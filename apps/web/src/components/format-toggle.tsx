"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FormatType = "mdx" | "normal";

interface FormatToggleProps {
	format: FormatType;
	onFormatChange: (format: FormatType) => void;
	className?: string;
}

export function FormatToggle({
	format,
	onFormatChange,
	className,
}: FormatToggleProps) {
	return (
		<div className={cn("flex gap-1 rounded-md border p-1", className)}>
			<Button
				variant={format === "mdx" ? "default" : "ghost"}
				size="sm"
				onClick={() => onFormatChange("mdx")}
				className={cn(
					"h-7 px-3 text-xs",
					format === "mdx" && "bg-primary text-primary-foreground",
				)}
			>
				MDX
			</Button>
			<Button
				variant={format === "normal" ? "default" : "ghost"}
				size="sm"
				onClick={() => onFormatChange("normal")}
				className={cn(
					"h-7 px-3 text-xs",
					format === "normal" && "bg-primary text-primary-foreground",
				)}
			>
				Normal
			</Button>
		</div>
	);
}

