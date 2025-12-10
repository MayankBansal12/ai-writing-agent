import "dotenv/config";

import { createAgent, type Message, openai } from "@inngest/agent-kit";
import { improvementPrompt } from "./helpers/prompts/improvement";
import { planningPrompt } from "./helpers/prompts/planning";
import { reviewPrompt } from "./helpers/prompts/review";
import { writingPrompt } from "./helpers/prompts/writing";

const planningAgent = createAgent({
	name: "Planning agent",
	system: planningPrompt,
	model: openai({
		model: "openai/gpt-oss-safeguard-20b",
		apiKey: process.env.GROQ_API_KEY,
		baseUrl: "https://api.groq.com/openai/v1/",
	}),
});

const writerAgent = createAgent({
	name: "Document Writing Agent",
	system: writingPrompt,
	model: openai({
		model: "groq/compound",
		apiKey: process.env.GROQ_API_KEY,
		baseUrl: "https://api.groq.com/openai/v1/",
	}),
});

const reviewAgent = createAgent({
	name: "Review agent",
	system: reviewPrompt,
	model: openai({
		model: "openai/gpt-oss-20b",
		apiKey: process.env.GROQ_API_KEY,
		baseUrl: "https://api.groq.com/openai/v1/",
	}),
});

const improvementAgent = createAgent({
	name: "Improvement agent",
	system: improvementPrompt,
	model: openai({
		model: "moonshotai/kimi-k2-instruct-0905",
		apiKey: process.env.GROQ_API_KEY,
		baseUrl: "https://api.groq.com/openai/v1/",
	}),
});

// const network = createNetwork({
// 	name: 'Writing Agent Network',
// 	agents: [planningAgent],
// 	defaultModel: openai({
// 		model: "llama-3.1-8b-instant",
// 		apiKey: process.env.GROQ_API_KEY,
// 		baseUrl: "https://api.groq.com/openai/v1/",
// 	}),
// });

// const server = createServer({
// 	networks: [network],
// });

// server.listen(3010, () => console.log("Agent kit running!"));

const getTextContent = (output: Message[]): string => {
	const textMessage = output.find((msg) => msg.type === "text");
	return textMessage?.type === "text" ? String(textMessage.content) : "";
};

try {
	const { output: planningOutput } = await planningAgent.run(
		"Please help me write a blog post about the benefits of using AI in writing. Keep it short to 500 words, and use simple language with easy to read sentences.",
	);
	console.log(planningOutput);

	const { output: writerOutput } = await writerAgent.run(
		getTextContent(planningOutput),
	);
	console.log(writerOutput);

	console.log("Draft output: ", getTextContent(writerOutput));

	const { output: reviewOutput } = await reviewAgent.run(
		getTextContent(writerOutput),
	);
	console.log(reviewOutput);

	const { output: improvementOutput } = await improvementAgent.run(
		getTextContent(reviewOutput),
	);
	console.log(improvementOutput);

	console.log("Final output: ", getTextContent(improvementOutput));
	process.exit(0);
} catch (error) {
	console.error(error);
	process.exit(1);
}
