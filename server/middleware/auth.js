const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isPremium: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès admin requis' })
  }
  next()
}

const requirePremium = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ message: 'Accès premium requis' })
  }
  next()
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requirePremium,
}








