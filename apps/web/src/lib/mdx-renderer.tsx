"use client";

import ReactMarkdown from "react-markdown";

interface MDXRendererProps {
	content: string;
	isMDX?: boolean;
	className?: string;
}

export function MDXRenderer({
	content,
	isMDX = true,
	className = "",
}: MDXRendererProps) {
	if (!isMDX) {
		return (
			<pre className={`whitespace-pre-wrap font-mono text-sm ${className}`}>
				{content}
			</pre>
		);
	}

	return (
		<div
			className={`mdx-content text-foreground ${className}`}
			style={{
				lineHeight: "1.75",
			}}
		>
			<ReactMarkdown
				components={{
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold my-4 first:mt-0">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-2xl font-semibold my-3 first:mt-0">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-xl font-semibold my-2 first:mt-0">
							{children}
						</h3>
					),
					p: ({ children }) => (
						<p className="mb-4 last:mb-0">{children}</p>
					),
					ul: ({ children }) => (
						<ul className="list-disc list-inside mb-4 space-y-1">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal list-inside mb-4 space-y-1">
							{children}
						</ol>
					),
					li: ({ children }) => <li className="ml-4">{children}</li>,
					code: ({ children, className }) => {
						const isInline = !className;
						return isInline ? (
							<code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
								{children}
							</code>
						) : (
							<code className={className}>{children}</code>
						);
					},
					pre: ({ children }) => (
						<pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
							{children}
						</pre>
					),
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4">
							{children}
						</blockquote>
					),
					a: ({ children, href }) => (
						<a
							href={href}
							className="text-primary underline hover:text-primary/80"
						>
							{children}
						</a>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}

