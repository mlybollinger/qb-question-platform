import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QuestionContext } from '../context/questionContext';
import { TabGroup } from '@/components/select/TabGroup';
import { EditorHeader } from '../components/editorHeader';
import { MdxEditor } from '../components/mdxEditor';
import { EditorFooter } from '../components/editorFooter';

const TABS = [
  { id: 0, name: 'Tossup' },
  { id: 1, name: 'Bonus' },
];

export default function QuestionWriter() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch('/api/tournaments/1/categories')
      .then((res) => res.json())
      .then((cats) => setCategories(cats));
  }, []);

  const submitQuestion = async (rawText, categoryId) => {
    const questionText = rawText
      .replace(/\n\n/g, '\n')
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']');

    const res = await fetch('/api/questions/', {
      method: 'POST',
      body: JSON.stringify({
        authorId: 1,
        tournamentId: 1,
        categoryId,
        questionType: selectedTab === 0 ? 'tossup' : 'bonus',
        rawText: questionText,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.json();
      toast.error(`Error submitting question: ${body.error}`);
    } else {
      const body = await res.json();
      navigate(`/editor/${body.id}`);
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
