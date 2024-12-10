'use client';
import Markdown from 'react-markdown';
export function MarkdownViewer({ content }: { content: string }) {
  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <Markdown>{content}</Markdown>
    </article>
  );
}
