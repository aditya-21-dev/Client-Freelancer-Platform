import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const sanitizeFilename = (filename) => filename.replace(/[^a-zA-Z0-9.-]/g, '_')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const safeOriginalName = sanitizeFilename(file.originalname || 'file')
    cb(null, `${timestamp}-${safeOriginalName}`)
  },
})

const fileFilter = (_req, file, cb) => {
  if (!file || !file.originalname) {
    return cb(new Error('Invalid file upload'), false)
  }
  return cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
})

export default upload
