import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SlateEditor from "../components/slateEditor";

export default function QuestionWriter() {
  const { id } = useParams();
  const [questionBlob, setQuestionBlob] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);


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

  const handleSave = async () => {
    console.log(" value: ", JSON.stringify({ data: questionBlob }, null, 2));
    await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ questionBlob }),
      headers: { 'Content-Type': 'application/json'}
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Error saving question ${id}`);
      return res.json();
    })
  }



  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>Write a Question</h1>
        <SlateEditor initialValue={questionBlob} onChange={setQuestionBlob} onSave={handleSave}/>
    </>
  );
}
