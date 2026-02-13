import { AboutWidget } from './AboutWidget'
import { StatsWidget } from './StatsWidget'
import { SpacesWidget } from './SpacesWidget'

export const ProfileSidebar = ({ user }: { user: any }) => {
  return (
    <aside className="col-span-12 lg:col-span-3 space-y-4">
      <AboutWidget user={user} />
      <StatsWidget />
      <SpacesWidget />
    </aside>
  )
}
