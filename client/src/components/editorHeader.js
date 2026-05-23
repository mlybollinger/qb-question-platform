import { useQuestion } from '../context/questionContext';

export function EditorHeader() {
  const { value, hasExistingQuestion, onDelete } = useQuestion();

  const charCount = value
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .replace(/`/g, '')
    .replace(/<[^>]+>/g, '')
    .length;

  return (
    <div className="flex flex-row justify-between items-end gap-4 font-light font-body text-ink-faint max-w-[800px]">
      <div className="flex gap-3">
        <button className="bg-canvas border-stroke-light">Copy Question</button>
        {hasExistingQuestion && (
          <button
            className="bg-danger-bg text-danger-dark border-danger-border"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <span>Characters: {charCount}</span>
      </div>
    </div>
  );
}

export default EditorHeader;
