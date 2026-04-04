import { 
  useEffect, 
  useState 
} from 'react'

import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { Avatar } from '@/components/ui'
import { ExternalLink, Shield, FlaskConical } from 'lucide-react'

import { API_BASE_URL } from '@/lib/apiUtils'

// ── Types ────────────────────────────────────────────────────────

interface DevUser {
  _id: string
  username: string
  name: string
  avatar?: string
  bio?: string
  badges: string[]
}

// ── Beta testers — fill in manually ─────────────────────────────

interface BetaTester {
  name: string          // display name
  username?: string     // optional link to profile
  bug?: string           // what they found
  feat?: string
}

const BETA_TESTERS: BetaTester[] = [
  { 
    name: 'PieIsSpy', 
    username: 'pieisspy', 
    bug: 'Suggested GIF on Comments' 
  },
  { 
    name: 'Allen Conner Hizon', 
    username: 'allen_hizon_437', 
    bug: 'Race conditioned the application leading to discoveries of multiple performance issues and vunerabilities' 
  },
  { 
    name: 'Pring', 
    username: '_pringles', 
    bug: 'Reported no validation for invalid links' 
  },
  { 
    name: 'Byron Ang', 
    username: 'onion', 
    bug: 'Reported no limit for tags, comments, and post' 
  },
  { 
    name: 'Sean Benedict Bernardo', 
    username: 'monggoyo63', 
    bug: 'Suggested to utilize toast to inform guessed users to sign in to interract with posts' 
  },
]

// ── Packages ─────────────────────────────────────────────────────

interface Package {
  name: string
  version: string
  description: string
  url: string
  type: 'frontend' | 'backend' | 'devtool'
}

