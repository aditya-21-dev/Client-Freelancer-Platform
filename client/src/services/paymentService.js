import { getJson } from '../utils/api'

export const fetchClientTransactions = async () => {
  return getJson('/api/payments/client')
}
