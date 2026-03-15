import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const AboutWidget = ({ user }: { user: any }) => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About Me: </CardTitle>
          <CardDescription className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {user.bio || 'No bio provided.'}
            </ReactMarkdown>
          </CardDescription>
        </CardHeader>
     </Card>
    </section>
  )
}
