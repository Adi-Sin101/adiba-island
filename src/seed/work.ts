// Projects, experience, awards and papers, merged from Adiba's CV, LinkedIn and GitHub history.
// Dates are first-commit / repo-creation months unless LinkedIn says otherwise.

type Category = 'web' | 'mobile' | 'ai' | 'systems' | 'graphics' | 'research' | 'other'
type Toy = 'rocket' | 'robot' | 'car' | 'teddy' | 'duck' | 'top' | 'gift' | 'blocks'

export type SeedProject = {
  title: string
  tagline: string
  description: string
  highlights?: string[]
  category: Category
  toy: Toy
  date: string
  role?: string
  tech: string[]
  links?: { repo?: string; live?: string; paper?: string; video?: string; store?: string }
  github?: string
  private?: boolean
  featured?: boolean
  /** Files in seed/assets/projects: first one is the cover. */
  images: string[]
}

export const projects: SeedProject[] = [
  {
    title: 'Agun Panjika',
    tagline: 'One fire history, across sensors and seasons (NASA Space Apps 2026)',
    description:
      'Team KUETaguns’ NASA Space Apps Challenge 2026 project. It harmonises NASA MODIS and VIIRS fire hotspots onto one weekly VIIRS scale from 2001 onward, so forest officers, communities, researchers and newsrooms can read Bangladesh’s fire seasons, compare them with normal conditions and see a two-week outlook, in Bangla or English, with uncertainty visible.',
    highlights: [
      'Season-aware harmonisation of MODIS (1 km) and VIIRS (375 m) detections',
      'Calendar, Sensors, Outlook and Map views plus an interactive "Soft Earth" globe',
      'Tested NOAA-20/21 bridge for when Suomi NPP data delivery ends',
      'Fully bilingual: English and বাংলা',
    ],
    category: 'research',
    toy: 'rocket',
    date: '2026-10-01',
    role: 'Team KUETaguns',
    tech: ['Python', 'React', 'TypeScript', 'NASA FIRMS', 'Geospatial'],
    links: { repo: 'https://github.com/Rockstatata/Agun-Panjika' },
    github: 'Rockstatata/Agun-Panjika',
    featured: true,
    images: ['agun-panjika-0.jpg', 'agun-panjika-1.jpg'],
  },
  {
    title: 'Medora',
    tagline: 'AI-native, consent-aware healthcare for Bangladesh',
    description:
      'Bilingual (English/Bangla), consent-governed platform for patient-held health records, human-reviewed clinical drafts, specialty navigation and appointment coordination. Medora puts a deterministic policy boundary around assistive AI instead of treating a prompt as access control.',
    highlights: [
      'Purpose-, provider-, scope- and time-bound patient consent',
      'Review-gated OCR prescription extraction and source-linked summaries',
      '26 route modules, 194 handlers and 41 SQLAlchemy models',
      '310+ commits from me, and a co-authored paper on the system',
    ],
    category: 'ai',
    toy: 'robot',
    date: '2025-12-01',
    role: 'Co-developer & co-author',
    tech: ['Next.js', 'FastAPI', 'Supabase', 'PostgreSQL', 'LLMs', 'OCR'],
    links: { repo: 'https://github.com/CSE-3200-System-Project/Medora', live: 'https://medorahealth.vercel.app' },
    github: 'CSE-3200-System-Project/Medora',
    featured: true,
    images: ['medora-cover.jpg', 'medora-0.jpg', 'medora-1.jpg'],
  },
  {
    title: 'Toy Story: The Midnight Mission',
    tagline: 'A hand-built OpenGL toy room (starring Penny!)',
    description:
      'Computer graphics project in C++ and OpenGL 3.3. Penny the cat walks home to the toy room, and at midnight the toys come alive for a seven-scene rescue mission. Every toy is built from hand-written primitives.',
    highlights: [
      'Own transformations, scene hierarchy and Phong lighting',
      'Flat, Gouraud, Phong and Blinn shading plus procedural textures',
      'Real-time GPU ray tracer and live character takeover',
    ],
    category: 'graphics',
    toy: 'teddy',
    date: '2026-09-01',
    tech: ['C++', 'OpenGL 3.3', 'GLSL', 'GLFW', 'GLM'],
    links: { repo: 'https://github.com/Adi-Sin101/Haunted-Toy-Room' },
    github: 'Adi-Sin101/Haunted-Toy-Room',
    featured: true,
    images: ['toy-story-0.jpg', 'toy-story-1.jpg', 'toy-story-2.jpg'],
  },
  {
    title: 'CrisisSense',
    tagline: 'Spotting implicit and explicit crisis language with NLP',
    description:
      'A three-class text-classification research system that compares a character-level TF-IDF + Logistic Regression model with a locally stored BERT classifier, served through FastAPI with a small web UI.',
    highlights: [
      'no_crisis / implicit_crisis / explicit_crisis labels',
      'Frozen, reproducible train/validation/test splits',
      'Side-by-side model comparison per prediction',
    ],
    category: 'ai',
    toy: 'duck',
    date: '2026-08-01',
    role: 'Research & development',
    tech: ['Python', 'BERT', 'scikit-learn', 'FastAPI', 'Jupyter'],
    links: { repo: 'https://github.com/Adi-Sin101/Implicit_Crisis' },
    github: 'Adi-Sin101/Implicit_Crisis',
    featured: true,
    images: ['crisissense-cover.jpg', 'crisissense-0.jpg'],
  },
  {
    title: 'Cya!',
    tagline: 'Capture now. Remember later.',
    description:
      'A Flutter "intention manager" that captures the moment you decide to do something later and brings it back at the right time with one-tap actions. Local-first, with a colourful mascot-driven UI.',
    highlights: [
      'Sub-two-second capture from share sheet, tile or widget',
      'Local-first SQLite (Drift) source of truth',
      'Rive animations, Memory Garden, XP and achievements',
    ],
    category: 'mobile',
    toy: 'top',
    date: '2026-07-01',
    tech: ['Flutter', 'Dart', 'Riverpod', 'Drift', 'Rive'],
    links: { repo: 'https://github.com/Adi-Sin101/Cya' },
    github: 'Adi-Sin101/Cya',
    featured: true,
    images: ['cya-0.jpg'],
  },
  {
    title: 'ParaBounce',
    tagline: 'Projectile motion you can play with',
    description:
      'Dynamic projectile motion simulator built with Next.js by team Kuet_Kobe_Khulbe. 1st Runner-Up at the international Bridging Engineering & Computer Science Competition 2025 (ILM AI Ltd × City St George’s, University of London).',
    category: 'web',
    toy: 'rocket',
    date: '2025-08-01',
    role: 'Team Kuet_Kobe_Khulbe',
    tech: ['Next.js', 'TypeScript', 'Physics simulation'],
    links: { repo: 'https://github.com/Kuet-Kobe-Khulbe/ParaBounce--Projectile-Motion-Simulation' },
    github: 'Kuet-Kobe-Khulbe/ParaBounce--Projectile-Motion-Simulation',
    featured: true,
    images: ['parabounce-cover.jpg'],
  },
  {
    title: 'EmotionScript',
    tagline: 'A programming language with feelings',
    description:
      'A custom compiler built with Flex and Bison for a human-centric, emotion-based language: if_feel conditionals, ruminate loops, persona classes and built-in maths.',
    highlights: ['Types: count, measure, truth, words, emotion, level', 'Functions via interpret / yields', 'OOP through persona classes'],
    category: 'systems',
    toy: 'top',
    date: '2026-02-01',
    tech: ['C', 'Flex', 'Bison'],
    links: { repo: 'https://github.com/Adi-Sin101/EmotionScript-Complier-Project-Using-Flex-Bison' },
    github: 'Adi-Sin101/EmotionScript-Complier-Project-Using-Flex-Bison',
    featured: true,
    images: ['emotionscript-cover.jpg'],
  },
  {
    title: 'Bookaroo',
    tagline: 'Swap physical books with your neighbours',
    description:
      'Location-aware community platform for exchanging physical books, with request, delivery and completion workflows for readers, delivery partners and admins.',
    highlights: [
      '14 merged pull requests: authentication, notifications and delivery modules',
      'Unit and integration tests for the notification and delivery services',
      'CI workflow with an H2 test database',
    ],
    category: 'web',
    toy: 'gift',
    date: '2026-03-01',
    role: 'Team project · backend features & tests',
    tech: ['Java', 'Spring Boot', 'JUnit', 'GitHub Actions'],
    links: { repo: 'https://github.com/Mehereen-1/SEPM_PROJECT' },
    github: 'Mehereen-1/SEPM_PROJECT',
    images: ['bookaroo-cover.jpg', 'bookaroo-0.jpg'],
  },
  {
    title: 'Intelligent Checkers',
    tagline: 'Adversarial vs simulation AI, in a web game',
    description: 'A checkers web game used as a comparative study of adversarial search versus simulation-based AI.',
    category: 'ai',
    toy: 'blocks',
    date: '2026-02-01',
    role: 'Team project',
    tech: ['Python', 'Cython', 'React', 'Vite'],
    links: { repo: 'https://github.com/CSE-3210-AI/Intelligent-Checkers--Webgame' },
    github: 'CSE-3210-AI/Intelligent-Checkers--Webgame',
    images: ['intelligent-checkers-cover.jpg'],
  },
  {
    title: 'Chorui',
    tagline: 'Every taka moves exactly once',
    description:
      'Hackathon team project: a closed-loop, simulated BDT money platform built to prove that every transfer moves atomically, exactly once, and stays auditable under retries, concurrency and failures.',
    category: 'web',
    toy: 'gift',
    date: '2026-08-01',
    role: 'Hackathon team contributor',
    tech: ['TypeScript', 'Python', 'PostgreSQL'],
    links: { repo: 'https://github.com/Rockstatata/pstu-hackathon' },
    github: 'Rockstatata/pstu-hackathon',
    images: ['chorui-cover.jpg'],
  },
  {
    title: 'AegisTwin',
    tagline: 'Emergency dispatch with a live digital twin',
    description:
      'Event-driven emergency dispatch platform where every channel (voice, app, SMS, USSD, mesh) becomes one incident schema and a digital twin is the single writer of resource state. Deterministic assignments with reasons you can audit later.',
    category: 'systems',
    toy: 'robot',
    date: '2026-08-01',
    role: 'Team contributor',
    tech: ['TypeScript', 'Redis', 'Azure'],
    github: 'Rockstatata/aegistwin',
    private: true,
    images: ['aegistwin-cover.jpg'],
  },
  {
    title: 'Student Management System',
    tagline: 'Enterprise Spring Boot with tests and CI',
    description:
      'Spring Boot 3 application for students, courses, departments and teachers with role-based access control, automated testing and continuous integration.',
    category: 'web',
    toy: 'blocks',
    date: '2026-02-01',
    tech: ['Java 17', 'Spring Boot', 'Docker', 'GitHub Actions'],
    links: { repo: 'https://github.com/Adi-Sin101/Student_Management' },
    github: 'Adi-Sin101/Student_Management',
    images: ['student-management-cover.jpg'],
  },
  {
    title: 'SwiftUI Notes',
    tagline: 'A pretty note-taking app for iOS',
    description: 'Note-taking app built with SwiftUI and Firebase: secure authentication, real-time sync and a clean interface.',
    category: 'mobile',
    toy: 'duck',
    date: '2026-02-01',
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    github: 'Adi-Sin101/Swift-Firebase',
    private: true,
    images: ['swiftui-notes-cover.jpg'],
  },
  {
    title: 'CookLoop',
    tagline: 'A social cooking playground for iOS',
    description:
      'iOS social cooking platform where people publish recipes, discover dishes, interact with other cooks and climb a gamified leaderboard.',
    category: 'mobile',
    toy: 'gift',
    date: '2026-03-01',
    role: 'Contributor',
    tech: ['Swift', 'SwiftUI'],
    links: { repo: 'https://github.com/Mehereen-1/CookLoop' },
    github: 'Mehereen-1/CookLoop',
    images: ['cookloop-cover.jpg'],
  },
  {
    title: 'Genetic Algorithm · Ackley',
    tagline: 'Evolving toward the global minimum',
    description: 'Real-valued genetic algorithm in Python that finds the global minimum of the multimodal 2D Ackley benchmark function.',
    category: 'ai',
    toy: 'duck',
    date: '2026-09-01',
    role: 'Contributor',
    tech: ['Python', 'NumPy'],
    links: { repo: 'https://github.com/ishrat02/ml-assignment-GA-ackley' },
    github: 'ishrat02/ml-assignment-GA-ackley',
    images: ['ga-ackley-cover.jpg'],
  },
  {
    title: 'CareerConnectDB',
    tagline: 'Job portal with data-driven dashboards',
    description: 'Career management and job portal with authentication, admin panel, CRUD and dashboards for employers and job seekers.',
    category: 'web',
    toy: 'gift',
    date: '2025-10-01',
    tech: ['PHP', 'MySQL'],
    links: { repo: 'https://github.com/Adi-Sin101/CareerConnectDB' },
    github: 'Adi-Sin101/CareerConnectDB',
    images: ['careerconnectdb-cover.jpg'],
  },
  {
    title: 'SkillSwap',
    tagline: 'Trade skills around campus',
    description: 'Campus skill-exchange platform with full CRUD and REST APIs on the MERN stack.',
    category: 'web',
    toy: 'blocks',
    date: '2025-09-01',
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind CSS'],
    links: { repo: 'https://github.com/Adi-Sin101/webdev_skillswap' },
    github: 'Adi-Sin101/webdev_skillswap',
    images: ['skillswap-cover.jpg'],
  },
  {
    title: 'Campus Complaint App',
    tagline: 'Report it, track it, fix it',
    description:
      'Cross-platform campus complaint management app with role-based dashboards, status tracking and push notifications.',
    category: 'mobile',
    toy: 'robot',
    date: '2025-09-01',
    role: 'Team project',
    tech: ['React Native', 'Expo', 'TypeScript'],
    links: { repo: 'https://github.com/Mehereen-1/ISD_Complain_App' },
    github: 'Mehereen-1/ISD_Complain_App',
    images: ['campus-complaint-cover.jpg'],
  },
  {
    title: 'PawPal',
    tagline: 'A pet-care sidekick for Android',
    description:
      'Android app for pet profiles, feeding and vet reminders, expenses and vet contacts, backed by Firebase authentication and storage.',
    category: 'mobile',
    toy: 'teddy',
    date: '2024-10-01',
    tech: ['Java', 'Android', 'Firebase'],
    links: { repo: 'https://github.com/Adi-Sin101/PawPal_Android' },
    github: 'Adi-Sin101/PawPal_Android',
    images: ['pawpal-cover.jpg'],
  },
  {
    title: 'Root Finder',
    tagline: 'Four numerical methods, one polynomial',
    description:
      'C++ program that finds polynomial roots with the bisection, false position, Newton–Raphson and secant methods, plus a bracket generator for picking starting intervals.',
    category: 'systems',
    toy: 'top',
    date: '2024-10-01',
    tech: ['C++', 'Numerical methods'],
    links: { repo: 'https://github.com/Adi-Sin101/Numerical-Temporary-Repo' },
    github: 'Adi-Sin101/Numerical-Temporary-Repo',
    images: ['root-finder-cover.jpg'],
  },
  {
    title: 'Company Management System',
    tagline: 'Hiring and employee records, the OOP way',
    description: 'Console C++ application to manage candidates and employees, match skills to requirements and persist records with file I/O.',
    category: 'systems',
    toy: 'blocks',
    date: '2023-08-01',
    tech: ['C++', 'OOP', 'File I/O'],
    links: { repo: 'https://github.com/Adi-Sin101/Company_Management_System' },
    github: 'Adi-Sin101/Company_Management_System',
    images: ['company-management-cover.jpg'],
  },
  {
    title: 'Fitness Tracker',
    tagline: 'Calories, BMI and goals in C++',
    description: 'Console fitness tracker with profiles, BMI, a food calorie database and goal tracking, built with clean OOP design.',
    category: 'systems',
    toy: 'car',
    date: '2023-08-01',
    tech: ['C++', 'OOP'],
    links: { repo: 'https://github.com/Adi-Sin101/Fitness-Tracking-System' },
    github: 'Adi-Sin101/Fitness-Tracking-System',
    images: ['fitness-tracker-cover.jpg'],
  },
]

