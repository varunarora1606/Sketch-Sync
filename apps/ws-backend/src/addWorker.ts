import { Chat } from "@repo/db/client";
import { createClient } from "redis";

const client = createClient();
(async () => await client.connect())();

const BATCH_SIZE = 10;

(async () => {
  console.log("worker started");
  while (true) {
    try {
      console.log("worker is running");
      const messages = [];
      const message = await client.brPop("messages", 0);
      console.log(message);
      if (message) messages.push(JSON.parse(message.element));

      for (let i = 0; i < BATCH_SIZE; i++) {
        const message = await client.rPop("messages");
        if (message) messages.push(JSON.parse(message));
        else break;
      }

      if (messages.length > 0) {
        await Chat.createMany({ data: messages });
        console.log(`Inserted ${messages.length} messages`);
      }
    } catch (error) {
      console.log("Error processing queue:", error);
    }
  }
})();
