<script lang="ts">
    import Fuse from "fuse.js"
    import IconCaretDownFill from "phosphor-icons-svelte/IconCaretDownFill.svelte"
    import IconCaretLeftRegular from "phosphor-icons-svelte/IconCaretLeftRegular.svelte"
    import IconCaretRightRegular from "phosphor-icons-svelte/IconCaretRightRegular.svelte"
    import IconCheckCircleFill from "phosphor-icons-svelte/IconCheckCircleFill.svelte"
    import IconCircleFill from "phosphor-icons-svelte/IconCircleFill.svelte"
    import IconGearSixFill from "phosphor-icons-svelte/IconGearSixFill.svelte"
    import IconXCircleFill from "phosphor-icons-svelte/IconXCircleFill.svelte"
    import { Pagination, RadioGroup, Select } from "ui-ingredients"
    import { goto } from "$app/navigation"
    import ApiCard from "$lib/components/ApiCard.svelte"
    import ApiSearchBox from "$lib/components/ApiSearchBox.svelte"
    import { apis, apisPropsKeysValues, type Api } from "$lib/db"

    const url = new URL(window.location.href)

    let searchParams = $state({
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
        keys: ["name", "description"],
    })

    const updateUrlSearchParams = (params: typeof searchParams) => {
        url.searchParams.keys().forEach((key) => {
            url.searchParams.delete(key)
        })
        Object.entries(params).forEach(([key, value]) => {
            if (!value) return
            if (key === "page" && value === "1") return
            if (key === "pageSize" && value === "20") return
            url.searchParams.set(key, value)
        })

        // If url.searchParams are empty, url.search becomes "", and goto("") won't trigger navigation. Fallback to "/" to ensure the router properly processes the navigation.
        goto(url.search || "/", {
            keepFocus: true,
            noScroll: true,
        })
    }

    const searchApis = (query: string) => {
        return fuse.search(query).map((item) => item.item)
    }

    const filterApis = (apis: Api[], params: typeof searchParams) => {
        for (const { label } of apisPropsKeysValues) {
            if (!params[label]) continue
            apis = apis.filter(({ props }) => props[label] === params[label])
        }
        return apis
    }

    const getCurrentPageApis = (apis: Api[], params: typeof searchParams) => {
        const page = Number(params.page)
        const pageSize = Number(params.pageSize)
        return apis.slice((page - 1) * pageSize, page * pageSize)
    }

    const findApis = (apis: Api[], params: typeof searchParams) => {
        let foundApis = apis
        if (params.query) {
            foundApis = searchApis(params.query)
        }
        foundApis = filterApis(foundApis, params)
        return foundApis
    }

    $effect(() => {
        updateUrlSearchParams(searchParams)
    })

    const apisToShow = $derived(findApis(apis, searchParams))
    const pageApis: Api[] = $derived(
        getCurrentPageApis(apisToShow, searchParams),
    )

    const pageCount = $derived(
        Math.ceil(apisToShow.length / Number(searchParams.pageSize)),
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

<div class="grid gap-8 lg:grid-cols-[auto_20rem]">
    <aside class="lg:sticky lg:top-8 lg:order-1 lg:self-start">
        <div class="flex gap-2">
            <ApiSearchBox bind:value={searchParams.query} />

            <button
                class="flex size-12 items-center justify-center border-2 border-gray-800 text-gray-600 hover:border-gray-700 lg:hidden"
                aria-label="Open advanced search"
                onclick={() => (isAdvancedSearchOpen = !isAdvancedSearchOpen)}
            >
                <IconGearSixFill />
            </button>
        </div>

        <div class="{!isAdvancedSearchOpen && 'hidden'} mt-4 lg:block">
            <ul class="space-y-4">
                <li>
                    <Select.Root
                        collection={categoryOptionCollection}
                        defaultValue={[searchParams.Category]}
                        onValueChange={(details) => {
                            searchParams.Category = details.value[0]
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
                                        <IconCaretDownFill
                                            class="text-gray-600"
                                        />
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
                            defaultValue={searchParams[label]}
                            onValueChange={(details) => {
                                searchParams[label] = details.value || ""
                            }}
                        >
                            {#snippet children({ clearValue })}
                                <RadioGroup.Label
                                    class="mb-2 inline-flex items-center gap-2"
                                >
                                    <span>{label}</span>
                                    {#if searchParams[label]}
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
                                                <RadioGroup.ItemHiddenInput
                                                    {value}
                                                />
                                            </RadioGroup.Item>
                                        </li>
                                    {/each}
                                </ul>
                            {/snippet}
                        </RadioGroup.Root>
                    </li>
                {/each}
            </ul>

            <hr class="mt-8 lg:hidden" />
        </div>
    </aside>

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
            <Pagination.Root
                class="bg-background sticky bottom-0 mt-8 flex justify-between gap-4"
                defaultPage={Number(searchParams.page)}
                defaultPageSize={Number(searchParams.pageSize)}
                onPageChange={(page) => {
                    searchParams.page = String(page.page)
                }}
                count={pageCount}
            >
                {#snippet children({ pages, page, totalPages })}
                    <Pagination.PrevTrigger
                        class="bg-background flex h-12 min-w-12 items-center justify-center border-2 border-gray-800 not-[:disabled]:hover:border-gray-700 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-25"
                    >
                        <IconCaretLeftRegular />
                    </Pagination.PrevTrigger>

                    <div class="flex items-center lg:hidden">
                        {page}/{totalPages}
                    </div>

                    <div class="hidden lg:flex lg:gap-2">
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
                                    class="bg-background flex h-12 min-w-12 items-center justify-center px-4"
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
</div>
