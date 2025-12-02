'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, FileText, ExternalLink } from 'lucide-react'

const RESOURCES = [
  {
    category: 'Founder Frameworks',
    items: [
      { title: 'YC Startup School', description: 'Free startup course from Y Combinator', url: 'https://www.startupschool.org' },
      { title: 'Paul Graham Essays', description: 'Classic startup wisdom', url: 'https://paulgraham.com/articles.html' },
      { title: 'The Mom Test', description: 'How to validate ideas by talking to customers', url: '#' },
    ],
  },
  {
    category: 'Templates',
    items: [
      { title: 'Pitch Deck Template', description: 'YC-style pitch deck structure', url: '#' },
      { title: 'Product Requirements Doc', description: 'PRD template for early-stage products', url: '#' },
      { title: 'User Interview Guide', description: 'Questions to ask potential customers', url: '#' },
    ],
  },
  {
    category: 'GTM & Strategy',
    items: [
      { title: 'Go-to-Market Playbook', description: 'Framework for launching products', url: '#' },
      { title: 'Pricing Strategy Guide', description: 'How to price your product', url: '#' },
      { title: 'Growth Tactics', description: 'Proven growth strategies', url: '#' },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Resources
            </h1>
          </div>
          <p className="text-sm text-gray-600">Founder frameworks, templates, and guides</p>
        </div>

        <div className="space-y-6">
          {RESOURCES.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold mb-4">{category.category}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {category.items.map((item, i) => (
                  <Card key={i} className="border-purple-200/50 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View Resource →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

