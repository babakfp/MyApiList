<script lang="ts">
    import ApiCard from "$lib/components/ApiCard.svelte"
    import { apis } from "$lib/db"
    import { tagToSlug } from "$lib/utilities/api"
</script>

<svelte:head>
    <title>My API List</title>
    <meta name="description" content="Discover the top free APIs available." />
</svelte:head>

<ul class="space-y-8">
    {#each apis.map((api) => api.tags).flat() as tag}
        <li>
            <h2 class="scroll-mt-4 text-xl font-bold" id={tagToSlug(tag)}>
                {tag}
            </h2>
            <ul class="mt-4">
                {#each apis.filter((api) => api.tags.includes(tag)) as api}
                    <ApiCard {...api} />
                {/each}
            </ul>
        </li>
    {/each}
</ul>
