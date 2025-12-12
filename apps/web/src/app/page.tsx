"use client";

import { ChatPanel } from "@/components/chat-panel";
import { DocumentPanel } from "@/components/document-panel";
import { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from "react-resizable-panels";

export default function Home() {
	const [isChatOpen, setIsChatOpen] = useState(true);
	const documentPanelRef = useRef<ImperativePanelHandle>(null);
	const chatPanelRef = useRef<ImperativePanelHandle>(null);

	const handleToggleChat = () => {
		setIsChatOpen((isChatOpen) => !isChatOpen);
	};

	useEffect(() => {
		if (isChatOpen) {
			documentPanelRef.current?.resize(60);
			chatPanelRef.current?.resize(40);
		} else {
			documentPanelRef.current?.resize(100);
			chatPanelRef.current?.resize(0);
		}
	}, [isChatOpen]);

	return (
		<div className="bg-primary-foreground dark:bg-secondary-foreground flex flex-1 h-svh flex-col overflow-hidden p-2">
			<PanelGroup direction="horizontal" className="h-full w-full">
				<Panel
					ref={documentPanelRef}
					defaultSize={60}
					minSize={50}
					maxSize={isChatOpen ? 70 : 100}
				>
					<div className="h-full w-full pr-1 overflow-hidden">
						<DocumentPanel
							isChatOpen={isChatOpen}
							onToggleChat={handleToggleChat}
						/>
					</div>
				</Panel>

				{isChatOpen && <PanelResizeHandle className="bg-border transition-colors hover:bg-primary/20" />}

				<Panel
					ref={chatPanelRef}
					defaultSize={40}
					minSize={30}
					maxSize={50}
					collapsible
				>
					{isChatOpen && (
						<div className="h-full w-full pl-1 overflow-hidden">
							<ChatPanel className="h-full" />
						</div>
					)}
				</Panel>
			</PanelGroup>
		</div>
	);
}
