import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

export const inngest = new Inngest({
	id: "writing-agent-network",
	middleware: [realtimeMiddleware()],
});
