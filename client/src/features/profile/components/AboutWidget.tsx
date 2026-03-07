import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui'


export const AboutWidget = ({ user }: { user: any }) => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About Me: </CardTitle>
          <CardDescription>
            {user.bio}
          </CardDescription>
        </CardHeader>
     </Card>
    </section>
  )
}
