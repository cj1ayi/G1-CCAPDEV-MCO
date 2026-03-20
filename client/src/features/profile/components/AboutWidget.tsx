import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

export const AboutWidget = ({
  user,
}: {
  user: any
}) => (
  <section className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>About Me:</CardTitle>
        <div
          className={cn(
            'text-sm text-gray-600',
            'dark:text-gray-300',
            'prose prose-sm',
            'dark:prose-invert max-w-none',
            'prose-headings:text-sm',
            'prose-headings:font-bold',
            'prose-headings:my-1',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-primary',
                    'hover:underline',
                  )}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                />
              ),
            }}
          >
            {user.bio || 'No bio provided.'}
          </ReactMarkdown>
        </div>
      </CardHeader>
    </Card>
  </section>
)
