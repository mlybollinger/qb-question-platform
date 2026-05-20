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
import { ComboBox } from './select/Combobox';
import { SelectComponent } from "./select/Select";


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

export const MdxEditor = ({ questionId=null, onSubmit, value, setValue, mode }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const hasExistingQuestion = !!questionId
  const [status, setStatus] = useState(null);
  const statuses = ["written", "edited", "proofread"]

    useEffect(() => {
    if (hasExistingQuestion) {
      fetch(`/api/questions/${questionId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((question) => {
          if (question.tossup) {
            setValue(question.tossup.questionText + "\nANSWER: " + question.tossup.answer);
            setAnswer(question.tossup.answer);
          } else if (question.bonus) {
            const text = question.bonus.bonusLeadin + "\n" + question.bonus.parts.reduce((prev, current, index) => {
              return prev + current.text + "\nANSWER: " + current.answer + "\n"
            }, "")
            setValue(text);
          }
          setSelectedCategory(question.category)
          setStatus(question.status)
        })
        .catch((err) => console.error('Failed to load question:', err))
        .finally(() => setLoading(false));
      } else {
        setLoading(false);
      };

      
  }, [])


  useEffect(() => {
    fetch(`/api/tournaments/1/categories`)
      .then((res) => { return res.json() })
      .then((cats) => setCategories(cats));
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
      <div className="flex max-w-[800px] justify-between">
        <div class="flex gap-1">Category: <ComboBox options={categories} selected={selectedCategory} setSelected={setSelectedCategory}></ComboBox></div>
        
        <button
          onClick={() => onSubmit(value, selectedCategory.id)}
          className="bg-primary-light w-[160px] border-stroke-light justify-center text-md hover:cursor-pointer"
        >
          { hasExistingQuestion ? "Save" : "Submit" }
        </button>
       
      </div>
      {hasExistingQuestion && <div className="flex items-center gap-2">
       {"Status: "}
      <SelectComponent options={statuses} value={status} setValue={setStatus}></SelectComponent>
        </div>
  }
    </div>
  );
};

export default MdxEditor;
