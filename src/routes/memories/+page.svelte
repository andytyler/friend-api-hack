<script>
	import MemoryDetailsSheet from "./MemoryDetailsSheet.svelte";
	import MemoryItem from "./MemoryItem.svelte";
	import { isOpen, selectedMemory } from "$lib/stores/memoryStore";
	export let data;

	function openSidePanel(memory) {
		selectedMemory.set(memory);
		isOpen.set(true);
	}
</script>

<div class="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
	<div class="mx-auto max-w-7xl">
		<h1 class="mb-8 text-4xl font-bold text-emerald-400">Memories</h1>
		<h2 class="mt-8 text-3xl font-semibold text-emerald-300">Our Journey</h2>
		<p class="mb-4 text-lg text-gray-200">Explore the memories that shape our story and drive our mission forward.</p>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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
	</div>
	<MemoryDetailsSheet />
</div>

<style>
	:global(body) {
		background-color: #111827;
	}
</style>
