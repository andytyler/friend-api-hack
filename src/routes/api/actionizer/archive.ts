import * as cheerio from "cheerio";
import getHtml from "waterfall-fetch";
// Import Groq at the top of the file
import Groq from "groq-sdk";
import { env } from "$env/dynamic/private";

interface PageData {
	url: string;
	html?: string;
}

let elementCounter = 0;

function processElement($: cheerio.CheerioAPI, element: cheerio.Element, depth: number = 0): string {
	const $elem = $(element);
	const indent = "  ".repeat(depth);
	const tagName = element.tagName.toLowerCase();
	const text = $elem.text().trim().replace(/\s+/g, " ");
	let output = "";

	const elementId = `e${elementCounter++}`;
	$(element).attr("data-element-id", elementId);

	const getLabel = () => $elem.attr("aria-label") || $elem.attr("title") || text;
	const label = getLabel();

	const addAction = (action: string) => ($elem.is('a, button, [role="button"]') ? ` (${action})` : "");

	switch (tagName) {
		case "header":
			output += `${indent}## [HEADER ${elementId}]\n`;
			break;
		case "nav":
			output += `${indent}### [NAVIGATION ${elementId}]\n`;
			$elem.find("a").each((_, link) => {
				const $link = $(link);
				const childId = `e${elementCounter++}`;
				const linkText = $link.text().trim();
				const href = $link.attr("href");
				if (linkText) {
					output += `${indent}  - [${linkText}](${href}) [${childId}]\n`;
				}
			});
			return output;
		case "main":
		case "article":
			output += `${indent}# [MAIN CONTENT ${elementId}]\n`;
			break;
		case "aside":
			output += `${indent}### [SIDEBAR ${elementId}]\n`;
			break;
		case "footer":
			output += `${indent}## [FOOTER ${elementId}]\n`;
			$elem.children().each((_, child) => {
				const $child = $(child);
				const childId = `e${elementCounter++}`;
				const childLabel = $child.attr("aria-label") || $child.attr("title") || $child.text().trim();
				if (childLabel) {
					output += `${indent}  - ${childLabel} [${childId}]\n`;
				}
			});
			return output;
		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
			const headerLevel = parseInt(tagName[1]) + 1;
			output += `${indent}${"#".repeat(headerLevel)} ${label} [${elementId}]${addAction("Click")}\n`;
			break;
		case "a":
			output += `${indent}- [${label}](${$elem.attr("href")}) [${elementId}]\n`;
			break;
		case "button":
			output += `${indent}- [BUTTON ${elementId}] ${label}${addAction("Click")}\n`;
			break;
		case "input":
			const inputType = $elem.attr("type") || "text";
			const placeholder = $elem.attr("placeholder") || "";
			output += `${indent}- [INPUT:${inputType.toUpperCase()} ${elementId}] ${placeholder || label}\n`;
			break;
		case "img":
			output += `${indent}![${$elem.attr("alt") || "Image"}](${$elem.attr("src")}) [${elementId}]\n`;
			break;
		case "ul":
		case "ol":
			output += `${indent}[LIST ${elementId}]\n`;
			break;
		case "li":
			output += `${indent}- ${label} [${elementId}]\n`;
			break;
		case "p":
			if (text.length > 100) {
				output += `${indent}${text.substring(0, 100)}... [${elementId}]\n`;
			} else {
				output += `${indent}${text} [${elementId}]\n`;
			}
			break;
		case "form":
			output += `${indent}[FORM ${elementId}] ${label}\n`;
			break;
		default:
			if ($elem.children().length > 0) {
				if (label && label !== text) {
					output += `${indent}### [SECTION ${elementId}] ${label}${addAction("Interact")}\n`;
				}
			} else if (label) {
				output += `${indent}- ${label} [${elementId}]${addAction("Interact")}\n`;
			}
	}

	$elem.children().each((_, child) => {
		output += processElement($, child, depth + 1);
	});

	return output;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: PageData = await request.json();
		let output = `[URL] ${body.url}\n`;

		const html = body.html || (await getHtml(body.url, { set: "js" })).html;
		console.log("html", html?.substring(0, 100));
		if (html) {
			const $ = cheerio.load(html);
			$("script, style, noscript").remove();
			output += processElement($, $("HTML")[0]);
		} else {
			output += "[ERROR] No HTML content available\n";
		}

		// console.log("output", output.substring(0, 100));

		// const groq = new Groq({ apiKey: env.GROQ_API_KEY });

		// console.log("consulting groq...");
		// const task = "Click the button that says 'Sign in' and then fill in the username and password fields.";

		// const completion = await groq.chat.completions.create({
		// 	messages: [
		// 		{
		// 			role: "system",
		// 			content: `You are an AI assistant that generates pure JavaScript code to perform actions in a browser environment.
		// 			You are gien a simplified version of the html.
		// 			return BOTH the e ids of the elements that you need to interact with,
		// 			AND the steps that you need to do as a human would to interact with them,
		// 			where to click, what to type etc.

		// 			TASK: ${task}`,
		// 		},
		// 		{
		// 			role: "user",
		// 			content: `${output}`,
		// 		},
		// 	],
		// 	model: "mixtral-8x7b-32768",
		// 	temperature: 0.5,
		// 	max_tokens: 1024,
		// });

		// const generatedCode = completion.choices[0]?.message?.content || "// No code generated";

		// output += "\n\n[GENERATED_CODE]\n" + generatedCode;

		return new Response(output);
	} catch (error) {
		return new Response(`[ERROR] ${error}\n`, { status: 500 });
	}
};

// function findElementById($: cheerio.CheerioAPI, id: string): cheerio.Cheerio | null {
// 	let foundElement: cheerio.Cheerio | null = null;

// 	function traverse(element: cheerio.Element) {
// 		const $elem = $(element);
// 		if ($elem.attr("data-element-id") === id) {
// 			foundElement = $elem;
// 			return;
// 		}

// 		$elem.children().each((_, child) => {
// 			if (!foundElement) {
// 				traverse(child);
// 			}
// 		});
// 	}

// 	traverse($("body")[0]);
// 	return foundElement;
// }
