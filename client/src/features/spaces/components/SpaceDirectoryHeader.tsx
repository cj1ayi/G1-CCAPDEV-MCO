import { ArrowRight } from 'lucide-react'

export const SpaceDirectoryHeader = () => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-black tracking-tight">Explore Spaces</h1>
      <p className="text-gray-500 text-lg max-w-2xl">
        Discover and join communities within DLSU. From academic support to 
        specialized interest groups.
      </p>
    </div>
    <button
      className="text-sm font-bold text-primary hover:underline flex 
        items-center gap-1"
    >
      Request a new Space <ArrowRight className="size-4" />
    </button>
  </div>
)
