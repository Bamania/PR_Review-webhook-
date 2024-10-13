import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { Octokit } from 'octokit';

// Use variables to simulate persistence
let count = 0;
let savedToken = '';
let savedRepoName = '';
let savedOwnerName = '';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

console.log(process.env.GITHUB_ID);
console.log(process.env.GITHUB_SECRET);

async function reviewPr(prContent: string) {
  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: `Review the latest changes in the PR and provide feedback: ${prContent}` }],
    });
    return chatResponse.choices?.[0].message.content;
  } catch (error) {
    console.error("Error with Mistral API:", error);
    throw new Error("Mistral API request failed");
  }
}

export async function POST(req: NextRequest) {
  // Parse the JSON request body
  const body = await req.json();
  let { token, reponame, ownername } = body;

  // If token, reponame, or ownername are not provided in this request, use the saved values from the previous request
  if (!token) token = savedToken;
  if (!reponame) reponame = savedRepoName;
  if (!ownername) ownername = savedOwnerName;

  console.log("repo and owner name ->", ownername, reponame);
  console.log("token-->", token);
  console.log("Endpoint POST triggered");

  // Return an error if no valid token, repo, or owner are available
  if (!token || !reponame || !ownername) {
    return NextResponse.json({ error: 'Missing required parameters (token, reponame, ownername)' }, { status: 400 });
  }

  const github_token = token;

  const octokit = new Octokit({
    auth: github_token,
  });

  // If it's the first request (count is 0), save token, repo, and owner for future requests and return without executing the try block
  if (count === 0) {
    console.log("First request, skipping try block. Count is 0.");
    
    // Save the values for future use
    savedToken = token;
    savedRepoName = reponame;
    savedOwnerName = ownername;

    count = 1; // Set count to 1 after the first request
    return NextResponse.json({ message: 'First API call skipped. Count is now 1.', count });
  }

  // On all subsequent requests, proceed with the try block
  try {
    // Fetch all open pull requests from the repository
    const pullRequests = await octokit.request(`GET /repos/${ownername}/${reponame}/pulls`, {
      owner: ownername,
      repo: reponame,
    });

    if (pullRequests.data.length === 0) {
      throw new Error("No open pull requests found.");
    }

    const latestPullRequest = pullRequests.data[0];
    const pullNo = latestPullRequest.number;
    const latestCommit = latestPullRequest.head.sha;

    console.log("Pull request number:", pullNo);
    console.log("Commit SHA:", latestCommit);

    // Get the PR diff files and content
    const diffData = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
      owner: ownername,
      repo: reponame,
      pull_number: pullNo,
    });

    const diffContent = diffData.data.map(file => `${file.filename}\n${file.patch}`).join('\n');
    console.log("Latest PR changes (diff content):", diffContent);

    // Get AI feedback for the PR
    const aiFeedback = await reviewPr(diffContent);
    console.log("AI feedback:", aiFeedback);

    // Post AI feedback as a comment on the PR
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner: ownername,
      repo: reponame,
      issue_number: pullNo,
      body: aiFeedback ?? "No feedback provided.",
    });

    return NextResponse.json({ aiReview: aiFeedback, count });

  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
