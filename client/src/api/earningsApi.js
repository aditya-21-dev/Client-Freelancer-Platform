import axiosClient from '../utils/axiosClient'

export const getMyEarnings = async () => {
  const { data } = await axiosClient.get('/api/earnings/me')
  return data
}
