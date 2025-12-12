import type { WritingPlan } from "../../types";

export function createWritingPrompt(plan: WritingPlan): string {
	return `You are the Writing Agent. Generate a complete, coherent draft based on the provided plan.

PLAN CONTEXT:
- Intent: ${plan.intent}
- Requirements: ${plan.requirements}
- Outline: ${plan.outline}
- Tone: ${plan.tone}
- Constraints: ${plan.constraints}

INSTRUCTIONS:
- Follow the outline strictly
- Use the specified tone and target audience
- Produce a single unified draft in MDX format
- Use proper MDX syntax: ## for headings, **bold**, *italic*, \`code\`, etc
- Include a title with # at the start
- No meta commentary or explanations
- Output valid JSON only

JSON SCHEMA:
{
  "draft": "string - the complete MDX-formatted draft"
}`;
}
