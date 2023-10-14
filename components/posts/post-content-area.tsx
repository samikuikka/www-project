"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";

interface PostContentAreaProps {
  content: string;
  postId: string;
}

const PostContentArea: React.FC<PostContentAreaProps> = ({
  content,
  postId,
}) => {
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [buttonVisible, setButtonVisible] = useState(false);
  const [selection, setSelection] = useState({ start: -1, end: -1 });
  const { userId } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      resetSelection();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSelection = (
    section: string,
    offset: number,
    startOffset: number = 0,
  ) => {
    const selection = window.getSelection();
    if (!selection || !divRef) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current!);
    }
    const highlightedText = selection.toString();
    if (!highlightedText) {
      resetSelection();
      return;
    }

    // Get the position of the selected text
    const range = selection.getRangeAt(0);
    const divRange = divRef.current?.getBoundingClientRect();
    const rect = range.getBoundingClientRect();

    const start = range.startOffset + (startOffset ?? 0);
    const firstIndex = offset + section.indexOf(highlightedText, start);
    const lastIndex = firstIndex + highlightedText.length;

    if (firstIndex < offset || lastIndex > offset + section.length) {
      resetSelection();
      return;
    }

    // Calculate the position of the button
    const top = rect.top - (divRange?.top ?? 0) - 45;
    const toLeft = rect.left - (divRange?.left ?? 0);
    const left = (toLeft + Math.min(toLeft + rect.width, divRange!.right)) / 2;

    setButtonPosition({ top, left });
    setButtonVisible(true);
    setSelection({ start: firstIndex, end: lastIndex });

    timeoutRef.current = setTimeout(() => {
      setButtonVisible(false);
    }, 5000); // Adjust the timeout duration as needed
  };

  function sendAnnotation({
    start,
    end,
    text,
  }: {
    start: number;
    end: number;
    text: string;
  }) {
    try {
      if (!userId) return;

      const annotation = {
        start: start,
        end: end,
        text: text,
        postId: postId,
        userId: userId,
      };
    } catch {}
  }

  function onButtonClick() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current!);
    }
  }

  function onOpenChange(change: boolean) {
    if (!change) {
      resetSelection();
    }
  }

  function resetSelection() {
    setButtonVisible(false);
    setSelection({ start: -1, end: -1 });
  }

  const contents = content.replace(/\\n/g, "\n").split("\n");
  const reducedLengths = contents.reduce(
    (acc, curr) => {
      acc.push(acc[acc.length - 1] + curr.length + 2);
      return acc;
    },
    [0],
  );
  const contentsWithOffset = contents.map((data, index) => {
    return { data, offset: reducedLengths[index] };
  });

  return (
    <div className="relative h-full w-full" ref={divRef}>
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            style={{
              position: "absolute",
              top: buttonPosition.top,
              left: buttonPosition.left,
              visibility: buttonVisible ? "visible" : "hidden",
            }}
            variant="outline"
            size="icon"
            onClick={onButtonClick}
          >
            <Pencil />
          </Button>
        </PopoverTrigger>

        <PopoverContent side="top" sideOffset={-40} className=" w-80">
          <div className=" flex w-full max-w-xs flex-col">
            <h1>Comment</h1>
            <Textarea className=" resize-none" />
            <div className="flex justify-end gap-2 pt-4">
              <Button>Submit</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {contentsWithOffset.map(function (item, index) {
        if (
          selection.start >= item.offset &&
          selection.end <= item.offset + item.data.length
        ) {
          const before = item.data.slice(0, selection.start - item.offset);
          const selected = item.data.slice(
            selection.start - item.offset,
            selection.end - item.offset + 1,
          );
          const after = item.data.slice(selection.end - item.offset + 1);
          return (
            <p key={index} className="mb-2">
              <span
                onMouseUp={() => handleSelection(item.data, item.offset, 0)}
              >
                {before}
              </span>
              <span
                className="bg-destructive text-destructive-foreground"
                onMouseUp={() =>
                  handleSelection(item.data, item.offset, before.length)
                }
              >
                {selected}
              </span>
              <span
                onMouseUp={() =>
                  handleSelection(
                    item.data,
                    item.offset,
                    before.length + selected.length,
                  )
                }
              >
                {after}
              </span>
            </p>
          );
        } else {
          return (
            <p
              key={index}
              onMouseUp={() => handleSelection(item.data, item.offset)}
              className="mb-2"
            >
              {item.data}
              <br />
            </p>
          );
        }
      })}
    </div>
  );
};

export default PostContentArea;
