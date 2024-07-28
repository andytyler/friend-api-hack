<script>
    import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "$lib/components/ui/sheet";
    import { Button } from "$lib/components/ui/button";
    import PluginResponse from "./PluginResponse.svelte";

    export let selectedMemory;
    export let isOpen;
</script>

<Sheet bind:open={isOpen}>
    <SheetContent class="overflow-y-auto w-1/2">
        <SheetHeader>
            <SheetTitle>{selectedMemory?.memory.structured.title || "No Title"}</SheetTitle>
            <SheetDescription>
                {#if selectedMemory}
                    <div class="mt-4 space-y-4">
                        <p class="text-sm text-gray-500">{selectedMemory.memory.structured.overview}</p>

                        <div>
                            <h4 class="text-sm font-semibold">Category:</h4>
                            <p class="text-sm text-gray-500">{selectedMemory.memory.structured.category}</p>
                        </div>

                        <div>
                            <h4 class="text-sm font-semibold">Action Items:</h4>
                            <ul class="text-sm list-disc list-inside text-gray-500">
                                {#each selectedMemory.memory.structured.actionItems as item}
                                    <li>{item}</li>
                                {/each}
                            </ul>
                        </div>

                        <div>
                            <h4 class="text-sm font-semibold">Events:</h4>
                            <ul class="text-sm list-disc list-inside text-gray-500">
                                {#each selectedMemory.memory.structured.events as event}
                                    <li>{event}</li>
                                {/each}
                            </ul>
                        </div>

                        <div>
                            <h4 class="text-sm font-semibold">Date Created:</h4>
                            <p class="text-sm text-gray-500">{new Date(selectedMemory.createdAt).toLocaleString()}</p>
                        </div>

                        <div>
                            <h4 class="text-sm font-semibold">Transcript:</h4>
                            <p class="text-sm text-gray-500">{selectedMemory.memory.transcript}</p>
                        </div>

                        {#if selectedMemory.memory.pluginsResponse.length > 0}
                            <div>
                                <h4 class="text-sm font-semibold">Plugin Responses:</h4>
                                {#each selectedMemory.memory.pluginsResponse as response}
                                    <PluginResponse pluginResponse={response} />
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </SheetDescription>
        </SheetHeader>
        <div class="mt-6">
            <Button on:click={() => (isOpen = false)}>Close</Button>
        </div>
    </SheetContent>
</Sheet>


<style>
    :global(body) {
        background-color: #111827;
    }
</style>