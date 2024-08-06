import { supabase } from "$lib/supabase";
import { json } from "@sveltejs/kit";

import { OpenAI } from "openai";

// In a server-side file
import { env } from "$env/dynamic/private";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

async function textToEmoji(texts: string[]): Promise<string> {
	const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;

	for (const text of texts) {
		const match = text.match(emojiRegex);
		if (match) {
			return match[0];
		}
	}

	// If no emoji found, use OpenAI to suggest an emoji for the longest string
	const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b));

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant that suggests a single appropriate emoji for given text. Respond with only the emoji, nothing else.",
				},
				{ role: "user", content: `Suggest an emoji for: ${longestText}` },
			],
			max_tokens: 1,
		});

		const suggestedEmoji = response.choices[0].message.content?.trim();
		return suggestedEmoji || "⏷"; // Fallback to default emoji if no suggestion
	} catch (error) {
		console.error("Error suggesting emoji:", error);
		return "⏷"; // Fallback to default emoji on error
	}
}

export async function POST({ request, url }) {
	const uid = url.searchParams.get("uid");

	const raw_memory = await request.json(); // Extract data from the request body

	console.log("🧠 raw_memory >>>>");

	console.log(raw_memory.length);

	// put data in supabase memories table

	// get emoji

	const emoji = await textToEmoji([raw_memory?.structured?.overview]);

	console.log("textToEmoji = ", emoji);

	const { data, error } = await supabase
		.from("memories")
		.insert([{ memory: raw_memory, uid: uid, emoji: emoji }])
		.select("*");

	if (error || !data) {
		console.log("🧠 error", error);
	}

	if (data) {
		console.log(`Memory added to supabase: ${data.length || null}`);
	}

	// decide if the conversation is boring

	// if it is boring then use

	return json({ statusCode: 201, data: "success", memory: data });
}
