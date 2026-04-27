
import _ from "lodash";

export function WriterToolbar({ value, onSave }) {
  const paragraphs = _.filter(value, (node) => node.type === "paragraph");
  const pgs = _.map(
    _.filter(value, (node) => node.type === "pronunciation-guide"),
    (node) => node.children[0].children[0].text.length
  );

  const lengths = _.map(paragraphs, (node) =>
    _.map(node.children, "text").map((text) => text.length)
  )
    .flat()
    .concat(pgs);
  

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-buttons">
        <button className="editor-toolbar-copy-question">Copy Question</button>
        <button className="writer-toolbar-submit-question" onClick={onSave}>Submit Question</button>

        <button className="editor-toolbar-delete-question">Delete</button>
      </div>
      <div className="writer-toolbar-question-length">
        {/* <span>Characters: {JSON.stringify(value[0].children[0].text.length)}</span> */}
        <span>
          Characters: {lengths.reduce((partialSum, a) => partialSum + a, 0)}
        </span>
      </div>
    </div>
  );
}