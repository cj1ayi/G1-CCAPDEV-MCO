import { 
  Card, 
  CardHeader, 
  CardTitle,  
  CardContent, 
} from '@/components/ui/Card'

import { 
  ArrowUp, 
  MessageCircle, 
  Users 
} from "lucide-react"

export const StatsWidget = () => {
	return (
		<section className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Community Stats</CardTitle>
				</CardHeader>
				<CardContent>		
					<div className="py-4">
						<div className="h-px w-full bg-gray-200" />
					</div>				
					
					<div className="flex items-center gap-1">
						<ArrowUp className="w-4 h-4" />
						<span>128 Post Karma</span>
					</div>
					
					<div className="py-4">
						<div className="h-px w-full bg-gray-200" />
					</div>

					<div className="flex items-center gap-1">
						<MessageCircle className="w-4 h-4" />
						<span>32 Comment Karma</span>
					</div>

					<div className="py-4">
						<div className="h-px w-full bg-gray-200" />
					</div>

					<div className="flex items-center gap-1">
						<Users className="w-4 h-4" />
						<span>1.2k Spaces Joined</span>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
