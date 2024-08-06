<script lang="ts">
	import { onMount } from "svelte";
	import Vapi from "@vapi-ai/web";
	import { browser } from "$app/environment";
	const vapi = new Vapi("a550153d-a8ee-415f-8daa-f0745f383e82");
	function startVapi() {
		vapi.start("19ac30e7-530f-4aa4-a797-cd8c0b67532f");
	}
	function addName() {
		vapi.send({
			type: "add-message",
			message: {
				role: "system",
				content: `You are interviewing a person named "${name}"`,
			},
		});
	}

	export let data;
	let name = "John Doe";
</script>

<div class="fixed inset-0 z-[-1] overflow-hidden w-full h-full bg-black">
	<!-- Animated gradient background -->
	<div class="flex absolute inset-0 justify-center items-center mx-auto mt-32 w-1/2 h-1/2 opacity-40 blur-3xl bg-gradient-radial animate-gradient-x"></div>

	<!-- SVG overlay -->
	<!-- <div class="z-10 w-full h-full bg-black" style="background-image: url('/grid.svg'); background-repeat: repeat;"></div> -->

	<!-- <div class="z-10 w-full h-full" style="background-image: url('/grid.svg'); background-repeat: repeat;"></div> -->
	<div class="z-10 w-64 h-64 bg-[url('/grid.svg')] bg-repeat"></div>
</div>

<main class="flex flex-col justify-center items-center min-h-screen">
	<div class="p-8 w-full max-w-3xl text-center">
		<h1 class="mb-6 text-5xl font-bold text-gray-100">
			Discover & Share
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500"> AI-Powered Interviews </span>
		</h1>
		<p class="mb-8 text-xl text-gray-600">
			AwesomeStartup is revolutionizing interviews with cutting-edge AI technology. Supercharge your conversations with Vapi.
		</p>

		<div class="mb-8">
			<input
				type="text"
				bind:value={name}
				placeholder="Enter your name"
				class="px-4 py-2 mr-2 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
			<button on:click={addName} class="px-6 py-2 text-lg text-white bg-blue-500 rounded-lg transition duration-300 hover:bg-blue-600"> Set Name </button>
		</div>

		{#if browser}
			<button
				on:click={startVapi}
				class="px-8 py-3 text-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg transition duration-300 hover:from-purple-600 hover:to-blue-600">
				Start Interview
			</button>
		{/if}
	</div>

	<section class="p-8 mt-12 w-full max-w-3xl bg-white rounded-lg shadow-lg">
		<h2 class="mb-6 text-3xl font-bold text-center text-gray-800">Interview Highlights</h2>
		{#if data?.highlights && data?.highlights.length > 0}
			<ul class="space-y-2">
				{#each data.highlights as highlight}
					<li class="p-3 text-lg text-gray-700 bg-gray-100 rounded-lg">{highlight}</li>
				{/each}
			</ul>
		{:else}
			<p class="text-lg text-center text-gray-500">No highlights available yet. Start your interview to see results!</p>
		{/if}
	</section>
</main>

<style>
	:global(.bg-gradient-radial) {
		background-image: radial-gradient(at 27% 37%, #3a8bfd 0, transparent 0), radial-gradient(at 97% 21%, #72fe7d 0, transparent 50%),
			radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #855afc 0, transparent 50%),
			radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%),
			radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%);
	}
</style>
