"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Markdown } from "tiptap-markdown";
import { MathBlock, MathInline } from "./extensions/math-passthrough";
import { MermaidBlock } from "./extensions/mermaid-block";
import { MermaidInputRule } from "./extensions/mermaid-input-rule";
import { patchMarkdownSerializer } from "./extensions/serializer-patch";
import {
	ShikiCodeBlock,
	ShikiCodeBlockThemeBridge,
} from "./extensions/shiki-code-block";
import { SlashCommandMenu } from "./extensions/slash-command-menu";
import "katex/dist/katex.min.css";
import "./styles/editor.css";

interface RichDocumentEditorProps {
	content: string;
	onChange: (markdown: string) => void;
}

type MarkdownStorage = {
	markdown: {
		getMarkdown: () => string;
	};
};

const FENCED_CODE_BLOCK = /```([^\n]*)\n([\s\S]*?)\n```/g;
const OBJECT_ONLY_CODE =
	/^\s*\[object Object\](?:\s*,?\s*\[object Object\])*\s*,?\s*$/;

function restoreObjectOnlyCodeBlocks(
	nextMarkdown: string,
	previousMarkdown: string,
): string {
	const previousBlocks = Array.from(
		previousMarkdown.matchAll(FENCED_CODE_BLOCK),
		(match) => ({
			block: match[0],
			language: match[1].trim(),
			content: match[2],
		}),
	);
	let blockIndex = 0;
	let unrecoverable = false;

	const repaired = nextMarkdown.replace(
		FENCED_CODE_BLOCK,
		(block, language: string, code: string) => {
			const previous = previousBlocks[blockIndex++];
			if (!OBJECT_ONLY_CODE.test(code)) return block;
			if (
				!previous ||
				previous.language !== language.trim() ||
				OBJECT_ONLY_CODE.test(previous.content)
			) {
				unrecoverable = true;
				return block;
			}
			return previous.block;
		},
	);

	return unrecoverable ? previousMarkdown : repaired;
}

export function RichDocumentEditor({
	content,
	onChange,
}: RichDocumentEditorProps) {
	const lastEmitted = useRef<string>(content);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				codeBlock: false,
				heading: { levels: [1, 2, 3] },
			}),
			Table.configure({ resizable: false }),
			TableRow,
			TableHeader,
			TableCell,
			TaskList,
			TaskItem.configure({ nested: true }),
			MermaidInputRule,
			ShikiCodeBlock,
			MermaidBlock,
			Markdown.configure({
				html: true,
				transformPastedText: true,
				transformCopiedText: true,
			}),
			Placeholder.configure({
				placeholder: 'Start writing... or type "/" for commands',
			}),
			Typography,
			MathInline,
			MathBlock,
		],
		content,
		onCreate: ({ editor }) => {
			patchMarkdownSerializer(editor);
		},
		onUpdate: ({ editor }) => {
			const serialized = (
				editor.storage as unknown as MarkdownStorage
			).markdown.getMarkdown();
			const md = restoreObjectOnlyCodeBlocks(serialized, lastEmitted.current);
			if (md !== serialized) {
				const selectionFrom = editor.state.selection.from;
				queueMicrotask(() => {
					if (editor.isDestroyed) return;
					editor.commands.setContent(md, { emitUpdate: false });
					editor.commands.setTextSelection(
						Math.min(selectionFrom, editor.state.doc.content.size - 1),
					);
				});
			}
			lastEmitted.current = md;
			onChange(md);
		},
		editorProps: {
			attributes: {
				class: "rich-editor-body",
				spellcheck: "false",
				"data-gramm": "false",
				"data-gramm_editor": "false",
				"data-enable-grammarly": "false",
				"data-lt-active": "false",
			},
		},
	});

	useEffect(() => {
		if (!editor) return;
		if (content === lastEmitted.current) return;

		editor.commands.setContent(content);
		lastEmitted.current = content;
		const endPos = editor.state.doc.content.size;
		editor.commands.setTextSelection(endPos - 1);
	}, [content, editor]);

	if (!editor) return null;

	return (
		<div className="rich-editor-wrapper">
			<EditorContent
				editor={editor}
				className="rich-editor-content thin-scrollbar"
			/>
			<SlashCommandMenu editor={editor} />
			<ShikiCodeBlockThemeBridge editor={editor} />
		</div>
	);
}
