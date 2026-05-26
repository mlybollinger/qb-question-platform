import classnames from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router";

function getAuthorName(question) {
  if (!question.author) return "";
  return `${question.author.firstName} ${question.author.lastName}`;
}

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


const statusClasses = {
  unclaimed: "text-gray-500",
  written: "bg-status-blue text-[#190b6c]",
  edited: "bg-status-green text-[#0B6C15]",
  proofread: "bg-status-green text-[#0B6C15]",
};

const cellBase = "text-xs font-dm-sans font-medium min-w-[175px] p-2";


export default function QuestionRow ({ slots, questions, tournamentId }) {
  const navigate = useNavigate();
  
  return (
  <>
  {Array.from({ length: slots }, (_, i) => {
    const q = questions[i];
    if (!q) {
      return (
        <td key={i} className={classnames(cellBase, statusClasses.unclaimed)}>
          {""}
          <br />
          <button className="bg-transparent text-inherit border-none p-0 mt-1 font-inter text-[11px]">
            unclaimed
            <FaChevronDown className="ml-1" />
          </button>
        </td>
      );
    }
    return (
      <td key={q.id} className={classnames(cellBase, statusClasses[q.status])}>
        <div class="flex flex-col justify-between">
        <span className="hover:cursor-pointer" onClick={() => navigate(`/tournament/${tournamentId}/editor/${q.id}`)}>{getAnswer(q)}</span>
        <br />
        <div className="flex justify-between items-end">
          <button className="bg-transparent text-inherit border-none p-0 mt-1 font-inter text-[11px]">
            {q.status}
            <FaChevronDown className="ml-1" />
          </button>
          <span>{getAuthorName(q) ? `<${getAuthorName(q)}>` : ""}</span>
        </div>
        </div>
      </td>
    );
  })}</>
)
}