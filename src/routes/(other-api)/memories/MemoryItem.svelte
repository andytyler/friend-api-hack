<script lang="ts">
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "$lib/components/ui/accordion";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { Tooltip, TooltipContent, TooltipTrigger } from "$lib/components/ui/tooltip";
	import PluginResponse from "./PluginResponse.svelte";

	export let data;

	$: memory = data.memory;
	$: showDetails = false;

	function toggleDetails() {
		showDetails = !showDetails;
	}

	onMount(() => {
		document.documentElement.classList.add("dark");
	});
</script>

<Card
	class="w-full min-w-[300px] bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 overflow-hidden group">
	<CardHeader class="pb-2">
		<div class="flex gap-2 justify-between items-start">
			<Tooltip>
				<TooltipTrigger>
					<span class="text-4xl cursor-help" transition:fade>{data.emoji}</span>
				</TooltipTrigger>
				<TooltipContent>
					<p>Memory Emoji</p>
				</TooltipContent>
			</Tooltip>
			<CardTitle class="text-2xl font-bold text-left text-emerald-400 transition-colors duration-300 group-hover:text-emerald-300"
				>{memory.structured.title}</CardTitle>
		</div>
		<Badge variant="secondary" class="mt-2 w-16 min-w-min text-sm text-emerald-100 transition-colors duration-300 bg-emerald-700/50 hover:bg-emerald-700">
			{memory.structured.category}
		</Badge>
	</CardHeader>
	<CardContent class="pt-2">
		<p class="mb-4 leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-gray-100 line-clamp-3">{memory.structured.overview}</p>
	</CardContent>
	<CardFooter class="flex relative justify-between items-center pt-2">
		<Button variant="outline" class="text-emerald-400 border-emerald-400 transition-colors duration-300 hover:bg-emerald-400 hover:text-gray-900">
			Explore Memory
		</Button>
		<div class="absolute right-2 bottom-2 text-xs opacity-50 transition-opacity duration-300 group-hover:opacity-100" transition:fade>{data.uid}</div>
	</CardFooter>
</Card>

<style>
	:global(.dark) {
		color-scheme: dark;
	}
</style>
