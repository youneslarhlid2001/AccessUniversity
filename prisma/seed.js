const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@accessuniversity.com' },
    update: {},
    create: {
      email: 'admin@accessuniversity.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isPremium: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create demo students
  const students = [
    {
      email: 'student@example.com',
      password: 'student123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33 6 12 34 56 78',
      role: 'student',
      isPremium: false,
    },
    {
      email: 'marie.dupont@example.com',
      password: 'student123',
      firstName: 'Marie',
      lastName: 'Dupont',
      phone: '+33 6 23 45 67 89',
      role: 'student',
      isPremium: true,
    },
    {
      email: 'pierre.martin@example.com',
      password: 'student123',
      firstName: 'Pierre',
      lastName: 'Martin',
      phone: '+33 6 34 56 78 90',
      role: 'student',
      isPremium: false,
    },
    {
      email: 'sophie.bernard@example.com',
      password: 'student123',
      firstName: 'Sophie',
      lastName: 'Bernard',
      phone: '+33 6 45 67 89 01',
      role: 'student',
      isPremium: true,
    },
  ]

  for (const studentData of students) {
    const studentPassword = await bcrypt.hash(studentData.password, 10)
    const student = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        password: studentPassword,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        phone: studentData.phone,
        role: studentData.role,
        isPremium: studentData.isPremium,
      },
    })
    console.log('✅ Student created:', student.email, student.isPremium ? '(Premium)' : '')
  }

  // Create schools
  const schools = [
    {
      name: 'École Supérieure de Commerce Paris',
      description: 'Une école de commerce prestigieuse située au cœur de Paris, offrant des programmes d\'excellence en management et commerce international.',
      country: 'France',
      city: 'Paris',
      program: 'Programme Grande École (PGE)\nMaster in Management\nMBA International\nSpécialisations: Finance, Marketing, Entrepreneuriat',
      price: 12000,
      website: 'https://example.com',
    },
    {
      name: 'Université de Montréal',
      description: 'L\'une des meilleures universités francophones au monde, offrant une large gamme de programmes académiques.',
      country: 'Canada',
      city: 'Montréal',
      program: 'Baccalauréat en Sciences\nMaîtrise en Ingénierie\nDoctorat en Recherche\nProgrammes bilingues français-anglais',
      price: 8000,
      website: 'https://example.com',
    },
    {
      name: 'École Polytechnique de Lausanne',
      description: 'Institution suisse de renommée mondiale spécialisée en sciences et technologies.',
      country: 'Suisse',
      city: 'Lausanne',
      program: 'Bachelor en Sciences\nMaster en Ingénierie\nProgrammes de recherche avancée\nDouble diplômes internationaux',
      price: 15000,
      website: 'https://example.com',
    },
    {
      name: 'Université Libre de Bruxelles',
      description: 'Université belge offrant une éducation de qualité dans un environnement multiculturel.',
      country: 'Belgique',
      city: 'Bruxelles',
      program: 'Licence en Sciences\nMaster en Droit\nMaster en Économie\nProgrammes européens',
      price: 5000,
      website: 'https://example.com',
    },
    {
      name: 'London Business School',
      description: 'École de commerce de classe mondiale située à Londres, reconnue internationalement.',
      country: 'Royaume-Uni',
      city: 'Londres',
      program: 'MBA Full-time\nExecutive MBA\nMaster in Finance\nProgrammes de leadership',
      price: 25000,
      website: 'https://example.com',
    },
    {
      name: 'MIT - Massachusetts Institute of Technology',
      description: 'Institution américaine de renommée mondiale en sciences, technologie et innovation.',
      country: 'États-Unis',
      city: 'Cambridge',
      program: 'Bachelor of Science\nMaster of Science\nPhD Programs\nProgrammes interdisciplinaires',
      price: 50000,
      website: 'https://example.com',
    },
    {
      name: 'Sorbonne Université',
      description: 'Prestigieuse université parisienne héritière de la Sorbonne historique, offrant des formations d\'excellence en lettres, sciences et médecine.',
      country: 'France',
      city: 'Paris',
      program: 'Licence en Lettres\nMaster en Sciences\nDoctorat en Médecine\nProgrammes interdisciplinaires',
      price: 3000,
      website: 'https://example.com',
    },
    {
      name: 'HEC Paris',
      description: 'École de commerce française de renommée internationale, classée parmi les meilleures au monde.',
      country: 'France',
      city: 'Paris',
      program: 'Programme Grande École\nMBA\nMaster Spécialisé\nExecutive Education',
      price: 18000,
      website: 'https://example.com',
    },
    {
      name: 'École Polytechnique',
      description: 'Grande école d\'ingénieurs française, l\'une des plus prestigieuses au monde en sciences et technologies.',
      country: 'France',
      city: 'Palaiseau',
      program: 'Ingénieur Polytechnicien\nMaster\nPhD\nProgrammes de recherche',
      price: 15000,
      website: 'https://example.com',
    },
    {
      name: 'Université McGill',
      description: 'Université canadienne anglophone de renommée mondiale, située à Montréal.',
      country: 'Canada',
      city: 'Montréal',
      program: 'Bachelor\'s Degree\nMaster\'s Degree\nPhD Programs\nProgrammes bilingues',
      price: 12000,
      website: 'https://example.com',
    },
    {
      name: 'ETH Zurich',
      description: 'École polytechnique fédérale de Zurich, l\'une des meilleures universités techniques au monde.',
      country: 'Suisse',
      city: 'Zurich',
      program: 'Bachelor en Sciences\nMaster en Ingénierie\nDoctorat\nProgrammes de recherche',
      price: 16000,
      website: 'https://example.com',
    },
    {
      name: 'Université de Genève',
      description: 'Université suisse francophone offrant une large gamme de programmes académiques.',
      country: 'Suisse',
      city: 'Genève',
      program: 'Bachelor\nMaster\nDoctorat\nProgrammes internationaux',
      price: 1000,
      website: 'https://example.com',
    },
    {
      name: 'KU Leuven',
      description: 'Université belge de renommée mondiale, la plus ancienne université des Pays-Bas historiques.',
      country: 'Belgique',
      city: 'Louvain',
      program: 'Bachelor\nMaster\nPhD\nProgrammes en anglais',
      price: 6000,
      website: 'https://example.com',
    },
    {
      name: 'Oxford University',
      description: 'Université britannique prestigieuse, l\'une des plus anciennes et renommées au monde.',
      country: 'Royaume-Uni',
      city: 'Oxford',
      program: 'Undergraduate\nGraduate\nResearch Programs\nContinuing Education',
      price: 30000,
      website: 'https://example.com',
    },
    {
      name: 'Cambridge University',
      description: 'Université britannique d\'excellence mondiale, rivale historique d\'Oxford.',
      country: 'Royaume-Uni',
      city: 'Cambridge',
      program: 'Undergraduate\nGraduate\nResearch Programs\nProfessional Development',
      price: 32000,
      website: 'https://example.com',
    },
    {
      name: 'Harvard University',
      description: 'Université américaine de renommée mondiale, l\'une des plus prestigieuses au monde.',
      country: 'États-Unis',
      city: 'Cambridge',
      program: 'Undergraduate\nGraduate\nProfessional Schools\nContinuing Education',
      price: 55000,
      website: 'https://example.com',
    },
    {
      name: 'Stanford University',
      description: 'Université américaine d\'excellence en sciences, technologie et innovation, située dans la Silicon Valley.',
      country: 'États-Unis',
      city: 'Stanford',
      program: 'Undergraduate\nGraduate\nProfessional Programs\nExecutive Education',
      price: 58000,
      website: 'https://example.com',
    },
  ]

  for (const schoolData of schools) {
    // Vérifier si l'école existe déjà
    const existingSchool = await prisma.school.findFirst({
      where: { name: schoolData.name },
    })

    if (!existingSchool) {
      const school = await prisma.school.create({
        data: schoolData,
      })
      console.log('✅ School created:', school.name)
    } else {
      console.log('⏭️  School already exists:', schoolData.name)
    }
  }

  // Create housings
  const housings = [
    {
      name: 'Studio moderne - Quartier Latin',
      description: 'Studio lumineux et moderne de 25m² situé dans le quartier historique du Quartier Latin, à 5 minutes à pied de la Sorbonne. Parfait pour un étudiant cherchant calme et proximité des universités.',
      city: 'Paris',
      country: 'France',
      type: 'studio',
      price: 650,
      partner: 'Studapart',
      amenities: ['WiFi', 'Meublé', 'Lave-linge', 'Proche métro'],
      available: true,
    },
    {
      name: 'Appartement T2 - Montparnasse',
      description: 'Bel appartement de 45m² avec balcon, situé à Montparnasse. Proche des grandes écoles et bien desservi par les transports. Idéal pour un couple d\'étudiants.',
      city: 'Paris',
      country: 'France',
      type: 'appartement',
      price: 1200,
      partner: 'Lokaviz',
      amenities: ['WiFi', 'Meublé', 'Balcon', 'Ascenseur', 'Proche métro'],
      available: true,
    },
    {
      name: 'Colocation étudiante - 11ème arrondissement',
      description: 'Chambre dans une colocation de 4 personnes, ambiance conviviale. Appartement de 80m² avec salon commun, cuisine équipée et salle de bain partagée.',
      city: 'Paris',
      country: 'France',
      type: 'colocation',
      price: 550,
      partner: 'Coloc\'Aide',
      amenities: ['WiFi', 'Meublé', 'Cuisine équipée', 'Salon commun'],
      available: true,
    },
    {
      name: 'Résidence étudiante - Campus Jussieu',
      description: 'Chambre dans une résidence étudiante moderne avec services inclus. Située à proximité du campus Jussieu, avec accès à la salle de sport et à la bibliothèque.',
      city: 'Paris',
      country: 'France',
      type: 'résidence',
      price: 750,
      partner: 'CROUS Partenaires',
      amenities: ['WiFi', 'Meublé', 'Salle de sport', 'Bibliothèque', 'Gardien'],
      available: true,
    },
    {
      name: 'Studio cosy - Plateau Mont-Royal',
      description: 'Studio charmant de 30m² dans le quartier branché du Plateau Mont-Royal. Proche de l\'Université de Montréal et des transports en commun.',
      city: 'Montréal',
      country: 'Canada',
      type: 'studio',
      price: 850,
      partner: 'Kijiji Immobilier',
      amenities: ['WiFi', 'Meublé', 'Chauffage inclus', 'Proche métro'],
      available: true,
    },
    {
      name: 'Appartement T1 - Centre-ville',
      description: 'Appartement moderne de 35m² en plein centre-ville de Montréal. Proche de toutes les commodités et des universités. Vue sur la ville.',
      city: 'Montréal',
      country: 'Canada',
      type: 'appartement',
      price: 1100,
      partner: 'Centris',
      amenities: ['WiFi', 'Meublé', 'Lave-vaisselle', 'Climatisation', 'Parking'],
      available: true,
    },
    {
      name: 'Studio étudiant - Quartier universitaire',
      description: 'Studio fonctionnel de 28m² dans le quartier universitaire de Lausanne. Proche de l\'EPFL et de l\'UNIL. Transport public à proximité.',
      city: 'Lausanne',
      country: 'Suisse',
      type: 'studio',
      price: 1200,
      partner: 'Homegate',
      amenities: ['WiFi', 'Meublé', 'Chauffage', 'Proche transports'],
      available: true,
    },
    {
      name: 'Colocation - Ixelles',
      description: 'Chambre dans une colocation de 3 personnes à Ixelles, quartier étudiant par excellence. Proche de l\'ULB et de l\'Université Saint-Louis.',
      city: 'Bruxelles',
      country: 'Belgique',
      type: 'colocation',
      price: 450,
      partner: 'ImmoWeb',
      amenities: ['WiFi', 'Meublé', 'Cuisine équipée', 'Jardin'],
      available: true,
    },
    {
      name: 'Studio moderne - Zone 2',
      description: 'Studio récent de 30m² en zone 2 de Londres. Bien connecté au centre-ville et aux universités. Idéal pour un étudiant international.',
      city: 'Londres',
      country: 'Royaume-Uni',
      type: 'studio',
      price: 950,
      partner: 'Rightmove',
      amenities: ['WiFi', 'Meublé', 'Chauffage', 'Proche métro'],
      available: true,
    },
    {
      name: 'Résidence étudiante - Cambridge',
      description: 'Chambre dans une résidence étudiante moderne à Cambridge. Proche du MIT et de Harvard. Services complets et communauté internationale.',
      city: 'Cambridge',
      country: 'États-Unis',
      type: 'résidence',
      price: 1800,
      partner: 'Campus Housing',
      amenities: ['WiFi', 'Meublé', 'Salle de sport', 'Cafétéria', 'Sécurité 24/7'],
      available: true,
    },
  ]

  for (const housingData of housings) {
    // Vérifier si le logement existe déjà
    const existingHousing = await prisma.housing.findFirst({
      where: { 
        name: housingData.name,
        city: housingData.city,
      },
    })

    if (!existingHousing) {
      const housing = await prisma.housing.create({
        data: housingData,
      })
      console.log('✅ Housing created:', housing.name)
    } else {
      console.log('⏭️  Housing already exists:', housingData.name)
    }
  }

  // Create housing partners
  const housingPartners = [
    {
      name: 'Lokaviz',
      email: 'contact@lokaviz.com',
      website: 'https://www.lokaviz.com',
      cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Lille', 'Nantes'],
      description: 'Plateforme spécialisée dans la location étudiante avec plus de 10 000 logements vérifiés.',
    },
    {
      name: 'CROUS',
      email: 'contact@crous.fr',
      website: 'https://www.crous.fr',
      cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Lille', 'Nantes', 'Bordeaux'],
      description: 'Réseau national des résidences universitaires et logements étudiants.',
    },
    {
      name: 'Studapart',
      email: 'contact@studapart.com',
      website: 'https://www.studapart.com',
      cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Lille'],
      description: 'Plateforme de référence pour trouver un logement étudiant en France et à l\'étranger.',
    },
    {
      name: 'Coloc\'Aide',
      email: 'contact@colocaide.fr',
      website: 'https://www.colocaide.fr',
      cities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes'],
      description: 'Spécialiste de la colocation étudiante avec accompagnement personnalisé.',
    },
    {
      name: 'CROUS Partenaires',
      email: 'partenaires@crous.fr',
      website: 'https://www.crous.fr/partenaires',
      cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Lille', 'Nantes', 'Bordeaux', 'Strasbourg'],
      description: 'Réseau de partenaires du CROUS offrant des logements étudiants de qualité.',
    },
    {
      name: 'Kijiji Immobilier',
      email: 'contact@kijiji.ca',
      website: 'https://www.kijiji.ca',
      cities: ['Montréal', 'Toronto', 'Vancouver', 'Québec'],
      description: 'Plateforme canadienne de petites annonces incluant des logements étudiants.',
    },
    {
      name: 'Centris',
      email: 'contact@centris.ca',
      website: 'https://www.centris.ca',
      cities: ['Montréal', 'Québec', 'Ottawa'],
      description: 'Réseau immobilier québécois avec une section dédiée aux logements étudiants.',
    },
    {
      name: 'Homegate',
      email: 'contact@homegate.ch',
      website: 'https://www.homegate.ch',
      cities: ['Lausanne', 'Genève', 'Zurich', 'Berne'],
      description: 'Portail immobilier suisse avec des offres de logements étudiants.',
    },
    {
      name: 'Rightmove',
      email: 'contact@rightmove.co.uk',
      website: 'https://www.rightmove.co.uk',
      cities: ['Londres', 'Manchester', 'Birmingham', 'Edinburgh'],
      description: 'Premier portail immobilier britannique avec une section logements étudiants.',
    },
  ]

  for (const partnerData of housingPartners) {
    // Vérifier si le partenaire existe déjà
    const existingPartner = await prisma.housingPartner.findFirst({
      where: { 
        name: partnerData.name,
      },
    })

    if (!existingPartner) {
      const partner = await prisma.housingPartner.create({
        data: partnerData,
      })
      console.log('✅ Housing partner created:', partner.name)
    } else {
      console.log('⏭️  Housing partner already exists:', partnerData.name)
    }
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

