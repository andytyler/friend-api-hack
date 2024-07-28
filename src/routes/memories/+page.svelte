<script>
	import MemoryDetailsSheet from "./MemoryDetailsSheet.svelte";

	import MemoryItem from "./ConversationGrid.svelte";
	import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "$lib/components/ui/sheet";
	import { Button } from "$lib/components/ui/button";
	import PluginResponse from "./PluginResponse.svelte";
	export let data;

	let selectedMemory = null;
	let isOpen = false;

	/**
	 * @param {{ memory: { structured: { title: any; overview: any; category: any; actionItems: any; events: any; }; transcript: any; pluginsResponse: string | any[]; }; createdAt: string | number | Date; } | null} memory
	 */
	function openSidePanel(memory) {
		selectedMemory = memory;
		isOpen = true;
	}
</script>

<div class="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
	<div class="mx-auto max-w-7xl">
		<h1 class="mb-8 text-4xl font-bold text-emerald-400">Memories</h1>
		<h2 class="mt-8 text-3xl font-semibold text-emerald-300">Our Journey</h2>
		<p class="mb-4 text-lg text-gray-200">Explore the memories that shape our story and drive our mission forward.</p>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#if data?.memories?.length > 0}
				{#each data.memories as memory}
					<div on:click={() => openSidePanel(memory)}>
						<MemoryItem data={memory} />
					</div>
				{/each}
			{:else}
				<p class="col-span-full text-2xl font-bold text-center text-gray-300">No memories found</p>
			{/if}
		</div>
		<MemoryDetailsSheet {selectedMemory} {isOpen} on:close={() => (isOpen = false)} />
	</div>
</div>

<style>
	:global(body) {
		background-color: #111827;
	}
</style>
