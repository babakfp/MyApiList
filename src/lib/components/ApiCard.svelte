<script lang="ts">
    import type { Api } from "$lib/db"
    import { tagToSlug } from "$lib/utilities/api"

    export let name: Api["name"]
    export let url: Api["url"]
    export let description: Api["description"]
    export let tags: Api["tags"]
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
            {#each tags as tag}
                <li>
                    <a
                        class="text-xs text-gray-600 underline hover:text-gray-100"
                        href="#{tagToSlug(tag)}"
                    >
                        {tag}
                    </a>
                </li>
            {/each}
        </ul>
    </a>
</li>
