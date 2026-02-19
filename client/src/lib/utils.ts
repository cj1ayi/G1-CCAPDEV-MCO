import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import LegendsYuch from "@/assets/loginpics/legendsyuch.jpg";
import SunriseHenry from "@/assets/loginpics/sunerisehenry.jpg";
import SunriseMig from "@/assets/loginpics/sunrisestmig.jpg";
import SundownHenry from "@/assets/loginpics/sundownhenry.jpg";


/*
 * Merges Tailwind CSS classes with clsx and handles conflicts via 
 * tailwind-merge
 * @param inputs - An array of class names, objects or conditional values
 * @return A merged string of tailwind classes
 */
export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

/*
 * Formats big numbers into human readable string
 * @param num - The number to format
 * @example formatNumber(1500) returns "1.5K"
 */
export const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) 
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1_000_000) 
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000) 
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';

    return num.toString();
};

/*
 * Truncates a string to a maximum length and appends an ellipsis
 * @param text - The string to truncate
 * @param maxLength - The maximum allowed length
 * @returns The truncated string.
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength)
        return text;

    return `${text.slice(0, maxLength).trim()}...`;
}

/*
 * Selects a random hex color from a predefined brand pallete.
 * @return A hex color string
 */
export const getRandomColor = (): string => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', 
                    '#3B82F6', '#8B5CF6', '#EC4899'];

    return colors[Math.floor(Math.random() * colors.length)];
}

/*
 * Extracts initials from a full name (up to 2 characters).
 * @param name - The full name 
 * @returns The uppercase intials
*/
export const getInitials = (name: string): string => {
    return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/*
 * Creates a debounced function that delays execution 
 * until after 'wait' milliseconds
 * @param func - The function to debounce
 * @param wait - Delay in milliseconds
 * @return A debounced version of the function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>): void => {
        if (timeout)
            clearTimeout(timeout);

        timeout = setTimeout(() => func(...args), wait);
    };
};

/*
 * Creates a throttle function that only involes 'func' at most per 'limit' ms
 * @param func - The function to throttle
 * @param limit - The window of time milliseconds
 * @return A throttle version of the function
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;
    
    return (...args: Parameters<T>): void => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/*
 * Copies text to the system clipboard using the modern Clipboard API.
 *
 * @param text - The string to copy.
 * @returns A promise resolving to true if successful, false otherwise.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text:', err);
        return false;
    }
};

/*
 * Transforms a string into a URL-friendly slug
 * @param text - The string to slugify
 * @return A kebab-case slug
 */
export const slugify = (text: string): string => {
    return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/*
 * Formats a byte value into the closest human-readable unti 
 * @param bytes - The number of bytes
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0)
        return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/*
 * Returns a relatie time string 
 * @param timestamp - Date object, ISO string, or number
 */
export const getRelativeTime = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: Record<string, number> = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);

        if (interval >= 1)
            return interval == 1 ? `1 ${unit} ago` : 
                `${interval} ${unit}s ago`;
    }
        return 'just now';
}

/*
 * Type-safe LocalStorage wrapper
 */
export const storage = {
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('localStorage Error:', error);
        }
    },
    remove: (key: string): void => localStorage.removeItem(key),
    clear: (): void => localStorage.clear(),
};

/*
 * Generates a non-cryptographic unique ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/*
 * Promisified timeout
 */
export const sleep = (ms: number): Promise<void> => new Promise(
    (resolve) => setTimeout(resolve, ms));

/*
 * Group an array of objects by a specific key
 * @param array - The array to group
 * @param key - The key to group by
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const group = String(item[key]);

        if (!result[group])
            result[group] = [];

        result[group].push(item);

        return result;
    }, {} as Record<string, T[]>);
};

/*
 * Retries an async function with exponential backoff
 * @param fn - The async function to execute
 * @param options - Retry configuration
 */
export const retry = async <T>(
    fn: () => Promise<T>, 
        { retries = 3, delay = 1000, backoff = 2 } = { }
): Promise<T> => {

    let lastError: unknown;
    let currentDelay = delay;

    for (let j = 0; j <= retries; j++) {

        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (j < retries) {
                await sleep(currentDelay);
                currentDelay *= backoff
            }
        }

    }

    throw lastError;
};

/*
 * Temporary Verification
 */
export const isValidDLSUEmail = (email: string): boolean => {
    return /^[\w.-]+@dlsu\.edu\.ph$/.test(email);
}

export const BACKGROUND_IMAGES = [
    {
      src: SunriseHenry,
      alt: "Sunrise Henry",
      weight: 300,
    },
    {
      src: SunriseMig,
      alt: "Sunrise St. Miguel",
      weight: 300,
    },
    {
      src: SundownHenry,
      alt: "Sundown Henry",
      weight: 300,
    },
    {
      src: LegendsYuch,
      alt: "Legends Yuch",
      weight: 1,
    },
];


