import getHtml from "waterfall-fetch";
import * as cheerio from "cheerio";
import { URL } from "url";
import * as fs from "fs/promises";
import path from "path";

async function crawlWebsite(baseUrl: string): Promise<void> {
	const visitedUrls = new Set<string>();
	const urlsToVisit: string[] = [baseUrl];
	const domain = new URL(baseUrl).hostname;

	while (urlsToVisit.length > 0) {
		const currentUrl = urlsToVisit.pop();
		if (!currentUrl || visitedUrls.has(currentUrl)) continue;

		try {
			console.log(`Crawling: ${currentUrl}`);
			const page_response = await getHtml(currentUrl);
			if (!page_response || !page_response.html || page_response.status !== 200) {
				console.error(`Failed to load page: ${currentUrl}`);
				continue;
			}
			const $ = cheerio.load(page_response.html);

			// Save the content
			await saveContent(currentUrl, $.html());

			// Add new URLs to visit
			$("a").each((_, element) => {
				const href = $(element).attr("href");
				if (href) {
					const fullUrl = new URL(href, currentUrl).href;
					if (fullUrl.includes(domain) && !visitedUrls.has(fullUrl)) {
						urlsToVisit.push(fullUrl);
					}
				}
			});

			visitedUrls.add(currentUrl);
		} catch (error) {
			console.error(`Error crawling ${currentUrl}:`, error);
		}
	}

	console.log("Crawling completed");
}

async function saveContent(url: string, content: string): Promise<void> {
	const urlObj = new URL(url);
	const filePath = path.join("crawled_data", urlObj.hostname, urlObj.pathname);
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(`${filePath}.html`, content);
}

// Usage
crawlWebsite("https://pptr.dev/category/introduction");
