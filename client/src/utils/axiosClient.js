import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    const message =
      error?.response?.data?.message || error?.message || 'Request failed'
    return Promise.reject(new Error(message))
  },
)

export default axiosClient
