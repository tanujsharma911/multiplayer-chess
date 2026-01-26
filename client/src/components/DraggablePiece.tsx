import { useDraggable } from "@dnd-kit/core";

interface Props {
  id: string;
  isAllowed?: boolean;
  children: React.ReactNode;
  blackBottom?: boolean;
}

export default function DraggablePiece({
  id,
  blackBottom,
  isAllowed,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { from: id },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x * (blackBottom ? -1 : 1)}px, ${
          transform.y * (blackBottom ? -1 : 1)
        }px, 0)`,
      zIndex: isDragging ? 1000 : "auto",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isAllowed ? listeners : {})}
      {...attributes}
      className={isAllowed ? "cursor-grab active:cursor-grabbing" : undefined}
    >
      {children}
    </div>
  );
}
