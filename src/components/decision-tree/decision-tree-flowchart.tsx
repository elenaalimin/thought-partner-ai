'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GitBranch, ChevronRight, Circle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DecisionNode {
  id: string
  label: string
  type: 'decision' | 'option' | 'outcome'
  children?: DecisionNode[]
  description?: string
  selected?: boolean
}

interface DecisionTreeFlowchartProps {
  decisionData: {
    situation: string
    constraints: string[]
    options: string[]
  }
}

export function DecisionTreeFlowchart({ decisionData }: DecisionTreeFlowchartProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))
  const [selectedPath, setSelectedPath] = useState<string[]>([])

  // Generate decision tree structure from user input
  const generateDecisionTree = (): DecisionNode => {
    const root: DecisionNode = {
      id: 'root',
      label: decisionData.situation || 'Main Decision',
      type: 'decision',
      description: 'Your decision point',
    }

    // Create branches for each option
    const branches: DecisionNode[] = decisionData.options.map((option, index) => {
      const optionId = `option-${index}`
      const outcomes: DecisionNode[] = [
        {
          id: `${optionId}-outcome-1`,
          label: 'Best Case Scenario',
          type: 'outcome',
          description: 'If everything goes well with this option',
        },
        {
          id: `${optionId}-outcome-2`,
          label: 'Likely Outcome',
          type: 'outcome',
          description: 'Most probable result based on current constraints',
        },
        {
          id: `${optionId}-outcome-3`,
          label: 'Risk Considerations',
          type: 'outcome',
          description: 'Potential challenges and mitigation strategies',
        },
      ]

      return {
        id: optionId,
        label: option,
        type: 'option',
        description: `Pathway: ${option}`,
        children: outcomes,
      }
    })

    root.children = branches
    return root
  }

  const tree = generateDecisionTree()

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const selectPath = (path: string[]) => {
    setSelectedPath(path)
  }

  const renderNode = (node: DecisionNode, level: number = 0, path: string[] = []): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id)
    const currentPath = [...path, node.id]
    const isSelected = selectedPath.length > 0 && 
      selectedPath.length === currentPath.length &&
      selectedPath.every((id, idx) => id === currentPath[idx])

    const nodeColors = {
      decision: 'bg-blue-100 border-blue-300 text-blue-900',
      option: 'bg-purple-100 border-purple-300 text-purple-900',
      outcome: 'bg-green-100 border-green-300 text-green-900',
    }

    const iconColors = {
      decision: 'text-blue-600',
      option: 'text-purple-600',
      outcome: 'text-green-600',
    }

    return (
      <div key={node.id} className="relative">
        <div
          className={cn(
            "flex items-start gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
            nodeColors[node.type],
            isSelected && "ring-2 ring-purple-400 ring-offset-2",
            level > 0 && "ml-8"
          )}
          onClick={() => {
            if (node.children && node.children.length > 0) {
              toggleNode(node.id)
            }
            selectPath(currentPath)
          }}
        >
          <div className={cn("flex-shrink-0", iconColors[node.type])}>
            {node.type === 'decision' ? (
              <GitBranch className="h-5 w-5" />
            ) : node.type === 'option' ? (
              <ChevronRight className={cn("h-5 w-5 transition-transform", isExpanded && "rotate-90")} />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{node.label}</h4>
              {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />}
            </div>
            {node.description && (
              <p className="text-xs opacity-80">{node.description}</p>
            )}
          </div>
        </div>

        {/* Render children if expanded */}
        {isExpanded && node.children && node.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {/* Connection line */}
            <div className="ml-6 w-0.5 h-4 bg-gray-300" />
            {node.children.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Branch line */}
                {index < node.children!.length - 1 && (
                  <div className="absolute left-6 top-0 w-0.5 h-full bg-gray-300" />
                )}
                {renderNode(child, level + 1, currentPath)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="border-purple-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg">Decision Tree</CardTitle>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Explore different pathways and outcomes. Click nodes to expand branches.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto p-2">
          {renderNode(tree)}
        </div>
        {selectedPath.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50/50 rounded-lg border border-purple-200">
            <p className="text-xs font-medium text-purple-900 mb-1">Selected Path:</p>
            <p className="text-xs text-gray-700">
              {selectedPath.map((id, idx) => {
                const findNode = (node: DecisionNode, targetId: string): DecisionNode | null => {
                  if (node.id === targetId) return node
                  if (node.children) {
                    for (const child of node.children) {
                      const found = findNode(child, targetId)
                      if (found) return found
                    }
                  }
                  return null
                }
                const node = findNode(tree, id)
                return node ? (
                  <span key={idx} className="inline-block mr-2">
                    {node.label}
                    {idx < selectedPath.length - 1 && <ChevronRight className="h-3 w-3 inline mx-1" />}
                  </span>
                ) : null
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

