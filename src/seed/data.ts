// Starting content for the island, taken from Adiba's CV and GitHub.
// Everything here can be edited later from the admin dashboard.

export const profile = {
  name: 'Adiba Tahsin',
  nickname: 'A Diva',
  greeting: 'Aloha!',
  roles: [
    'Full-stack developer',
    'AI-assisted systems builder',
    'Research fellow',
    'Tech event organiser',
    'Seafood explorer',
  ],
  headline:
    'Final-year CSE student at KUET who builds production-grade apps, chases new food, new places and new people, and turns ideas into things that ship.',
  bio: "I'm Adiba, a final-year Computer Science & Engineering student at KUET specialising in full-stack web development, AI-assisted systems and workflow automation. I've built across PHP, MERN and FastAPI backends, Android, iOS, Flutter and React Native, and I love tools that take boring repeated work off people's plates. Off the keyboard I co-organised TEDxKUET 2026, champion women in STEM as a SheSTEM Campus Ambassador and Research Fellow, and collect adventures: new food (seafood, always), new cities, new outfits and new friends.",
  funFacts: [
    { emoji: '🦐', text: 'Will travel for good seafood' },
    { emoji: '🧸', text: 'Animated films and toys forever' },
    { emoji: '👗', text: 'Fashion is my side quest' },
    { emoji: '🐱', text: "Penny's favourite napping pillow" },
  ],
  currentlyAt: 'Software Engineer @ Logarithm Studio',
  location: 'Khalishpur, Khulna, Bangladesh',
  tagline: 'CSE Undergraduate @ KUET · Software Engineer @ Logarithm Studio',
  openTo: 'Internships, research collaborations and hackathon teams',
  email: 'adiba0tahsin@gmail.com',
  socials: [
    { platform: 'github', url: 'https://github.com/Adi-Sin101', handle: 'Adi-Sin101' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/adiba-tahsin-985b452a2', handle: 'Adiba Tahsin' },
    { platform: 'instagram', url: 'https://www.instagram.com/adiba_tahsin', handle: '@adiba_tahsin' },
    { platform: 'facebook', url: 'https://www.facebook.com/search/top?q=Adiba%20Tahsin', handle: 'Adiba Tahsin' },
    {
      platform: 'scholar',
      url: 'https://scholar.google.com/scholar?q=%22Medora%3A+A+Consent-Aware%2C+AI-Native+Bilingual+Platform%22',
      handle: 'Google Scholar',
    },
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science & Engineering',
      school: 'Khulna University of Engineering & Technology (KUET)',
      period: '2022 – 2027 (expected)',
      startDate: '2022-01-01',
      grade: 'CGPA 3.37 / 4.00',
    },
    {
      degree: 'Higher Secondary Certificate (HSC)',
      school: "Khulna Govt. Girls' College, Khulna",
      period: '2019 – 2021',
      startDate: '2019-07-01',
      grade: 'GPA 5.00 / 5.00',
    },
    {
      degree: 'Secondary School Certificate (SSC)',
      school: "Govt. Coronation Secondary Girls' School, Khulna",
      period: 'Completed 2019',
      startDate: '2019-02-01',
      grade: 'GPA 5.00 / 5.00',
    },
  ],
  seoTitle: 'Adiba Tahsin · A Diva on a toy island',
  seoDescription:
    'Portfolio of Adiba Tahsin: full-stack developer, AI-assisted systems builder and CSE student at KUET. Explore her projects, research and adventures on a 3D toy island.',
}

export const penny = {
  intro:
    "Meet Penny, my roommate's cat and the island's head of napping. White fluff, ginger patches, zero responsibilities. She already starred in my OpenGL toy-room project, so of course she got a hammock here too.",
  facts: [
    { label: 'Job title', value: 'Chief Nap Officer' },
    { label: 'Colours', value: 'White with ginger patches' },
    { label: 'Hobbies', value: 'Sleeping on laundry, sleeping on plaid, sleeping' },
    { label: 'Weakness', value: 'Belly rubs (allegedly)' },
  ],
  meows: [
    'Mrrp? Five more minutes…',
    'Did someone say seafood?',
    'I was not asleep. I was debugging.',
    'Pet me and I might approve your PR.',
    'Zzz… shipping to production… zzz',
  ],
  photos: ['penny-1.jpg', 'penny-2.jpg', 'penny-3.jpg', 'penny-4.jpg'],
}

export { achievements, experiences, milestones, projects, publications } from './work'

