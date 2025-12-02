'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react'

export default function SpeakPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(prev => prev + finalTranscript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
      setTranscript('')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleSend = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    setAiResponse('')

    try {
      // TODO: Integrate with voice API endpoint
      // For now, use the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcript,
          mode: 'brainstorming',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6).trim())
                if (data.type === 'content_block_delta') {
                  if (data.delta?.type === 'text_delta' && data.delta.text) {
                    fullResponse += data.delta.text
                    setAiResponse(fullResponse)
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setTranscript('')
    } catch (error) {
      console.error('Error sending message:', error)
      setAiResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = () => {
    if (!aiResponse || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(aiResponse)
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Voice Conversation</h1>
          <p className="text-muted-foreground">
            Speak naturally with your AI co-founder. Think out loud and get real-time feedback.
          </p>
        </div>

        {!isSupported && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                Your browser doesn't support the Web Speech API. Please use Chrome, Edge, or Safari for voice features.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Voice</CardTitle>
              <CardDescription>
                Click the microphone to start speaking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Button
                  size="lg"
                  variant={isListening ? 'destructive' : 'default'}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!isSupported}
                  className="h-20 w-20 rounded-full"
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              </div>
              
              {isListening && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Listening...
                  </div>
                </div>
              )}

              <div className="min-h-[200px] p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Transcript:</p>
                <p className="text-sm">{transcript || 'Your speech will appear here...'}</p>
              </div>

              <Button
                onClick={handleSend}
                disabled={!transcript.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Send & Get Response'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Response</CardTitle>
              <CardDescription>
                Your co-founder's thoughts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[200px] p-4 bg-muted rounded-lg">
                {aiResponse ? (
                  <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Responses will appear here after you send a message...
                  </p>
                )}
              </div>

              {aiResponse && (
                <Button
                  onClick={speakResponse}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  Play Response
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tips for Voice Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Use this for brainstorming and thinking out loud</li>
              <li>• The AI will respond in text, which you can have read aloud</li>
              <li>• Best for quick back-and-forth conversations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

