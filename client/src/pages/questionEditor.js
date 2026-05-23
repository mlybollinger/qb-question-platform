import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { QuestionContext } from '../context/questionContext';
import { EditorHeader } from '../components/editorHeader';
import { MdxEditor } from '../components/mdxEditor';
import { EditorFooter } from '../components/editorFooter';
import { getQuestion, getTournamentCategories, updateQuestion } from '../lib/api';

export default function QuestionEditor() {
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [status, setStatus] = useState(null);
  const [questionType, setQuestionType] = useState(null);

  useEffect(() => {
    getQuestion(questionId)
      .then((question) => {
        if (question.tossup) {
          setText(question.tossup.questionText + '\nANSWER: ' + question.tossup.answer);
          setQuestionType('tossup');
        } else if (question.bonus) {
          const bonusText =
            question.bonus.bonusLeadin +
            '\n' +
            question.bonus.parts.reduce(
              (prev, part) => prev + part.text + '\nANSWER: ' + part.answer + '\n',
              ''
            );
          setText(bonusText);
          setQuestionType('bonus');
        }
        setSelectedCategory(question.category);
        setStatus(question.status);
      })
      .catch((err) => {
        console.error('Failed to load question:', err);
        toast.error('Failed to load question.');
      })
      .finally(() => setLoading(false));
  }, [questionId]);

  useEffect(() => {
    getTournamentCategories(1).then(setCategories).catch(console.error);
  }, []);

  const handleSave = async (rawText, categoryId) => {
    const cleanedText = rawText
      .replace(/\n\n/g, '\n')
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']');

    try {
      await updateQuestion(questionId, { rawText: cleanedText, questionType, categoryId, status });
      toast.success('Question saved.');
    } catch (err) {
      toast.error(`Error saving question: ${err.message}`);
    }
  };

  if (loading) return <div className="flex flex-col gap-2 w-[80%] max-w-[1000px]">Loading…</div>;

  return (
    <QuestionContext.Provider
      value={{
        value: text,
        setValue: setText,
        categories,
        selectedCategory,
        setSelectedCategory,
        status,
        setStatus,
        onSubmit: handleSave,
        hasExistingQuestion: true,
      }}
    >
      <h1>Edit Question</h1>
      <div className="flex flex-col gap-2 w-[80%] max-w-[1000px]">
        <EditorHeader />
        <MdxEditor />
        <EditorFooter />
      </div>
    </QuestionContext.Provider>
  );
}
