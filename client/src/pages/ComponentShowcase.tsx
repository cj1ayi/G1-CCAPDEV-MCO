import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, ArrowRight, Mail, Trash2, Search, Settings } from 'lucide-react'

export const ComponentShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Component Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Testing ground for all UI components
          </p>
        </div>
        
        {/* Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Variants</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sizes</h2>
          <div className="flex gap-4 items-center flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">With Icons</h2>
          <div className="flex gap-4 flex-wrap">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Create Post
            </Button>
            <Button 
              variant="secondary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Next
            </Button>
            <Button 
              variant="outline"
              leftIcon={<Mail className="h-4 w-4" />}
            >
              Sign Up
            </Button>
            <Button 
              variant="ghost"
              leftIcon={<Search className="h-4 w-4" />}
            >
              Search
            </Button>
          </div>
        </section>

        {/* Loading State */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading State</h2>
          <div className="flex gap-4 flex-wrap">
            <Button isLoading>Loading...</Button>
            <Button variant="secondary" isLoading>Loading...</Button>
            <Button variant="danger" isLoading>Deleting...</Button>
          </div>
        </section>

        {/* Disabled */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Disabled</h2>
          <div className="flex gap-4 flex-wrap">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Full Width */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Full Width</h2>
          <Button fullWidth size="lg">Full Width Button</Button>
        </section>

        {/* Interactive */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Interactive</h2>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => alert('Clicked!')}>
              Click Me
            </Button>
            <Button 
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => confirm('Are you sure?')}
            >
              Delete
            </Button>
            <Button 
              variant="secondary"
              leftIcon={<Settings className="h-4 w-4" />}
            >
              Settings
            </Button>
          </div>
        </section>

        {/* Dark Mode Toggle */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dark Mode</h2>
          <Button 
            variant="outline"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            Toggle Dark Mode
          </Button>
        </section>

        {/* Input Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Input</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Basic input" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input 
              label="With Icon" 
              leftIcon={<Mail className="h-4 w-4" />}
              placeholder="Enter email"
            />
            <Input 
              label="With Error" 
              error="This field is required" 
              placeholder="Enter value"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default ComponentShowcase
