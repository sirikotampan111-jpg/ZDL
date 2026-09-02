"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  toolbarPlugin,
  UndoRedo,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  InsertCodeBlock,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

// MDXEditor touches the DOM — load client-side only.
const InitializedEditor = dynamic(() => import("@mdxeditor/editor").then((m) => m.MDXEditor), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-secondary/50">
      <span className="text-sm text-muted-foreground">Memuat editor…</span>
    </div>
  ),
});

const allPlugins = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  thematicBreakPlugin(),
  markdownShortcutPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin(),
  tablePlugin(),
  codeBlockPlugin(),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <UndoRedo />
        <BlockTypeSelect />
        <BoldItalicUnderlineToggles />
        <CodeToggle />
        <ListsToggle />
        <CreateLink />
        <InsertImage />
        <InsertCodeBlock />
        <InsertTable />
        <InsertThematicBreak />
      </>
    ),
  }),
];

/**
 * Markdown rich-text editor for long-form journal articles.
 * Uncontrolled: initial value is captured once; changes flow out via onChange.
 * Exposes getMarkdown() via ref for reliable form submission.
 * Supports: headings, paragraph, bold, italic, underline, link, image (URL),
 * lists, quote, code block, inline code, table, divider + markdown shortcuts.
 * For YouTube embeds, paste `{{youtube:VIDEO_ID}}` on its own line.
 */
export interface MarkdownEditorHandle {
  getMarkdown: () => string;
}

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, {
  value: string;
  onChange: (markdown: string) => void;
}>(function MarkdownEditor({ value, onChange }, forwardedRef) {
  const editorRef = useRef<MDXEditorMethods>(null);
  // Capture the initial content once so re-renders don't reset the caret.
  const [initialMarkdown] = useState(
    () =>
      value ||
      "Mulai menulis artikel di sini…\n\nGunakan toolbar untuk heading, list, gambar, dan lainnya. Untuk embed YouTube, tulis {{youtube:VIDEO_ID}} pada baris terpisah."
  );

  useImperativeHandle(
    forwardedRef,
    () => ({
      getMarkdown: () => editorRef.current?.getMarkdown() ?? "",
    }),
    []
  );

  return (
    <div className="zdl-editor overflow-hidden rounded-lg border border-border bg-background">
      <InitializedEditor
        ref={editorRef}
        markdown={initialMarkdown}
        plugins={allPlugins}
        onChange={onChange}
        contentEditableProps={{ "aria-label": "Konten artikel" }}
      />
    </div>
  );
});
