<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";

	export let pluginResponse: {
		content: string;
		pluginId: string;
	};
</script>

<Card class="mb-4 w-full text-gray-100 bg-gray-700 border-gray-600">
	<CardHeader>
		<div class="flex justify-between items-center">
			<CardTitle class="text-xl font-semibold text-emerald-400">Plugin Response</CardTitle>
			<Badge variant="secondary" class="text-sm text-emerald-100 bg-emerald-700">
				{pluginResponse.pluginId}
			</Badge>
		</div>
	</CardHeader>
	<CardContent>
		<p class="text-sm text-gray-300 whitespace-pre-wrap">{pluginResponse.content}</p>
	</CardContent>
</Card>
