"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, Square } from "lucide-react";
import { useState } from "react";
import { ChainOfThoughtReasoning } from "./chain-of-thought-reasoning";
import { Message, MessageContent } from "./ui/message";
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "./ui/prompt-input";
import { PromptSuggestion } from "./ui/prompt-suggestion";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	format?: "mdx" | "plain";
}

export function ChatPanel() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false)

	const handleSend = () => {
		if (!inputValue.trim()) return;
		setIsLoading(true);

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputValue,
			role: "user",
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");

		setTimeout(() => {
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"I received your message. AI response functionality will be implemented soon.",
				role: "assistant",
			};
			setMessages((prev) => [...prev, assistantMessage]);
			setIsLoading(false);
		}, 5000);
	};

	return (
		<Card className="flex h-full flex-col">
			<CardHeader>
				<h2 className="font-semibold text-lg">Agent Chat</h2>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4 justify-between overflow-hidden p-0">
				<div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4">
					{messages.length > 0 ? (
						messages.map((message) => (
							<Message key={message.id} className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}>
								<MessageContent markdown className={cn(message.role === "user" ? "bg-primary text-primary-foreground max-w-4/5" : "bg-primary-foreground dark:bg-secondary-foreground")}>{message.content}</MessageContent>
							</Message>
						))
					) : (
						<div className="w-full h-full flex flex-col gap-6 justify-center items-center text-center">
							<div className="flex flex-col gap-1">
								<h2 className="text-xl font-medium">
									Experiment your writings with
									<span className="font-semibold"> Wavmo </span>
								</h2>
								<p className="text-sm text-accent-foreground/60">Use suggestions to get started or input your prompt below. <br /> Rate limits may be applied and it will def make mistakes.</p>
							</div>
							<div className="w-[90%] min-w-sm flex flex-wrap gap-2 items-center">
								<PromptSuggestion size="lg" highlight="true" onClick={() => setInputValue("Tell me a joke")}>
									Generate a short blog on a random topic
								</PromptSuggestion>

								<PromptSuggestion size="lg" highlight="true" onClick={() => setInputValue("Write a poem")}>
									Create an outline for a research paper on LLM tokenization
								</PromptSuggestion>

								<PromptSuggestion
									size="lg"
									highlight="true"
									onClick={() => setInputValue("Code a React component")}
								>
									In 150 words, write an introduction explaining why context matters for AI agents.
								</PromptSuggestion>

								<PromptSuggestion size="lg" highlight="true" onClick={() => setInputValue("How does this work?")}>
									Write a blog on how React works
								</PromptSuggestion>

								<PromptSuggestion
									size="lg"
									highlight="true"
									onClick={() => setInputValue("Generate an image of a cat")}
								>
									Defend name "Wavmo" is not taken from Waymo in &lt;200 words
								</PromptSuggestion>
							</div>
						</div>
					)}

					{isLoading && <ChainOfThoughtReasoning />}
				</div>

				<PromptInput
					value={inputValue}
					onValueChange={(value) => setInputValue(value)}
					isLoading={isLoading}
					onSubmit={handleSend}
					className="w-[90%] min-w-sm m-4 mx-auto"
				>
					<PromptInputTextarea placeholder="Explain, Generate, review your documents..." />
					<PromptInputActions className="justify-end pt-2">
						<PromptInputAction
							tooltip={isLoading ? "Stop generation" : "Send message"}
						>
							<Button
								variant="default"
								size="icon"
								className="h-8 w-8 rounded-full"
								onClick={handleSend}
							>
								{isLoading ? (
									<Square className="size-5 fill-current" />
								) : (
									<ArrowUp className="size-5" />
								)}
							</Button>
						</PromptInputAction>
					</PromptInputActions>
				</PromptInput>
			</CardContent>
		</Card>
	);
}
