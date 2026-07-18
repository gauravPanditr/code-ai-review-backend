import { inngest } from "./client.js";

export const reviewFunction :any = inngest.createFunction(
  { id: "review-function", triggers: [{ event: "repo.connected" }] },
  async ({ event }) => {
    console.log(event.data);

    return { success: true };
  }
);
