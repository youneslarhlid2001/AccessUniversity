const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')
const bcrypt = require('bcryptjs')

const router = express.Router()
const prisma = new PrismaClient()

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' })
  }
})

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'Le prénom et le nom sont requis' })
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone ? phone.trim() : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isPremium: true,
        updatedAt: true,
      },
    })

    res.json(updated)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' })
  }
})

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Le mot de passe actuel et le nouveau mot de passe sont requis' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' })
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    })

    res.json({ message: 'Mot de passe modifié avec succès' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' })
  }
})

module.exports = router

