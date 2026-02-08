const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all team members
router.get('/', async (req, res) => {
    try {
        const team = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' },
        })
        res.json(team)
    } catch (error) {
        console.error('Get Team error:', error)
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'équipe' })
    }
})

// Admin: Create Team Member
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, role, imageUrl, bio, linkedin, order } = req.body
        const member = await prisma.teamMember.create({
            data: {
                name,
                role,
                imageUrl,
                bio,
                linkedin,
                order: order || 0
            }
        })
        res.status(201).json(member)
    } catch (error) {
        res.status(400).json({ message: 'Erreur ajout membre', error })
    }
})

module.exports = router
