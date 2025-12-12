import "dotenv/config";

import { createServer } from "@inngest/agent-kit/server";
import { writingNetwork } from "./network";

const server = createServer({
	networks: [writingNetwork],
});

server.listen(3010, () => console.log("Agent kit running!"));
