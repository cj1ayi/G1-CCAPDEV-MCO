import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardContent, 
  Badge,
 } from '@/components/ui'

export const SpacesWidget = () => {
return (
<section className="space-y-4">
	<Card>
		<CardHeader>
			<CardTitle>Spaces</CardTitle>
		</CardHeader>
		<CardContent>		
			<div className="py-4">
				<div className="h-px w-full bg-gray-200" />
			</div>

			<Badge>r/profs2pick</Badge>
		</CardContent>
	</Card>
</section>
)
}
