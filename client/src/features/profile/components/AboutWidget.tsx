import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

export const AboutWidget = ({ user }: { user: any }) => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About Me: </CardTitle>
          <CardDescription className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            // Force headers in the bio widget to be small and consistent
            "prose-headings:text-sm prose-headings:font-bold prose-headings:my-1"
          )}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {user.bio || 'No bio provided.'}
            </ReactMarkdown>
          </CardDescription>
        </CardHeader>
     </Card>
    </section>
  )
}
