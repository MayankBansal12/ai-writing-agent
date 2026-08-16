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
let highlighter: Highlighter | null = null;
let currentTheme: "min-light" | "monokai" = "min-light";

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
		}).then((instance) => {
			highlighter = instance;
			return instance;
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

export const ShikiCodeBlock = CodeBlock.extend({
	name: "codeBlock",
	addProseMirrorPlugins() {
		const pluginKey = new PluginKey("shiki-codeblock");
		return [
			new Plugin({
				key: pluginKey,
				state: {
					init: () => DecorationSet.empty,
					apply(tr, set) {
						if (
							highlighter &&
							(tr.docChanged ||
								tr.getMeta(pluginKey) ||
								tr.getMeta("shikiCodeBlockThemeChanged"))
						) {
							return buildDecorations({
								doc: tr.doc,
								name: "codeBlock",
								highlighter,
								theme: currentTheme,
							});
						}
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
					void getHighlighter()
						.then(() => {
							if (!destroyed) {
								view.dispatch(view.state.tr.setMeta(pluginKey, true));
							}
						})
						.catch((err) => {
							console.error("[shiki] code block decoration update failed", err);
						});
					return {
						destroy() {
							destroyed = true;
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
