import { useState, useEffect } from 'react'

interface ImageItem {
  src: string
  alt: string
  weight?: number
}

interface HookOptions {
  images: ImageItem[]
  interval?: number
  random?: boolean
}

interface HookReturn {
  currentIndex: number
  currentImage: ImageItem
  goToNext: () => void
  goToIndex: (index: number) => void
}

/**
 * Hook to manage image rotation with support for sequential and
 * weighted random selection.
 *
 * Features:
 * - Automatically rotates through images at specified interval
 * - Supports sequential rotation (default)
 * - Supports weighted random selection based on image weights
 * - Manual navigation with goToNext() and goToIndex()
 * - Handles edge cases (single image, invalid indices)
 *
 * @param {HookOptions} options - Configuration object
 * @param {ImageItem[]} options.images - Array of images to rotate
 * @param {number} [options.interval=10000] - Rotation interval in
 *   milliseconds
 * @param {boolean} [options.random=false] - Enable weighted random
 *   selection
 *
 * @returns {HookReturn} Object containing current image state and
 *   navigation functions
 *
 * @example
 * const { currentImage, goToNext, goToIndex } = useImageRotation({
 *   images: [
 *     { src: '/img1.jpg', alt: 'Image 1', weight: 2 },
 *     { src: '/img2.jpg', alt: 'Image 2', weight: 1 },
 *   ],
 *   interval: 5000,
 *   random: true,
 * })
 *
 * return <img src={currentImage.src} alt={currentImage.alt} />
 */
export const useImageRotation = (
  options: HookOptions,
): HookReturn => {
  const { images, interval = 10000, random = false } = options

  const [currentIndex, setCurrentIndex] = useState(0)

  /**
   * Get next index in sequential order.
   */
  const getNextSequentialIndex = (): number => {
    return (currentIndex + 1) % images.length
  }

  /**
   * Get next index using weighted random selection.
   * Images with higher weights are more likely to be selected.
   */
  const getNextRandomIndex = (): number => {
    if (images.length === 1) {
      return 0
    }

    let totalWeight = 0
    for (let j = 0; j < images.length; j++) {
      if (j !== currentIndex) {
        totalWeight += images[j].weight || 1
      }
    }

    let randomNumber = Math.random() * totalWeight

    for (let j = 0; j < images.length; j++) {
      if (j === currentIndex) continue

      const imageWeight = images[j].weight || 1
      randomNumber -= imageWeight

      if (randomNumber <= 0) {
        return j
      }
    }

    return (currentIndex + 1) % images.length
  }

  /**
   * Determine next index based on mode (sequential or random).
   */
  const getNextIndex = (): number => {
    if (random) {
      return getNextRandomIndex()
    }
    return getNextSequentialIndex()
  }

  /**
   * Advance to next image.
   */
  const goToNext = (): void => {
    setCurrentIndex(getNextIndex())
  }

  /**
   * Navigate to specific image by index.
   * Validates index is within bounds.
   */
  const goToIndex = (index: number): void => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
    }
  }

  // Auto-rotate images at specified interval
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
