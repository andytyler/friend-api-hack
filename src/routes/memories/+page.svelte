<script>
	import ConversationGrid from "./ConversationGrid.svelte";
	export let data;
	console.log("data", data);
</script>

{#if data?.memories}
	{#each data.memories as memory}
		<ConversationGrid data={memory} />
	{/each}
{:else}
	<p>No memories found</p>
{/if}
