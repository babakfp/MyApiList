<script lang="ts">
    import IconXFill from "phosphor-icons-svelte/IconXFill.svelte"

    export let value = ""
</script>

<div class="group relative flex-1">
    <input
        class="peer h-12 w-full border-2 border-gray-800 bg-transparent pl-4 pr-[calc(theme(spacing.12)-theme(spacing.1))] placeholder-gray-600 reset-search-input"
        type="search"
        placeholder="Search APIs"
        bind:value
    />
    <button
        class="absolute right-0.5 flex h-[calc(theme(spacing.12)-theme(spacing.1))] w-[calc(theme(spacing.12)-theme(spacing.1))] items-center justify-center text-gray-600 hide inset-y-center hover:text-gray-100 focus-visible:show group-hover:show peer-focus-visible:show peer-[:not(:placeholder-shown)]:show"
        aria-label="Clear search"
        on:click={() => (value = "")}
    >
        <IconXFill />
    </button>
</div>
