"use client";

import { type Editor, findChildren } from "@tiptap/core";
import CodeBlock from "@tiptap/extension-code-block";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
	bundledLanguages,
	createHighlighter,
	type Highlighter,
	type ThemedToken,
} from "shiki";

const SUPPORTED_LANGS = new Set(Object.keys(bundledLanguages));

let highlighterPromise: Promise<Highlighter> | null = null;
let currentTheme: "min-light" | "monokai" = "min-light";
const HIGHLIGHT_DEBOUNCE_MS = 75;

function isFirefox(): boolean {
	return (
		typeof navigator !== "undefined" &&
		/(?:Firefox|FxiOS)\//.test(navigator.userAgent)
	);
}

function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["min-light", "monokai"],
			langs: [
				"ts",
				"tsx",
				"js",
				"jsx",
				"json",
				"html",
				"css",
				"bash",
				"shell",
				"python",
				"go",
				"rust",
				"sql",
				"yaml",
				"md",
				"mdx",
			],
		});
	}
	return highlighterPromise;
}

export function setShikiCodeBlockTheme(theme: "min-light" | "monokai") {
	currentTheme = theme;
}

function buildStyle(token: ThemedToken): string | undefined {
	const parts: string[] = [];
	if (token.color) parts.push(`color:${token.color}`);
	if (token.bgColor) parts.push(`background-color:${token.bgColor}`);
	if (token.fontStyle) {
		if ((token.fontStyle as number) & 1) parts.push("font-style:italic");
		if ((token.fontStyle as number) & 2) parts.push("font-weight:bold");
		if ((token.fontStyle as number) & 4)
			parts.push("text-decoration:underline");
	}
	return parts.length ? parts.join(";") : undefined;
}

function buildDecorations({
	doc,
	name,
	highlighter,
	theme,
}: {
	doc: Parameters<typeof findChildren>[0];
	name: string;
	highlighter: Highlighter;
	theme: "min-light" | "monokai";
}): DecorationSet {
	const decorations: Decoration[] = [];
	const blocks = findChildren(doc, (node) => node.type.name === name);
	const loadedLangs = highlighter.getLoadedLanguages() as string[];

	for (const block of blocks) {
		const languageAttr = block.node.attrs.language;
		const code = block.node.textContent;
		const from = block.pos + 1;
		const lang =
			languageAttr &&
			SUPPORTED_LANGS.has(languageAttr) &&
			loadedLangs.includes(languageAttr)
				? languageAttr
				: "txt";
		if (!loadedLangs.includes(lang)) continue;

		const result = highlighter.codeToTokens(code, { lang, theme });
		for (const line of result.tokens) {
			for (const token of line) {
				const length = token.content.length;
				if (length === 0) continue;
				const style = buildStyle(token);
				if (!style) continue;
				decorations.push(
					Decoration.inline(from + token.offset, from + token.offset + length, {
						style,
					}),
				);
			}
		}
	}

	return DecorationSet.create(doc, decorations);
}

function codeBlocksChanged({
	previousDoc,
	nextDoc,
	name,
}: {
	previousDoc: Parameters<typeof findChildren>[0];
	nextDoc: Parameters<typeof findChildren>[0];
	name: string;
}): boolean {
	const isCodeBlock = (node: { type: { name: string } }) =>
		node.type.name === name;
	const previousBlocks = findChildren(previousDoc, isCodeBlock);
	const nextBlocks = findChildren(nextDoc, isCodeBlock);

	if (previousBlocks.length !== nextBlocks.length) return true;
	return previousBlocks.some(
		(block, index) => !block.node.eq(nextBlocks[index].node),
	);
}

export const ShikiCodeBlock = CodeBlock.extend({
	name: "codeBlock",
	addProseMirrorPlugins() {
		// Firefox can serialize inline decorations from the editable DOM back into
		// the document as "[object Object]". Keep code blocks plain until syntax
		// highlighting is moved outside the contenteditable tree.
		if (isFirefox()) return [];

		const pluginKey = new PluginKey("shiki-codeblock");
		return [
			new Plugin({
				key: pluginKey,
				state: {
					init: () => DecorationSet.empty,
					apply(tr, set) {
						const nextDecorations = tr.getMeta(pluginKey) as
							| DecorationSet
							| undefined;
						if (nextDecorations) return nextDecorations;
						return set.map(tr.mapping, tr.doc);
					},
				},
				props: {
					decorations(state) {
						return pluginKey.getState(state);
					},
				},
				view: (view) => {
					let destroyed = false;
					let lastTheme = currentTheme;
					let timer: ReturnType<typeof setTimeout> | null = null;
					let updating = false;
					let rerun = false;

					const updateDecorations = async () => {
						timer = null;
						if (updating) {
							rerun = true;
							return;
						}

						updating = true;
						try {
							do {
								rerun = false;
								const highlighter = await getHighlighter();
								if (destroyed) return;

								const doc = view.state.doc;
								const theme = currentTheme;
								const decorationSet = buildDecorations({
									doc,
									name: "codeBlock",
									highlighter,
									theme,
								});

								if (doc !== view.state.doc || theme !== currentTheme) {
									rerun = true;
									continue;
								}

								if (timer) clearTimeout(timer);
								timer = null;
								lastTheme = theme;
								view.dispatch(view.state.tr.setMeta(pluginKey, decorationSet));
							} while (rerun && !destroyed);
						} catch (err) {
							console.error("[shiki] code block decoration update failed", err);
						} finally {
							updating = false;
						}
					};

					const scheduleUpdate = (delay: number) => {
						if (timer) clearTimeout(timer);
						timer = setTimeout(() => void updateDecorations(), delay);
					};

					scheduleUpdate(0);
					return {
						update(nextView, previousState) {
							const themeChanged = currentTheme !== lastTheme;
							if (
								themeChanged ||
								codeBlocksChanged({
									previousDoc: previousState.doc,
									nextDoc: nextView.state.doc,
									name: "codeBlock",
								})
							) {
								scheduleUpdate(themeChanged ? 0 : HIGHLIGHT_DEBOUNCE_MS);
							}
						},
						destroy() {
							destroyed = true;
							if (timer) clearTimeout(timer);
						},
					};
				},
			}),
		];
	},
});

export function ShikiCodeBlockThemeBridge({ editor }: { editor: Editor }) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	useEffect(() => {
		if (!mounted) return;
		setShikiCodeBlockTheme(resolvedTheme === "light" ? "min-light" : "monokai");
		editor.view.dispatch(
			editor.state.tr.setMeta("shikiCodeBlockThemeChanged", true),
		);
	}, [editor, resolvedTheme, mounted]);
	return null;
}
