import {
    ChainOfThought,
    ChainOfThoughtContent,
    ChainOfThoughtItem,
    ChainOfThoughtStep,
    ChainOfThoughtTrigger,
  } from "./ui/chain-of-thought"
  import { Lightbulb, Search, Target } from "lucide-react"
  
  export function ChainOfThoughtReasoning() {
    return (
      <div className="w-full max-w-3xl">
        <ChainOfThought>
          <ChainOfThoughtStep>
            <ChainOfThoughtTrigger leftIcon={<Search className="size-4" />}>
              Research phase: Understanding the problem space
            </ChainOfThoughtTrigger>
            <ChainOfThoughtContent>
              <ChainOfThoughtItem>
                The problem involves optimizing database queries for a
                high-traffic e-commerce platform
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                Current bottlenecks: slow product search (2-3 seconds), category
                filtering delays
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                Database: PostgreSQL with 10M+ products, complex joins across
                multiple tables
              </ChainOfThoughtItem>
            </ChainOfThoughtContent>
          </ChainOfThoughtStep>
  
          <ChainOfThoughtStep>
            <ChainOfThoughtTrigger leftIcon={<Lightbulb className="size-4" />}>
              Analysis: Identifying optimization opportunities
            </ChainOfThoughtTrigger>
            <ChainOfThoughtContent>
              <ChainOfThoughtItem>
                Missing indexes on frequently queried columns (product_name,
                category_id, price_range)
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                N+1 query problem in product listing API - need eager loading
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                Full table scans occurring due to non-optimized WHERE clauses
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                Consider implementing database partitioning for better performance
              </ChainOfThoughtItem>
            </ChainOfThoughtContent>
          </ChainOfThoughtStep>
  
          <ChainOfThoughtStep>
            <ChainOfThoughtTrigger leftIcon={<Target className="size-4" />}>
              Solution: Implementing targeted improvements
            </ChainOfThoughtTrigger>
            <ChainOfThoughtContent>
              <ChainOfThoughtItem>
                <strong>Step 1:</strong> Add composite indexes for common query
                patterns
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                <strong>Step 2:</strong> Optimize ORM queries with eager loading
              </ChainOfThoughtItem>
              <ChainOfThoughtItem>
                <strong>Step 3:</strong> Implement query result caching for
                popular searches
              </ChainOfThoughtItem>
            </ChainOfThoughtContent>
          </ChainOfThoughtStep>
        </ChainOfThought>
      </div>
    )
  }
  