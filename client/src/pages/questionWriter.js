import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QuestionContext } from '../context/questionContext';
import { TabGroup } from '@/components/select/TabGroup';
import { EditorHeader } from '../components/editorHeader';
import { MdxEditor } from '../components/mdxEditor';
import { EditorFooter } from '../components/editorFooter';
import { getTournamentCategories, createQuestion } from '../lib/api';
import { useParams } from 'react-router-dom';
const TABS = [
  { id: 0, name: 'Tossup' },
  { id: 1, name: 'Bonus' },
];

export default function QuestionWriter() {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [text, setText] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getTournamentCategories(tournamentId).then(setCategories).catch(console.error);
  }, []);

  const submitQuestion = async (rawText, categoryId) => {
    const questionText = rawText
      .replace(/\n\n/g, '\n')
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']');

    try {
      const question = await createQuestion({
        authorId: 1,
        tournamentId: tournamentId,
        categoryId,
        questionType: selectedTab === 0 ? 'tossup' : 'bonus',
        rawText: questionText,
      });
      navigate(`/editor/${question.id}`);
    } catch (err) {
      toast.error(`Error submitting question: ${err.message}`);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        value: text,
        setValue: setText,
        categories,
        selectedCategory,
        setSelectedCategory,
        status: null,
        setStatus: () => {},
        onSubmit: submitQuestion,
        hasExistingQuestion: false,
      }}
    >
      <TabGroup className="pb-4" tabs={TABS} selected={selectedTab} setSelection={setSelectedTab} />
      <div className="flex flex-col gap-2 w-[80%] max-w-[1000px]">
        <EditorHeader />
        <MdxEditor />
        <EditorFooter />
      </div>
    </QuestionContext.Provider>
  );
}
