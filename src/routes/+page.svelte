<script lang="ts">
    import Fuse from "fuse.js"
    import IconCaretDownFill from "phosphor-icons-svelte/IconCaretDownFill.svelte"
    import IconCaretLeftRegular from "phosphor-icons-svelte/IconCaretLeftRegular.svelte"
    import IconCaretRightRegular from "phosphor-icons-svelte/IconCaretRightRegular.svelte"
    import IconCheckCircleFill from "phosphor-icons-svelte/IconCheckCircleFill.svelte"
    import IconCircleFill from "phosphor-icons-svelte/IconCircleFill.svelte"
    import IconGearSixFill from "phosphor-icons-svelte/IconGearSixFill.svelte"
    import IconXCircleFill from "phosphor-icons-svelte/IconXCircleFill.svelte"
    import { untrack } from "svelte"
    import { Pagination, RadioGroup, Select } from "ui-ingredients"
    import { goto } from "$app/navigation"
    import { page } from "$app/state"
    import ApiCard from "$lib/components/ApiCard.svelte"
    import ApiSearchBox from "$lib/components/ApiSearchBox.svelte"
    import { apis, apisPropsKeysValues, type Api } from "$lib/db"

    let searchOptions = $state({
        search: page.url.searchParams.get("search") || "",
        page: page.url.searchParams.get("page") || "1",
        pageSize: page.url.searchParams.get("pageSize") || "10",
        Category: page.url.searchParams.get("search") || "",
        Auth: page.url.searchParams.get("search") || "",
        HTTPS: page.url.searchParams.get("search") || "",
        CORS: page.url.searchParams.get("search") || "",
    })

    const fuse = new Fuse(apis, {
        includeScore: true,
        keys: ["name", "description"],
    })

    let apisToShow: Api[] = $state([])
    let pageApis: Api[] = $state([])

    let searchOptionsOldPage = searchOptions.page

    $effect(() => {
        untrack(() => {
            if (searchOptions.page !== searchOptionsOldPage) {
                searchOptionsOldPage = searchOptions.page
            }

            apisToShow = apis

            if (searchOptions.search) {
                const searchResults = fuse.search(searchOptions.search)
                const foundApis = searchResults.map((item) => item.item)
                apisToShow = foundApis
            }

            apisPropsKeysValues.forEach(({ label }) => {
                if (searchOptions[label]) {
                    apisToShow = apisToShow.filter((api) => {
                        return api.props[label] === searchOptions[label]
                    })
                }
            })

            pageApis = apisToShow.slice(
                (Number(searchOptions.page) - 1) *
                    Number(searchOptions.pageSize),
                Number(searchOptions.page) * Number(searchOptions.pageSize),
            )

            Object.entries(searchOptions).forEach(([key]) => {
                page.url.searchParams.delete(key)
            })
            Object.entries(searchOptions).forEach(([key, value]) => {
                if (!value) return
                if (key === "page" && value === "1") return
                if (key === "pageSize" && value === "10") return
                page.url.searchParams.set(key, value)
            })

            goto(page.url.search, { keepFocus: true, noScroll: true })
        })

        // dependencies
        ;({ ...searchOptions })
    })

    const pageCount = $derived(
        Math.ceil(apisToShow.length / Number(searchOptions.pageSize)),
    )

    let isAdvancedSearchOpen = $state(false)

    const radioGroups = apisPropsKeysValues.filter(
        ({ label }) => label !== "Category",
    )

    const categoryOptionData = apisPropsKeysValues.find(({ label }) =>
        label.includes("Category"),
    )!.values

    const categoryOptionCollection = Select.collection({
        items: categoryOptionData,
    })
</script>

<svelte:head>
    <title>My API List</title>
    <meta name="description" content="Discover the top free APIs available." />
</svelte:head>

<div class="flex gap-2">
    <ApiSearchBox bind:value={searchOptions.search} />

    <button
        class="flex size-12 items-center justify-center border-2 border-gray-800 text-gray-600 hover:border-gray-700"
        aria-label="Open advanced search"
        onclick={() => (isAdvancedSearchOpen = !isAdvancedSearchOpen)}
    >
        <IconGearSixFill />
    </button>
</div>

