import { retrieveContext } from "../ai/rag.js";
import { reviewGraph } from "../ai/graph.js";
import { getPullRequestDiff, postReviewComment } from "../lib/github.js";
import { prisma } from "../lib/primsa.js";
import { inngest } from "./client.js";

export const generateReview: any = inngest.createFunction(
  {
    id: "generate-review",
    triggers: [{ event: "pr.review-connected" }],
    concurrency: 5,
  },

  async ({ event, step }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No GitHub access token found");
        }

        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repo,
          prNumber
        );

        return {
          ...data,
          token: account.accessToken,
        };
      }
    );

    const context = await step.run(
      "retrieve-context",
      async () => {
        const query = `${title}\n${description ?? ""}`;
        
        return await retrieveContext(
          query,
          `${owner}/${repo}`
        );
      }
    );

    
    const review = await step.run(
      "generate-ai-review",
      async () => {
        const result = await reviewGraph.invoke({
          title,
          description: description ?? "",
          diff,
          context,
        });

        return result.finalReview;
      }
    );

    await step.run(
      "post-comment",
      async () => {
        await postReviewComment(
          token,
          owner,
          repo,
          prNumber,
          review
        );
      }
    );
    console.log("savin");
    
    await step.run(
      "save-review",
      async () => {
        const repository =
          await prisma.repositary.findFirst({
            where: {
              owner,
              name: repo,
            },
          });

        if (repository) {
          await prisma.review.create({
            data: {
              repositoryId: repository.id,
              prNumber,
              prTitle: title,
              prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
              review,
              status: "completed",
            },
          });
        }
      }
    );

    return {
      success: true,
    };
  }
);