import {
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { Avatar } from '@/components/ui'
import {
  ExternalLink,
  Shield,
  FlaskConical,
  Bug,
  Lightbulb,
  Lock,
} from 'lucide-react'

import { API_BASE_URL } from '@/lib/apiUtils'
import { userService } from '@/features/profile/services'

// ── Types ─────────────────────────────────────────────────────────────────

interface DevUser {
  _id: string
  username: string
  name: string
  avatar?: string
  bio?: string
  badges: string[]
}

type ContributionKind = 'bug' | 'suggestion' | 'security'

interface Contribution {
  kind: ContributionKind
  text: string
}

interface BetaTester {
  name: string
  username?: string
  contributions: Contribution[]
}

// Resolved at runtime with avatar from the DB
interface ResolvedBetaTester extends BetaTester {
  avatar?: string
}

// ── Contribution config ────────────────────────────────────────────────────

const CONTRIBUTION_CONFIG: Record<
  ContributionKind,
  { label: string; icon: React.ElementType; classes: string }
> = {
  bug: {
    label: 'Bug Report',
    icon: Bug,
    classes:
      'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
      + ' border border-red-200 dark:border-red-800',
  },
  suggestion: {
    label: 'Suggestion',
    icon: Lightbulb,
    classes:
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
      + ' border border-yellow-200 dark:border-yellow-800',
  },
  security: {
    label: 'Security',
    icon: Lock,
    classes:
      'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
      + ' border border-blue-200 dark:border-blue-800',
  },
}

// ── Beta testers ───────────────────────────────────────────────────────────

const BETA_TESTERS: BetaTester[] = [
  {
    name: 'PieIsSpy',
    username: 'pieisspy',
    contributions: [
      { kind: 'suggestion', text: 'Suggested GIF support on Comments' },
    ],
  },
  {
    name: 'Allen Conner Hizon',
    username: 'allen_hizon_437',
    contributions: [
      {
        kind: 'security',
        text:
          'Race-conditioned the app, uncovering multiple performance'
          + ' issues and vulnerabilities',
      },
    ],
  },
  {
    name: 'Pring',
    username: 'pringles',
    contributions: [
      { kind: 'bug', text: 'Reported missing validation for invalid links' },
      { kind: 'suggestion', text: 'Instagram and Youtube Video Embeds' },
    ],
  },
  {
    name: 'Byron Ang',
    username: 'onion',
    contributions: [
      {
        kind: 'bug',
        text: 'Reported missing limits for tags, comments, and posts',
      },
    ],
  },
  {
    name: 'Sean Benedict Bernardo',
    username: 'monggoyo63',
    contributions: [
      {
        kind: 'suggestion',
        text:
          'Suggested toast notifications to prompt guest users'
          + ' to sign in before interacting with posts',
      },
    ],
  },
  {
    name: 'Master9x3r4n',
    username: 'Master9x3r4n',
    contributions: [
      { kind: 'suggestion', text: 'Instagram and Youtube Video Embeds' },
    ],
  },
]

// ── Packages ───────────────────────────────────────────────────────────────

type PackageType = 'frontend' | 'backend' | 'devtool'

interface Package {
  name: string
  version: string
  description: string
  url: string
  type: PackageType
}

const PACKAGE_TYPE_CONFIG: Record<
  PackageType,
  { label: string; classes: string }
> = {
  frontend: {
    label: 'Frontend',
    classes:
      'bg-primary/10 text-primary border border-primary/20',
  },
  backend: {
    label: 'Backend',
    classes:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      + ' border border-blue-200 dark:border-blue-800',
  },
  devtool: {
    label: 'Dev Tools',
    classes:
      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
      + ' border border-gray-200 dark:border-gray-700',
  },
}

const PACKAGES: Package[] = [
  // Frontend
  {
    name: 'react', version: '19.2.0', type: 'frontend',
    description: 'UI library for building component-based interfaces',
    url: 'https://react.dev',
  },
  {
    name: 'react-dom', version: '19.2.0', type: 'frontend',
    description: 'React rendering for the browser DOM',
    url: 'https://react.dev',
  },
  {
    name: 'react-router-dom', version: '7.12.0', type: 'frontend',
    description: 'Client-side routing and navigation',
    url: 'https://reactrouter.com',
  },
  {
    name: '@tanstack/react-query', version: '5.90.19', type: 'frontend',
    description: 'Async state management and server data caching',
    url: 'https://tanstack.com/query',
  },
  {
    name: 'framer-motion', version: '12.33.0', type: 'frontend',
    description: 'Production-ready animation library for React',
    url: 'https://www.framer.com/motion',
  },
  {
    name: 'zustand', version: '5.0.11', type: 'frontend',
    description: 'Lightweight global state management',
    url: 'https://zustand-demo.pmnd.rs',
  },
  {
    name: 'react-hook-form', version: '7.71.1', type: 'frontend',
    description: 'Performant, flexible forms with easy validation',
    url: 'https://react-hook-form.com',
  },
  {
    name: '@hookform/resolvers', version: '5.2.2', type: 'frontend',
    description: 'Validation resolvers for react-hook-form',
    url: 'https://github.com/react-hook-form/resolvers',
  },
  {
    name: 'zod', version: '4.3.5', type: 'frontend',
    description: 'TypeScript-first schema validation',
    url: 'https://zod.dev',
  },
  {
    name: 'axios', version: '1.13.2', type: 'frontend',
    description: 'Promise-based HTTP client for the browser',
    url: 'https://axios-http.com',
  },
  {
    name: 'lucide-react', version: '0.562.0', type: 'frontend',
    description: 'Beautiful and consistent open-source icon set',
    url: 'https://lucide.dev',
  },
  {
    name: 'class-variance-authority', version: '0.7.1', type: 'frontend',
    description: 'Component variant management utility',
    url: 'https://cva.style',
  },
  {
    name: 'clsx', version: '2.1.1', type: 'frontend',
    description: 'Utility for constructing className strings conditionally',
    url: 'https://github.com/lukeed/clsx',
  },
  {
    name: 'tailwind-merge', version: '3.4.0', type: 'frontend',
    description: 'Merge Tailwind CSS classes without conflicts',
    url: 'https://github.com/dcastil/tailwind-merge',
  },
  {
    name: 'date-fns', version: '4.1.0', type: 'frontend',
    description: 'Modern JavaScript date utility library',
    url: 'https://date-fns.org',
  },
  {
    name: 'react-markdown', version: '10.1.0', type: 'frontend',
    description: 'Render Markdown as React components',
    url: 'https://github.com/remarkjs/react-markdown',
  },
  {
    name: 'remark-gfm', version: '4.0.1', type: 'frontend',
    description: 'GitHub Flavored Markdown support for remark',
    url: 'https://github.com/remarkjs/remark-gfm',
  },
  {
    name: 'rehype-raw', version: '7.0.0', type: 'frontend',
    description: 'Parse raw HTML in rehype pipelines',
    url: 'https://github.com/rehypejs/rehype-raw',
  },
  {
    name: '@tiptap/react', version: '3.20.1', type: 'frontend',
    description: 'Headless rich-text editor framework for React',
    url: 'https://tiptap.dev',
  },
  {
    name: '@tiptap/starter-kit', version: '3.20.1', type: 'frontend',
    description: 'Collection of essential Tiptap extensions',
    url: 'https://tiptap.dev',
  },
  {
    name: '@tiptap/extension-link', version: '3.20.1', type: 'frontend',
    description: 'Tiptap extension for hyperlink support',
    url: 'https://tiptap.dev',
  },
  {
    name: '@tiptap/extension-image', version: '3.20.2', type: 'frontend',
    description: 'Tiptap extension for inline image embeds',
    url: 'https://tiptap.dev',
  },
  {
    name: '@tiptap/extension-placeholder', version: '3.20.2', type: 'frontend',
    description: 'Tiptap extension for placeholder text',
    url: 'https://tiptap.dev',
  },
  {
    name: '@tiptap/extension-superscript', version: '3.20.1', type: 'frontend',
    description: 'Tiptap extension for superscript formatting',
    url: 'https://tiptap.dev',
  },
  {
    name: '@tiptap/pm', version: '3.20.1', type: 'frontend',
    description: 'ProseMirror bindings used by Tiptap',
    url: 'https://tiptap.dev',
  },
  {
    name: 'tiptap-markdown', version: '0.9.0', type: 'frontend',
    description: 'Markdown input/output support for Tiptap',
    url: 'https://github.com/aguingand/tiptap-markdown',
  },
  {
    name: 'embla-carousel-react', version: '8.6.0', type: 'frontend',
    description: 'Lightweight extensible carousel for React',
    url: 'https://www.embla-carousel.com',
  },
  {
    name: 'embla-carousel-autoplay', version: '8.6.0', type: 'frontend',
    description: 'Autoplay plugin for Embla Carousel',
    url: 'https://www.embla-carousel.com/plugins/autoplay',
  },
  {
    name: 'react-countup', version: '6.5.3', type: 'frontend',
    description: 'Animated number counting component for React',
    url: 'https://github.com/glennreyes/react-countup',
  },
  // Backend
  {
    name: 'express', version: '4.21.2', type: 'backend',
    description: 'Fast, minimalist web framework for Node.js',
    url: 'https://expressjs.com',
  },
  {
    name: 'mongoose', version: '8.10.1', type: 'backend',
    description: 'MongoDB object modeling for Node.js',
    url: 'https://mongoosejs.com',
  },
  {
    name: 'passport', version: '0.7.0', type: 'backend',
    description: 'Authentication middleware for Node.js',
    url: 'https://www.passportjs.org',
  },
  {
    name: 'passport-google-oauth20', version: '2.0.0', type: 'backend',
    description: 'Passport strategy for Google OAuth 2.0',
    url: 'https://github.com/jaredhanson/passport-google-oauth2',
  },
  {
    name: 'express-session', version: '1.19.0', type: 'backend',
    description: 'Session middleware for Express',
    url: 'https://github.com/expressjs/session',
  },
  {
    name: 'connect-mongo', version: '6.0.0', type: 'backend',
    description: 'MongoDB session store for express-session',
    url: 'https://github.com/jdesboeufs/connect-mongo',
  },
  {
    name: 'cors', version: '2.8.5', type: 'backend',
    description: 'Express middleware for enabling CORS',
    url: 'https://github.com/expressjs/cors',
  },
  {
    name: 'dotenv', version: '16.4.7', type: 'backend',
    description: 'Loads environment variables from .env files',
    url: 'https://github.com/motdotla/dotenv',
  },
  {
    name: 'helmet', version: '8.1.0', type: 'backend',
    description: 'Secures Express apps with HTTP headers',
    url: 'https://helmetjs.github.io',
  },
  {
    name: 'express-rate-limit', version: '8.3.2', type: 'backend',
    description: 'Rate limiting middleware for Express',
    url: 'https://github.com/express-rate-limit/express-rate-limit',
  },
  {
    name: 'express-mongo-sanitize', version: '2.2.0', type: 'backend',
    description: 'Sanitizes input to prevent MongoDB injection',
    url: 'https://github.com/fiznool/express-mongo-sanitize',
  },
  {
    name: 'express-validator', version: '7.3.1', type: 'backend',
    description: 'Input validation and sanitization for Express',
    url: 'https://express-validator.github.io',
  },
  {
    name: 'cookie-parser', version: '1.4.7', type: 'backend',
    description: 'Parses Cookie header and populates req.cookies',
    url: 'https://github.com/expressjs/cookie-parser',
  },
  // Dev tools
  {
    name: 'vite', version: '7.2.4', type: 'devtool',
    description: 'Next-generation frontend build tool',
    url: 'https://vitejs.dev',
  },
  {
    name: 'typescript', version: '5.9.3', type: 'devtool',
    description: 'Typed superset of JavaScript',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'tailwindcss', version: '3.4.19', type: 'devtool',
    description: 'Utility-first CSS framework',
    url: 'https://tailwindcss.com',
  },
  {
    name: '@tailwindcss/typography', version: '0.5.19', type: 'devtool',
    description: 'Beautiful typographic defaults for Tailwind',
    url: 'https://tailwindcss.com/docs/typography-plugin',
  },
  {
    name: 'tsx', version: '4.19.3', type: 'devtool',
    description: 'TypeScript execute — runs .ts files directly',
    url: 'https://github.com/privatenumber/tsx',
  },
  {
    name: 'eslint', version: '9.39.1', type: 'devtool',
    description: 'Pluggable JavaScript linter',
    url: 'https://eslint.org',
  },
  {
    name: 'postcss', version: '8.5.6', type: 'devtool',
    description: 'CSS transformations with JavaScript plugins',
    url: 'https://postcss.org',
  },
  {
    name: 'autoprefixer', version: '10.4.23', type: 'devtool',
    description: 'Adds vendor prefixes to CSS automatically',
    url: 'https://github.com/postcss/autoprefixer',
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────

function ContributionPill({ kind, text }: Contribution) {
  const { icon: Icon, label, classes } = CONTRIBUTION_CONFIG[kind]
  return (
    <li className="flex items-start gap-2">
      <span
        className={`
          mt-0.5 shrink-0 inline-flex items-center gap-1
          text-[11px] font-semibold px-2 py-0.5 rounded-full ${classes}
        `}
      >
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {text}
      </p>
    </li>
  )
}

function BetaTesterCard({ tester }: { tester: ResolvedBetaTester }) {
  return (
    <div className="
      flex items-start gap-4 p-4 rounded-xl
      border border-gray-200 dark:border-border-dark
      bg-white dark:bg-surface-dark
    ">
      <Avatar
        src={tester.avatar}
        name={tester.name}
        size="md"
        className="shrink-0 ring-2 ring-dlsu-gold/30"
      />
      <div className="space-y-2 min-w-0">
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-white">
            {tester.name}
          </p>
          {tester.username && (
            <p className="text-xs text-gray-400">u/{tester.username}</p>
          )}
        </div>
        <ul className="space-y-1.5">
          {tester.contributions.map((c, i) => (
            <ContributionPill key={i} {...c} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  const { label, classes } = PACKAGE_TYPE_CONFIG[pkg.type]
  return (
    <a
      href={pkg.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group flex flex-col gap-2 p-4 rounded-xl
        border border-gray-200 dark:border-border-dark
        bg-white dark:bg-surface-dark
        hover:border-primary/40 hover:shadow-sm transition-all duration-200
      "
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="
            font-mono text-sm font-bold
            text-gray-900 dark:text-white
            group-hover:text-primary transition-colors
          ">
            {pkg.name}
          </span>
          <span className="font-mono text-xs text-gray-400">
            v{pkg.version}
          </span>
        </div>
        <ExternalLink className="
          h-3.5 w-3.5 shrink-0 mt-0.5 transition-colors
          text-gray-300 dark:text-gray-600 group-hover:text-primary
        " />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {pkg.description}
      </p>
      <span className={`
        self-start text-[11px] font-semibold
        px-2 py-0.5 rounded-full ${classes}
      `}>
        {label}
      </span>
    </a>
  )
}

function DevCard({ dev, onClick }: { dev: DevUser; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center gap-3 p-5 rounded-xl text-center
        border border-gray-200 dark:border-border-dark
        bg-white dark:bg-surface-dark
        hover:border-primary/40 hover:shadow-md
        transition-all duration-200 group
      "
    >
      <Avatar
        src={dev.avatar}
        name={dev.name}
        size="xl"
        className="ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
      />
      <div className="space-y-1">
        <p className="
          font-bold text-sm text-gray-900 dark:text-white
          group-hover:text-primary transition-colors
        ">
          {dev.name}
        </p>
        <p className="text-xs text-gray-400">u/{dev.username}</p>
        <span className="
          inline-flex items-center gap-1
          text-[11px] font-semibold px-2 py-0.5 rounded-full
          bg-primary/10 text-primary border border-primary/20
        ">
          <Shield className="h-3 w-3" />
          Dev
        </span>
      </div>
    </button>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

const PACKAGE_TYPES: PackageType[] = ['frontend', 'backend', 'devtool']

export default function About() {
  const navigate = useNavigate()
  const [devs, setDevs] = useState<DevUser[]>([])
  const [devsLoading, setDevsLoading] = useState(true)
  const [resolvedTesters, setResolvedTesters] =
    useState<ResolvedBetaTester[]>(BETA_TESTERS)

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/badge/dev`)
      .then((r) => r.json())
      .then((data) => setDevs(Array.isArray(data) ? data : []))
      .catch(() => setDevs([]))
      .finally(() => setDevsLoading(false))
  }, [])

  useEffect(() => {
    const testers = BETA_TESTERS.filter((t) => t.username)
    Promise.all(
      testers.map((t) =>
        userService
          .getUserByUsername(t.username!)
          .then((user) => ({ 
            username: t.username!, 
            avatar:  user?.avatar?.includes('dicebear') ? undefined : user?.avatar,
        }))
          .catch(() => ({ username: t.username!, avatar: undefined }))
      )
    ).then((results) => {
      const avatarMap = Object.fromEntries(
        results.map(({ username, avatar }) => [username, avatar])
      )
      setResolvedTesters(
        BETA_TESTERS.map((t) => ({
          ...t,
          avatar: t.username ? avatarMap[t.username] : undefined,
        }))
      )
    })
  }, [])

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* ── Intro ── */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            About <span className="text-primary">AnimoForums</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            A community discussion platform built exclusively for De La Salle
            University students. Connect, share, and engage with your fellow
            Lasallians.
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
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-gray-100 dark:bg-surface-darker animate-pulse"
                />
              ))}
            </div>
          ) : devs.length === 0 ? (
            <p className="text-sm text-gray-400">No developers found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {devs.map((dev) => (
                <DevCard
                  key={dev._id}
                  dev={dev}
                  onClick={() => navigate(`/profile/${dev.username}`)}
                />
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
              {resolvedTesters.map((tester, i) => (
                <BetaTesterCard key={i} tester={tester} />
              ))}
            </div>
          </section>
        )}

        {/* ── Packages ── */}
        <section className="space-y-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Third-Party Libraries & Packages
          </h2>

          {PACKAGE_TYPES.map((type) => {
            const packages = PACKAGES.filter((p) => p.type === type)
            const { label } = PACKAGE_TYPE_CONFIG[type]
            return (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {label}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400">
                    {packages.length} packages
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.name} pkg={pkg} />
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* ── Footer note ── */}
        <p className="
          text-xs text-gray-400
          border-t border-gray-200 dark:border-border-dark pt-6
        ">
          All packages are used under their respective open-source licenses.
          This page is maintained in compliance with course requirements for
          CCAPDEV.
        </p>

      </div>
    </MainLayout>
  )
}
