import { Space } from './types'

export const MOCK_SPACES: Space[] = [
  {
    id: '1',
    name: 'ccs-gov',
    displayName: 'CCS Student Gov',
    description: 'Official updates, announcements, and support from the College of Computer Studies Student Government.',
    memberCount: '1.2k',
    postCount: '450',
    icon: 'C',
    iconType: 'text',
    category: 'Official',
    colorScheme: 'from-blue-500 to-cyan-400',
    isJoined: false,
    isActive: true,
    createdDate: 'Aug 24, 2018',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi6Xukxb2LT4Mj6TjnwhnNtFL4ao6VlYjxduRaoL2twXEpqafKTN0IYPbjjgb5qVdtBLv7KGnqQjFEIs5PVihem28O11xmtCfpUyyrD4BGyJbd58psZuBZSEguY-fvrpnbbrNLOLSTMLGUCiZTmRfTKyZKfOF3l1YQMRt0cK4fOqXOYKBMlVy12c9NkO65iOvmRD4rrZTzHQr_w4E8wpkhdaGDtZq3d6SBP03g0VhBp5q2CnqRbvxmZcEIGBdshM0VZqXHjgBDMJA',
    rules: [
      { title: 'Be Respectful', description: 'We are all Lasallians here. No hate speech.' },
      { title: 'No NSFW Content', description: 'Keep it clean and wholesome.' },
      { title: 'DLSU Related Only', description: 'Memes must be relevant to university life.' }
    ]
  },
  {
    id: '2',
    name: 'freedom-wall',
    displayName: 'DLSU Freedom Wall',
    description: 'Express yourself anonymously. The pulse of the Lasallian community. Keep it respectful.',
    memberCount: '5.6k',
    postCount: '10k+',
    icon: 'F',
    iconType: 'text',
    category: 'Lifestyle',
    colorScheme: 'from-pink-500 to-rose-400',
    isJoined: true,
    createdDate: 'Oct 24, 2016',
    rules: [
      { title: 'Anonymity', description: 'Do not dox other students.' },
      { title: 'Respect', description: 'No targeted harassment.' }
    ]
  }
]
