import { getContactMessages } from "@/lib/db";
import MessagesClient from "./MessagesClient";

export const metadata = {
  title: "Messages | Admin",
};

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesClient initialMessages={messages} />;
}
