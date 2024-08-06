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
		console.log("|🧠  MEMORIES RECIEVED = ", data.length);
		console.log("|🧠  MEMORIES RECIEVED = ", data);
	}

	return {
		memories: data,
	};
}
