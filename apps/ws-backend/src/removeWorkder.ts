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
      const removedMessages = [];
      const message = await client.brPop("remove", 0);
      console.log(message);
      if (!message) continue;
      const parsedMessage = JSON.parse(message.element);
      if (Array.isArray(parsedMessage.message)) {
        removedMessages.push(...parsedMessage.message);
      } else {
        removedMessages.push(parsedMessage.message);
      }

      for (let i = 0; i < BATCH_SIZE; i++) {
        const message = await client.rPop("remove");
        if (!message) break;
        const parsedMessage = JSON.parse(message);
        if (Array.isArray(parsedMessage.message)) {
          removedMessages.push(...parsedMessage.message);
        } else {
          removedMessages.push(parsedMessage.message);
        }
      }

      if (removedMessages.length > 0) {
        console.log(removedMessages)
        const result = await Chat.deleteMany({
          where: {
            message: { in: removedMessages.map((m) => JSON.stringify(m)) },
          },
        });
        console.log("result", result);
        console.log(`Removed ${removedMessages.length} messages`);
      }
    } catch (error) {
      console.log("Error processing queue:", error);
    }
  }
})();
