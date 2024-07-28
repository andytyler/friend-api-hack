<script>
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	export let data;

	console.log("INDIVIDUAL MEM + ", data);

	let recording = data.memory;
	let showDetails = false;

	function toggleDetails() {
		showDetails = !showDetails;
	}

	onMount(() => {
		// Any initialization logic can go here
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8">
	<div class="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
		<div class="p-8">
			<div class="flex items-center justify-between mb-6">
				<h1 class="text-4xl font-bold text-gray-800">{recording.structured.title}</h1>
				<span class="text-6xl">{recording.structured.emoji}</span>
			</div>

			<div class="mb-6">
				<span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
					{recording.structured.category}
				</span>
			</div>

			<p class="text-gray-600 mb-6">{recording.structured.overview}</p>

			<button on:click={toggleDetails} class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300">
				{showDetails ? "Hide Details" : "Show Details"}
			</button>
		</div>

		{#if showDetails}
			<div transition:fade={{ duration: 300 }} class="bg-gray-100 p-8">
				<h2 class="text-2xl font-semibold mb-4">Action Items</h2>
				<ul class="list-disc list-inside mb-6">
					{#each recording.structured.actionItems as item}
						<li class="text-gray-700">{item}</li>
					{/each}
				</ul>

				<h2 class="text-2xl font-semibold mb-4">Plugin Responses</h2>
				{#each recording.pluginsResponse as response}
					<div class="bg-white p-4 rounded-lg shadow mb-4">
						<p class="text-gray-800">{response}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
