<script>
	import ConversationGrid from "./ConversationGrid.svelte";
	export let memories;
	console.log("memories", memories);
</script>

{#each memories as memory}
	<ConversationGrid data={memory} />
{/each}
