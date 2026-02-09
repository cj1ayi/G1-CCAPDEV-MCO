import { Space } from './types'

export const MOCK_SPACES: Space[] = [
  {
    id: '1',
    name: 'ccs',
    displayName: 'CCS Student Gov',
    description: 'Official updates, announcements, and support from the College of Computer Studies Student Government.',
    memberCount: 1200,
    onlineCount: 45,
    icon: 'C',
    category: 'Official',
    rules: [
      { title: 'Be Respectful', description: 'We are all Lasallians here.' },
      { title: 'No Cheating', description: 'Sharing exam answers is prohibited.' }
    ],
    createdAt: 'Aug 24, 2018'
  },
  {
    id: '2',
    name: 'freedom-wall',
    displayName: 'DLSU Freedom Wall',
    description: 'Express yourself anonymously. The pulse of the Lasallian community. Keep it respectful.',
    memberCount: 5600,
    onlineCount: 150,
    icon: 'F',
    category: 'Lifestyle',
    rules: [],
    createdAt: 'Oct 24, 2016'
  },
  {
    id: '3',
    name: 'frosh',
    displayName: 'Frosh Support (ID 124)',
    description: 'Guides, campus maps, enrollment tips, and survival hacks for the incoming batch.',
    memberCount: 800,
    onlineCount: 12,
    icon: '124',
    category: 'Batch',
    rules: [],
    createdAt: 'Jan 12, 2024'
  }
]