export const publications = [
  {
    title: 'Medora: A Consent-Aware, AI-Native Bilingual Platform for Healthcare Management and Consultation',
    authors: 'SH Siddiqui, A Tahsin, KS Alam, SI Hossain',
    venue: 'SoftwareX (manuscript)',
    year: '2026',
    date: '2026-01-01',
    status: 'review' as const,
    abstract:
      'Medora is bilingual, consent-governed research software for patient-held health records, human-reviewed clinical drafts, specialty navigation and appointment coordination in Bangladesh. It places a deterministic policy boundary around assistive AI: purpose-, provider-, scope- and time-bound consent, source-linked summaries, review-gated prescription extraction and deterministic emergency red flags.',
    links: {
      scholar: 'https://scholar.google.com/citations?user=l_J2QaYAAAAJ&hl=en',
      code: 'https://github.com/CSE-3200-System-Project/Medora',
      demo: 'https://medorahealth.vercel.app',
    },
  },
]

export const experiences = [
  {
    role: 'Software Engineer',
    organization: 'Logarithm Studio',
    kind: 'work' as const,
    period: 'Mar 2026 – Present',
    startDate: '2026-03-01',
    location: 'Khulna · Remote · Full-time',
    summary:
      'Mobile app and JavaScript development at a studio that builds web, mobile, game and DevOps products: product features, UI implementation and iterative delivery.',
  },
  {
    role: 'Assistant Operations Secretary & Group Co-Organizer',
    organization: 'TEDxKUET 2026 · KUET Business & Entrepreneurship Club',
    kind: 'leadership' as const,
    period: '2026',
    startDate: '2026-04-01',
    endDate: '2026-05-01',
    location: 'Khulna',
    summary: 'Worked with the PR & Media team from planning through event day.',
    highlights: [
      'Created promotional videos and media content; campaigns reached 50.5K+ views',
      'Welcomed and coordinated guests, speakers and interview participants',
      'Coordinated speaker interview sessions',
      'Designed the post-event audience questionnaire for impact assessment',
    ],
  },
  {
    role: 'Research Fellow · SheSTEM Year 2 Impact Study',
    organization: 'SheSTEM × LightCastle Partners × Embassy of the Kingdom of the Netherlands',
    kind: 'research' as const,
    period: '2025 – Jan 2026',
    startDate: '2025-10-01',
    endDate: '2026-01-01',
    summary:
      'Contributed to qualitative research by documenting student interviews on STEM skills, confidence and career aspirations. Recognised with a Certificate of Recognition (Jan 2026).',
  },
  {
    role: 'Campus Ambassador',
    organization: 'SheSTEM',
    kind: 'leadership' as const,
    period: 'Aug 2025 – Present',
    startDate: '2025-08-01',
    summary: 'Building more inclusive spaces in STEM at KUET: events, peer engagement and bridges between students and industry.',
  },
  {
    role: 'Joint Secretary',
    organization: 'KUET Business & Entrepreneurship Club (KBEC)',
    kind: 'leadership' as const,
    period: 'Apr 2025 – Present',
    startDate: '2025-04-01',
    location: 'Khulna · On-site',
    summary: 'Leads operational planning for club events and workshops; coordinates logistics, communications and member onboarding.',
  },
  {
    role: 'Volunteer',
    organization: 'Hult Prize at KUET',
    kind: 'volunteer' as const,
    period: 'Jan – Apr 2024',
    startDate: '2024-01-01',
    endDate: '2024-04-01',
    summary: 'Event coordination and logistics support across every stage of the competition.',
  },
]

export const achievements = [
  {
    title: 'Participant · Team KUETaguns',
    event: 'NASA Space Apps Challenge 2026',
    year: '2026',
    date: '2026-10-01',
    medal: 'star' as const,
    description: 'Built Agun Panjika, a harmonised MODIS + VIIRS fire history for Bangladesh.',
  },
  {
    title: '1st Runner-Up',
    event: 'Bridging Engineering & Computer Science Competition 2025',
    year: '2025',
    date: '2025-09-01',
    medal: 'silver' as const,
    description: 'International hackathon by ILM AI Ltd × City St George’s, University of London, with ParaBounce.',
  },
  { title: '3rd Runner-Up', event: 'Case Crack 2.0 (KBEC)', year: '', medal: 'bronze' as const },
  { title: 'Participant', event: 'Intra KUET Programming Contest (IKPC) 2K23', year: '2023', date: '2023-01-01', medal: 'star' as const },
  { title: '4th Place', event: 'Spark Fusion 2K21 · Hardware Design', year: '2021', date: '2021-01-01', medal: 'star' as const },
]

export const milestones = [
  { title: 'Built a toy-island portfolio', emoji: '🏝️', date: '2026-10-01', description: 'Hello from the island you are standing on!' },
]
