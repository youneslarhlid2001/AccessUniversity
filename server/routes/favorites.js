const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all favorites for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            imageUrl: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(favorites)
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des favoris' })
  }
})

// Add to favorites
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { schoolId } = req.body

    if (!schoolId) {
      return res.status(400).json({ message: 'schoolId est requis' })
    }

    // Check if already favorite
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_schoolId: {
          userId: req.user.id,
          schoolId: schoolId,
        },
      },
    })

    if (existing) {
      return res.json(existing)
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        schoolId: schoolId,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            imageUrl: true,
            description: true,
          },
        },
      },
    })

    res.json(favorite)
  } catch (error) {
    console.error('Add favorite error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris' })
  }
})

// Remove from favorites
router.delete('/:schoolId', authenticateToken, async (req, res) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_schoolId: {
          userId: req.user.id,
          schoolId: req.params.schoolId,
        },
      },
    })

    if (!favorite) {
      return res.status(404).json({ message: 'Favori non trouvé' })
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    })

    res.json({ message: 'Retiré des favoris avec succès' })
  } catch (error) {
    console.error('Remove favorite error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression du favori' })
  }
})

// Check if school is favorite
router.get('/check/:schoolId', authenticateToken, async (req, res) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_schoolId: {
          userId: req.user.id,
          schoolId: req.params.schoolId,
        },
      },
    })

    res.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error('Check favorite error:', error)
    res.status(500).json({ message: 'Erreur lors de la vérification' })
  }
})

module.exports = router

