import React, { useRef, useMemo } from 'react';
import {
  MDXEditor,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  markdownShortcutPlugin,
  UndoRedo,
  Separator,
  jsxPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './slateEditor.css';
import { useQuestion } from '../context/questionContext';

const PronunciationGuideDescriptor = {
  name: 'PronunciationGuide',
  kind: 'text',
  props: [
    { name: 'word', type: 'string' },
    { name: 'pg', type: 'string' },
  ],
  hasChildren: false,
  Editor: ({ mdastNode }) => {
    const attrs = mdastNode.attributes ?? [];
    const pg = attrs.find((a) => a.name === 'pg')?.value ?? '';
    const word = attrs.find((a) => a.name === 'word')?.value ?? '';
    return (
      <span contentEditable={false}>
        {word}
        <span className="pronunciation-guide">("{pg}")</span>
      </span>
    );
  },
};

export function MdxEditor() {
  const { value, setValue } = useQuestion();
  const editorRef = useRef(null);

  const plugins = useMemo(
    () => [
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <button
              className="mdxeditor-toolbar-button pg-button"
              title="Add Pronunciation Guide"
              onMouseDown={(e) => {
                e.preventDefault();
                const selectedText = window.getSelection()?.toString() || '';
                const word = selectedText || window.prompt('Enter the word:');
                if (!word) return;
                const pg = window.prompt('Enter the pronunciation guide:');
                if (!pg) return;
                editorRef.current?.insertMarkdown(
                  `<PronunciationGuide word="${word}" pg="${pg}" />`
                );
              }}
            >
              PG
            </button>
          </>
        ),
      }),
      jsxPlugin({ jsxComponentDescriptors: [PronunciationGuideDescriptor] }),
      markdownShortcutPlugin(),
    ],
    []
  );

  return (
    <div className="flex flex-col max-w-[800px]">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={setValue}
        placeholder=""
        className="mdx-question-editor min-h-[200px]"
        plugins={plugins}
      />
    </div>
  );
}

export default MdxEditor;
