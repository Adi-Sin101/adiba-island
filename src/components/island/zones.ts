export type ZoneId =
  | 'welcome'
  | 'timeline'
  | 'workshop'
  | 'lighthouse'
  | 'stage'
  | 'blocks'
  | 'boutique'
  | 'shack'
  | 'dock'
  | 'cabin'
  | 'hammock'
  | 'mailbox'

export type Zone = {
  id: ZoneId
  label: string
  emoji: string
  title: string
  blurb: string
  /** Position on the island (x, z). */
  at: [number, number]
  /** Height the camera looks at. */
  lookY: number
  /** Which way the building faces (rotation around Y); the camera looks at it from that side. */
  facing: number
  /** Distance of the camera from the zone. */
  distance: number
  color: string
}

// Tour order: scrolling steps through zones in this order.
export const ZONES: Zone[] = [
  {
    id: 'welcome',
    label: 'Welcome Beach',
    emoji: '🌺',
    title: 'Aloha, I’m Adiba',
    blurb: 'About',
    at: [0, 8.6],
    lookY: 1.6,
    facing: 0,
    distance: 8.5,
    color: '#ff7eb6',
  },
  {
    id: 'timeline',
    label: 'Memory Lane',
    emoji: '🚂',
    title: 'My journey so far',
    blurb: 'Journey',
    at: [1.8, 4.6],
    lookY: 0.8,
    facing: -0.5,
    distance: 7,
    color: '#ff9b3d',
  },
  {
    id: 'workshop',
    label: 'Toy Workshop',
    emoji: '🧸',
    title: 'Things I’ve built',
    blurb: 'Projects',
    at: [-7.4, 3.6],
    lookY: 1.6,
    facing: 0.9,
    distance: 9,
    color: '#ffb547',
  },
  {
    id: 'blocks',
    label: 'Block Tower',
    emoji: '🧱',
    title: 'My toolbox',
    blurb: 'Skills',
    at: [-3.6, 0.4],
    lookY: 1.8,
    facing: 0,
    distance: 8,
    color: '#7cc6ff',
  },
  {
    id: 'lighthouse',
    label: 'Research Lighthouse',
    emoji: '🗼',
    title: 'Research & papers',
    blurb: 'Research',
    at: [-9.6, -4.6],
    lookY: 3,
    facing: 0.5,
    distance: 11,
    color: '#ff5d5d',
  },
  {
    id: 'stage',
    label: 'Events Stage',
    emoji: '🎤',
    title: 'Experience & leadership',
    blurb: 'Experience',
    at: [-3.4, -7.6],
    lookY: 1.6,
    facing: 0.25,
    distance: 9,
    color: '#a774ff',
  },
  {
    id: 'boutique',
    label: 'Diva Boutique',
    emoji: '👗',
    title: 'The lookbook',
    blurb: 'Fashion',
    at: [4, -7.4],
    lookY: 1.6,
    facing: -0.4,
    distance: 9,
    color: '#ff8fd0',
  },
  {
    id: 'shack',
    label: 'Seafood Shack',
    emoji: '🦐',
    title: 'Food diary',
    blurb: 'Food',
    at: [9.2, -2.4],
    lookY: 1.4,
    facing: -1.6,
    distance: 8.5,
    color: '#ff9b6a',
  },
  {
    id: 'dock',
    label: 'Travel Dock',
    emoji: '🌏',
    title: 'Places & adventures',
    blurb: 'Travel',
    at: [11.2, 4.8],
    lookY: 1.6,
    facing: -0.4,
    distance: 9,
    color: '#2fc4c9',
  },
  {
    id: 'cabin',
    label: 'Story Cabin',
    emoji: '📖',
    title: 'Stories & blog',
    blurb: 'Blog',
    at: [5.4, 1.6],
    lookY: 1.5,
    facing: -1.2,
    distance: 8,
    color: '#8bd17c',
  },
  {
    id: 'hammock',
    label: 'Penny’s Hammock',
    emoji: '🐱',
    title: 'Meet Penny',
    blurb: 'Penny',
    at: [4.6, 7.2],
    lookY: 1.1,
    facing: -0.5,
    distance: 6,
    color: '#ffb347',
  },
  {
    id: 'mailbox',
    label: 'Mailbox',
    emoji: '💌',
    title: 'Say hello',
    blurb: 'Contact',
    at: [-4.6, 8],
    lookY: 1.2,
    facing: 0.5,
    distance: 6.5,
    color: '#2a6bf2',
  },
]

export const zoneById = (id: ZoneId) => ZONES.find((z) => z.id === id)!

export const ISLAND_RADIUS = 13
