import MdxEditor from "../components/mdxEditor";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TabGroup } from "@/components/select/TabGroup"
import { toast } from "react-toastify";

export default function QuestionWriter() {
  const navigate = useNavigate();
  const [text, setText] = useState("")
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [{ id: 0, name: "Tossup"}, { id: 1, name: "Bonus" }]

  const submitQuestion = async (question, categoryId) => {

    const questionText = question.replace(/\n\n/g, "\n")
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']')
    
    await fetch(`/api/questions/`, {
      method: 'POST',
      body: JSON.stringify({ authorId: 1, 
        tournamentId: 1,
        categoryId: categoryId,
        questionType: selectedTab === 0 ? "tossup" : "bonus",
        rawText: questionText }),
      headers: { 'Content-Type': 'application/json'}
    })
    .then(async (res) => {
      if (!res.ok) {
        const response = await res.json();
        toast.error(`Error submitting question: ${response.error}`);
      } else {
        const response = await res.json();
        navigate(`/editor/${response.id}`)
      }
    })
  }



  return (
    <>
      <TabGroup className="pb-4" tabs={tabs} selected={selectedTab} setSelection={setSelectedTab}></TabGroup>

      <MdxEditor onSubmit={submitQuestion} value={text} setValue={setText} mode={tabs[selectedTab].name}/>
    </>
  );
}