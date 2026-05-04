import MdxEditor from "../components/mdxEditor";
import { useParams } from "react-router";

export default function QuestionEditor() {
  const { questionId } = useParams()

  return (
    <>
      <h1>Write a Question</h1>
      <MdxEditor questionId={questionId}/>
    </>
  );
}