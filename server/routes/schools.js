const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all schools
router.get('/', async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(schools)
  } catch (error) {
    console.error('Get schools error:', error)
    
    let errorMessage = 'Erreur lors de la récupération des écoles'
    if (error.code === 'P1001') {
      errorMessage = 'Impossible de se connecter à la base de données. Vérifiez que PostgreSQL est démarré et que DATABASE_URL est correct dans .env'
    } else if (error.code === 'P2025') {
      errorMessage = 'Table non trouvée. Exécutez "npm run db:push" pour créer les tables.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: error.code
    })
  }
})

// Get school by ID
router.get('/:id', async (req, res) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.params.id },
    })

    if (!school) {
      return res.status(404).json({ message: 'École non trouvée' })
    }

    res.json(school)
  } catch (error) {
    console.error('Get school error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'école' })
  }
})

// Create school (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, country, city, program, price, imageUrl, website } = req.body

    if (!name || !description || !country || !program) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' })
    }

    const school = await prisma.school.create({
      data: {
        name,
        description,
        country,
        city: city || null,
        program,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
        website: website || null,
      },
    })

    res.status(201).json(school)
  } catch (error) {
    console.error('Create school error:', error)
    res.status(500).json({ message: 'Erreur lors de la création de l\'école' })
  }
})

// Update school (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, country, city, program, price, imageUrl, website } = req.body

    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(country && { country }),
        ...(city !== undefined && { city }),
        ...(program && { program }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(website !== undefined && { website }),
      },
    })

    res.json(school)
  } catch (error) {
    console.error('Update school error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'école' })
  }
})

// Delete school (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.school.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'École supprimée avec succès' })
  } catch (error) {
    console.error('Delete school error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'école' })
  }
})

module.exports = router


