import { supabase } from "$lib/supabase";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const raw_memory = await request.json(); // Extract data from the request body

	console.log(raw_memory);

	// put data in supabase memories table
	const { data, error } = await supabase.from("memories").insert([
		{
			memory: raw_memory,
		},
	]);

	console.log(`Memory added to supabase: ${data || null}`);

	// decide if the conversation is boring

	// if it is boring then use

	return json({ message: "Data received", data });
}
