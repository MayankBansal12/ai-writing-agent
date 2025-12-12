"use client";

import { FormatToggle, type FormatType } from "@/components/format-toggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MDXRenderer } from "@/lib/mdx-renderer";
import { PanelLeft, PanelLeftOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

interface DocumentPanelProps {
    isChatOpen: boolean;
    onToggleChat: () => void;
}

export function DocumentPanel({ isChatOpen, onToggleChat }: DocumentPanelProps) {
    const [content, setContent] = useState("# Welcome\n\nStart editing your document...");
    const [format, setFormat] = useState<FormatType>("mdx");

    return (
        <Card className="flex flex-col w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between p-2">
                <h2 className="text-lg font-semibold px-2">Wavmo</h2>
                <div className="flex items-center gap-2">
                    <FormatToggle format={format} onFormatChange={setFormat} />
                    <ModeToggle />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onToggleChat}
                                className={isChatOpen ? '' : 'text-muted-foreground'}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={isChatOpen ? 'sidebar-open' : 'sidebar-closed'}
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
                            <p>{isChatOpen ? 'Hide Chat' : 'Open Agent Chat'}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4">
                <MDXRenderer content={content} isMDX={format === "mdx"} />
            </CardContent>
        </Card>
    );
}
