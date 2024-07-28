import { supabase } from "$lib/supabase";

export async function load() {
	const { data, error } = await supabase.from("memories").select("*");

	if (error || !data) {
		console.error("Error fetching memories:", error);
		return {
			memories: [],
		};
	}

	if (data) {
		console.log("🧠 memories FETCHED >> ", data);
	}

	return {
		memories: data,
	};
}
