<script lang="ts">
	import { onMount } from "svelte";
	import Vapi from "@vapi-ai/web";
	import { browser } from "$app/environment";

	const vapi = new Vapi("a550153d-a8ee-415f-8daa-f0745f383e82");

	async function startVapi() {
		await vapi.start("19ac30e7-530f-4aa4-a797-cd8c0b67532f");
		addName();
		title = `Interview with ${name} & Alice`;
	}

	function addName() {
		vapi.send({
			type: "add-message",
			message: {
				role: "tool",
				content: `Alice is interviewing a person named "${name}"`,
			},
		});
	}

	let transcriptEg = {
		type: "transcript",
		role: "user",
		transcriptType: "final",
		transcript: "end call.",
	};

	export let data;
	let name = "Your Name";

	let title = "";

	let messages: any[] = [];

	vapi.on("message", (message) => {
		console.log(message);
		messages = [...messages, message];
	});

	vapi.on("error", (e) => {
		console.error(e);
	});
</script>

<!-- Background -->
<div class="absolute inset-0 z-[-1] overflow-hidden w-full h-full bg-background">
	<!-- Milti Gradient -->
	<div class="flex absolute inset-0 z-20 justify-center items-center mx-auto w-2/3 h-2/3 opacity-30 blur-3xl bg-gradient-radial animate-gradient-x"></div>

	<!-- Grid SVG Background -->
	<div class="z-10 w-full h-full bg-[url('/grid.svg')] bg-repeat bg-[length:48px_48px] bg-background relative">
		<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--background)_80%,_var(--background)_100%)]"></div>
	</div>
</div>

<main class="flex flex-col justify-center items-center min-h-screen">
	<!-- Alice Image -->
	<div class="absolute -inset-y-20 w-2/3 h-full drop-shadow-md x-auto">
		<img
			src="/alice.png"
			alt="Alice Bethbeau"
			class="object-contain absolute inset-0 w-full h-full bg-clip-content bg-gradient-to-b to-transparent mask-transparent from-black/0" />
	</div>

	<!-- Slash Text -->
	<div class="z-30 p-8 w-full max-w-3xl text-center drop-shadow-md mt-[450px]">
		<h1 class="mb-4 text-6xl font-bold text-foreground">
			Meet
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Alice Bethbeau</span>
			Your in-house Journalist.
		</h1>
		<p class="mb-8 text-2xl drop-shadow-md text-background-foreground">10 min interview, to Human grade press article.</p>

		<div class="mb-8">
			<input
				type="text"
				bind:value={name}
				placeholder="Enter your name"
				class="px-4 py-2 mr-2 text-lg rounded-lg border-2 border-input focus:outline-none focus:border-ring" />
			{#if browser}
				<button
					on:click={startVapi}
					class="px-8 py-2 text-lg font-semibold bg-gradient-to-r rounded-lg transition duration-300 text-secondary-foreground from-secondary to-accent hover:from-secondary/90 hover:to-accent/90">
					Start Interview
				</button>
			{/if}
		</div>
	</div>

	{#if messages.length > 0}
		<section id="transcript" class="p-4 mt-12 w-full max-w-3xl rounded-lg border shadow-lg bg-card border-border">
			<div class="flex justify-between mb-6 w-full">
				<h2 class="flex text-2xl font-bold text-left text-card-foreground">{title}</h2>

				<div class="flex justify-end">
					<div class="w-2 h-2 rounded-full animate-pulse bg-secondary"></div>
					<span class="inline-flex items-center px-3 py-1 text-xs font-medium capitalize rounded-full text-accent-foreground bg-accent">
						Interview in Progress
					</span>
				</div>
			</div>

			<div class="flex flex-col gap-2 w-full">
				{#each messages as message}
					{#if message.type === "transcript" && message.transcriptType === "final"}
						{#if message.role === "user"}
							<div class="justify-end p-2 w-1/2 min-w-max rounded-lg border max-w-2/3 text-accent-foreground bg-accent border-border">
								{message.transcript}
							</div>
						{/if}
						{#if message.role === "assistant"}
							<div class="justify-start p-2 w-1/2 min-w-max rounded-lg border max-w-2/3 text-card-foreground bg-card border-border">
								{message.transcript}
							</div>
						{/if}
						{#if message.role === "tool"}
							<div class="justify-center p-2 w-1/2 min-w-max rounded-lg border max-w-2/3 text-card-foreground bg-card border-border">
								{message.transcript}
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		</section>
	{/if}

	<!-- <section class="p-8 mt-12 w-full max-w-3xl rounded-lg shadow-lg bg-card">
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
	</section> -->
</main>

<style>
	.mask-transparent {
		mask-image: linear-gradient(rgb(0 0 0 / 100%) 60%, transparent 80%);
	}

	:global(.bg-gradient-radial) {
		background-image: radial-gradient(at 27% 37%, #3afd3d 0, transparent 0), radial-gradient(at 97% 21%, #0b5f11 0, transparent 50%),
			radial-gradient(at 52% 99%, #7efd3a 0, transparent 50%), radial-gradient(at 10% 29%, #d2d607 0, transparent 50%),
			radial-gradient(at 97% 96%, #b2af12 0, transparent 50%), radial-gradient(at 33% 50%, #67e308 0, transparent 50%),
			radial-gradient(at 79% 53%, rgb(237, 247, 41) 0, transparent 50%);
	}
	:global(.animate-gradient-x) {
		animation: gradient-x 2s linear infinite;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	:global(.animate-pulse) {
		animation: pulse 1s linear infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
