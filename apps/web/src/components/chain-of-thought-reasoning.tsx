import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "./ui/chain-of-thought"
import { Lightbulb, MessageSquareQuote, Pencil, Search, Target } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState, useEffect } from "react"
import { TextShimmer } from "./ui/text-shimmer"

interface ChainOfThoughtReasoningProps {
  isLoading?: boolean
  stepItems?: (React.ReactNode | string)[][]
}

const stepTitles = [
  "Planning next moves: Understanding the requirements and making a plan",
  "Writing a draft: Implementing the plan to write an initial draft",
  "Reviewing the draft: Generating correction pointers",
  "Getting Final Draft Ready: Implementing targeted improvements",
]

const stepIcons = [
  <Search className="size-4" />,
  <Pencil className="size-4" />,
  <MessageSquareQuote className="size-4" />,
  <Target className="size-4" />,
]

export function ChainOfThoughtReasoning({ isLoading = false, stepItems = [] }: ChainOfThoughtReasoningProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])

  useEffect(() => {
    if (!isLoading) {
      setVisibleSteps([])
      return
    }

    setVisibleSteps([])

    const timeouts: NodeJS.Timeout[] = []
    const maxSteps = Math.max(stepTitles.length, stepItems.length || 0)

    for (let index = 0; index < maxSteps; index++) {
      const timeout = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, index])
      }, index * 5000)
      timeouts.push(timeout)
    }

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isLoading, stepItems.length])

  const maxSteps = Math.max(stepTitles.length, stepItems.length || 0)

  return (
    <div className="w-full max-w-3xl">
      <ChainOfThought>
        <AnimatePresence>
          {Array.from({ length: maxSteps }).map((_, index) => {
            if (!visibleSteps.includes(index)) return null

            const items = stepItems[index] || []
            const hasItems = items.length > 0
            const title = stepTitles[index] || "Generating Final Response..."
            const icon = stepIcons[index] || <Target className="size-4" />

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChainOfThoughtStep>
                  <ChainOfThoughtTrigger leftIcon={icon}>
                    <TextShimmer>
                      {title}
                    </TextShimmer>
                  </ChainOfThoughtTrigger>
                  {hasItems ? (
                    <ChainOfThoughtContent>
                      {items.map((item, itemIndex) => (
                        <ChainOfThoughtItem key={itemIndex}>
                          {item}
                        </ChainOfThoughtItem>
                      ))}
                    </ChainOfThoughtContent>
                  ) : (
                    <ChainOfThoughtContent>
                      <ChainOfThoughtItem>
                        Generating Final Response...
                      </ChainOfThoughtItem>
                    </ChainOfThoughtContent>
                  )}
                </ChainOfThoughtStep>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </ChainOfThought>
    </div>
  )
}
