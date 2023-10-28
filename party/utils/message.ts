import { nanoid } from "nanoid";

export type Message = {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
};

// Outbound message types

export type BroadcastMessage = {
  type: "new" | "edit";
} & Message;

export type DeleteBroadcastMessage = {
  type: "delete";
  id: string;
};

export type SyncMessage = {
  type: "sync";
  messages: Message[];
};

// Inbound message types

export type NewMessage = {
  type: "new";
  text: string;
  id?: string; // optional, server will set if not provided
};

export type DeleteMessage = {
  type: "delete";
  id: string;
};

export type EditMessage = {
  type: "edit";
  text: string;
  id: string;
};

export type UserMessage = NewMessage | EditMessage | DeleteMessage;
export type ChatMessage =
  | SyncMessage
  | BroadcastMessage
  | DeleteBroadcastMessage;

export const deleteMessage = (id: string) =>
  JSON.stringify(<DeleteBroadcastMessage>{ type: "delete", id });

export const syncMessage = (messages: Message[]) =>
  JSON.stringify(<SyncMessage>{ type: "sync", messages });

export const newMessage = (msg: Omit<Message, "id" | "createdAt">) =>
  JSON.stringify(<BroadcastMessage>{
    type: "new",
    id: nanoid(),
    createdAt: Date.now(),
    ...msg,
  });

export const systemMessage = (text: string) =>
  newMessage({ authorId: "system", text });

export const editMessage = (msg: Omit<Message, "createdAt">) =>
  JSON.stringify(<BroadcastMessage>{
    type: "edit",
    createdAt: Date.now(),
    ...msg,
  });
