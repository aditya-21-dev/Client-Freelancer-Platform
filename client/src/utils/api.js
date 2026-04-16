const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const buildApiUrl = (path) => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalized}`
}

const getAuthHeaders = (headers = {}) => {
  const token = localStorage.getItem('token')

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }
}

const handleApiError = (res, data) => {
  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'))
  }

  const message = data?.message || 'Request failed'
  const error = new Error(message)
  error.status = res.status
  error.data = data
  throw error
}

export const getJson = async (path, options = {}) => {
  const res = await fetch(buildApiUrl(path), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    handleApiError(res, data)
  }
  return data
}

export const sendJson = async (path, { method = 'POST', body, headers = {} } = {}) => {
  const res = await fetch(buildApiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(headers),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    handleApiError(res, data)
  }
  return data
}
