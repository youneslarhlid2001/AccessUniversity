const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get student dashboard data
router.get('/student', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        orientationResponses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        recommendations: {
          include: { school: true },
          orderBy: { score: 'desc' },
          take: 5,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        fileUploads: {
          orderBy: { createdAt: 'desc' },
        },
        applications: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                country: true,
                city: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
        favorites: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                country: true,
                city: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isPremium: user.isPremium,
      },
      lastOrientation: user.orientationResponses[0] || null,
      recommendations: user.recommendations,
      lastPayment: user.payments[0] || null,
      files: user.fileUploads,
      applications: user.applications,
      favorites: user.favorites,
    })
  } catch (error) {
    console.error('Get student dashboard error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des données' })
  }
})

// Get admin dashboard data
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [students, schools, payments] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'student' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isPremium: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.school.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.findMany({
        where: { status: 'completed' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    res.json({
      stats: {
        totalStudents: students.length,
        premiumStudents: students.filter((s) => s.isPremium).length,
        totalSchools: schools.length,
        totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      },
      students,
      schools,
      recentPayments: payments,
    })
  } catch (error) {
    console.error('Get admin dashboard error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des données' })
  }
})

module.exports = router








