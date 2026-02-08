const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all housings
router.get('/', async (req, res) => {
  try {
    const housings = await prisma.housing.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(housings)
  } catch (error) {
    console.error('Get housings error:', error)
    
    let errorMessage = 'Erreur lors de la récupération des logements'
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

// Get housing by ID
router.get('/:id', async (req, res) => {
  try {
    const housing = await prisma.housing.findUnique({
      where: { id: req.params.id },
    })

    if (!housing) {
      return res.status(404).json({ message: 'Logement non trouvé' })
    }

    res.json(housing)
  } catch (error) {
    console.error('Get housing error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération du logement' })
  }
})

// Create housing (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, city, country, type, price, partner, imageUrl, amenities, available } = req.body

    if (!name || !description || !city || !country || !type || !partner) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' })
    }

    const housing = await prisma.housing.create({
      data: {
        name,
        description,
        city,
        country,
        type,
        price: price ? parseFloat(price) : null,
        partner,
        imageUrl: imageUrl || null,
        amenities: amenities || [],
        available: available !== undefined ? available : true,
      },
    })

    res.status(201).json(housing)
  } catch (error) {
    console.error('Create housing error:', error)
    res.status(500).json({ message: 'Erreur lors de la création du logement' })
  }
})

// Update housing (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, city, country, type, price, partner, imageUrl, amenities, available } = req.body

    const housing = await prisma.housing.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(city && { city }),
        ...(country && { country }),
        ...(type && { type }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(partner && { partner }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(amenities !== undefined && { amenities }),
        ...(available !== undefined && { available }),
      },
    })

    res.json(housing)
  } catch (error) {
    console.error('Update housing error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour du logement' })
  }
})

// Delete housing (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.housing.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Logement supprimé avec succès' })
  } catch (error) {
    console.error('Delete housing error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression du logement' })
  }
})

module.exports = router






