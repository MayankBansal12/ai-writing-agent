"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={resolvedTheme}
							initial={{ opacity: 0, rotate: -15, scale: 0.85, y: -4 }}
							animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
							exit={{ opacity: 0, rotate: 15, scale: 0.85, y: 4 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="flex items-center justify-center"
						>
							{resolvedTheme === "light" ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</motion.span>
					</AnimatePresence>
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Toggle Theme</p>
			</TooltipContent>
		</Tooltip>
	);
}
