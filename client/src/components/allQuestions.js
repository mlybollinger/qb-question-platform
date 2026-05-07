import classnames from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useState } from "react";

const statusClasses = {
  unclaimed: "text-gray-500",
  written: "bg-status-blue text-[#190b6c]",
  edited: "bg-status-green text-[#0B6C15]",
  proofread: "bg-status-green text-[#0B6C15]",
};

const cellBase = "flex flex-col justify-between text-xs font-dm-sans font-medium w-[200px] p-2";

function getAnswer(question) {
  if (question.tossup) {
    return question.tossup.mainAnswer;
  } else if (question.bonus) {
        return question.bonus.parts?.reduce((answerString, part, currentIndex) => {
          if (currentIndex < 2) {
            return answerString + part.mainAnswer + ' / ';
          } else {
            return answerString + part.mainAnswer ;
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
  return 14 * subcat.distributionConstraints?.reduce((sum, c) => sum + c.numQuestions, 0) || 0;
}

export default function AllQuestions() {
  const [categoryTree, setCategoryTree] = useState([]);

  useEffect(() => {
    fetch(`/api/tournaments/1/categoryTree`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setCategoryTree(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>All Questions</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <tbody>
            {categoryTree.map((cat) => (
              <>
                <tr key={cat.id}>
                  <td className="font-bold border-b-2 border-stroke mt-3" colSpan={100}>
                    {cat.name}
                  </td>
                </tr>
                {(cat.children?.length ? cat.children : [cat]).map((subcat) => {
                  const slots = totalSlots(subcat);
                  const questions = subcat.questions || [];
                  return (
                    <tr key={subcat.id} className="flex">
                      <td className="bg-[whitesmoke] w-[70px]">{cat.children?.length ? subcat.name : ""}</td>
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
                            {getAnswer(q)}
                            <br />
                            <div className="flex justify-between items-end">
                              <button className="bg-transparent text-inherit border-none p-0 mt-1 font-inter text-[11px]">
                                {q.status}
                                <FaChevronDown className="ml-1" />
                              </button>
                              <span>{getAuthorName(q) ? `<${getAuthorName(q)}>` : ""}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
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
