import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui'

import {
  Calendar,
  GraduationCap,
  MapPin,
  Twitter,
  Github,
  Linkedin,
} from 'lucide-react'

import { cn } from '@/lib/utils'

export const AboutWidget = ({ user }: { user: any }) => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            {user.bio}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600 dark:text-gray-300">
            <div className="py-4">
              <div className="h-px w-full bg-gray-200" />
            </div>
            <div
              className="flex items-center gap-2 text-sm
                text-gray-600"
            >
              <Calendar className="w-4 h-4" />
              <span>{user.joinedAt}</span>
            </div>

            <div
              className="flex items-center gap-2 text-sm
                text-gray-600"
            >
              <GraduationCap className="w-4 h-4" />
              <span>BS Computer Science</span>
            </div>

            <div
              className="flex items-center gap-2 text-sm
                text-gray-600"
            >
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
            <div className="py-4">
              <div className="h-px w-full bg-gray-200" />
            </div>
            <div className="flex items-center gap-3">
              {user.twitter && (
                <a
                  href={user.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-gray-600 dark:text-gray-400',
                    'hover:text-primary transition'
                  )}
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}

              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-gray-600 dark:text-gray-400',
                    'hover:text-primary transition'
                  )}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-gray-600 dark:text-gray-400',
                    'hover:text-primary transition'
                  )}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
