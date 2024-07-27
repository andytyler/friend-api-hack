<script>
	import ConversationGrid from "./ConversationGrid.svelte";
	export let memories;
	console.log(memories);
</script>

<ConversationGrid data={memories} />
