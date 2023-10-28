"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import usePartySocket from "partysocket/react";
import { PARTYKIT_HOST } from "@/party/utils/env";
import { ChatMessage, Message } from "@/party/utils/message";
import { FormEventHandler, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ChatMessageComponent from "./chat-message";

interface ChatRoomProps {
  room: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { getToken, userId } = useAuth();
  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    party: "chatroom",
    room,
    query: async () => ({
      token: await getToken(),
    }),
    onMessage(event: MessageEvent<string>) {
      const message = JSON.parse(event.data) as ChatMessage;
      if (message.type === "sync") setMessages(message.messages);
      if (message.type === "new")
        setMessages((messages) => [message, ...messages]);
      if (message.type === "edit")
        setMessages((messages) =>
          messages.map((m) => (m.id === message.id ? message : m)),
        );
      if (message.type === "delete")
        setMessages((messages) => messages.filter((m) => m.id !== message.id));
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    let text = event.currentTarget.message.value;
    console.log(text);
    if (text?.trim()) {
      text = text.replace(/\n/g, "<br>");
      socket.send(JSON.stringify({ type: "new", text }));
      event.currentTarget.message.value = "";
    }
  };

  return (
    <div className="w-full max-w-6xl py-10">
      <div className="flex w-full flex-col">
        <h1 className="py-4 text-center text-2xl font-semibold">Comments</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded bg-muted p-2"
        >
          <Textarea name="message" placeholder="Comment..." />
          <div className="w-full px-3">
            <Button type="submit" variant="outline">
              Comment
            </Button>
          </div>
        </form>

        {messages.map((message) => (
          <ChatMessageComponent
            message={message}
            key={message.id}
            socket={socket}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
