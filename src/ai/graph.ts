import { StateGraph, START, END } from "@langchain/langgraph";

import { ReviewStateAnnotation } from "./state.js";
import {
  architectureAgent,
  issuesAgent,
  reportAgent,
  riskAgent,
  securityAgent,
  strengthsAgent,
  summaryAgent,
  walkthroughAgent,
} from "./agents/agent.js";

const builder = new StateGraph(ReviewStateAnnotation)

  .addNode("walkthrough_agent", walkthroughAgent)
  .addNode("summary_agent", summaryAgent)

  .addNode("strengths_agent", strengthsAgent)
  .addNode("issues_agent", issuesAgent)
  .addNode("security_agent", securityAgent)
  .addNode("architecture_agent", architectureAgent)

  .addNode("risk_agent", riskAgent)
  .addNode("report_agent", reportAgent)

  .addEdge(START, "walkthrough_agent")

  .addEdge("walkthrough_agent", "summary_agent")

  .addEdge("summary_agent", "strengths_agent")
  .addEdge("summary_agent", "issues_agent")
  .addEdge("summary_agent", "security_agent")
  .addEdge("summary_agent", "architecture_agent")

  .addEdge("strengths_agent", "risk_agent")
  .addEdge("issues_agent", "risk_agent")
  .addEdge("security_agent", "risk_agent")
  .addEdge("architecture_agent", "risk_agent")

  .addEdge("risk_agent", "report_agent")

  .addEdge("report_agent", END);

export const reviewGraph = builder.compile();