import "dotenv/config";
import Fastify from "fastify";

const fastify = Fastify({
	logger: true,
});

// const baseCorsConfig = {
// 	origin: process.env.CORS_ORIGIN || "",
// 	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// 	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// 	credentials: true,
// 	maxAge: 86400,
// };
// fastify.register(fastifyCors, baseCorsConfig);

fastify.get("/health", async () => {
	return "Server is running";
});

import { createAgent, createNetwork, gemini } from '@inngest/agent-kit';
import { createServer } from '@inngest/agent-kit/server';
import { writingPrompt } from './helpers/prompts/writing';
import { planningPrompt } from './helpers/prompts/planning';
import { reviewPrompt } from "./helpers/prompts/review";
import { improvementPrompt } from "./helpers/prompts/improvement";

const writerAgent = createAgent({
	name: 'Document editor',
	system: writingPrompt,
	model: gemini({ model: "gemini-2.0-flash", apiKey: process.env.GEMINI_API_KEY }),
});

const planningAgent = createAgent({
	name: 'Planning agent',
	system: planningPrompt,
	model: gemini({ model: "gemini-2.0-flash-lite", apiKey: process.env.GEMINI_API_KEY }),
});

const reviewAgent = createAgent({
	name: 'Review agent',
	system: reviewPrompt,
	model: gemini({ model: "gemini-2.0-flash-lite", apiKey: process.env.GEMINI_API_KEY }),
});

const improvementAgent = createAgent({
	name: 'Improvement agent',
	system: improvementPrompt,
	model: gemini({ model: "gemini-2.0-flash", apiKey: process.env.GEMINI_API_KEY }),
});

const network = createNetwork({
	name: 'My Network',
	agents: [planningAgent, writerAgent, reviewAgent, improvementAgent],
	defaultModel: gemini({ model: "gemini-2.0-flash", apiKey: process.env.GEMINI_API_KEY }),
});

const server = createServer({
	networks: [network],
});

server.listen(3010, () => console.log("Agent kit running!"));

fastify.listen({ port: 5000 }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log("Server running on port 5000");
});
