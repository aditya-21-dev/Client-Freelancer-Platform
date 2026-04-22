import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ✅ FIX: pass CLIENT ID here
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const DEFAULT_ROLE = 'freelancer'

const generateToken = ({ userId, role }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not configured')
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
}

const buildAuthResponse = (user) => {
  const safeRole = user.role || DEFAULT_ROLE
  const token = generateToken({
    userId: user._id.toString(),
    role: safeRole,
  })

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: safeRole,
    },
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {}
    const normalizedName = typeof name === 'string' ? name.trim() : ''
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''
    const normalizedRole = typeof role === 'string' ? role.trim() : ''

    console.log('[auth.register] incoming request', {
      name: normalizedName,
      email: normalizedEmail,
      role: normalizedRole,
      hasPassword: Boolean(password),
    })

    if (!normalizedName || !normalizedEmail || !password || !normalizedRole) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    if (!['client', 'freelancer'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    })

    console.log('[auth.register] user created', {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      hasPassword: Boolean(user.password),
    })

    return res.status(201).json({
      message: 'User registered successfully',
      ...buildAuthResponse(user),
    })
  } catch (error) {
    console.error('[auth.register] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Use Google Sign-In' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.role) {
      user.role = DEFAULT_ROLE
      await user.save()
    }

    return res.status(200).json(buildAuthResponse(user))
  } catch (error) {
    console.error('[auth.login] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

// ✅ FINAL FIXED GOOGLE AUTH
export const googleAuth = async (req, res) => {
  try {
    // ✅ FIX: use credential, NOT token
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    const email = payload.email.toLowerCase().trim()
    const name = payload.name
    const googleId = payload.sub

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        role: DEFAULT_ROLE,
        password: null,
        googleId,
      })
    } else {
      // attach googleId if missing
      if (!user.googleId) {
        user.googleId = googleId
      }

      if (!user.role) {
        user.role = DEFAULT_ROLE
      }

      if (user.isModified('googleId') || user.isModified('role')) {
        await user.save()
      }
    }

    return res.status(200).json(buildAuthResponse(user))
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Google authentication failed' })
  }
}

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    return res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || DEFAULT_ROLE,
      },
    })
  } catch (error) {
    console.error('[auth.me] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}
