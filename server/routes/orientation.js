const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all orientations for authenticated user
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const orientations = await prisma.orientationResponse.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    res.json(orientations)
  } catch (error) {
    console.error('Get orientations history error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' })
  }
})

// Submit orientation form
router.post('/', async (req, res) => {
  try {
    const { level, country, objectives, profile } = req.body

    // 1. Validation (Guard Clause)
    if (!level || !country || !objectives || !profile) {
      return res.status(400).json({ message: 'Tous les champs sont requis' })
    }

    // 2. Data Preparation
    const score = calculateScore(level)
    const userId = getUserIdFromToken(req.headers['authorization'])

    // 3. Fetch Schools (Single Query)
    const schools = await prisma.school.findMany({
      where: { country },
      take: 5,
    })

    // 4. Handle Anonymous User
    if (!userId) {
      return res.json({
        orientationResponse: null,
        recommendations: schools.map(school => formatRecommendation(school, score))
      })
    }

    // 5. Handle Authenticated User (Atomic Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // Create response
      const orientation = await tx.orientationResponse.create({
        data: { userId, level, country, objectives, profile, score },
      })

      // Clean old recommendations (User Story 3.5 fix)
      await tx.recommendation.deleteMany({ where: { userId } })

      // Create new recommendations
      // Note: We can't use createMany if we want to return the created objects easily with relations
      // But we can create then fetch, or map create.
      // createMany is faster but doesn't return the created records in standard Prisma.
      // We'll stick to individual creates for now to match the "return full object" requirement 
      // but inside a transaction it's safe.

      const recommendations = await Promise.all(
        schools.map(school => tx.recommendation.create({
          data: {
            userId,
            schoolId: school.id,
            score: calculateRecommendationScore(score),
          },
          include: { school: true }
        }))
      )

      return { orientation, recommendations }
    })

    res.json(result)

  } catch (error) {
    console.error('Orientation error:', error)
    res.status(500).json({ message: "Erreur lors du traitement de l'orientation" })
  }
})

// --- Helpers ---

const calculateScore = (level) => {
  const scores = { 'bac+5': 30, 'bac+3': 20, 'bac+2': 10 }
  return scores[level] || 0
}

const calculateRecommendationScore = (baseScore) => {
  // Deterministic score logic instead of random
  return baseScore + 10
}

const formatRecommendation = (school, score) => ({
  id: `temp-${school.id}`,
  schoolId: school.id,
  score: calculateRecommendationScore(score),
  school,
})

const getUserIdFromToken = (authHeader) => {
  if (!authHeader) return null
  const token = authHeader.split(' ')[1]
  if (!token) return null
  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId
  } catch {
    return null
  }
}

// Get user's orientation responses
router.get('/my-responses', authenticateToken, async (req, res) => {
  try {
    const responses = await prisma.orientationResponse.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    res.json(responses)
  } catch (error) {
    console.error('Get orientation responses error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des réponses' })
  }
})

// Get user's recommendations
router.get('/my-recommendations', authenticateToken, async (req, res) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { userId: req.user.id },
      include: { school: true },
      orderBy: { score: 'desc' },
    })

    res.json(recommendations)
  } catch (error) {
    console.error('Get recommendations error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des recommandations' })
  }
})

// Get specific orientation details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orientation = await prisma.orientationResponse.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })

    if (!orientation) {
      return res.status(404).json({ message: 'Orientation non trouvée' })
    }

    // Since recommendations are currently linked to user and not specific orientation in the schema (based on previous code),
    // we will fetch the recommendations that were created around the same time or just current ones if that's the logic.
    // For now, let's just return the orientation details. The frontend can use the profile/objectives to "re-show" what was submitted.
    // If we want to show the *schools* recommended, we might need to fetch all recommendations for the user.
    // Let's also fetch the top recommendations for this user to display them as "Results".

    const recommendations = await prisma.recommendation.findMany({
      where: { userId: req.user.id },
      include: { school: true },
      take: 5
    })

    res.json({ ...orientation, recommendations })
  } catch (error) {
    console.error('Get orientation details error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'orientation' })
  }
})

module.exports = router



