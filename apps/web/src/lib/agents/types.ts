export interface WritingPlan {
	intent: string;
	requirements: string;
	outline: string;
	tone: string;
	constraints: string;
	optional_search_queries?: string[];
}

export interface WritingDraft {
	draft: string;
}

export interface WritingReview {
	issues: string[];
	missing_elements: string[];
	tone_mismatches: string[];
	structural_problems: string[];
	suggested_improvements: string[];
}

export interface FinalDocument {
	final_document: string;
}

export interface WritingAgentState {
	userId: string;
	userPrompt: string;
	plan?: WritingPlan;
	draft?: string;
	review?: WritingReview;
	finalDocument?: string;
}

export interface AgentTiming {
	name: string;
	duration: number;
}

