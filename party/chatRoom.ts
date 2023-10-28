import type * as Party from "partykit/server";
import { json } from "@/party/utils/response";
import {
  Message,
  UserMessage,
  deleteMessage,
  editMessage,
  newMessage,
  syncMessage,
  systemMessage,
} from "@/party/utils/message";
import { verifyToken } from "@clerk/backend";
import { nanoid } from "nanoid";

const DEFAULT_CLERK_ENDPOINT = "https://fun-caiman-49.clerk.accounts.dev";

export default class ChatRoomServer implements Party.Server {
  options: Party.ServerOptions = {
    hibernate: true,
    // this opts the chat room into hibernation mode, which
    // allows for a higher number of concurrent connections
  };

  messages?: Message[];

  constructor(public party: Party.Party) {}

  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    try {
      // get authentication server url from environment variables (optional)
      const issuer = DEFAULT_CLERK_ENDPOINT;
      // get token from request query string
      const token = new URL(request.url).searchParams.get("token") ?? "";
      // verify the JWT (in this case using clerk)
      const session = await verifyToken(token, { issuer });
      // pass any information to the onConnect handler in headers (optional)
      request.headers.set("X-User-ID", session.sub);
      // forward the request onwards on onConnect
      return request;
    } catch (e) {
      // authentication failed!
      // short-circuit the request before it's forwarded to the party
      return new Response("Unauthorized", { status: 401 });
    }
  }

  static async onBeforeRequest(request: Party.Request) {
    try {
      // get authentication server url from environment variables (optional)
      const issuer = DEFAULT_CLERK_ENDPOINT;
      // get token from request headers
      const token = request.headers.get("Authorization") ?? "";
      // verify the JWT (in this case using clerk)
      await verifyToken(token, { issuer });
      // forward the request onwards on onRequest
      return request;
    } catch (e) {
      // authentication failed!
      // short-circuit the request before it's forwarded to the party
      return new Response("Unauthorized", { status: 401 });
    }
  }

  async onConnect(
    connection: Party.Connection,
    { request }: Party.ConnectionContext,
  ) {
    const userId = request.headers.get("X-User-ID");
    await this.ensureLoadMessages();
    connection.setState({ userId });
    connection.send(syncMessage((this.messages ?? []).toReversed()));
  }

  async onRequest(req: Party.Request) {
    console.log("onRequest", req.method);
    return json({ message: "Hello, world!" });
  }

  async onMessage(
    messageString: string,
    connection: Party.Connection<unknown>,
  ) {
    const message = JSON.parse(messageString) as UserMessage;

    const userId = (connection.state as any)?.userId;
    if (typeof userId !== "string") {
      return connection.send(systemMessage("You must be logged in to chat"));
    }

    if (message.type === "delete") {
      this.party.broadcast(deleteMessage(message.id));
      this.messages = this.messages!.filter((m) => m.id !== message.id);
    }

    if (message.type !== "delete") {
      if (message.text.length > 4000) {
        return connection.send(systemMessage("Message too long"));
      }
      const payload: Message = {
        id: message.id ?? nanoid(),
        authorId: userId,
        text: message.text,
        createdAt: Date.now(),
      };

      if (message.type === "new") {
        this.party.broadcast(newMessage(payload));
        this.messages!.push(payload);
      }

      if (message.type === "edit") {
        this.party.broadcast(editMessage(payload));
        this.messages = this.messages!.map((m) =>
          m.id == message.id ? payload : m,
        );
      }
    }

    // Save messages to room storage
    await this.party.storage.put("messages", this.messages);
  }

  // Retrieve messages from room storage and store them on room instance
  private async ensureLoadMessages() {
    if (!this.messages) {
      this.messages = (await this.party.storage.get("messages")) ?? [];
    }
    return this.messages;
  }
}

ChatRoomServer satisfies Party.Worker;
