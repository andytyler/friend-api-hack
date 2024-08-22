<script>
	import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "$lib/components/ui/sheet";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "$lib/components/ui/accordion";
	import PluginResponse from "./PluginResponse.svelte";
	import { isOpen, selectedMemory } from "$lib/stores/memoryStore";

	function closeSheet() {
		isOpen.set(false);
	}
</script>

<Sheet bind:open={$isOpen}>
	<SheetContent class="overflow-y-auto w-96 bg-gray-900 min-w-1/2">
		<SheetHeader>
			<SheetTitle class="text-3xl font-bold text-emerald-400">
				{$selectedMemory?.memory?.structured?.title || "Untitled Memory"}
			</SheetTitle>
			<Badge variant="secondary" class="mb-4 text-sm text-emerald-100 bg-emerald-700">
				{$selectedMemory?.memory?.structured?.category || "Uncategorized"}
			</Badge>
		</SheetHeader>
		<SheetDescription>
			{#if $selectedMemory}
				<div class="space-y-6">
					<p class="text-lg text-gray-300">{$selectedMemory.memory?.structured?.overview}</p>

					<Accordion type="single" collapsible class="w-full">
						<AccordionItem value="action-items">
							<AccordionTrigger class="text-emerald-400">Action Items</AccordionTrigger>
							<AccordionContent>
								<ul class="list-disc list-inside text-gray-300">
									{#each $selectedMemory.memory.structured.actionItems as item}
										<li>{item}</li>
									{/each}
								</ul>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="events">
							<AccordionTrigger class="text-emerald-400">Events</AccordionTrigger>
							<AccordionContent>
								<ul class="list-disc list-inside text-gray-300">
									{#each $selectedMemory.memory.structured.events as event}
										<li>{event}</li>
									{/each}
								</ul>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="transcript">
							<AccordionTrigger class="text-emerald-400">Transcript</AccordionTrigger>
							<AccordionContent>
								<p class="text-gray-300 whitespace-pre-wrap">{$selectedMemory.memory.transcript}</p>
							</AccordionContent>
						</AccordionItem>

						{#if $selectedMemory.memory.pluginsResponse.length > 0}
							<AccordionItem value="plugin-responses">
								<AccordionTrigger class="text-emerald-400">Plugin Responses</AccordionTrigger>
								<AccordionContent>
									{#each $selectedMemory.memory.pluginsResponse as response}
										<PluginResponse pluginResponse={response} />
									{/each}
								</AccordionContent>
							</AccordionItem>
						{/if}
					</Accordion>

					<div class="text-sm text-gray-400">
						Created: {new Date($selectedMemory.createdAt).toLocaleString()}
					</div>
				</div>
			{/if}
		</SheetDescription>
		<div class="mt-6">
			<Button variant="outline" on:click={closeSheet}>Close</Button>
		</div>
	</SheetContent>
</Sheet>
