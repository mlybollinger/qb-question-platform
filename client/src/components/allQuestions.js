import classnames from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTournamentCategoryTree } from "../lib/api";
import { useParams } from 'react-router';
import QuestionRow from "./questionRow";

const statusClasses = {
  unclaimed: "text-gray-500",
  written: "bg-status-blue text-[#190b6c]",
  edited: "bg-status-green text-[#0B6C15]",
  proofread: "bg-status-green text-[#0B6C15]",
};

const cellBase = "flex flex-col justify-between text-xs font-dm-sans font-medium w-[200px] p-2";

const parseAnswer = (text) => {
  return text.replace(/<\/?u>/g, "")
          .replace(/\*\*/g, "")
          .replace(/_/g, "")
}
function getAnswer(question) {
  if (question.tossup) {
    return parseAnswer(question.tossup.mainAnswer);
  } else if (question.bonus) {
        return question.bonus.parts?.reduce((answerString, part, currentIndex) => {
          if (currentIndex < 2) {
            return answerString + parseAnswer(part.mainAnswer) + ' / ';
          } else {
            return answerString + parseAnswer(part.mainAnswer);
          }
    }, "")
  }
  return "";
}

function getAuthorName(question) {
  if (!question.author) return "";
  return `${question.author.firstName} ${question.author.lastName}`;
}

function totalSlots(subcat) {
  return 14 * subcat.tournamentCategories?.reduce((sum, c) => sum + c.numTossups + c.numBonuses, 0) || 0;
}

export default function AllQuestions() {
  const [categoryTree, setCategoryTree] = useState([]);
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTournamentCategoryTree(tournamentId).then(setCategoryTree).catch(console.error);
  }, []);


  

  return (
    <div>
      <h2>All Questions</h2>
      <div className="flex max-w-[1750px] overflow-x-auto">
        <table className="table-auto">
          <tbody>
            {categoryTree.children?.map((cat) => (
              <>
                <tr key={`${cat.name}-${cat.id}`}>
                  <td className="font-bold border-b-2 border-stroke mt-3" colSpan={100}>
                    {cat.name}
                  </td>
                </tr>
                {(cat.children?.length ? cat.children : [cat]).map((subcat) => {
                  const slots = totalSlots(subcat);
                  const tossups = subcat.questions?.filter((question) => question.tossup) || [];
                  const bonuses = subcat.questions?.filter((question) => question.bonus) || [];
                  return (<>
                    <tr key={`${subcat.name}-${subcat.id}`} className="table-row">
                      <th rowspan="2" className="bg-[whitesmoke] w-[70px]">{cat.children?.length ? subcat.name : ""}</th>
                      <QuestionRow slots={slots / 2} questions={tossups} tournamentId={tournamentId}></QuestionRow>
                    </tr>
                    <tr className="table-row"> 
                    <QuestionRow slots={slots / 2} questions={bonuses} tournamentId={tournamentId}></QuestionRow>
                    </tr>
                    
                   </>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
