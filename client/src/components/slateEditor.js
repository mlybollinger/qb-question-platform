import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import "./slateEditor.css";
import { HoveringToolbar, toggleMark } from "./slateToolbar";
import { AnswerlineInstruction } from "./answerline";
import { withInlines, withEditableVoids } from "./slateUtils";
import { PointMarker } from "./bonus";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const SlateEditor = ({ initialValue: propValue, onChange: onChangeProp, onSave: onSave, saveMessageVisible: saveMessageVisible }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const [value, setValue] = useState(propValue ?? defaultValue);
  const editor = useMemo(
    () =>
      withEditableVoids(withInlines(withReact(withHistory(createEditor())))),
    []
  );



  return (
    <div className="editor-container">
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
          onChangeProp?.(value);
        }}
        initialValue={propValue ?? defaultValue}
        className="slate-editor"
      >
        <HoveringToolbar />
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Write a question…"
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
      </Slate>
            { saveMessageVisible && <div> { "Save Successful" }</div> }

      <pre>{JSON.stringify(value, null, 2)}</pre>

    </div>

  );
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "pronunciation-guide":
      return (
        <span style={style} {...attributes}>
          {children}
          <span className="pronunciation-guide">("{element.pg}")</span>
        </span>
      );
    case "main-answer":
      return (

      <p style={style} {...attributes}>

          {children}
        </p>
    
      )
    case "answerline-instruction":
      return (
        <AnswerlineInstruction {...attributes}>
          {children}
        </AnswerlineInstruction>
      );
    case "answerline":
      return (
        <div className="answerline" {...attributes}>
          <p>
          {children}
          </p>
        </div>
      );
    case "answer-label":
      return (
        <span {...attributes}>
          <span contentEditable={false}>
             {'ANSWER: '}
          </span>
          {children} 
        </span>
      );
    case "point-marker":
      return (
        
        <PointMarker {...attributes} children={children} difficulty={element.difficulty} points={element.points}>
        </PointMarker>
      )
    case "bonus_leadin":
      return <p style={style} {...attributes}>
          {children} { '\n'} 
        </p>
    case "bonus_part":
      return <div style={style} {...attributes}>
          {children}
        </div>
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};


const defaultValue = [
  {
    "type": "paragraph",
    "children": [
      {
        "text": ""
      }
    ]
  },
  {
    "type": "answerline",
    "children": [
      {
        "type": "answer-label",
        "children": [
          {
            "text": ""
          }
        ]
      },
      {
        "type": "main-answer",
        "children": [
          {
            "text": " "
          }
        ]
      }
    ]
  }
]

export default SlateEditor;
