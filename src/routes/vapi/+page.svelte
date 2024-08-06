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
				content: `I am interviewing a person named "${name}"`,
			},
		});
	}

	export let data;
	let name = "Your Name";
</script>

<div class="fixed inset-0 z-[-1] overflow-hidden w-full h-full bg-background">
	<!-- Animated gradient background -->

	<!-- SVG overlay -->
	<!-- <div class="z-10 w-full h-full bg-black" style="background-image: url('/grid.svg'); background-repeat: repeat;"></div> -->
	<div class="flex absolute inset-0 z-20 justify-center items-center mx-auto mt-32 w-2/3 h-2/3 opacity-30 blur-3xl bg-gradient-radial animate-gradient-x">
	</div>

	<!-- Grid background with fading edges -->
	<div class="z-10 w-full h-full bg-[url('/grid.svg')] bg-repeat bg-[length:48px_48px] bg-background relative">
		<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--background)_80%,_var(--background)_100%)]"></div>
	</div>
</div>

<main class="flex flex-col justify-center items-center min-h-screen">
	<div class="absolute -inset-y-20 w-2/3 h-2/3 x-auto">
		<img src="/alice.png" alt="Alice Bethbeau" class="object-contain absolute inset-0 w-full h-full" />
	</div>
	<div class="z-30 p-8 pt-64 w-full max-w-3xl text-center">
		<h1 class="mb-6 text-6xl font-bold text-foreground">
			Meet
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Alice Bethbeau</span>
		</h1>
		<p class="mb-16 text-xl text-muted-foreground">Your in-house journalist.</p>

		<div class="mb-8">
			<input
				type="text"
				bind:value={name}
				placeholder="Enter your name"
				class="px-4 py-2 mr-2 text-lg rounded-lg border-2 border-input focus:outline-none focus:border-ring" />
			<button on:click={addName} class="px-6 py-2 text-lg rounded-lg transition duration-300 text-primary-foreground bg-primary hover:bg-primary/90">
				Set Name
			</button>
		</div>

		{#if browser}
			<button
				on:click={startVapi}
				class="px-8 py-3 text-xl font-semibold bg-gradient-to-r rounded-lg transition duration-300 text-secondary-foreground from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
				Start Interview
			</button>
		{/if}
	</div>

	<section class="p-8 mt-12 w-full max-w-3xl rounded-lg shadow-lg bg-card">
		<h2 class="mb-6 text-3xl font-bold text-center text-card-foreground">Interview Highlights</h2>
		{#if data?.highlights && data?.highlights.length > 0}
			<ul class="space-y-2">
				{#each data.highlights as highlight}
					<li class="p-3 text-lg rounded-lg text-muted-foreground bg-accent">{highlight}</li>
				{/each}
			</ul>
		{:else}
			<p class="text-lg text-center text-muted-foreground">No highlights available yet. Start your interview to see results!</p>
		{/if}
	</section>
</main>

<style>
	:global(.bg-gradient-radial) {
		background-image: radial-gradient(at 27% 37%, #3a8bfd 0, transparent 0), radial-gradient(at 97% 21%, #e772fe 0, transparent 50%),
			radial-gradient(at 52% 99%, #3a44fd 0, transparent 50%), radial-gradient(at 10% 29%, #855afc 0, transparent 50%),
			radial-gradient(at 97% 96%, #b2127d 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%),
			radial-gradient(at 79% 53%, rgb(141, 5, 169) 0, transparent 50%);
	}
</style>
