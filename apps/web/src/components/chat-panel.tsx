"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MDXRenderer } from "@/lib/mdx-renderer";
import { cn } from "@/lib/utils";

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
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content:
				"Hello! I'm your AI writing assistant. How can I help you today?",
			role: "assistant",
		},
	]);
	const [inputValue, setInputValue] = useState("");

	const handleSend = () => {
		if (!inputValue.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputValue,
			role: "user",
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");

		// TODO: Add actual AI response logic here
		// For now, just echo back a placeholder response
		setTimeout(() => {
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"I received your message. AI response functionality will be implemented soon.",
				role: "assistant",
			};
			setMessages((prev) => [...prev, assistantMessage]);
		}, 500);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<Card className={cn("flex h-full flex-col", className)}>
			<CardHeader>
				<h2 className="font-semibold text-lg">Agent Chat</h2>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
				<div className="flex-1 overflow-y-auto p-4">
					<div className="flex flex-col gap-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={cn(
									"flex w-full",
									message.role === "user" ? "justify-end" : "justify-start",
								)}
							>
								<div
									className={cn(
										"max-w-[80%] rounded-lg px-4 py-2 text-sm",
										message.role === "user"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-foreground",
									)}
								>
									<div className="[&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-0">
										<MDXRenderer
											content={message.content}
											isMDX={message.format !== "plain"}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="border-t p-4">
					<div className="flex gap-2">
						<Input
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
							className="flex-1"
						/>
						<Button
							onClick={handleSend}
							size="icon"
							disabled={!inputValue.trim()}
						>
							<Send className="h-4 w-4" />
							<span className="sr-only">Send message</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
