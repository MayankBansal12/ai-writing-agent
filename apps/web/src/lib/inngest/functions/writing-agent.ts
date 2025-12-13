import {
	createState,
	type AgentMessageChunk
} from "@inngest/agent-kit";
import type { ChatRequestEvent } from "@inngest/use-agent";
import { inngest } from "../../../app/api/inngest/client";
import { createChannel } from "../../../app/api/inngest/realtime";
import { writingNetwork } from "../../agents/network";
import type { WritingAgentState } from "../../agents/types";

export const runWritingAgent = inngest.createFunction(
	{
		id: "run-writing-agent",
		name: "Writing Agent",
	},
	{ event: "agent/chat.requested" },
	async ({ event, publish }) => {
		console.log("🚀 [Writing Agent] Function triggered");
		console.log("📦 Event data:", JSON.stringify(event.data, null, 2));
		
		const {
			threadId,
			userMessage,
			userId,
		} = event.data as ChatRequestEvent;

		console.log("👤 User ID:", userId);
		console.log("💬 Thread ID:", threadId);
		console.log("📝 User message:", userMessage);

		if (!userId) {
			console.error("❌ Error: userId is missing!");
			throw new Error("userId is required for agent chat execution");
		}

		if (!userMessage || !userMessage.content) {
			console.error("❌ Error: userMessage or content is missing!");
			throw new Error("userMessage.content is required");
		}

		try {
			const clientState = userMessage.state || {};
			const userPrompt = userMessage.content;
			const networkState = createState<WritingAgentState>(
				{
					userId,
					userPrompt,
					...clientState,
				}
			);

			console.log("🌐 Starting writing network execution...");

			const channelInstance = createChannel(userId);
			const channelKey = userId;
			
			console.log("📺 [Writing Agent] Channel setup:");
			console.log("   - Channel Key:", channelKey);
			console.log("   - Topic: agent_stream");

			await writingNetwork.run(userPrompt, {
				state: networkState,
				streaming: {
					publish: async (chunk: AgentMessageChunk) => {
						const chunkContent = chunk.data?.content || chunk.data?.text || JSON.stringify(chunk.data);
						const chunkEvent = chunk.event;
						const chunkId = chunk.id;
						
						console.log("[Writing Agent] Publishing chunk:");
						console.log("   - Channel Key:", channelKey);
						console.log("   - Event Type:", chunkEvent);
						console.log("   - Chunk ID:", chunkId);
						console.log("   - Chunk Content:", chunkContent);
						console.log("   - Full Chunk Data:", JSON.stringify(chunk, null, 2));
						
						try {
							await publish(channelInstance.agent_stream(chunk));
							console.log("✅ [Writing Agent] Chunk published successfully to channel:", channelKey);
						} catch (publishError) {
							console.error("❌ [Writing Agent] Error publishing chunk:", publishError);
							console.error("   - Channel Key:", channelKey);
							console.error("   - Chunk Event:", chunkEvent);
							throw publishError;
						}
					},
				},
			});

			console.log("✅ Network execution completed");

			return {
				success: true,
				threadId,
				message: "Agent network completed successfully",
			};
		} catch (error) {
			console.error("❌ [Writing Agent] Error in writing agent:", error);
			console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
			
			const channelInstance = createChannel(userId);
			const channelKey = userId;

			const errorChunk: AgentMessageChunk = {
				event: "error",
				data: {
					threadId,
					message: error instanceof Error ? error.message : "Unknown error",
				},
				timestamp: Date.now(),
				sequenceNumber: 0,
				id: crypto.randomUUID(),
			};
			
			console.log("📡 [Writing Agent] Publishing error chunk to channel:", channelKey);
			await publish(channelInstance.agent_stream(errorChunk));
		}
	},
);
