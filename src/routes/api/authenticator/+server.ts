import type { RequestHandler } from "./$types";
import Groq from "groq-sdk";
import { config } from "dotenv";

config();

import { OpenAI } from "openai";
import { env } from "$env/dynamic/private"; // this only works in a server side file

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// Main function that will be called by the client
export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const { a, b } = await request.json();

	let systemPrompt = "you are a researcher.";
	let userPrompt = `I want to write a blog article.`;

	// you have the researcher and the step planner.
	// these personas are then given as tools to a tool enabled LLM.
	// these personas have tools themseves that they can use, they are also gien the ability to call each other.

	// this is a rudimental version of the spoke and wheel model.

	// the nesting and hierachy of the clickable items is important.

	const groqResponse = await groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: userPrompt,
			},
		],
		model: "llama3-8b-8192",
	});

	const openaiResponse = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: userPrompt,
			},
		],
		max_tokens: 4096,
	});

	console.log(openaiResponse.choices[0]?.message?.content || ""); // visibility logging

	const responseMessage = `${openaiResponse.choices[0]?.message?.content || ""}`; // Your server-side function logic

	return new Response(JSON.stringify({ response: responseMessage }), {
		headers: { "Content-Type": "application/json" },
	});
};

// insert water fetcher

// plan research
// research
// understand from research
// plan all ideal steps
// steps
// step breakdown into single task tasks
// execute task queue

let improveIt = "Improve this article, make it better, make it awesome.";
let humanizeIt = "Make this read as a human had written it. Not a robot. It must be written by a human.";
// let humanizeIt = "What parts of this article can be improved?";
let researchTask =
	"Your teammates goal is to write a news article. The current task you are fixated on is researching the how to write amazing new articles. Find out everythign you can and compile a list of the best practices for writing amazing articles. Any tips or advice you find, add it to your list also. You will be graded on the quality of your list, the more comprehensive the better. Your goal is to compile all the infomation you can on writing world class amazing articles.";
