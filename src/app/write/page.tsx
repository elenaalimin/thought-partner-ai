'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
}

export default function WritePage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [analysis, setAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress({})

    // Simulate upload progress
    for (const file of files) {
      setUploadProgress((prev) => ({ ...prev, [file.id]: 0 }))
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadProgress((prev) => ({ ...prev, [file.id]: i }))
      }
    }

    setIsUploading(false)
    // TODO: Actually upload files to storage and process
  }

  const handleAnalyze = async () => {
    if (files.length === 0) return

    setIsAnalyzing(true)
    setAnalysis('')

    try {
      // TODO: Integrate with file analysis API
      // For now, simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Mock analysis response
      setAnalysis(
        `I've reviewed your ${files.length} file(s). Here's my feedback:\n\n` +
        files.map((f) => `• ${f.name}: This appears to be a ${f.type || 'document'}. ` +
          `I can see the structure and would recommend focusing on clarity and user experience. ` +
          `Consider breaking down complex flows into simpler steps.`).join('\n\n') +
        `\n\nWould you like me to dive deeper into any specific aspect?`
      )
    } catch (error) {
      console.error('Error analyzing files:', error)
      setAnalysis('Sorry, I encountered an error analyzing your files. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Write & Review</h1>
          <p className="text-muted-foreground">
            Upload documents, Figma plans, flow diagrams, and more. Get detailed feedback from your AI co-founder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload PDFs, images, documents, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.fig,.doc,.docx,.txt"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                Select Files
              </Button>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        {uploadProgress[file.id] !== undefined && (
                          <div className="flex items-center gap-2">
                            {uploadProgress[file.id] === 100 ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {uploadProgress[file.id]}%
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={files.length === 0 || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get Feedback'
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Supported formats:</p>
                <p className="text-xs text-muted-foreground">
                  PDF, PNG, JPG, Figma files, Word docs, Text files
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>
                Your co-founder&apos;s analysis and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] p-4 bg-muted rounded-lg">
                {analysis ? (
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-sm">{analysis}</p>
                    </div>
                    <Button
                      onClick={() => {
                        // Copy analysis to clipboard or open in chat
                        navigator.clipboard.writeText(analysis)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Copy to Chat
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Upload files and click &ldquo;Get Feedback&rdquo; to receive analysis
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Upload</h4>
                <p className="text-muted-foreground">
                  Select your files - designs, documents, plans, or diagrams
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Analyze</h4>
                <p className="text-muted-foreground">
                  Your AI co-founder reviews and understands your work
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Get Feedback</h4>
                <p className="text-muted-foreground">
                  Receive detailed, actionable feedback and suggestions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

