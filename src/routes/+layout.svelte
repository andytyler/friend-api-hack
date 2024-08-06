<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import LightSwitch from "$lib/components/ui/light-switch/light-switch.svelte";
</script>

<div class="fixed top-0 right-0 z-50 m-2">
	<ModeWatcher />
	<LightSwitch />
</div>

<slot />
