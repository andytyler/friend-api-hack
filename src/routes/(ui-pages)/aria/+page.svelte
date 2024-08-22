<script lang="ts">
	import { onMount } from "svelte";
	import Vapi from "@vapi-ai/web";
	import { browser } from "$app/environment";
	import { marked } from "marked";

	let name = "";
	let loading = false; // Add loading state
	let call_active = false;
	let loading_article = false;

	const vapi = new Vapi("a550153d-a8ee-415f-8daa-f0745f383e82");

	async function startVapi() {
		loading = true; // Set loading state to true
		await vapi.start("19ac30e7-530f-4aa4-a797-cd8c0b67532f", {
			variableValues: {
				name,
			},
		});
		title = `Interview with ${name} & Alice`;
		loading = false; // Set loading state to false
		call_active = true;
		scrollToDiv("transcript");

		vapi.send({
			type: "add-message",
			message: {
				role: "system",
				content: `Interviewee name is "${name}". \n\n Please interview them about the following topic.\n  <topic>${topic}</topic>`,
			},
		});
	}

	// function say(message: string) {
	// 	vapi.send({
	// 		type: "add-message",
	// 		message: {
	// 			role: "system",
	// 			content: message,
	// 		},
	// 	});
	// }

	function scrollToDiv(id: string) {
		const element = document.getElementById(id); // Change to your target div ID
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	}

	let transcriptEg = {
		type: "transcript",
		role: "user",
		transcriptType: "final",
		transcript: "end call.",
	};

	let title = "";
	let topic = "";

	let messages: any[] = [];

	vapi.on("message", (message) => {
		console.log(message);
		messages = [...messages, message];
	});

	vapi.on("error", (e) => {
		console.error(e);
	});

	let final_article = "";

	async function endCall() {
		loading_article = true;
		vapi.stop();
		let justFinalMessages = messages.filter((message) => message.transcriptType === "final" && message.type === "transcript");
		let transcript = justFinalMessages.map((message) => message.transcript).join("\n");

		const response = await fetch("/api/gen-article", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ transcript }),
		});

		const res = await response.json();

		console.log(res.article);
		final_article = await marked(res.article);

		loading_article = false;
	}
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
			src="/aria.png"
			alt="Aria Iverson"
			class="object-contain absolute inset-0 w-full h-full bg-clip-content bg-gradient-to-b to-transparent mask-transparent from-black/0" />
	</div>

	<!-- Heading Text -->
	<div class="z-30 py-8 w-full max-w-3xl text-center drop-shadow-md mt-[450px]">
		<h1 class="mb-4 text-6xl font-extrabold text-foreground">
			Meet <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Aria Iverson</span>
			<br />Your in-house Journalist.
		</h1>
		<p class="mb-8 text-3xl drop-shadow-md text-background-foreground">10 min interview, to Human-grade press article.</p>

		{#if loading}
			<div class="flex justify-center items-center flex-row gap-2 loading-icon">
				<div class="w-4 h-4 rounded-full animate-pulse bg-secondary"></div>
				Loading...
			</div>
		{:else if !call_active}
			<div class="mb-4">
				<textarea
					rows="3"
					cols="30"
					bind:value={topic}
					placeholder="What would you like the article to be about?"
					class="px-4 mb-2 py-2 mr-2 w-full h-16 text-lg rounded-lg border-2 border-input focus:outline-none focus:border-ring" />
				<div class="flex flex-row">
					<input
						type="text"
						bind:value={name}
						placeholder="Enter your name"
						class="px-4 py-2 mr-2 w-full text-lg rounded-lg border-2 border-input focus:outline-none focus:border-ring" />
					{#if browser}
						<button
							on:click={startVapi}
							disabled={!name || name.length < 2}
							class="px-8 py-2 text-lg font-semibold text-nowrap bg-gradient-to-r rounded-lg transition duration-300 text-secondary-foreground from-secondary to-accent hover:from-secondary/90 hover:to-accent/90">
							{loading ? "Loading..." : "Start Interview"}
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if call_active}
		{#if messages.length > 0}
			<section id="transcript" class=" my-4 w-full max-w-3xl rounded-lg border shadow-lg bg-card border-border">
				<!-- headder -->
				<div class="flex justify-between p-4 bg-background rounded-lg border-b-1 border-border w-full">
					<h2 class="flex text-2xl font-bold text-left text-card-foreground">{title}</h2>

					<div class="flex justify-end">
						<span class="inline-flex items-center px-3 py-1 text-xs font-medium capitalize rounded-full text-primary-foreground bg-primary">
							<div class="w-4 h-4 mr-2 rounded-full animate-pulse capitalize bg-secondary-foreground"></div>
							Interview in Progress
						</span>
						<!-- <button on:click={() => say("say Chicken Nugget")}>End Call</button> -->
					</div>
				</div>

				<!-- content -->
				<div class="flex flex-col gap-2 w-full p-4">
					{#each messages as message}
						{#if message.type === "transcript" && message.transcriptType === "final"}
							{#if message.role === "user"}
								<div class="self-end p-2 w-1/2 max-w-max rounded-lg border max-w-2/3 text-accent-foreground bg-accent border-border">
									{message.transcript}
								</div>
							{/if}
							{#if message.role === "assistant"}
								<div class="self-start p-2 w-1/2 max-w-max rounded-lg border max-w-2/3 text-card-foreground bg-card border-border">
									{message.transcript}
								</div>
							{/if}
							{#if message.role === "tool"}
								<div class="self-center p-2 w-1/2 max-w-max rounded-lg border max-w-2/3 text-card-foreground bg-card border-border">
									{message.transcript}
								</div>
							{/if}
						{/if}
					{/each}
				</div>
			</section>
		{/if}
	{/if}
	{#if call_active}
		<div class="max-w-3xl flex flex-col mb-4 justify-between w-full border border-border rounded-lg p-4 bg-card text-card-foreground">
			<button
				class="w-full rounded-lg p-4 bg-gradient-to-br from-accent to-secondary text-accent-foreground hover:from-secondary hover:to-accent active:from-secondary/90 active:to-accent/90"
				on:click={endCall}>{loading_article ? "Generating Article..." : "End Call"}</button>
			{#if final_article && final_article.length > 0}
				<article class="w-full">
					{@html final_article}
				</article>
			{/if}
		</div>
	{/if}
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
