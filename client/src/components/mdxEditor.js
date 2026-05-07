import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MDXEditor,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  markdownShortcutPlugin,
  UndoRedo,
  Separator,
  jsxPlugin,
   NestedLexicalEditor,
   JsxComponentDescriptor

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

export const MdxEditor = ({ questionId=null, onSubmit, value, setValue }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const hasExistingQuestion = !!questionId

    useEffect(() => {
    if (hasExistingQuestion) {
      fetch(`/api/questions/${questionId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((question) => {
          if (question.tossup) {
            setValue(question.tossup.questionText);
            setAnswer(question.tossup.answer);
          }
        })
        .catch((err) => console.error('Failed to load question:', err))
        .finally(() => setLoading(false));
      } else {
        setLoading(false);
      };
  }, [])

  const charCount =
    value
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

  if (loading) return <div className="flex flex-col gap-2 w-[80%] max-w-[1000px]">Loading…</div>;

  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[1000px]">
      <div className="flex flex-row justify-between items-end gap-4 font-light font-body text-ink-faint max-w-[800px]">
        <div className="flex gap-3">
          <button className="bg-canvas border-stroke-light">Copy Question</button>
          <button className="bg-danger-bg text-danger-dark border-danger-border">Delete</button>
        </div>
        <div className="flex justify-end gap-2">
          <span>Characters: {charCount}</span>
        </div>
      </div>
      <div className="flex flex-col w-[80%] max-w-[900px]">
        <MDXEditor
          ref={editorRef}
          markdown={value}
          onChange={setValue}
          placeholder="Write a question…"
          className="mdx-question-editor"
          plugins={plugins}
        />
        <div className="flex w-full items-center border border-solid border-stroke-light rounded-b-sm box-border border-t-0 max-w-[800px]">
          <div className="pl-2">
            <span className="p-1 bg-stroke-light">ANSWER: </span>
          </div>
          <MDXEditor
            markdown={answer}
            onChange={setAnswer}
            plugins={[]}
            placeholder=""
            className='mdx-answer-editor'
          />
        </div>
      </div>
      <div className="flex w-[800px] justify-end">
        <button
          onClick={() => onSubmit(value, answer)}
          className="bg-primary-light w-[20%] border-stroke-light justify-center text-md hover:cursor-pointer"
        >
          { hasExistingQuestion ? "Save" : "Submit" }
        </button>
      </div>
    </div>
  );
};

export default MdxEditor;
