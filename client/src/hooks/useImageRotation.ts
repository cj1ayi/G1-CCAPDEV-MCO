import {
  useState,
  useEffect
} from 'react'

interface ImageItem {
  src: string
  alt: string
  weight?: number
}

interface HookOptions {
  images: ImageItem[]
  interval?: number // Time in ms (default: 10000)
  random?: boolean
}

interface HookReturn {
  currentIndex: number
  currentImage: ImageItem
  goToNext: () => void
  goToIndex: (index: number) => void
}

export const useImageRotation = (options: HookOptions): HookReturn => {
  const { images, interval = 10000, random = false } = options;

  const [currentIndex, setCurrentIndex] = useState(0);

  const getNextSequentialIndex = (): number => {
    return (currentIndex + 1) % images.length;
  }

  const getNextRandomIndex = (): number => {
    if (images.length === 1) {
      return 0
    }

    let totalWeight = 0
    for (let j = 0; j < images.length; j++) {
      if (j !== currentIndex) {
        totalWeight += images[j].weight || 1;
      }
    }

    let randomNumber = Math.random() * totalWeight;

    for (let j = 0; j < images.length; j++) {
      if (j === currentIndex) continue;
      
      const imageWeight = images[j].weight || 1
      randomNumber -= imageWeight

      if (randomNumber <= 0) {
        return j
      }
    }

    return (currentIndex + 1) % images.length
  }

  const getNextIndex = (): number => {
    if (random) {
      return getNextRandomIndex()
    }
    return getNextSequentialIndex()
  }

  const goToNext = (): void => {
    setCurrentIndex(getNextIndex())
  }

  const goToIndex = (index: number): void => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
    }
  }

  useEffect(() => {
    if (images.length <= 1) {
      return
    }

    const rotationInterval = setInterval(() => {
      setCurrentIndex(getNextIndex())
    }, interval)

    return () => {
      clearInterval(rotationInterval)
    }
  }, [currentIndex, interval, images.length, random])

  return {
    currentIndex,
    currentImage: images[currentIndex],
    goToNext,
    goToIndex,
  }
}
