import { supabase } from "$lib/supabase";

export async function load() {
	const { data } = await supabase.from("memories").select();
	return {
		memories: data ?? [],
	};
}
