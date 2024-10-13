import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { Octokit } from 'octokit';
import { getServerSession } from 'next-auth';
const apiKey = process.env.MISTRAL_API_KEY 
const github_token = process.env.GITHUB_TOKEN 
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
  console.log("Endpoint POST triggered");
  const session = getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' });
  }
  console.log("Endpoint POST")

  const octokit = new Octokit({
    auth: github_token
  });

  try {
  //api to fetch all the api request 
    const pullRequests = await octokit.request('GET /repos/Aimank009/E-Sport-Assignment/pulls', {
      owner: 'Aimank009',
      repo: 'E-Sport-Assignment'
    });

    if (pullRequests.data.length === 0) {
      throw new Error("No open pull requests found.");
    }

    
    const latestPullRequest = pullRequests.data[0]; 
    const pullNo = latestPullRequest.number;
    // const bodyForReview = latestPullRequest.body;
    const latestCommit = latestPullRequest.head.sha;

    console.log("Pull request number:", pullNo);
    console.log("Commit SHA:", latestCommit);

    
    const diffData = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
      owner: 'Aimank009',
      repo: 'E-Sport-Assignment',
      pull_number: pullNo
    });

    const diffContent = diffData.data.map(file => `${file.filename}\n${file.patch}`).join('\n');
    console.log("Latest PR changes (diff content):", diffContent);

   
    const aiFeedback = await reviewPr(diffContent);
    console.log("AI feedback:", aiFeedback);

  //api to send the review by Ai
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner: 'Aimank009',
      repo: 'E-Sport-Assignment',
      issue_number: pullNo,
      body: aiFeedback ?? "No feedback provided."
    });

    return NextResponse.json({ aiReview: aiFeedback });

  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
