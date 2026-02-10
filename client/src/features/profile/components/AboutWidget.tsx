import { Card, CardHeader, CardTitle, CardDescription, CardContent, 
    CardFooter } from '@/components/ui/Card'

import { Calendar, GraduationCap, MapPin, Twitter, Github, Linkedin } 
	from "lucide-react"


export const AboutWidget = () => {
	return (
		<section className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>About</CardTitle>
					<CardDescription>
						Passionate about coding, coffee, and campus life. Trying to survive CCS one term at a time. Always up for a chat about React or finding the best study spots on campus. 🏹
						
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-gray-600 dark:text-gray-300">
						<div className="py-4">
							<div className="h-px w-full bg-gray-200" />
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Calendar className="w-4 h-4" />
							<span>Joined September 2021</span>
						</div>

						<div className="flex items-center gap-2 text-sm text-gray-600">
							<GraduationCap className="w-4 h-4" />
							<span>BS Computer Science</span>
						</div>

						<div className="flex items-center gap-2 text-sm text-gray-600">
							<MapPin className="w-4 h-4" />
							<span>Manila, Philippines</span>
						</div>
						<div className="py-4"k
							<div className="h-px w-full bg-gray-200" />
						</div>
						<div className="flex items-center gap-3">
						<a
							href="https://twitter.com/yourhandle"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600"
						>
							<Twitter className="w-4 h-4" />
						</a>

						<a
							href="https://github.com/yourusername"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600"
						>
							<Github className="w-4 h-4" />
						</a>

						<a
							href="https://linkedin.com/in/yourusername"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600"
						>
							<Linkedin className="w-4 h-4" />
						</a>
					</div>
					</p>
				</CardContent>
			</Card>
		</section>
	)
}