{#if isAdvancedSearchOpen}
    <ul class="mt-4 space-y-4">
        <li>
            <Select.Root
                collection={categoryOptionCollection}
                defaultValue={[searchOptions.Category]}
                onValueChange={(details) => {
                    searchOptions.Category = details.value[0]
                }}
            >
                {#snippet children({ valueAsString, clearValue })}
                    <div class="flex gap-2">
                        <Select.Control class="flex-1">
                            <Select.Trigger
                                class="relative flex h-12 w-full flex-1 items-center justify-between border-2 border-gray-800 px-4 hover:border-gray-700 data-[state=checked]:text-gray-400"
                            >
                                <span>
                                    {valueAsString || "Categories"}
                                </span>
                                <IconCaretDownFill class="text-gray-600" />
                            </Select.Trigger>
                        </Select.Control>
                        {#if valueAsString}
                            <button
                                class="flex size-12 items-center justify-center border-2 border-gray-800 text-gray-600 hover:border-gray-700"
                                onclick={() => {
                                    clearValue()
                                }}
                            >
                                <IconXCircleFill />
                            </button>
                        {/if}
                    </div>
                    <Select.Positioner>
                        <Select.Content
                            class="bg-background z-1 max-h-72 overflow-y-auto border-2 border-gray-800"
                        >
                            {#each categoryOptionData as item}
                                <Select.Item
                                    {item}
                                    class="group flex items-center gap-2 py-1.5 pr-8 pl-4 first:pt-4 last:pb-4"
                                >
                                    <IconCheckCircleFill
                                        class="text-xl group-[&:not([data-state=checked])]:hidden"
                                    />
                                    <IconCircleFill
                                        class="text-xl text-gray-600 group-data-[state=checked]:hidden"
                                    />
                                    <Select.ItemText
                                        class="text-sm [&:not([data-highlighted]):not([data-state=checked])]:text-gray-400"
                                    >
                                        {item}
                                    </Select.ItemText>
                                </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Positioner>
                {/snippet}
            </Select.Root>
        </li>
        {#each radioGroups as { label, values }}
            <li>
                <RadioGroup.Root
                    defaultValue={searchOptions[label]}
                    onValueChange={(details) => {
                        searchOptions[label] = details.value || ""
                    }}
                >
                    {#snippet children({ clearValue })}
                        <RadioGroup.Label
                            class="mb-2 inline-flex items-center gap-2"
                        >
                            <span>{label}</span>
                            {#if searchOptions[label]}
                                <button
                                    class="flex text-gray-600 hover:text-gray-100"
                                    onclick={() => {
                                        clearValue()
                                    }}
                                >
                                    <IconXCircleFill />
                                </button>
                            {/if}
                        </RadioGroup.Label>
                        <ul class="flex flex-wrap gap-2">
                            {#each values as value}
                                <li>
                                    <RadioGroup.Item
                                        {value}
                                        class="flex items-center gap-2 rounded-full border-2 border-gray-800 py-1.5 pr-4 pl-2 hover:border-gray-700"
                                    >
                                        <RadioGroup.ItemControl
                                            class="group flex text-xl"
                                        >
                                            <IconCheckCircleFill
                                                class="group-[&:not([data-state=checked])]:hidden"
                                            />
                                            <IconCircleFill
                                                class="text-gray-600 group-data-[state=checked]:hidden"
                                            />
                                        </RadioGroup.ItemControl>
                                        <RadioGroup.ItemText
                                            class="text-sm [&:not([data-state=checked])]:text-gray-400"
                                        >
                                            {value}
                                        </RadioGroup.ItemText>
                                        <RadioGroup.ItemHiddenInput {value} />
                                    </RadioGroup.Item>
                                </li>
                            {/each}
                        </ul>
                    {/snippet}
                </RadioGroup.Root>
            </li>
        {/each}
    </ul>
{/if}

<div class="mt-4 space-y-6">
    {#if pageApis.length}
        <ul class="space-y-4">
            {#each pageApis as api}
                <ApiCard {...api} />
            {/each}
        </ul>
    {:else}
        <p class="text-center">No results found.</p>
    {/if}

    {#if apisToShow.length}
        <Pagination.Root
            class="bg-background sticky bottom-0 flex justify-between gap-4"
            defaultPage={Number(searchOptions.page)}
            defaultPageSize={Number(searchOptions.pageSize)}
            onPageChange={(page) => {
                searchOptions.page = String(page.page)
            }}
            count={pageCount}
        >
            {#snippet children({ pages })}
                <Pagination.PrevTrigger
                    class="bg-background flex h-12 min-w-12 items-center justify-center border-2 border-gray-800 not-[:disabled]:hover:border-gray-700 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-25"
                >
                    <IconCaretLeftRegular />
                </Pagination.PrevTrigger>

                <div class="flex gap-2">
                    {#each pages as page, index}
                        {#if page.type === "page"}
                            <Pagination.Item
                                class="bg-background h-12 min-w-12 border-2 border-gray-800 px-4 hover:border-gray-700 data-[selected]:border-gray-50"
                                value={page.value}
                            >
                                {page.value}
                            </Pagination.Item>
                        {:else}
                            <Pagination.Ellipsis
                                class="bg-background flex size-12 items-center justify-center px-4"
                                {index}
                            >
                                ...
                            </Pagination.Ellipsis>
                        {/if}
                    {/each}
                </div>

                <Pagination.NextTrigger
                    class="bg-background flex h-12 min-w-12 items-center justify-center border-2 border-gray-800 not-[:disabled]:hover:border-gray-700 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-25"
                >
                    <IconCaretRightRegular />
                </Pagination.NextTrigger>
            {/snippet}
        </Pagination.Root>
    {/if}
</div>
