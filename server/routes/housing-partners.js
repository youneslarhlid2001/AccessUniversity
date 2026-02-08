const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all housing partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.housingPartner.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(partners)
  } catch (error) {
    console.error('Get housing partners error:', error)
    
    let errorMessage = 'Erreur lors de la récupération des partenaires logement'
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

// Get housing partner by ID
router.get('/:id', async (req, res) => {
  try {
    const partner = await prisma.housingPartner.findUnique({
      where: { id: req.params.id },
    })

    if (!partner) {
      return res.status(404).json({ message: 'Partenaire non trouvé' })
    }

    res.json(partner)
  } catch (error) {
    console.error('Get housing partner error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération du partenaire' })
  }
})

// Create housing partner (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, website, cities, description } = req.body

    if (!name || !email || !website || !cities || !Array.isArray(cities)) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' })
    }

    const partner = await prisma.housingPartner.create({
      data: {
        name,
        email,
        website,
        cities,
        description: description || null,
      },
    })

    res.status(201).json(partner)
  } catch (error) {
    console.error('Create housing partner error:', error)
    res.status(500).json({ message: 'Erreur lors de la création du partenaire' })
  }
})

// Update housing partner (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, website, cities, description } = req.body

    const partner = await prisma.housingPartner.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(website && { website }),
        ...(cities && { cities }),
        ...(description !== undefined && { description }),
      },
    })

    res.json(partner)
  } catch (error) {
    console.error('Update housing partner error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour du partenaire' })
  }
})

// Delete housing partner (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.housingPartner.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Partenaire supprimé avec succès' })
  } catch (error) {
    console.error('Delete housing partner error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression du partenaire' })
  }
})

module.exports = router






