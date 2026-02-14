import { Post } from '@/lib/mockData'

import sharkImage from '@/assets/post/shark.jpg'
import carImage from '@/assets/post/car.jpg'

const LOCAL_IMAGES: Record<string, string> = {
  '3': sharkImage, 
  '2': carImage,
}

const PHOTO_DATABASE: Record<string, string> = {
  // Tech / CS
  coding: 'photo-1461749280684-dccba630e2f6',
  laptop: 'photo-1517694712202-14dd9538aa97',
  monitor: 'photo-1550439062-609e1531270e',
  server: 'photo-1558494949-ef010cbdcc51',
  keyboard: 'photo-1511467687858-23d96c32e4ae',
  tech: 'photo-1518770660439-4636190af475',
  // Campus Life
  campus: 'photo-1523050854058-8df90110c9f1',
  students: 'photo-1541339907198-e08756dedf3f',
  sunset: 'photo-1472393365320-dc772421449a',
  coffee: 'photo-1509042239860-f550ce710b93',
  friends: 'photo-1529156069898-49953e39b3ac',
  // Academic
  books: 'photo-1497633762265-9d179a990aa6',
  library: 'photo-1456513080510-7bf3a84b82f8',
  classroom: 'photo-1580582932707-520aed937b7b',
  exam: 'photo-1434030216411-0b793f4b4173',
  study: 'photo-1491841550275-ad7854e35ca6',
  // Food
  food: 'photo-1504674900247-0877df9cc836',
  burger: 'photo-1568901346375-23c9450c58cd',
  restaurant: 'photo-1517248135467-4c7edcad34c4',
  // News
  news: 'photo-1504711434969-e33886168f5c',
  newspaper: 'photo-1495020689067-958852a7765e',
  // Animals
  cat: 'photo-1514888286974-6c03e2ca1dba',
}

const spaceDefaults: Record<string, string[]> = {
  'ccs-gov': ['laptop', 'coding', 'monitor', 'tech'],
  'freedom-wall': ['campus', 'students', 'sunset', 'coffee', 'friends'],
  'the-lasallian': ['news', 'newspaper', 'campus'],
  'pts': ['library', 'books', 'study'],
  'rinaldoeats': ['food', 'burger', 'restaurant'],
}

const GLOBAL_FALLBACK = 'photo-1523050854058-8df90110c9f1' // University campus

export const getPostThumbnail = (post: Post): string => {
  // 0. Check for local image override first
  if (LOCAL_IMAGES[post.id]) {
    return LOCAL_IMAGES[post.id]
  }

  const title = (post.title || "").toLowerCase()
  const space = post.space || "general"
  
  // 1. Try Keyword Match
  let photoKey = Object.keys(PHOTO_DATABASE).find(key => title.includes(key))

  // 2. Fallback to Space-based Defaults
  if (!photoKey) {
    const defaults = spaceDefaults[space] || ['campus', 'students']
    const idSeed = String(post.id).length
    photoKey = defaults[idSeed % defaults.length]
  }

  const photoId = PHOTO_DATABASE[photoKey] || GLOBAL_FALLBACK
  return `https://images.unsplash.com/${photoId}?w=800&q=80&auto=format&fit=crop`
}
