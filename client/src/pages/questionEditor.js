import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SlateEditor from "../components/slateEditor";
import { SlateToolbar } from "../components/slateToolbar";

export default function QuestionEditor() {
  const { id } = useParams();
  const [questionBlob, setQuestionBlob] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [saveMessageVisible, setSaveMessageVisible] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    fetch(`/api/questions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Question ${id} not found`);
        return res.json();
      })
      .then((data) => {
        setQuestionBlob(data.questionBlob);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const showSuccessMessage = () => {
    setSaveMessageVisible(true);
    setTimeout(() => {
      setSaveMessageVisible(false);
    }, 3000)
  }
  const handleSave = async () => {
    await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ questionBlob }),
      headers: { 'Content-Type': 'application/json'}
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Error saving question ${id}`);
      showSuccessMessage()
      return res.json();
    })
  }



  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>Write a Question</h1>
        <SlateToolbar value={questionBlob} onSave={handleSave} />

        <SlateEditor initialValue={questionBlob} onChange={setQuestionBlob} onSave={handleSave} saveMessageVisible={saveMessageVisible}/>
    </>
  );
}
