<script lang="ts">
    import Fuse from "fuse.js"
    import IconCaretDownFill from "phosphor-icons-svelte/IconCaretDownFill.svelte"
    import IconCaretLeftRegular from "phosphor-icons-svelte/IconCaretLeftRegular.svelte"
    import IconCaretRightRegular from "phosphor-icons-svelte/IconCaretRightRegular.svelte"
    import IconCheckCircleFill from "phosphor-icons-svelte/IconCheckCircleFill.svelte"
    import IconCircleFill from "phosphor-icons-svelte/IconCircleFill.svelte"
    import IconGearSixFill from "phosphor-icons-svelte/IconGearSixFill.svelte"
    import IconXCircleFill from "phosphor-icons-svelte/IconXCircleFill.svelte"
    import { type Snippet } from "svelte"
    import { Collapsible } from "ui-ingredients/collapsible"
    import { Pagination } from "ui-ingredients/pagination"
    import { RadioGroup } from "ui-ingredients/radio-group"
    import { Select } from "ui-ingredients/select"
    import { goto } from "$app/navigation"
    import ApiCard from "$lib/components/ApiCard.svelte"
    import ApiSearchBox from "$lib/components/ApiSearchBox.svelte"
    import { apiMetadata, apis, type API } from "$lib/db"

    const url = new URL(window.location.href)

    type Filters = typeof filters
    let filters = $state({
        query: url.searchParams.get("query") || "",
        page: url.searchParams.get("page") || "1",
        pageSize: url.searchParams.get("pageSize") || "20",
        Category: url.searchParams.get("Category") || "",
        Auth: url.searchParams.get("Auth") || "",
        HTTPS: url.searchParams.get("HTTPS") || "",
        CORS: url.searchParams.get("CORS") || "",
    })

    const fuse = new Fuse(apis, {
        includeScore: true,
        keys: [{ name: "name", weight: 1.1 }, "description"],
    })

    const updateSearchParams = (filters: Filters) => {
        url.searchParams.keys().forEach((key) => {
            url.searchParams.delete(key)
        })
        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return
            if (key === "page" && value === "1") return
            if (key === "pageSize" && value === "20") return
            url.searchParams.set(key, value)
        })

        // If url.searchParams are empty, url.search becomes "", and goto("") won't trigger navigation. Fallback to "/" to ensure the router properly processes the navigation.
        goto(url.search || "/", { keepFocus: true, noScroll: true })
    }

    const searchApis = (query: string) => {
        return fuse.search(query).map((item) => item.item)
    }

    const filterApis = (apis: API[], filters: Filters) => {
        for (const { label } of apiMetadata) {
            if (!filters[label]) continue
            apis = apis.filter((api) => api.metadata[label] === filters[label])
        }
        return apis
    }

    const getCurrentPageApis = (apis: API[], filters: Filters) => {
        const page = Number(filters.page)
        const pageSize = Number(filters.pageSize)
        return apis.slice((page - 1) * pageSize, page * pageSize)
    }

    const findApis = (apis: API[], filters: Filters) => {
        let foundApis = apis
        if (filters.query) {
            foundApis = searchApis(filters.query)
        }
        return filterApis(foundApis, filters)
    }

    $effect(() => {
        updateSearchParams(filters)
    })

    const apisToShow = $derived(findApis(apis, filters))
    const pageApis: API[] = $derived(getCurrentPageApis(apisToShow, filters))

    const pageCount = $derived(
        Math.ceil(apisToShow.length / Number(filters.pageSize)),
    )

    $effect(() => {
        filters.page = "1"
        const _dependency = apisToShow.length
    })

    const radioGroupMetadatas = apiMetadata.filter(
        ({ label }) => label !== "Category",
    )

    const categoryOptionData = apiMetadata
        .filter(({ label }) => label.includes("Category"))
        .flatMap(({ values }) => values)

    const categoryOptionCollection = Select.collection({
        items: categoryOptionData,
    })
</script>

