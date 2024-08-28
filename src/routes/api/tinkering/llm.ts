import Groq from "groq-sdk";
import { OpenAI } from "openai";
import { env } from "$env/dynamic/private"; // this only works in a server side file
import type { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function askOpenAi(system: string, user: string, structured_output?: z.ZodType) {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-2024-08-06",
		response_format: structured_output ? zodResponseFormat(structured_output, "output") : undefined,
		messages: [
			{
				role: "system",
				content: system,
			},
			{
				role: "user",
				content: user,
			},
		],
		max_tokens: 4096,
	});
	return response.choices[0].message.content;
}

export async function askGroq(system: string, user: string) {
	return groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content: system,
			},
			{
				role: "user",
				content: user,
			},
		],
		model: "llama3-8b-8192",
	});
}
