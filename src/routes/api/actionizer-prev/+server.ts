import type { RequestHandler } from "./$types";
import Groq from "groq-sdk";
import { config } from "dotenv";
import getHtml from "waterfall-fetch";
import * as cheerio from "cheerio";

config();

const CLICKABLE_SELECTORS = [
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

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const { url } = await request.json();
	console.log("Processing URL:", url);

	try {
		const response = await getHtml(url);
		if (!response?.html || response.status !== 200) {
			throw new Error(`Failed to load page: ${url}`);
		}

		const $ = cheerio.load(response.html);
		const clickableElements = findClickableElements($);

		return new Response(JSON.stringify({ clickableElements }), {
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		});
	} catch (error) {
		console.error("Error processing request:", error);
		return new Response(JSON.stringify({ error: "Failed to process request" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

function findClickableElements($: cheerio.CheerioAPI): any[] {
	try {
		return $("body")
			.children()
			.map((_, element) => processElement($, element))
			.get()
			.filter(Boolean);
	} catch (error) {
		console.error("Error finding clickable elements:", error);
		return [];
	}
}

function processElement($: cheerio.CheerioAPI, element: any): any {
	const elem = $(element);
	const elementInfo = getElementInfo($, elem);

	const children = elem
		.children()
		.filter((_, child) => isVisible($, child))
		.map((_, child) => processElement($, child))
		.get()
		.filter(Boolean);

	const isActionable = CLICKABLE_SELECTORS.some((selector) => elem.is(selector));

	return {
		...elementInfo,
		isActionable,
		children: children.length > 0 ? children : undefined,
	};
}

function getElementInfo($: cheerio.CheerioAPI, elem: any): any {
	const elementInfo: any = {};

	const allAttributes = elem.attr() || {};

	const desiredAttributes = ["id", "class", "href", "src", "alt", "title", "type", "name", "value", "placeholder", "aria-label", "data-*"];

	for (const attr in allAttributes) {
		if (desiredAttributes.includes(attr) || attr.startsWith("data-")) {
			elementInfo[attr] = allAttributes[attr];
		}
	}
	elementInfo.tagName = elem.prop("tagName")?.toLowerCase();
	elementInfo.text = elem.text().trim() || undefined;

	if (["input", "textarea"].includes(elementInfo.tagName)) {
		elementInfo.value = elem.val() || undefined;
	} else if (elementInfo.tagName === "select") {
		const options = elem
			.find("option")
			.map((_: any, option: any) => ({
				value: $(option).val(),
				text: $(option).text().trim(),
				selected: $(option).is(":selected"),
			}))
			.get();

		if (options.length) elementInfo.options = options;
	}

	return elementInfo;
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
