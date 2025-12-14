"use client";

import { PanelLeft, PanelLeftOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FormatToggle, type FormatType } from "@/components/format-toggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { MDXRenderer } from "@/lib/mdx-renderer";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useRef, useEffect } from "react";
import { Markdown } from "./ui/markdown";

interface DocumentPanelProps {
	isChatOpen: boolean;
	onToggleChat: () => void;
}

const welcomeText = `# Welcome to Wavmo \n\n An AI Agent that helps you write better documents. Get started using the Agent Chat on the right side.`

export function DocumentPanel({
	isChatOpen,
	onToggleChat,
}: DocumentPanelProps) {
	const [content, setContent] = useState(welcomeText);
	const [format, setFormat] = useState<FormatType>("mdx");
	const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);

	return (
		<Card className="flex h-full w-full flex-col">
			<CardHeader className="flex flex-row items-center justify-between p-2">
				<h2 className="px-2 font-semibold text-lg">Wavmo</h2>
				<div className="flex items-center gap-2">
					<FormatToggle format={isEditingMarkdown ? "mdx" : format} onFormatChange={setFormat} />
					<ModeToggle />
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={onToggleChat}
								className={isChatOpen ? "" : "text-muted-foreground"}
							>
								<AnimatePresence mode="wait" initial={false}>
									<motion.span
										key={isChatOpen ? "sidebar-open" : "sidebar-closed"}
										initial={{ rotateY: 90, opacity: 0 }}
										animate={{ rotateY: 0, opacity: 1 }}
										exit={{ rotateY: -90, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="flex items-center justify-center"
									>
										{!isChatOpen ? (
											<PanelLeft className="h-5 w-5" />
										) : (
											<PanelLeftOpen className="h-5 w-5" />
										)}
									</motion.span>
								</AnimatePresence>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{isChatOpen ? "Hide Chat" : "Open Agent Chat"}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-hidden p-4">
				{format === "mdx" ? (
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full h-full resize-none border-none outline-none bg-transparent font-mono text-sm whitespace-pre-wrap p-0 rounded-sm"
						placeholder="Start editing your document..."
					/>
				) : (
					<div className="w-full h-full overflow-y-auto relative">
						{isEditingMarkdown ? (
							<textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								onBlur={() => setIsEditingMarkdown(false)}
								autoFocus
								className="w-full h-full resize-none border-none outline-none bg-transparent font-mono text-sm whitespace-pre-wrap p-0 rounded-sm"
								placeholder="Start editing your document..."
							/>
						) : (
							<div
								onClick={() => setIsEditingMarkdown(true)}
								className="w-full min-h-full cursor-text prose prose-sm max-w-none dark:prose-invert rounded-sm transition-all p-2 -m-2"
							>
								<Markdown>{content}</Markdown>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