<div class="grid gap-8 lg:grid-cols-[auto_20rem]">
    {@render Aside({ Search })}

    <div>
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
            <div class="sticky bottom-0">
                <div
                    class="to-background mt-4 h-4 bg-gradient-to-b from-transparent"
                ></div>
                <Pagination.Root
                    class="bg-background -mb-4 flex justify-between gap-4 pb-4 lg:-mb-8 lg:pb-8"
                    page={Number(filters.page)}
                    defaultPageSize={Number(filters.pageSize)}
                    onPageChange={(page) => {
                        filters.page = String(page.page)
                    }}
                    count={pageCount}
                >
                    {#snippet children({ pages, page, totalPages })}
                        <Pagination.PrevTrigger
                            class="bg-background flex h-12 w-full min-w-12 items-center justify-center border-2 border-gray-800 not-[:disabled]:hover:border-gray-700 focus-visible:border-yellow-500 focus-visible:text-yellow-500 disabled:cursor-not-allowed disabled:opacity-25"
                        >
                            <IconCaretLeftRegular />
                        </Pagination.PrevTrigger>

                        <div class="flex items-center px-8 lg:hidden">
                            {page}/{totalPages}
                        </div>

                        <div class="hidden lg:flex lg:gap-2">
                            {#each pages as page, index}
                                {#if page.type === "page"}
                                    <Pagination.Item
                                        class="bg-background h-12 min-w-12 border-2 border-gray-800 px-4 hover:border-gray-700 focus-visible:border-yellow-500! focus-visible:text-yellow-500 data-[selected]:border-gray-50"
                                        value={page.value}
                                    >
                                        {page.value}
                                    </Pagination.Item>
                                {:else}
                                    <Pagination.Ellipsis
                                        class="bg-background flex h-12 min-w-12 items-center justify-center px-4"
                                        {index}
                                    >
                                        ...
                                    </Pagination.Ellipsis>
                                {/if}
                            {/each}
                        </div>

                        <Pagination.NextTrigger
                            class="bg-background flex h-12 w-full min-w-12 items-center justify-center border-2 border-gray-800 not-[:disabled]:hover:border-gray-700 focus-visible:border-yellow-500 focus-visible:text-yellow-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-25"
                        >
                            <IconCaretRightRegular />
                        </Pagination.NextTrigger>
                    {/snippet}
                </Pagination.Root>
            </div>
        {/if}
    </div>
</div>

{#snippet Aside({ Search }: { Search: Snippet })}
    <aside class="lg:sticky lg:top-8 lg:order-1 lg:self-start">
        <div class="hidden space-y-4 lg:block">
            {@render Search()}
            {@render Filters()}
        </div>

        <Collapsible.Root class="lg:hidden">
            <div class="flex gap-2">
                {@render Search()}

                <Collapsible.Trigger
                    class="flex size-12 items-center justify-center border-2 border-gray-800 hover:border-gray-700 focus-visible:border-yellow-500"
                    aria-label="Open advanced search"
                >
                    <IconGearSixFill />
                </Collapsible.Trigger>
            </div>

            <Collapsible.Content>
                <div class="pt-4">
                    {@render Filters()}
                </div>
            </Collapsible.Content>
        </Collapsible.Root>
    </aside>
{/snippet}

{#snippet Search()}
    <ApiSearchBox bind:value={filters.query} />
{/snippet}

{#snippet Filters()}
    <div class="space-y-4">
        <Select.Root
            collection={categoryOptionCollection}
            defaultValue={[filters.Category]}
            onValueChange={(details) => {
                filters.Category = details.value[0]
            }}
        >
            {#snippet children(context)}
                <div class="flex gap-2">
                    <Select.Control class="flex-1">
                        <Select.Trigger
                            class="relative flex h-12 w-full flex-1 items-center justify-between border-2 border-gray-800 px-4 hover:border-gray-700 focus-visible:border-yellow-500 data-[state=checked]:text-gray-400"
                        >
                            <span>
                                {context.valueAsString || "Categories"}
                            </span>
                            <IconCaretDownFill class="text-gray-600" />
                        </Select.Trigger>
                    </Select.Control>
                    {#if context.valueAsString}
                        <button
                            class="flex size-12 items-center justify-center border-2 border-gray-800 hover:border-gray-700 focus-visible:border-yellow-500"
                            onclick={() => context.clearValue()}
                        >
                            <IconXCircleFill />
                        </button>
                    {/if}
                </div>
                <Select.Positioner>
                    <Select.Content
                        class="bg-background z-1 max-h-72 overflow-y-auto border-2 border-gray-800 focus-visible:border-yellow-500"
                    >
                        {#each categoryOptionData as item}
                            <Select.Item
                                {item}
                                class="group flex items-center gap-2 py-1.5 pr-8 pl-4 first:pt-4 last:pb-4"
                            >
                                <IconCheckCircleFill
                                    class="text-xl group-not-data-[state=checked]:hidden group-data-[highlighted]:text-yellow-500"
                                />
                                <IconCircleFill
                                    class="text-xl text-gray-600 group-data-[highlighted]:text-yellow-500 group-data-[state=checked]:hidden"
                                />
                                <Select.ItemText
                                    class="text-sm not-data-[highlighted]:not-data-[state=checked]:text-gray-400"
                                >
                                    {item}
                                </Select.ItemText>
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Positioner>
            {/snippet}
        </Select.Root>

        {#each radioGroupMetadatas as { label, values }}
            <RadioGroup.Root
                defaultValue={filters[label]}
                onValueChange={(details) => {
                    filters[label] = details.value || ""
                }}
            >
                {#snippet children(context)}
                    <RadioGroup.Label
                        class="mb-2 inline-flex items-center gap-2"
                    >
                        <span>{label}</span>
                        {#if context.value}
                            <button
                                class="flex text-gray-600 hover:text-gray-100 focus-visible:text-yellow-500"
                                onclick={() => context.clearValue()}
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
                                    class="flex items-center gap-2 rounded-full border-2 border-gray-800 py-1.5 pr-4 pl-2 hover:border-gray-700 data-[focus]:border-yellow-500"
                                >
                                    <RadioGroup.ItemControl
                                        class="group flex text-xl"
                                    >
                                        <IconCheckCircleFill
                                            class="group-not-data-[state=checked]:hidden"
                                        />
                                        <IconCircleFill
                                            class="text-gray-600 group-data-[state=checked]:hidden"
                                        />
                                    </RadioGroup.ItemControl>
                                    <RadioGroup.ItemText
                                        class="text-sm not-data-[state=checked]:text-gray-400"
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
        {/each}
    </div>
{/snippet}
