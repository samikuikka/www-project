"use client";

import { Message } from "@/party/utils/message";
import React, { useState, FormEventHandler } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PartySocket from "partysocket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface ChatMessageProps {
  message: Message;
  socket: PartySocket;
  userId: string | null | undefined;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  socket,
  userId,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  const submitMessage: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const text = event.currentTarget.message.value;
    if (text?.trim()) {
      socket.send(JSON.stringify({ ...message, type: "edit", text }));
      event.currentTarget.message.value = "";
      setEditMode(false);
    }
  };

  const deleteMessage = () => {
    socket.send(JSON.stringify({ id: message.id, type: "delete" }));
    setOpen(false);
  };

  const isAuthor = message.authorId === userId;
  const textContent = message.text.replace(/<br>/g, "\n");

  return (
    <div
      key={message.id}
      className="flex w-full flex-row justify-between gap-3 border border-border bg-background p-2"
    >
      <div className="flex w-full flex-col gap-2 truncate">
        <p className="truncate text-sm font-semibold">{message.authorId}</p>
        {editMode ? (
          <form
            onSubmit={submitMessage}
            className="flex w-full shrink-0 flex-col gap-2"
          >
            <Textarea name="message" defaultValue={textContent} />
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="outline" size="sm">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <>
            {textContent.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </>
        )}
      </div>
      {isAuthor && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-10 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEditMode(true)}>
                <div className="flex items-center gap-2">
                  <Pencil size={16} />
                  Edit
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2 text-destructive">
                    <Trash size={16} />
                    Delete
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this comment?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={deleteMessage}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatMessage;
