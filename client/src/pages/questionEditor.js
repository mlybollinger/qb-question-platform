import MdxEditor from "../components/mdxEditor";
import { useParams } from "react-router";
import { useState } from "react";

export default function QuestionEditor() {
  const { questionId } = useParams()

  const [text, setText] = useState("")

  return (
    <>
      <h1>Write a Question</h1>
      <MdxEditor questionId={questionId} value={text} setValue={setText}/>
    </>
  );
}