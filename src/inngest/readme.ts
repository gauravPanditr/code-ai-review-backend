
import { inngest } from "./client.js";

export const generateReadme:any = inngest.createFunction(
  {
    id: "generate-readme",
    triggers: [{ event: "repository.readme.generate" }],
  },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // 1. Get GitHub token
   
    // 2. Retrieve repository context from Pinecone

    // 3. Generate README with Gemini

    // 4. Commit README.md to GitHub

    return { success: true };
  }
);