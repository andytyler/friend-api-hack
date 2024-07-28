<script lang="ts">
	import { onMount } from "svelte";
	import Vapi from "@vapi-ai/web";
	import { browser } from "$app/environment";
	const vapi = new Vapi("a550153d-a8ee-415f-8daa-f0745f383e82");
	function startVapi() {
		vapi.start("19ac30e7-530f-4aa4-a797-cd8c0b67532f");
	}
</script>

<main class="h-screen flex flex-col justify-center items-center p-20">
	<div class="content text-center">
		<img src="/logo.png" alt="AwesomeStartup Logo" class="logo w-100 h-auto mb-20" />
		<h1 class="text-2xl mb-10 text-blue-600">Welcome to <span class="highlight text-blue-600">AwesomeStartup</span></h1>
		<p class="text-lg text-gray-600">Revolutionizing the future with cutting-edge technology</p>
		{#if browser}
			<button class="start-vapi-btn bg-blue-600 text-white px-20 py-10 rounded-20 cursor-pointer hover:bg-blue-500" on:click={startVapi}
				>Start Vapi</button>
		{/if}
	</div>
</main>
