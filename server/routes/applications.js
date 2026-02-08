const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all applications for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
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
    })

    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures' })
  }
})

// Get single application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        school: true,
      },
    })

    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' })
    }

    res.json(application)
  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de la candidature' })
  }
})

// Create or update application
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { schoolId, status, notes, applicationDate, deadline, interviewDate, resultDate } = req.body

    if (!schoolId) {
      return res.status(400).json({ message: 'schoolId est requis' })
    }

    // Check if application already exists
    const existing = await prisma.application.findUnique({
      where: {
        userId_schoolId: {
          userId: req.user.id,
          schoolId: schoolId,
        },
      },
    })

    let application
    if (existing) {
      // Update existing
      application = await prisma.application.update({
        where: { id: existing.id },
        data: {
          status: status || existing.status,
          notes: notes !== undefined ? notes : existing.notes,
          applicationDate: applicationDate || existing.applicationDate,
          deadline: deadline !== undefined ? deadline : existing.deadline,
          interviewDate: interviewDate !== undefined ? interviewDate : existing.interviewDate,
          resultDate: resultDate !== undefined ? resultDate : existing.resultDate,
        },
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
      })
    } else {
      // Create new
      application = await prisma.application.create({
        data: {
          userId: req.user.id,
          schoolId: schoolId,
          status: status || 'interested',
          notes: notes || null,
          applicationDate: applicationDate || null,
          deadline: deadline || null,
          interviewDate: interviewDate || null,
          resultDate: resultDate || null,
        },
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
      })
    }

    res.json(application)
  } catch (error) {
    console.error('Create/update application error:', error)
    res.status(500).json({ message: 'Erreur lors de la sauvegarde de la candidature' })
  }
})

// Update application status
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes, applicationDate, deadline, interviewDate, resultDate } = req.body

    const application = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' })
    }

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: status || application.status,
        notes: notes !== undefined ? notes : application.notes,
        applicationDate: applicationDate !== undefined ? applicationDate : application.applicationDate,
        deadline: deadline !== undefined ? deadline : application.deadline,
        interviewDate: interviewDate !== undefined ? interviewDate : application.interviewDate,
        resultDate: resultDate !== undefined ? resultDate : application.resultDate,
      },
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
    })

    res.json(updated)
  } catch (error) {
    console.error('Update application error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la candidature' })
  }
})

// Delete application
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' })
    }

    await prisma.application.delete({
      where: { id: application.id },
    })

    res.json({ message: 'Candidature supprimée avec succès' })
  } catch (error) {
    console.error('Delete application error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression de la candidature' })
  }
})

// Get application by schoolId
router.get('/school/:schoolId', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: {
        userId_schoolId: {
          userId: req.user.id,
          schoolId: req.params.schoolId,
        },
      },
      include: {
        school: true,
      },
    })

    res.json(application || null)
  } catch (error) {
    console.error('Get application by school error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de la candidature' })
  }
})

module.exports = router

