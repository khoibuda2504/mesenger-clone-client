import axios from 'axios'
const setToLS = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
}

const getFromLS = key => {
  const value = window.localStorage.getItem(key);

  if (value) {
    return JSON.parse(value);
  }
}

const kickUser = () => {
  localStorage.setItem('user', null)
  return window.location.href = '/login'
}
const instance = axios.create({})
const ISSERVER = typeof window === 'undefined'

instance.interceptors.request.use(
  (config) => {
    if (!ISSERVER) {
      const { accessToken } = getFromLS("user");
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);
let isRefreshing = false;
let requests = []
instance.interceptors.response.use(
  response => response?.data,
  async (error) => {
    if ((error.response.status === 401) || (error.response.status === 403 && error.config.url === '/refresh')) {
      kickUser()
    }
    if (error.response.status === 403) {
      if (!isRefreshing) {
        isRefreshing = true
        const user = getFromLS("user");
        const prevRequest = error.config
        const res = await instance.post('/refresh', { refreshToken: user.refreshToken })
        setToLS("user", { ...user, accessToken: res.accessToken })
        requests.forEach((cb) => cb(res.accessToken));
        requests = [];
        isRefreshing = false
        return instance(prevRequest);
      } else {
        const prevRequest = error.config
        return new Promise((resolve) => {
          requests.push((accessToken) => {
            if (prevRequest.headers) {
              prevRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            resolve(instance(prevRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
