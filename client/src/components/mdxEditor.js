import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { FaPlus, FaTimes } from 'react-icons/fa';

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

export const MdxEditor = ({ questionId=null }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [questionMarkdown, setQuestionMarkdown] = useState('');

    useEffect(() => {
    if (questionId) {


      fetch(`/api/questions/${questionId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((question) => {
          if (question.tossup) {
            setQuestionMarkdown(question.tossup.questionText + "\nANSWER: " + question.tossup.answer || '');
          }
        })
        .catch((err) => console.error('Failed to load question:', err))
        .finally(() => setLoading(false));
      } else {
        setLoading(false);
      };
  }, [])



  

  const charCount =
    questionMarkdown
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .replace(/<[^>]+>/g, '')
      .length

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

  if (loading) return <div className="editor-container">Loading…</div>;

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <div className="editor-toolbar-buttons">
          <button className="editor-toolbar-copy-question">Copy Question</button>
          <button className="editor-toolbar-delete-question">Delete</button>
        </div>
        <div className="editor-toolbar-question-length">
          <span>Characters: {charCount}</span>
        </div>
      </div>

      <MDXEditor
        ref={editorRef}
        markdown={questionMarkdown}
        onChange={setQuestionMarkdown}
        placeholder="Write a question…"
        className="mdx-question-editor"
        plugins={plugins}
      />


    </div>
  );
};

export default MdxEditor;
