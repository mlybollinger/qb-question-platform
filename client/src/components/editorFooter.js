import { useQuestion } from '../context/questionContext';
import { ComboBox } from './select/Combobox';
import { SelectComponent } from './select/Select';

const STATUSES = ['written', 'edited', 'proofread'];

export function EditorFooter() {
  const {
    value,
    categories,
    selectedCategory,
    setSelectedCategory,
    status,
    setStatus,
    onSubmit,
    hasExistingQuestion,
  } = useQuestion();

  return (
    <div className="flex flex-col gap-2 max-w-[800px]">
      <div className="flex justify-between">
        <div className="flex gap-1">
          Category:
          <ComboBox
            options={categories}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </div>
        <button
          onClick={() => onSubmit(value, selectedCategory?.id)}
          className="bg-primary-light w-[160px] border-stroke-light justify-center text-md hover:cursor-pointer"
        >
          {hasExistingQuestion ? 'Save' : 'Submit'}
        </button>
      </div>
      {hasExistingQuestion && (
        <div className="flex items-center gap-2">
          Status:
          <SelectComponent options={STATUSES} value={status} setValue={setStatus} />
        </div>
      )}
    </div>
  );
}

export default EditorFooter;
