<script lang="ts">
    import IconXFill from "phosphor-icons-svelte/IconXFill.svelte"

    let {
        value = $bindable(),
    }: {
        value?: string
    } = $props()

    const id = $props.id()
</script>

<div class="group relative flex-1">
    <input
        name={id}
        class="peer reset-search-input h-12 w-full border-2 border-gray-800 bg-transparent pr-[calc(theme(spacing.12)-theme(spacing.1))] pl-4 placeholder-gray-600 hover:border-gray-700"
        type="search"
        placeholder="Search APIs"
        bind:value
        autocomplete="off"
    />
    <button
        class="hide inset-y-center peer-[:not(:placeholder-shown)]:show absolute right-0.5 flex h-[calc(theme(spacing.12)-theme(spacing.1))] w-[calc(theme(spacing.12)-theme(spacing.1))] items-center justify-center text-gray-600 hover:text-gray-100"
        aria-label="Clear search"
        onclick={() => (value = "")}
    >
        <IconXFill />
    </button>
</div>
