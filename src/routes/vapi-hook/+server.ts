import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
	console.log("VAPI hook received");

	return new Response();
};