const PACKAGES: Package[] = [
  // Frontend
  { name: 'react', version: '19.2.0', description: 'UI library for building component-based interfaces', url: 'https://react.dev', type: 'frontend' },
  { name: 'react-dom', version: '19.2.0', description: 'React rendering for the browser DOM', url: 'https://react.dev', type: 'frontend' },
  { name: 'react-router-dom', version: '7.12.0', description: 'Client-side routing and navigation', url: 'https://reactrouter.com', type: 'frontend' },
  { name: '@tanstack/react-query', version: '5.90.19', description: 'Async state management and server data caching', url: 'https://tanstack.com/query', type: 'frontend' },
  { name: 'framer-motion', version: '12.33.0', description: 'Production-ready animation library for React', url: 'https://www.framer.com/motion', type: 'frontend' },
  { name: 'zustand', version: '5.0.11', description: 'Lightweight global state management', url: 'https://zustand-demo.pmnd.rs', type: 'frontend' },
  { name: 'react-hook-form', version: '7.71.1', description: 'Performant, flexible forms with easy validation', url: 'https://react-hook-form.com', type: 'frontend' },
  { name: '@hookform/resolvers', version: '5.2.2', description: 'Validation resolvers for react-hook-form', url: 'https://github.com/react-hook-form/resolvers', type: 'frontend' },
  { name: 'zod', version: '4.3.5', description: 'TypeScript-first schema validation', url: 'https://zod.dev', type: 'frontend' },
  { name: 'axios', version: '1.13.2', description: 'Promise-based HTTP client for the browser', url: 'https://axios-http.com', type: 'frontend' },
  { name: 'lucide-react', version: '0.562.0', description: 'Beautiful and consistent open-source icon set', url: 'https://lucide.dev', type: 'frontend' },
  { name: 'class-variance-authority', version: '0.7.1', description: 'Component variant management utility', url: 'https://cva.style', type: 'frontend' },
  { name: 'clsx', version: '2.1.1', description: 'Utility for constructing className strings conditionally', url: 'https://github.com/lukeed/clsx', type: 'frontend' },
  { name: 'tailwind-merge', version: '3.4.0', description: 'Merge Tailwind CSS classes without conflicts', url: 'https://github.com/dcastil/tailwind-merge', type: 'frontend' },
  { name: 'date-fns', version: '4.1.0', description: 'Modern JavaScript date utility library', url: 'https://date-fns.org', type: 'frontend' },
  { name: 'react-markdown', version: '10.1.0', description: 'Render Markdown as React components', url: 'https://github.com/remarkjs/react-markdown', type: 'frontend' },
  { name: 'remark-gfm', version: '4.0.1', description: 'GitHub Flavored Markdown support for remark', url: 'https://github.com/remarkjs/remark-gfm', type: 'frontend' },
  { name: 'rehype-raw', version: '7.0.0', description: 'Parse raw HTML in rehype pipelines', url: 'https://github.com/rehypejs/rehype-raw', type: 'frontend' },
  { name: '@tiptap/react', version: '3.20.1', description: 'Headless rich-text editor framework for React', url: 'https://tiptap.dev', type: 'frontend' },
  { name: '@tiptap/starter-kit', version: '3.20.1', description: 'Collection of essential Tiptap extensions', url: 'https://tiptap.dev', type: 'frontend' },
  { name: '@tiptap/extension-link', version: '3.20.1', description: 'Tiptap extension for hyperlink support', url: 'https://tiptap.dev', type: 'frontend' },
  { name: '@tiptap/extension-image', version: '3.20.2', description: 'Tiptap extension for inline image embeds', url: 'https://tiptap.dev', type: 'frontend' },
  { name: '@tiptap/extension-placeholder', version: '3.20.2', description: 'Tiptap extension for placeholder text', url: 'https://tiptap.dev', type: 'frontend' },
  { name: '@tiptap/extension-superscript', version: '3.20.1', description: 'Tiptap extension for superscript formatting', url: 'https://tiptap.dev', type: 'frontend' },
  { name: '@tiptap/pm', version: '3.20.1', description: 'ProseMirror bindings used by Tiptap', url: 'https://tiptap.dev', type: 'frontend' },
  { name: 'tiptap-markdown', version: '0.9.0', description: 'Markdown input/output support for Tiptap', url: 'https://github.com/aguingand/tiptap-markdown', type: 'frontend' },
  { name: 'embla-carousel-react', version: '8.6.0', description: 'Lightweight extensible carousel for React', url: 'https://www.embla-carousel.com', type: 'frontend' },
  { name: 'embla-carousel-autoplay', version: '8.6.0', description: 'Autoplay plugin for Embla Carousel', url: 'https://www.embla-carousel.com/plugins/autoplay', type: 'frontend' },
  { name: 'react-countup', version: '6.5.3', description: 'Animated number counting component for React', url: 'https://github.com/glennreyes/react-countup', type: 'frontend' },
  // Backend
  { name: 'express', version: '4.21.2', description: 'Fast, minimalist web framework for Node.js', url: 'https://expressjs.com', type: 'backend' },
  { name: 'mongoose', version: '8.10.1', description: 'MongoDB object modeling for Node.js', url: 'https://mongoosejs.com', type: 'backend' },
  { name: 'passport', version: '0.7.0', description: 'Authentication middleware for Node.js', url: 'https://www.passportjs.org', type: 'backend' },
  { name: 'passport-google-oauth20', version: '2.0.0', description: 'Passport strategy for Google OAuth 2.0', url: 'https://github.com/jaredhanson/passport-google-oauth2', type: 'backend' },
  { name: 'express-session', version: '1.19.0', description: 'Session middleware for Express', url: 'https://github.com/expressjs/session', type: 'backend' },
  { name: 'connect-mongo', version: '6.0.0', description: 'MongoDB session store for express-session', url: 'https://github.com/jdesboeufs/connect-mongo', type: 'backend' },
  { name: 'cors', version: '2.8.5', description: 'Express middleware for enabling CORS', url: 'https://github.com/expressjs/cors', type: 'backend' },
  { name: 'dotenv', version: '16.4.7', description: 'Loads environment variables from .env files', url: 'https://github.com/motdotla/dotenv', type: 'backend' },
  { name: 'helmet', version: '8.1.0', description: 'Secures Express apps with HTTP headers', url: 'https://helmetjs.github.io', type: 'backend' },
  { name: 'express-rate-limit', version: '8.3.2', description: 'Rate limiting middleware for Express', url: 'https://github.com/express-rate-limit/express-rate-limit', type: 'backend' },
  { name: 'express-mongo-sanitize', version: '2.2.0', description: 'Sanitizes input to prevent MongoDB injection', url: 'https://github.com/fiznool/express-mongo-sanitize', type: 'backend' },
  { name: 'express-validator', version: '7.3.1', description: 'Input validation and sanitization for Express', url: 'https://express-validator.github.io', type: 'backend' },
  { name: 'cookie-parser', version: '1.4.7', description: 'Parses Cookie header and populates req.cookies', url: 'https://github.com/expressjs/cookie-parser', type: 'backend' },
  // Dev tools
  { name: 'vite', version: '7.2.4', description: 'Next-generation frontend build tool', url: 'https://vitejs.dev', type: 'devtool' },
  { name: 'typescript', version: '5.9.3', description: 'Typed superset of JavaScript', url: 'https://www.typescriptlang.org', type: 'devtool' },
  { name: 'tailwindcss', version: '3.4.19', description: 'Utility-first CSS framework', url: 'https://tailwindcss.com', type: 'devtool' },
  { name: '@tailwindcss/typography', version: '0.5.19', description: 'Beautiful typographic defaults for Tailwind', url: 'https://tailwindcss.com/docs/typography-plugin', type: 'devtool' },
  { name: 'tsx', version: '4.19.3', description: 'TypeScript execute — runs .ts files directly', url: 'https://github.com/privatenumber/tsx', type: 'devtool' },
  { name: 'eslint', version: '9.39.1', description: 'Pluggable JavaScript linter', url: 'https://eslint.org', type: 'devtool' },
  { name: 'postcss', version: '8.5.6', description: 'CSS transformations with JavaScript plugins', url: 'https://postcss.org', type: 'devtool' },
  { name: 'autoprefixer', version: '10.4.23', description: 'Adds vendor prefixes to CSS automatically', url: 'https://github.com/postcss/autoprefixer', type: 'devtool' },
]

