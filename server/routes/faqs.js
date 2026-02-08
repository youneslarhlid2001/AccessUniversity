const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all public FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await prisma.faq.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        })
        res.json(faqs)
    } catch (error) {
        console.error('Get FAQs error:', error)
        res.status(500).json({ message: 'Erreur lors de la récupération de la FAQ' })
    }
})

// Admin: Create FAQ
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { question, answer, category, order } = req.body
        const newFaq = await prisma.faq.create({
            data: {
                question,
                answer,
                category,
                order: order || 0
            }
        })
        res.status(201).json(newFaq)
    } catch (error) {
        res.status(400).json({ message: 'Erreur création FAQ', error })
    }
})

module.exports = router
