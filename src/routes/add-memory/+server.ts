import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const data = await request.json(); // Extract data from the request body

	console.log(data);

	// log to Supabase

	// decide if the conversation is boring

	// if it is boring then use 

	return json({ message: "Data received", data });
}
