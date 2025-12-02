'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import ReactMarkdown from 'react-markdown'
import { Send, Loader2, User, GitBranch, MessageSquare, AlertTriangle, ExternalLink } from 'lucide-react'
import type { ChatMode } from '@/types'
import type { OnboardingData } from '@/types/onboarding'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  "Challenge my assumption",
  "Give me a contrarian take",
  "Help me prioritize",
  "Simulate an investor Q&A",
]

const LEGAL_KEYWORDS = ['legal', 'lawyer', 'attorney', 'contract', 'cap table', 'visa', 'compliance', 'regulation', 'liability']

function checkForLegalQuestion(text: string): boolean {
  const lower = text.toLowerCase()
  return LEGAL_KEYWORDS.some(keyword => lower.includes(keyword))
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<ChatMode>('brainstorming')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [assistantStream, setAssistantStream] = useState('')
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [decisionContext, setDecisionContext] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Load onboarding data
    const data = localStorage.getItem('onboarding_data')
    if (data) {
      try {
        setOnboardingData(JSON.parse(data))
      } catch (e) {
        console.error('Failed to parse onboarding data', e)
      }
    }

    // Check for decision context
    const context = localStorage.getItem('decision_context')
    if (context) {
      try {
        setDecisionContext(JSON.parse(context))
      } catch (e) {
        console.error('Failed to parse decision context', e)
      }
    }

    // Check for prompt from URL
    const prompt = searchParams?.get('prompt')
    if (prompt) {
      setInput(decodeURIComponent(prompt))
    }
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages, assistantStream])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    
    // Check for legal questions
    if (checkForLegalQuestion(userMessage)) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userMessage },
        {
          role: 'assistant',
          content: `I can't provide legal advice, but here's what to consider:\n\n` +
            `For legal matters like this, I'd recommend consulting with a qualified attorney who specializes in startup law. ` +
            `Here are some vetted resources:\n\n` +
            `• [YC Startup Legal Checklist](https://www.ycombinator.com/library/4Q-startup-legal-checklist)\n` +
            `• [Find a Business Attorney](https://www.avvo.com/business-lawyers)\n` +
            `• [LegalZoom Business Resources](https://www.legalzoom.com/business)\n\n` +
            `I can still help you think through the strategic and business aspects of your question though!`
        }
      ])
      setInput('')
      return
    }

    setInput('')
    setLoading(true)
    setAssistantStream('')

    // Add user message to UI
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          mode,
          context: {
            onboarding: onboardingData,
            decisionPath: decisionContext,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Get conversation ID from headers
      const conversationIdFromHeader = response.headers.get('X-Conversation-Id')
      if (conversationIdFromHeader && !conversationId) {
        setConversationId(conversationIdFromHeader)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''
      let buffer = ''
      const currentConvId = conversationIdFromHeader || conversationId

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            // Save final message if stream ends
            if (currentConvId && fullResponse) {
              await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  conversationId: currentConvId,
                  assistantMessage: fullResponse,
                }),
              })
              
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: fullResponse },
              ])
              setAssistantStream('')
            }
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue
            
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6).trim()
                if (jsonStr === '[DONE]') continue
                
                const data = JSON.parse(jsonStr)
                
                if (data.type === 'content_block_delta') {
                  if (data.delta?.type === 'text_delta' && data.delta.text) {
                    fullResponse += data.delta.text
                    setAssistantStream(fullResponse)
                  }
                }
                
                if (data.type === 'message_stop') {
                  if (currentConvId && fullResponse) {
                    await fetch('/api/chat/stream', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        conversationId: currentConvId,
                        assistantMessage: fullResponse,
                      }),
                    })
                    
                    setMessages((prev) => [
                      ...prev,
                      { role: 'assistant', content: fullResponse },
                    ])
                    setAssistantStream('')
                  }
                }
              } catch (e) {
                console.debug('Skipping line:', line, e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const roleLabels = {
    co_founder: 'Co-Founder',
    startup_advisor: 'Startup Advisor',
    digital_twin: 'Digital Twin',
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-purple-200/50 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
            <div>
              <h1 className="text-xl font-bold">Chat with your {onboardingData ? roleLabels[onboardingData.rolePreference] : 'AI Partner'}</h1>
              <p className="text-sm text-muted-foreground">
                {onboardingData?.rolePreference === 'digital_twin' && 'Learning your style...'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="mode" className="text-sm">Mode:</Label>
              <Select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as ChatMode)}
                className="w-40"
              >
                <option value="brainstorming">Brainstorming</option>
                <option value="challenge">Challenge Mode</option>
                <option value="strategic">Strategic Advisor</option>
                <option value="technical">Technical Guide</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto container mx-auto px-6 py-6 max-w-4xl">
          {messages.length === 0 && (
            <div className="space-y-4 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-2">Welcome to your Thought Partner</h2>
                  <p className="text-muted-foreground mb-4">
                    I'm here to help you think through your startup journey. I'll ask tough questions,
                    challenge your assumptions, and help you make better decisions.
                  </p>
                  {decisionContext && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Context:</strong> Continuing from your Decision Path about {decisionContext.topic}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white'
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        className={
                          message.role === 'user'
                            ? 'text-primary-foreground'
                            : 'text-foreground'
                        }
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {assistantStream && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] bg-white">
                  <CardContent className="pt-4">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{assistantStream}</ReactMarkdown>
                    </div>
                    {loading && (
                      <Loader2 className="h-4 w-4 animate-spin mt-2" />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 0 && (
          <div className="border-t border-purple-200/50 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-3 max-w-4xl">
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-purple-200/50 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 max-w-4xl">
            <form onSubmit={handleSend} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your startup journey..."
                className="min-h-[60px] max-h-[200px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
              />
              <Button type="submit" disabled={loading || !input.trim()} size="icon" className="h-[60px] w-[60px]">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Context Sidebar */}
      <div className="w-80 border-l border-purple-200/50 bg-white/80 backdrop-blur-sm overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Founder Profile */}
          {onboardingData && (
            <Card className="border-purple-200/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <CardTitle className="text-sm">Founder Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <span className="font-medium">Type:</span> {onboardingData.founderType.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {roleLabels[onboardingData.rolePreference]}
                </div>
                {onboardingData.projectDescription && (
                  <div>
                    <span className="font-medium">Project:</span>
                    <p className="text-gray-600 mt-1 line-clamp-2">{onboardingData.projectDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Active Decision Path */}
          {decisionContext && (
            <Card className="border-blue-200/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm">Active Decision Path</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs">
                <div className="font-medium mb-1">{decisionContext.topic}</div>
                <p className="text-gray-600">Continuing from decision path</p>
              </CardContent>
            </Card>
          )}

          {/* Past Sessions */}
          <Card className="border-purple-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-sm">Recent Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500 text-center py-4">
                No recent sessions yet
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <Card className="border-orange-200/50 bg-orange-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm">Important</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-gray-700">
              I can't provide legal, financial, or medical advice. For those matters, please consult qualified professionals.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
