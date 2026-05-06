import MdxEditor from "../components/mdxEditor";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function QuestionWriter() {
  const navigate = useNavigate();
  const [text, setText] = useState("")

  const submitQuestion = async (question, answer) => {
    console.log("Question: ", question);
    console.log("Answer: ", answer);
    await fetch(`/api/questions/`, {
      method: 'POST',
      body: JSON.stringify({ authorId: 1, 
        tournamentId: 1,
        categoryId: 1,
        questionType: "tossup",
        rawText: question + "\nANSWER: " + answer }),
      headers: { 'Content-Type': 'application/json'}
    })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Error submitting question`);

      const response = await res.json();
      navigate(`/editor/${response.id}`)
    })
  }

  return (
    <>
      <h1>Write a Question</h1>
      <MdxEditor onSubmit={submitQuestion} value={text} setValue={setText}/>
    </>
  );
}