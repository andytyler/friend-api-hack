import type { RequestHandler } from "./$types";
import Groq from "groq-sdk";
import { config } from "dotenv";
import getHtml from "waterfall-fetch";
import * as cheerio from "cheerio";

config();

import { OpenAI } from "openai";
import { env } from "$env/dynamic/private"; // this only works in a server side file because it is private.

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: env.GROQ_API_KEY });

let CRUTON = "CRUTON"; // Node.ts Swarms of AI agents, written in NODE!!!!!
let systemPrompt = "you are a researcher.";
let userPrompt = `I want to write a blog article.`;

// you have the researcher and the step planner.
// these personas are then given as tools to a tool enabled LLM.
// these personas have tools themseves that they can use, they are also gien the ability to call each other.

// this is a rudimental version of the spoke and wheel model.

// the nesting and hierachy of the clickable items is important.

// ===============  ===============  ================  ===========  ===============

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
// Main function that will be called by the client

// const groqResponse = await groq.chat.completions.create({
// 	model: "llama3-8b-8192",
// 	messages: [
// 		{
// 			role: "system",
// 			content: systemPrompt,
// 		},
// 		{
// 			role: "user",
// 			content: userPrompt,
// 		},
// 	],
// });

// const openaiResponse = await openai.chat.completions.create({
// 	model: "gpt-4o",
// 	max_tokens: 4096,
// 	messages: [
// 		{
// 			role: "system",
// 			content: systemPrompt,
// 		},
// 		{
// 			role: "user",
// 			content: userPrompt,
// 		},
// 	],
// });

// console.log(openaiResponse.choices[0]?.message?.content || ""); // visibility logging
// const responseMessage = `${openaiResponse.choices[0]?.message?.content || ""}`; // Your server-side function logic

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const { url } = await request.json();

	try {
		const response = await getHtml(url);
		if (!response || !response.html || response.status !== 200) {
			throw new Error(`Failed to load page: ${url}`);
		}

		const $ = cheerio.load(response.html);
		const clickableElements = findClickableElements($);

		return new Response(JSON.stringify({ clickableElements }), {
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		});
	} catch (error) {
		console.error("Error fetching HTML:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch HTML" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

function findClickableElements($: cheerio.CheerioAPI): any[] {
	try {
		const selectors = [
			"a[href]",
			"button",
			'[role="button"]',
			'input[type="submit"]',
			'input[type="button"]',
			'input[type="reset"]',
			"[onclick]",
			"label[for]",
			"select",
			"textarea",
			'input:not([type="hidden"])',
			"summary",
			'div[role="button"]',
			'span[role="button"]',
			"img[usemap]",
			"area[href]",
		];

		return $(selectors.join(", "))
			.filter((_, element) => isVisible($, element))
			.map((_, element) => {
				const elem = $(element);
				const elementInfo = getElementInfo(elem);
				const parentInfo = getParentInfo(elem, 6); // Get 3 levels of parent info

				return {
					...elementInfo,
					parents: parentInfo,
				};
			})
			.get();
	} catch (error) {
		console.error("Error finding clickable elements:", error);
		return [];
	}
}

function getElementInfo(elem: any): any {
	const ariaAttributes: Record<string, string> = {};
	const el = elem.get(0);
	if (el && "attribs" in el) {
		Object.entries(el.attribs).forEach(([attr, value]) => {
			if (attr.startsWith("aria-") && typeof value === "string") {
				ariaAttributes[attr] = value;
			}
		});
	}

	// Remove empty properties from element info
	const elementInfo: Record<string, any> = {};
	["tagName", "text", "alt", "title", "href", "id", "role", "type", "onclick", "name", "placeholder", "value", "for"].forEach((key) => {
		const value = elem.prop(key) || elem.attr(key) || "";
		if (value !== "") {
			elementInfo[key] = key === "text" ? value.trim() : value;
		}
	});

	// Add non-empty aria attributes
	if (Object.keys(ariaAttributes).length > 0) {
		elementInfo.ariaAttributes = ariaAttributes;
	}

	return elementInfo;
	// return {
	// 	tagName: elem.prop("tagName") || "",
	// 	text: elem.text().trim() || "",
	// 	alt: elem.attr("alt") || "",
	// 	title: elem.attr("title") || "",
	// 	href: elem.attr("href") || "",
	// 	class: elem.attr("class") || "",
	// 	id: elem.attr("id") || "",
	// 	role: elem.attr("role") || "",
	// 	type: elem.attr("type") || "",
	// 	onclick: elem.attr("onclick") || "",
	// 	name: elem.attr("name") || "",
	// 	placeholder: elem.attr("placeholder") || "",
	// 	value: elem.attr("value") || "",
	// 	for: elem.attr("for") || "",
	// 	ariaAttributes: ariaAttributes,
	// };
}

function getParentInfo(elem: any, depth: number): any[] {
	const parents = [];
	let currentElement = elem;

	for (let i = 0; i < depth; i++) {
		const parent = currentElement.parent();
		if (!parent || !parent.length) break; // Stop if there's no parent or if the parent is not an element

		const parentInfo = {
			tagName: parent.prop("tagName") || "",
			text: parent.text(), // Limit text to 100 characters
			alt: parent.attr("alt") || "",
			id: parent.attr("id") || "",
			// class: parent.attr("class") || "",
			role: parent.attr("role") || "",
			ariaLabel: parent.attr("aria-label") || "",
			title: parent.attr("title") || "",
			name: parent.attr("name") || "",
			type: parent.attr("type") || "",
			placeholder: parent.attr("placeholder") || "",
		};

		// Remove empty properties
		Object.keys(parentInfo).forEach((key) => {
			if (parentInfo[key as keyof typeof parentInfo] === "" || parentInfo[key as keyof typeof parentInfo] === undefined) {
				delete parentInfo[key as keyof typeof parentInfo];
			}
		});

		// Break if we have found a meaningful text description
		const minDescriptionLength = 10;

		if (
			(parentInfo.text && parentInfo.text.length >= minDescriptionLength) ||
			(parentInfo.alt && parentInfo.alt.length >= minDescriptionLength) ||
			(parentInfo.ariaLabel && parentInfo.ariaLabel.length >= minDescriptionLength) ||
			(parentInfo.title && parentInfo.title.length >= minDescriptionLength)
		) {
			break;
		}

		parents.push(parentInfo);
		currentElement = parent;
	}

	return parents;
}

function isVisible($: cheerio.CheerioAPI, element: any): boolean {
	const elem = $(element);
	return (
		elem.css("display") !== "none" &&
		elem.css("visibility") !== "hidden" &&
		elem.css("opacity") !== "0" &&
		elem.attr("width") !== "0" &&
		elem.attr("height") !== "0"
	);
}
