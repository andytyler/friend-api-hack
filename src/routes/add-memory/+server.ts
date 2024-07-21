import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const data = await request.json(); // Extract data from the request body

	console.log(data);
	// console.log(data.body);
	// Process the data (e.g., save to a database)
	// For demonstration, we'll just return the received data
	return json({ message: "Data received", data });
}
