import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <td
      className="w-[200px] p-2 border border-stroke-light"
      ref={setNodeRef}
      style={style}
      id={props.id}
    >
      <div className="flex items-center gap-2">{props.children}</div>
    </td>
  );
}