export const skills: { name: string; group: string; level: number }[] = [
  ['React', 'web', 5], ['Next.js', 'web', 5], ['Node.js', 'web', 4], ['Express.js', 'web', 4], ['FastAPI', 'web', 4],
  ['PHP', 'web', 4], ['ASP.NET', 'web', 3], ['Tailwind CSS', 'web', 5], ['Supabase', 'web', 4], ['MongoDB', 'web', 4],
  ['MySQL', 'web', 4], ['Firebase', 'mobile', 4], ['React Native', 'mobile', 4], ['Expo', 'mobile', 4],
  ['Java (Android)', 'mobile', 4], ['Flutter', 'mobile', 3], ['SwiftUI', 'mobile', 3],
  ['TypeScript', 'languages', 4], ['JavaScript', 'languages', 5], ['Python', 'languages', 4], ['C++', 'languages', 4],
  ['Java', 'languages', 4], ['C', 'languages', 3], ['Dart', 'languages', 3], ['Swift', 'languages', 3],
  ['LLM integration', 'ai', 4], ['AI automation', 'ai', 4], ['NLP', 'ai', 3], ['scikit-learn', 'ai', 3],
  ['Git & GitHub', 'tools', 5], ['Figma', 'tools', 4], ['Postman', 'tools', 4], ['GitHub Actions', 'tools', 3],
  ['Flex / Bison', 'tools', 3], ['OpenGL', 'tools', 3], ['Advanced Excel', 'tools', 4],
  ['HTML & CSS', 'web', 5], ['Leadership', 'soft', 5], ['Communication', 'soft', 5], ['Event management', 'soft', 5], ['Content creation', 'soft', 5], ['Teamwork', 'soft', 5],
  ['Research & analysis', 'soft', 4], ['Process thinking', 'soft', 4],
].map(([name, group, level]) => ({ name: name as string, group: group as string, level: level as number }))

export const looks: { file: string; title: string; vibe: string }[] = [
  { file: 'photo-00.jpg', title: 'Pink gingham by the shore', vibe: 'casual' },
  { file: 'photo-19.jpg', title: 'Little black off-shoulder', vibe: 'party' },
  { file: 'photo-17.jpg', title: 'Red & gold festive', vibe: 'traditional' },
  { file: 'photo-01.jpg', title: 'Livin’ it up in denim', vibe: 'casual' },
  { file: 'photo-13.jpg', title: 'Floral midi & a bouquet', vibe: 'party' },
  { file: 'photo-04.jpg', title: 'Red dupatta, balcony light', vibe: 'traditional' },
  { file: 'photo-03.jpg', title: 'Emerald wrap dress', vibe: 'formal' },
  { file: 'photo-08.jpg', title: 'All-white embroidery', vibe: 'traditional' },
  { file: 'photo-10.jpg', title: 'Midnight florals', vibe: 'party' },
  { file: 'photo-11.jpg', title: 'Pink tie-dye saree', vibe: 'traditional' },
  { file: 'photo-12.jpg', title: 'Blush under the flower arch', vibe: 'party' },
  { file: 'photo-14.jpg', title: 'Garden wall & magenta', vibe: 'traditional' },
  { file: 'photo-15.jpg', title: 'Soft pastel mornings', vibe: 'casual' },
  { file: 'photo-18.jpg', title: 'Café hopping', vibe: 'casual' },
]

// Locations are left for Adiba to fill in from the admin (lat/lng puts a pin on the globe).
export const places: { name: string; files: string[]; story: string }[] = [
  { name: 'Tea garden trails', files: ['photo-05.jpg'], story: 'Rolling green tea hills and a well-earned hat break.' },
  { name: 'River boat ride', files: ['photo-09.jpg'], story: 'Straw hat, slow river, zero network. Perfect.' },
  { name: 'Waterfall splash', files: ['photo-16.jpg'], story: 'Sat right in the spray. No regrets, very wet.' },
  { name: 'Seaside skies', files: ['photo-02.jpg'], story: 'Blue patterns, bluer horizon.' },
  { name: 'Forest cottage stay', files: ['photo-07.jpg'], story: 'Wooden cottages in the trees.' },
  { name: 'Countryside trail', files: ['photo-06.jpg'], story: 'Sunglasses on, map off.' },
]

export const food = [
  { dish: 'Lobster thermidor', kind: 'seafood', notes: 'The final boss of seafood.' },
  { dish: 'Sushi omakase', kind: 'seafood', notes: "Chef's choice, every piece." },
  { dish: 'Chingri malai curry', kind: 'seafood', notes: 'Coconut prawns, the Bengali classic.' },
  { dish: 'Grilled crab at a beach shack', kind: 'seafood', notes: 'Sandy toes required.' },
]

export const welcomePost = {
  title: 'Welcome to my island',
  excerpt: 'Why my portfolio is a tiny tropical island with a blue alien, a sleepy cat and a seafood shack.',
  tags: ['life'],
  paragraphs: [
    "Hi, I'm Adiba (yes, A Diva). I love animated films, toys, seafood, fashion and going somewhere I've never been, so a regular résumé page felt way too quiet.",
    'So I built a little island instead. My projects are toys in the workshop, my research lives in the lighthouse, the boutique holds my favourite outfits, and Penny naps in the hammock.',
    "Stories about trips, food and the things I build will show up right here. Thanks for visiting, and don't wake Penny.",
  ],
}
