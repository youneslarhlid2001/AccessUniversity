const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
      },
    })

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPremium: user.isPremium,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    
    // Messages d'erreur plus explicites
    let errorMessage = 'Erreur lors de l\'inscription'
    if (error.code === 'P1001') {
      errorMessage = 'Impossible de se connecter à la base de données. Vérifiez que PostgreSQL est démarré et que DATABASE_URL est correct dans .env'
    } else if (error.code === 'P2002') {
      errorMessage = 'Cet email est déjà utilisé'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPremium: user.isPremium,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    
    let errorMessage = 'Erreur lors de la connexion'
    if (error.code === 'P1001') {
      errorMessage = 'Impossible de se connecter à la base de données. Vérifiez que PostgreSQL est démarré et que DATABASE_URL est correct dans .env'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

const { authenticateToken } = require('../middleware/auth')

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' })
  }
})

module.exports = router

