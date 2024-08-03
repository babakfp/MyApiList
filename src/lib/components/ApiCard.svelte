<script lang="ts">
    import type { Api } from "$lib/db"

    export let name: Api["name"]
    export let url: Api["url"]
    export let description: Api["description"]
    export let props: Api["props"]
</script>

<li>
    <a
        class="grid gap-2 border-2 border-gray-800 p-4 hover:bg-gray-800"
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
    >
        <h3 class="font-bold">{name}</h3>
        <p class="text-sm text-gray-400">{description}</p>
        <ul class="mt-4 flex flex-wrap gap-4">
            {#each Object.entries(props) as [k, v]}
                <li class="text-xs text-gray-600">
                    {#if k === "Category"}
                        {v}
                    {:else}
                        {k}:{v}
                    {/if}
                </li>
            {/each}
        </ul>
    </a>
</li>
