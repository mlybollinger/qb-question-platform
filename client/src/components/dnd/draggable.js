import React from "react";
import { useDraggable } from "@dnd-kit/core";
import classnames from "classnames";

const statusClasses = {
  unclaimed: "text-gray-500",
  claimed: "bg-status-red text-[#6c3a0b]",
  written: "bg-status-blue text-[#190b6c]",
  edited: "bg-status-green text-[#0B6C15]",
};

export function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: { title: props.children },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      className={classnames(
        "w-[150px] p-2 border-2 border-stroke-light touch-none",
        statusClasses[props.status]
      )}
      ref={setNodeRef}
      style={style}
      role="button"
      {...listeners}
      {...attributes}
    >
      {props.answer} <br />
      <div className="flex justify-between items-end">
        <button className="bg-transparent text-inherit border-none p-0 mt-1 font-inter text-[11px]">
          {props.status}
        </button>
        <span>
          {props.author ? `<${props.author}>` : ""}
          {props.editor ? ` |${props.editor}|` : ""}
        </span>
      </div>
    </div>
  );
}
