"use client";

import { useAgent, type ConversationMessage } from "@inngest/use-agent";
import { Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MDXRenderer } from "@/lib/mdx-renderer";
import { cn } from "@/lib/utils";
import { useAgentStore } from "../stores/useAgentStore";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	format?: "mdx" | "plain";
}

interface ChatPanelProps {
	className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
	const agentUserId = useAgentStore((state) => state.agentUserId);
	// const { messages: agentMessages, sendMessage, status, error } = useAgent({ userId: agentUserId });
	const [inputValue, setInputValue] = useState("");

	// useEffect(() => {
	// 	console.log("🔍 [Chat Panel] Channel/User Info:");
	// 	console.log("   - Agent User ID:", agentUserId);
	// 	console.log("   - Listening to channel:", agentUserId);
	// }, [agentUserId]);

	// const messages = useMemo<Message[]>(() => {
	// 	const welcomeMessage: Message = {
	// 		id: "welcome",
	// 		content:
	// 			"Hello! I'm your AI writing assistant. How can I help you today?",
	// 		role: "assistant",
	// 	};

	// 	if (agentMessages.length === 0) {
	// 		return [welcomeMessage];
	// 	}

	// 	const mappedMessages = agentMessages.map((msg, index): Message => {
	// 		// Type-safe access to message content - ConversationMessage may have content in different structure
	// 		const msgAny = msg as any;
	// 		const msgContent = msgAny.content ?? msgAny.text ?? msgAny.parts?.[0]?.content ?? "";
	// 		const content = typeof msgContent === "string"
	// 			? msgContent
	// 			: JSON.stringify(msgContent ?? "");

	// 		console.log("📥 [Chat Panel] Received message:", {
	// 			id: msg.id ?? `msg-${index}`,
	// 			role: msg.role,
	// 			contentLength: content.length,
	// 			contentPreview: content.substring(0, 100),
	// 			fullContent: content,
	// 			rawMessage: msgAny,
	// 		});

	// 		return {
	// 			id: msg.id ?? `msg-${index}`,
	// 			content,
	// 			role: msg.role === "user" ? "user" : "assistant",
	// 			format: "mdx",
	// 		};
	// 	});

	// 	return [welcomeMessage, ...mappedMessages];
	// }, [agentMessages]);

	// const handleSend = async () => {
	// 	if (!inputValue.trim()) return;
	// 	if (status === "streaming") return;

	// 	const messageToSend = inputValue.trim();
	// 	setInputValue("");

	// 	try {
	// 		await sendMessage(messageToSend);
	// 		console.log("message sent: ", messageToSend);
	// 	} catch (err) {
	// 		console.error("Error sending message:", err);
	// 	}
	// };

	// const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	if (e.key === "Enter" && !e.shiftKey) {
	// 		e.preventDefault();
	// 		handleSend();
	// 	}
	// };


	// return (
	// 	<Card className={cn("flex h-full flex-col", className)}>
	// 		<CardHeader>
	// 			<h2 className="font-semibold text-lg">Agent Chat</h2>
	// 		</CardHeader>
	// 		<CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
	// 			<div className="flex-1 overflow-y-auto p-4">
	// 				<div className="flex flex-col gap-4">
	// 					{messages.map((message) => (
	// 						<div
	// 							key={message.id}
	// 							className={cn(
	// 								"flex w-full",
	// 								message.role === "user" ? "justify-end" : "justify-start",
	// 							)}
	// 						>
	// 							<div
	// 								className={cn(
	// 									"max-w-[80%] rounded-lg px-4 py-2 text-sm",
	// 									message.role === "user"
	// 										? "bg-primary text-primary-foreground"
	// 										: "bg-muted text-foreground",
	// 								)}
	// 							>
	// 								<div className="[&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-0">
	// 									<MDXRenderer
	// 										content={message.content}
	// 										isMDX={message.format !== "plain"}
	// 									/>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					))}
	// 					{status === "streaming" && (
	// 						<div className="flex w-full justify-start">
	// 							<div className="max-w-[80%] rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
	// 								<div className="flex items-center gap-2">
	// 									<div className="h-2 w-2 animate-pulse rounded-full bg-current" />
	// 									<span>Agent is thinking...</span>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					)}
	// 					{error && (
	// 						<div className="flex w-full justify-start">
	// 							<div className="max-w-[80%] rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
	// 								Error: {error.message || "An error occurred"}
	// 							</div>
	// 						</div>
	// 					)}
	// 				</div>
	// 			</div>

	// 			<div className="border-t p-4">
	// 				<div className="flex gap-2">
	// 					<Input
	// 						value={inputValue}
	// 						onChange={(e) => setInputValue(e.target.value)}
	// 						onKeyDown={handleKeyDown}
	// 						placeholder="Type your message..."
	// 						className="flex-1"
	// 						disabled={status === "streaming"}
	// 					/>
	// 					<Button
	// 						onClick={handleSend}
	// 						size="icon"
	// 						disabled={!inputValue.trim() || status === "streaming"}
	// 					>
	// 						<Send className="h-4 w-4" />
	// 						<span className="sr-only">Send message</span>
	// 					</Button>
	// 				</div>
	// 			</div>
	// 		</CardContent>
	// 	</Card>
	// );

	const { messages, status, sendMessage, isConnected, error, clearError } = useAgent({
		//   threadId: threadId,
		userId: agentUserId,
		debug: true,
		//   onError: (err:any) => console.error("Agent error:", err),
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const message = formData.get("message") as string;
		if (message.trim()) {
			sendMessage(message);
			e.currentTarget.reset();
		}
	};

	return (
		<div>
			<div>Status: {status}</div>
			<div>Connected: {isConnected ? "Yes" : "No"}</div>
			{error && (
				<div>
					Error: {error.message}
					<button onClick={clearError}>Clear</button>
				</div>
			)}

			<div className="message-list">
				{messages.map((msg) => (
					<Message key={msg.id} message={msg} />
				))}
			</div>

			<form onSubmit={handleSubmit}>
				<input
					name="message"
					placeholder="Ask anything..."
				// disabled={status !== "idle"}
				/>
				<button type="submit"
				// disabled={status !== "idle"}
				>
					Send
				</button>
			</form>
		</div>
	);
}

// A simple component to render a message with all its parts

function Message({ message }: { message: ConversationMessage }) {
	return (
		<div className={`message ${message.role}`}>
			<strong>{message.role}</strong>
			{message.parts.map((part, index) => {
				switch (part.type) {
					case "text":
						return <p key={index}>{part.content}</p>;
					case "tool-call":
						return (
							<div
								key={index}
								className="tool-call"
								style={{
									border: "1px solid #ccc",
									padding: "10px",
									marginTop: "10px",
									borderRadius: "5px",
								}}
							>
								<div>
									<strong>Tool Call:</strong> {part.toolName}
								</div>
								<pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
									Status: {part.state}
									<br />
									Input: {JSON.stringify(part.input, null, 2)}
									{part?.output ? (
										<>
											<br />
											Output: {JSON.stringify(part.output, null, 2)}
										</>
									) : <></>}
								</pre>
							</div>
						);
					// TODO: Add cases for other part types like 'data', 'reasoning', etc.
					default:
						return null;
				}
			})}
		</div>
	);
}