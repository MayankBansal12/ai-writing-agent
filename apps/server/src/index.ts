import "dotenv/config";
import fastifyCors from "@fastify/cors";
import { createServer } from "@inngest/agent-kit/server";
import { runWritingWorkflow, writingNetwork } from "./network";
import Fastify from "fastify";
import { fastifyPlugin } from "inngest/fastify";
import { inngestClient, agentRunFunction } from "./inngest";

const baseCorsConfig = {
	origin: process.env.CORS_ORIGIN || "",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true,
	maxAge: 86400,
};

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyCors, baseCorsConfig);

fastify.register(fastifyPlugin, {
	client: inngestClient,
	functions: [agentRunFunction],
});

fastify.post("/api/chat", async (request, reply) => {
	try {
		const { userPrompt } = request.body as { userPrompt: string };
		if (!userPrompt) {
			return reply.status(400).send({
				error: "userPrompt is required",
			});
		}

		const agentResponse = await runWritingWorkflow(userPrompt)
		if (!agentResponse) {
			return reply.status(500).send({
				error: "",
			});
		}

		return agentResponse;
	} catch (error) {
		fastify.log.error(error);
		return reply.status(500).send({
			error: "Internal server error",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

fastify.get("/health", async () => {
	return "Server is healthy!";
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
fastify.listen({ port: PORT }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});

const server = createServer({
	networks: [writingNetwork],
});

server.listen(3010, () => console.log("Agent kit running!"));
