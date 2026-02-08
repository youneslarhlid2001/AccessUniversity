require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const schoolsRoutes = require('./routes/schools')
const orientationRoutes = require('./routes/orientation')
const paymentRoutes = require('./routes/payment')
const dashboardRoutes = require('./routes/dashboard')
const uploadRoutes = require('./routes/upload')
const housingRoutes = require('./routes/housing')
const housingPartnersRoutes = require('./routes/housing-partners')
const applicationsRoutes = require('./routes/applications')
const favoritesRoutes = require('./routes/favorites')
const profileRoutes = require('./routes/profile')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.NEXT_PUBLIC_APP_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes


// New Routes
const faqsRoutes = require('./routes/faqs')
const teamRoutes = require('./routes/team')
const pricingRoutes = require('./routes/pricing')

app.use('/api/auth', authRoutes)
app.use('/api/schools', schoolsRoutes)
app.use('/api/orientation', orientationRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/housing', housingRoutes)
app.use('/api/housing-partners', housingPartnersRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/faqs', faqsRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/pricing', pricingRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})



