const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requirePremium } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, PDF'))
    }
  },
})

// Upload file
router.post('/', authenticateToken, requirePremium, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' })
    }

    const { category } = req.body

    const fileUpload = await prisma.fileUpload.create({
      data: {
        userId: req.user.id,
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        category: category || 'other',
      },
    })

    res.json(fileUpload)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'upload du fichier' })
  }
})

// Get user files
router.get('/my-files', authenticateToken, requirePremium, async (req, res) => {
  try {
    const files = await prisma.fileUpload.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    res.json(files)
  } catch (error) {
    console.error('Get files error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des fichiers' })
  }
})

// Download/View file
router.get('/:id', authenticateToken, requirePremium, async (req, res) => {
  try {
    const file = await prisma.fileUpload.findUnique({
      where: { id: req.params.id },
    })

    if (!file) {
      return res.status(404).json({ message: 'Fichier non trouvé' })
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' })
    }

    // The filePath often starts with '/uploads', and we need 'uploads' for path.join from server root
    // But since server/routes is where we are, assuming relative to project root:
    // path.join(__dirname, '../..', file.filePath)
    // If filePath is '/uploads/foo.pdf', then '../..' from routes is 'server', then root, then '/uploads/...' -> 'c:/Users/.../uploads/foo.pdf'
    // Let's assume the DB stores '/uploads/filename'.

    // We already use `path.join(__dirname, '../../uploads')` above (line 12)
    const filePath = path.join(__dirname, '../../uploads', path.basename(file.filePath))

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fichier physique introuvable' })
    }

    res.download(filePath, file.fileName)
  } catch (error) {
    console.error('Download file error:', error)
    res.status(500).json({ message: 'Erreur lors du téléchargement' })
  }
})

// Delete file
router.delete('/:id', authenticateToken, requirePremium, async (req, res) => {
  try {
    const file = await prisma.fileUpload.findUnique({
      where: { id: req.params.id },
    })

    if (!file || file.userId !== req.user.id) {
      return res.status(404).json({ message: 'Fichier non trouvé' })
    }

    // Supprimer le fichier du système de fichiers
    const filePath = path.join(__dirname, '../..', file.filePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await prisma.fileUpload.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Fichier supprimé avec succès' })
  } catch (error) {
    console.error('Delete file error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression du fichier' })
  }
})

module.exports = router








