import { serve } from "inngest/next";
import { runWritingAgent } from "@/lib/inngest/functions/writing-agent";
import { inngest } from "@/app/api/inngest/client";

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [runWritingAgent],
});
