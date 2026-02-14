import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Badge,
 } from '@/components/ui'

import { TrendingUp } from "lucide-react"

export const TrendingWidgets = () => {
return (
<section className="space-y-4">
	<Card>
		<CardHeader>
			<CardTitle className="w-full flex items-center gap-2">
				<TrendingUp className="w-5 h-5" />
				<span>Trending Searches</span>			
			</CardTitle>
		</CardHeader>
		<CardContent>		
			<div className="py-4">
				<div className="h-px w-full bg-gray-200" />
			</div>

			<div className="flex flex-wrap gap-2">	
				<Badge variant="outline">67</Badge>
				<Badge variant="outline">Skibidi Meme</Badge>
				<Badge variant="outline">Nate touches a minor!</Badge>
				<Badge variant="outline">feet</Badge>
				<Badge variant="outline">No tuition increase</Badge>
				<Badge variant="outline">coding</Badge>
			</div>
		</CardContent>
	</Card>
</section>
)
}
