import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
	// const response = await fetch(`/api/some-endpoint/${params.id}`);
	// const data = await response.json();

	const data = {
		status: "in progress",
		highlights: ["test", "test", "test"],
		article: "",
		interview: "",
	};

	return {
		data,
	};
};



