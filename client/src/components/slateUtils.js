import { MainAnswer } from "./answerline";
import { Editor, Range, Transforms} from "slate"

export const Element = ({ attributes, children, element }) => {
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
      return <MainAnswer {...attributes} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export const Leaf = ({ attributes, children, leaf }) => {
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

export const withInlines = (editor) => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = (element) =>
    ["link", "button", "badge"].includes(element.type) || isInline(element);

  editor.isElementReadOnly = (element) =>
    element.type === "badge" || isElementReadOnly(element);

  editor.isSelectable = (element) =>
    element.type !== "badge" && isSelectable(element);

  editor.insertText = (text) => {
    insertText(text);
  };

  editor.insertData = (data) => {
    insertData(data);
  };

  return editor;
};

export const withEditableVoids = (editor) => {
  const { isVoid, deleteBackward } = editor;

  editor.isVoid = (element) => {
    const voidTypes = ["editable-void", "answer-label"]
    return voidTypes.includes(element.type) ? true : isVoid(element);
  };

  editor.deleteBackward = (...args) => {
  const { selection } = editor;

  if (selection && Range.isCollapsed(selection)) {
    // Look at the node just before the cursor
    const before = Editor.before(editor, selection);
    if (before) {
      const [match] = Editor.nodes(editor, {
        at: before,
        match: n => n.type === "answer-label",
      });

      if (match) return; // cursor is right after the label, block deletion
    }
  }

  deleteBackward(...args);
};
  return editor;  
};
