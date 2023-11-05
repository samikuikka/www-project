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
import { Annotation } from "@prisma/client";
import { AnnotationType, PostWithAnnotations } from "@/models/post-model";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import addToastOnRequestCompletion from "@/helpers/add-toast-on-request-completion";
dayjs.extend(relativeTime);
import { useToast } from "@/components/ui/toast/use-toast"

interface PostContentAreaProps {
  post: PostWithAnnotations;
}

const PostContentArea: React.FC<PostContentAreaProps> = ({ post }) => {
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [buttonVisible, setButtonVisible] = useState(false);
  const [selection, setSelection] = useState({ start: -1, end: -1 });
  const [annotations, setAnnotations] = useState<Annotation[]>(
    post.annotations,
  );
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

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

    const pOffset = getParentOffset(range, selection);
    const start = range.startOffset + (startOffset ?? 0) + pOffset;
    const firstIndex = offset + section.indexOf(highlightedText, start);
    const lastIndex = firstIndex + highlightedText.length - 1;

    if (
      firstIndex < offset ||
      lastIndex > offset + section.length ||
      annotations.some(
        (annotation) =>
          (annotation.start >= firstIndex && annotation.start <= lastIndex) ||
          (annotation.end >= firstIndex && annotation.end <= lastIndex) ||
          (firstIndex >= annotation.start && lastIndex <= annotation.end),
      )
    ) {
      resetSelection();
      return;
    }

    setSelection({ start: firstIndex, end: lastIndex });
    setButtonPositionFromSelection(rect, divRange);
  };

  function setButtonPositionFromSelection(rect: DOMRect, divRange?: DOMRect) {
    // Calculate the position of the button
    const top = rect.top - (divRange?.top ?? 0) - 45;
    const toLeft = rect.left - (divRange?.left ?? 0);
    const left = (toLeft + Math.min(toLeft + rect.width, divRange!.right)) / 2;

    setButtonPosition({ top, left });
    setButtonVisible(true);

    timeoutRef.current = setTimeout(() => {
      setButtonVisible(false);
    }, 5000);
  }

  function getParentOffset(range: Range, textSelection: Selection): number {
    let pNode = range.startContainer;
    while (pNode?.nodeName !== "P") {
      if (!pNode) return 0;
      pNode = pNode.parentNode!;
    }

    let pOffset = 0;
    for (let i = 0; i < pNode.childNodes.length; i++) {
      if (textSelection.containsNode(pNode.childNodes[i], true)) break;
      pOffset += pNode.childNodes[i].textContent?.length ?? 0;
    }
    return pOffset;
  }

  function showSection(item: { data: string; offset: number }, index: number) {
    const annotationsArray: AnnotationType[] = annotations
      .map((a) => {
        return { ...a, type: "annotation" } as AnnotationType;
      })
      .filter(
        (annotation) =>
          annotation.start >= item.offset &&
          annotation.end <= item.offset + item.data.length,
      );

    const annotatedText = [];
    if (
      selection.start >= item.offset &&
      selection.end <= item.offset + item.data.length
    ) {
      annotationsArray.push({
        start: selection.start,
        end: selection.end,
        type: "selection",
      });
    }
    const sortedAnnotations = annotationsArray.sort(
      (a, b) => a.start - b.start,
    );

    if (sortedAnnotations.length === 0) {
      return (
        <p key={index} onClick={() => handleSelection(item.data, item.offset)}>
          {item.data}
        </p>
      );
    } else {
      let lastEnd = 0;
      for (let i = 0; i < sortedAnnotations.length; i++) {
        const annotation = sortedAnnotations[i];
        const before = item.data.slice(lastEnd, annotation.start - item.offset);
        const selected = item.data.slice(
          annotation.start - item.offset,
          annotation.end - item.offset + 1,
        );
        annotatedText.push(before);
        annotatedText.push(
          <Popover key={i}>
            <PopoverTrigger asChild>
              <span className="cursor-pointer whitespace-pre-wrap bg-destructive/80 text-destructive-foreground [-webkit-appearance:none] hover:bg-destructive">
                {selected}
              </span>
            </PopoverTrigger>
            {annotation.type === "annotation" && (
              <PopoverContent side="top" className=" w-[400px]">
                <div className="w-full ">
                  <div className="pb-2 text-center">
                    <span className="bg-destructive text-destructive-foreground">
                      {selected}
                    </span>
                  </div>
                  <Separator />

                  <div className="w-full p-4">
                    <div className="w-full text-xs text-foreground">
                      {annotation.authorId}
                    </div>
                    <div className="pb-3 text-xs text-muted-foreground">
                      {dayjs(annotation.createdAt).fromNow()}
                    </div>

                    <p>&quot;{annotation.content}&quot;</p>
                  </div>
                </div>
              </PopoverContent>
            )}
          </Popover>,
        );
        lastEnd = annotation.end - item.offset + 1;
      }
      annotatedText.push(item.data.slice(lastEnd));

      return (
        <p key={index} onClick={() => handleSelection(item.data, item.offset)}>
          {annotatedText}
        </p>
      );
    }
  }

  async function postAnnotation() {
    try {
      if (!userId) return;

      const annotation = {
        start: selection.start,
        end: selection.end,
        postId: post.id,
        userId: userId,
        content: comment,
      };

      const response = await fetch("/api/annotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(annotation),
      });
      addToastOnRequestCompletion({ response, errorMsg: "Adding notation failed, please try again later", successMsg: "Adding notation successful", toast })
      const data = await response.json();
      setAnnotations([...annotations, data]);
      resetSelection();
    } catch { }

    setOpen(false);
    setComment("");
  }

  function onButtonClick() {
    setOpen(true);
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
    setOpen(false);
  }

  const contents = post.content.replace(/\\n/g, "\n").split("\n");
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
      <Popover open={open} onOpenChange={onOpenChange}>
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
            <Textarea
              className=" resize-none"
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={postAnnotation}>Submit</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {contentsWithOffset.map(showSection)}
    </div>
  );
};

export default PostContentArea;
