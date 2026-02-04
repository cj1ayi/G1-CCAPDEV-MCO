import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge' 
import { Avatar } from '@/components/ui/Avatar'
import { Header } from '@/components/ui/Header'
import { Dropdown, DropdownItem, DropdownSeparator, 
    DropdownLabel } from '@/components/ui/Dropdown'
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } 
    from '@/components/ui/Modal'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, 
    CardFooter } from '@/components/ui/Card'
import { Plus, Mail, Settings, User, LogOut, Trash2, ArrowRight, Search} 
from 'lucide-react'
import { Select } from '@/components/ui/Select' 

export const ComponentShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Component Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Testing ground for all UI components
          </p>
        </div>

        {/* Header */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Header
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <Header user={{ name: 'Diane Panganiban' }} />
          </div>
        </section>

        {/* Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Variants
          </h2>
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sizes
          </h2>
          <div className="flex gap-4 items-center flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            With Icons
          </h2>
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading State
          </h2>
          <div className="flex gap-4 flex-wrap">
            <Button isLoading>Loading...</Button>
            <Button variant="secondary" isLoading>
              Loading...
            </Button>
            <Button variant="danger" isLoading>
              Deleting...
            </Button>
          </div>
        </section>

        {/* Disabled */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Disabled
          </h2>
          <div className="flex gap-4 flex-wrap">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Full Width */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Full Width
          </h2>
          <Button fullWidth size="lg">Full Width Button</Button>
        </section>

        {/* Interactive */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Interactive
          </h2>
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dark Mode
          </h2>
          <Button 
            variant="outline"
            onClick={() => {
              document.documentElement.classList.toggle('dark')
            }}
          >
            Toggle Dark Mode
          </Button>
        </section>

        {/* Input Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Input</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Basic input" />
            <Input 
              label="Email" 
              type="email" 
              placeholder="you@example.com" 
            />
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

        {/* Textarea Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Textarea</h2>
          <Textarea 
            label="Description" 
            placeholder="Enter description..."
            rows={4}
            showCharCount
            maxLength={200}
          />
        </section>

        {/* Card Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>
                  Card description goes here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Card content
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card hover>
              <CardHeader>
                <CardTitle>Hoverable Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Hover over me!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badge Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Badge</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </section>

        {/* Avatar Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Avatar</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar size="sm" name="John Doe" />
            <Avatar size="md" name="Jane Smith" />
            <Avatar size="lg" name="Bob Wilson" />
            <Avatar size="xl" name="Alice Brown" />
            <Avatar 
              size="2xl" 
              src="https://shreks.corneroftheinter.net?img=png"
              alt="Beautiful Man" 
            />
            <Avatar 
              size="2xl" 
              src="https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
              alt="Never Gonna Give You Up" 
            />
          </div>
        </section>

        {/* Modal Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Modal</h2>
          <div className="flex gap-4">
            <Button onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </div>

          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
          >
            <ModalHeader>
              <ModalTitle>Example Modal</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <p className="text-gray-600 dark:text-gray-300">
                This is a modal dialog. You can put any content here!
              </p>
              <div className="mt-4 space-y-4">
                <Input 
                  label="Name" 
                  placeholder="Enter your name" 
                />
                <Textarea 
                  label="Message" 
                  placeholder="Enter a message" 
                  rows={4} 
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        </section>

        {/* Select Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Select</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Choose a Space"
              placeholder="Select a space..."
              options={[
                { value: 'ccs', label: 'College of Computer Studies' },
                { value: 'cob', label: 'College of Business' },
                { value: 'cla', label: 'College of Liberal Arts' },
                { value: 'general', label: 'DLSU General' },
              ]}
            />

            <Select
              label="With Icon"
              placeholder="Select option..."
              leftIcon={<Mail className="h-4 w-4" />}
              options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
                { value: '3', label: 'Option 3' },
              ]}
            />
          </div>
        </section>

              {/* Dropdown Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Dropdown</h2>
          <div className="flex gap-4">
            {/* User Menu Dropdown */}
            <Dropdown
              trigger={
                <Button variant="secondary">
                  User Menu
                </Button>
              }
            >
              <DropdownLabel>Account</DropdownLabel>
              <DropdownItem icon={<User className="h-4 w-4" />}>
                Profile
              </DropdownItem>
              <DropdownItem icon={<Settings className="h-4 w-4" />}>
                Settings
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem 
                icon={<LogOut className="h-4 w-4" />}
                destructive
              >
                Logout
              </DropdownItem>
            </Dropdown>

            {/* Actions Dropdown */}
            <Dropdown
              trigger={
                <Button variant="outline">
                  Actions
                </Button>
              }
            >
              <DropdownItem icon={<Plus className="h-4 w-4" />}>
                Create Post
              </DropdownItem>
              <DropdownItem icon={<Mail className="h-4 w-4" />}>
                Send Message
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem 
                icon={<Trash2 className="h-4 w-4" />}
                destructive
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </section>
      </div>
    </div> 
  )
}

export default ComponentShowcase
