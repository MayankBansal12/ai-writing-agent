import { createState } from "@inngest/agent-kit";
import { Inngest } from "inngest";
import { writingNetwork } from "./network";
import type { WritingAgentState } from "./types";

export const inngestClient = new Inngest({
	id: "ai-writing-agent",
	name: "AI Writing Agent",
});

export const agentRunFunction = inngestClient.createFunction(
	{
		id: "agent/run",
		name: "Writing Agent Run",
	},
	{ event: "agent/run" },
	async ({
		event,
		step,
	}: {
		event: { data: { userPrompt: string } };
		step: any;
	}) => {
		const { userPrompt } = event.data;
		const result = await step.run("run-writing-network", async () => {
			const state = createState<WritingAgentState>({
				userPrompt,
			});

			try {
				console.info("starting network run");
				await writingNetwork.run(userPrompt, { state });
			} catch (error) {
				console.error("error: ", error);
				throw error;
			}

			return {
				success: !!state.data.finalDocument,
				finalDocument: state.data.finalDocument,
				state: state.data,
			};
		});

		return result;
	},
);
