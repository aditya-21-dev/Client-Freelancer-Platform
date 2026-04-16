import { sendJson } from '../utils/api'

export const registerWithEmail = async ({ name, email, password, role }) => {
  return sendJson('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, role },
  })
}

export const loginWithEmail = async ({ email, password }) => {
  return sendJson('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

// ✅ FIX: send "credential" NOT "token"
export const loginWithGoogle = async (googleCredential) => {
  return sendJson('/api/auth/google', {
    method: 'POST',
    body: { credential: googleCredential },
  })
}
