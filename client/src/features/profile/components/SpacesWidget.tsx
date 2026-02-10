import { Card, CardHeader, CardTitle, CardDescription, CardContent, 
CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge' 

import { ArrowUp, MessageCircle, Users } from "lucide-react"

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