const TYPE_LABELS: Record<Package['type'], string> = {
  frontend: 'Frontend',
  backend:  'Backend',
  devtool:  'Dev Tools',
}

const TYPE_COLORS: Record<Package['type'], string> = {
  frontend: 'bg-primary/10 text-primary border border-primary/20',
  backend:  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  devtool:  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
}

// ── About Page ───────────────────────────────────────────────────

export default function About() {
  const navigate = useNavigate()
  const [devs, setDevs] = useState<DevUser[]>([])
  const [devsLoading, setDevsLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/badge/dev`)
      .then((r) => r.json())
      .then((data) => setDevs(Array.isArray(data) ? data : []))
      .catch(() => setDevs([]))
      .finally(() => setDevsLoading(false))
  }, [])

  const packageGroups = (
    ['frontend', 'backend', 'devtool'] as Package['type'][]
  ).map((type) => ({
    type,
    packages: PACKAGES.filter((p) => p.type === type),
  }))

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* ── Intro ── */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            About <span className="text-primary">AnimoForums</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            A community discussion platform built exclusively for De La Salle University students.
            Connect, share, and engage with your fellow Lasallians.
          </p>
        </div>

        {/* ── Dev Hall of Fame ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Development Team
            </h2>
          </div>

          {devsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-gray-100 dark:bg-surface-darker animate-pulse" />
              ))}
            </div>
          ) : devs.length === 0 ? (
            <p className="text-sm text-gray-400">No developers found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {devs.map((dev) => (
                <button
                  key={dev._id}
                  onClick={() => navigate(`/profile/${dev.username}`)}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/40 hover:shadow-md transition-all duration-200 text-center group"
                >
                  <Avatar
                    src={dev.avatar}
                    name={dev.name}
                    size="xl"
                    className="ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                  />
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {dev.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      u/{dev.username}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Shield className="h-3 w-3" />
                      Dev
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── Beta Testers ── */}
        {BETA_TESTERS.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-dlsu-gold" />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                Beta Tester Honorable Mentions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BETA_TESTERS.map((tester, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark"
                >
                  <div className="h-8 w-8 rounded-full bg-dlsu-gold/10 border border-dlsu-gold/30 flex items-center justify-center shrink-0">
                    <FlaskConical className="h-4 w-4 text-dlsu-gold" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      {tester.name}
                      {tester.username && (
                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                          u/{tester.username}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {tester.bug}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Packages ── */}
        <section className="space-y-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Third-Party Libraries & Packages
          </h2>

          {packageGroups.map(({ type, packages }) => (
            <div key={type} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {TYPE_LABELS[type]}
                </h3>
                <span className="text-xs font-semibold text-gray-400">
                  {packages.length} packages
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packages.map((pkg) => (
                  <a
                    key={pkg.name}
                    href={pkg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {pkg.name}
                        </span>
                        <span className="font-mono text-xs text-gray-400">
                          v{pkg.version}
                        </span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {pkg.description}
                    </p>
                    <span className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[type]}`}>
                      {TYPE_LABELS[type]}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Footer note ── */}
        <p className="text-xs text-gray-400 border-t border-gray-200 dark:border-border-dark pt-6">
          All packages are used under their respective open-source licenses.
          This page is maintained in compliance with course requirements for CCAPDEV.
        </p>
      </div>
    </MainLayout>
  )
}
