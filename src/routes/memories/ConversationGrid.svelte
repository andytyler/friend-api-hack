<script lang="ts">
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "$lib/components/ui/accordion";
	import PluginResponse from "./PluginResponse.svelte";
	import { textToEmoji } from "$lib/utils";

	export let data;

	$: recording = data.memory;
	$: showDetails = false;
	$: emoji = textToEmoji([recording.structured.emoji, recording.structured.title]);

	function toggleDetails() {
		showDetails = !showDetails;
	}

	onMount(() => {
		document.documentElement.classList.add("dark");
	});
</script>

<Card class="w-full min-w-[300px] bg-gray-800 text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 border-gray-700">
	<CardHeader>
		<div class="flex justify-between items-center">
			<CardTitle class="text-3xl font-bold text-emerald-400">{recording.structured.title}</CardTitle>
			<span class="text-5xl" transition:fade>{emoji}</span>
		</div>
		<Badge variant="secondary" class="mt-2 text-sm text-emerald-100 bg-emerald-700">
			{recording.structured.category}
		</Badge>
	</CardHeader>
	<CardContent>
		<p class="mb-6 leading-relaxed text-gray-300">{recording.structured.overview}</p>

		
	</CardContent>
</Card>

<style>
	:global(.dark) {
		color-scheme: dark;
	}
</style>
