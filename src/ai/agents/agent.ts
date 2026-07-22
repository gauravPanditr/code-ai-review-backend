import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import type { ReviewState } from "../state.js";

export async function walkthroughAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
Explain file-by-file changes.

Diff:
${state.diff}
`,
  });

  return {
    walkthrough: text,
  };
}


export async function summaryAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are an expert code reviewer.

Analyze this pull request and write a concise summary.

PR Title:
${state.title}

PR Description:
${state.description}

Code Changes:
${state.diff}

Requirements:
- Explain the main purpose of the PR.
- Mention the most important changes.
- Keep it between 3-6 sentences.
- Focus on what changed and why.
- Return only the summary.
`,
  });

  return {
    summary: text,
  };
}



export async function strengthsAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a senior software engineer reviewing a pull request.

PR Summary:
${state.summary}

Code Changes:
${state.diff}

Identify the strengths of this pull request.

Focus on:
- Good coding practices
- Clean architecture decisions
- Readability improvements
- Reusability
- Performance improvements
- Proper error handling
- Good naming conventions
- Maintainability

Return 3-7 concise bullet points.

Only mention actual strengths found in the code.
Do not invent positives.
If no significant strengths are found, say so.
`,
  });

  return {
    strengths: text,
  };
}

export async function issuesAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a senior code reviewer.

PR Summary:
${state.summary}

Walkthrough:
${state.walkthrough}

Repository Context:
${state.context.join("\n")}

Code Diff:
${state.diff}

Find issues in this pull request.

Look for:
- Bugs
- Logic errors
- Edge cases
- Code smells
- Unused code
- Missing validation
- Performance concerns
- Bad React practices
- Maintainability problems

Return findings as markdown bullet points.

Only report issues that are reasonably supported by the code.
Do not invent problems.
If no issues are found, say:
"No significant issues found."
`,
  });

  return {
    issues: text,
  };
}


export async function securityAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a senior application security engineer performing a pull request review.

PR Summary:
${state.summary}

Walkthrough:
${state.walkthrough}

Repository Context:
${state.context.join("\n")}

Code Changes:
${state.diff}

Analyze ONLY security concerns.

Look for:
- Authentication issues
- Authorization flaws
- Hardcoded secrets
- API key exposure
- Missing input validation
- SQL injection risks
- XSS vulnerabilities
- CSRF issues
- Unsafe file operations
- Insecure API usage
- Sensitive data exposure
- Weak error handling leaking information
- Privilege escalation risks

Requirements:
- Return markdown bullet points.
- Explain why each issue is a risk.
- If no security issues are found, return:
  "No significant security concerns found."

Do not report code quality or architecture issues.
Focus strictly on security.
`,
  });

  return {
    security: text,
  };
}


export async function architectureAgent(
 state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a senior software architect reviewing a pull request.

PR Summary:
${state.summary}

Walkthrough:
${state.walkthrough}

Repository Context:
${state.context.join("\n")}

Code Changes:
${state.diff}

Review the architecture of this change.

Focus on:
- Separation of concerns
- Component structure
- Design patterns
- Reusability
- Maintainability
- Scalability
- Folder organization
- Coupling and cohesion
- Code organization
- Future extensibility

Requirements:
- Return markdown bullet points.
- Highlight both good and bad architectural decisions.
- Explain architectural risks if present.
- If no significant architectural concerns exist, say:
  "No significant architectural concerns found."

Do not focus on security vulnerabilities.
Do not focus on code style.
Focus only on architecture and design.
`,
  });

  return {
    architecture: text,
  };
}


export async function riskAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a senior engineering manager.

Based on the following pull request analysis, determine the overall risk level.

Summary:
${state.summary}

Strengths:
${state.strengths}

Issues:
${state.issues}

Security Review:
${state.security}

Architecture Review:
${state.architecture}

Code Diff:
${state.diff}

Requirements:
- Assign a risk level: Low, Medium, or High.
- Give a score from 1-10.
- Explain the reasons.
- Mention what could break after deployment.
- Return markdown.

Format:

Risk Level: <Low|Medium|High>

Score: X/10

Reasons:
- ...
- ...

Deployment Concerns:
- ...
`,
  });

  return {
    risk: text,
  };
}


export async function reportAgent(
  state: ReviewState
): Promise<Partial<ReviewState>> {
  return {
    finalReview: `
# 🤖 AI Code Review

## Walkthrough
${state.walkthrough}

## Summary
${state.summary}

## Strengths
${state.strengths}

## Issues
${state.issues}

## Security
${state.security}

## Architecture
${state.architecture}

## Risk Score
${state.risk}
`,
  };
}