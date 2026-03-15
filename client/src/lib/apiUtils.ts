export const convertObjectId = (data: any): any => {
  if (!data) return data
  
  if (Array.isArray(data)) {
    return data.map(convertObjectId)
  }
  
  if (typeof data === 'object' && data._id) {
    const { _id, ...rest } = data
    const converted: any = { id: _id.toString() }
    
    for (const key in rest) {
      converted[key] = convertObjectId(rest[key])
    }
    
    return converted
  }
  
  if (typeof data === 'object') {
    const converted: any = {}
    for (const key in data) {
      converted[key] = convertObjectId(data[key])
    }
    return converted
  }
  
  return data
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response
}
