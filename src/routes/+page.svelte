<script lang="ts">
    import * as select from "@zag-js/select"
    import lunr from "lunr"
    import IconCaretDownFill from "phosphor-icons-svelte/IconCaretDownFill.svelte"
    import IconCheckCircleFill from "phosphor-icons-svelte/IconCheckCircleFill.svelte"
    import IconCircleFill from "phosphor-icons-svelte/IconCircleFill.svelte"
    import IconGearSixFill from "phosphor-icons-svelte/IconGearSixFill.svelte"
    import IconXCircleFill from "phosphor-icons-svelte/IconXCircleFill.svelte"
    import { untrack } from "svelte"
    import { goto } from "$app/navigation"
    import { page } from "$app/stores"
    import ApiCard from "$lib/components/ApiCard.svelte"
    import ApiSearchBox from "$lib/components/ApiSearchBox.svelte"
    import Pagination from "$lib/components/Pagination.svelte"
    import PaginationButton from "$lib/components/PaginationButton.svelte"
    import { RadioGroup, useRadioGroup } from "$lib/components/RadioGroup"
    import { Select, useSelect } from "$lib/components/Select"
    import { apis, apisPropsKeysValues, type Api } from "$lib/db"

    let searchOptions = $state({
        search: $page.url.searchParams.get("search") || "",
        page: $page.url.searchParams.get("page") || "1",
        pageSize: $page.url.searchParams.get("pageSize") || "10",
        Category: $page.url.searchParams.get("search") || "",
        Auth: $page.url.searchParams.get("search") || "",
        HTTPS: $page.url.searchParams.get("search") || "",
        CORS: $page.url.searchParams.get("search") || "",
    })

    const idx = lunr(function () {
        this.ref("url")
        this.field("name")
        this.field("description")
        apis.forEach((api) => this.add(api))
    })

    let apisToShow: Api[] = $state([])
    let pageApis: Api[] = $state([])

    let searchOptionsOldPage = searchOptions.page

    $effect(() => {
        if (searchOptions.page !== searchOptionsOldPage) {
            searchOptionsOldPage = searchOptions.page
        }

        untrack(() => {
            apisToShow = apis
        })

        if (searchOptions.search) {
            const foundUrls = idx.search(searchOptions.search).map((r) => r.ref)
            const foundApis = foundUrls
                .map((url) =>
                    untrack(() => apisToShow.find((a) => a.url === url)),
                )
                .filter((a) => a !== undefined)
            untrack(() => {
                apisToShow = foundApis
            })
        }

        apisPropsKeysValues.forEach(({ label }) => {
            if (searchOptions[label]) {
                untrack(() => {
                    apisToShow = apisToShow.filter((api) => {
                        return api.props[label] === searchOptions[label]
                    })
                })
            }
        })

        untrack(() => {
            pageApis = apisToShow.slice(
                (Number(searchOptions.page) - 1) *
                    Number(searchOptions.pageSize),
                Number(searchOptions.page) * Number(searchOptions.pageSize),
            )
        })

        Object.entries(searchOptions).forEach(([key]) => {
            $page.url.searchParams.delete(key)
        })
        Object.entries(searchOptions).forEach(([key, value]) => {
            if (!value) return
            $page.url.searchParams.set(key, value)
        })

        goto($page.url.search, { keepFocus: true })
    })

    const pageCount = $derived(
        Math.ceil(apisToShow.length / Number(searchOptions.pageSize)),
    )

    let isAdvancedSearchOpen = $state(false)

    const radioGroups = apisPropsKeysValues
        .filter(({ label }) => label !== "Category")
        .map(({ label, values }) => ({
            label,
            radioGroup: useRadioGroup({
                id: label.toLowerCase(),
                value: searchOptions[label],
                onValueChange: (details) => {
                    searchOptions[label] = details.value
                },
            }),
            values,
        }))

    const categoryOptionData = apisPropsKeysValues.find(({ label }) =>
        label.includes("Category"),
    )!.values

    const categoryOptionCollection = select.collection({
        items: categoryOptionData,
    })

    const categoryOption = useSelect({
        id: "categories",
        collection: categoryOptionCollection,
        value: [searchOptions.Category],
    })
</script>

<svelte:head>
    <title>My API List</title>
    <meta name="description" content="Discover the top free APIs available." />
</svelte:head>

<div class="flex gap-2">
    <ApiSearchBox bind:value={searchOptions.search} />

    <button
        class="flex size-12 items-center justify-center text-gray-600 clickable-with-icon"
        aria-label="Open advanced search"
        onclick={() => (isAdvancedSearchOpen = !isAdvancedSearchOpen)}
    >
        <IconGearSixFill />
    </button>
</div>

{#if isAdvancedSearchOpen}
    <ul class="mt-4 space-y-4">
        <li>
            <Select.RootProvider select={categoryOption}>
                <div class="flex gap-2">
                    <Select.Control class="flex-1">
                        <Select.Trigger
                            class="relative flex h-12 w-full flex-1 cursor-pointer items-center justify-between px-4 clickable data-[state=checked]:text-gray-400"
                        >
                            <span>
                                {categoryOption.api.valueAsString ||
                                    "Categories"}
                            </span>
                            <IconCaretDownFill class="text-gray-600" />
                        </Select.Trigger>
                    </Select.Control>
                    {#if categoryOption.api.valueAsString}
                        <button
                            class="size-12 text-gray-600 clickable-with-icon"
                            onclick={() => {
                                categoryOption.api.setValue([])
                            }}
                        >
                            <IconXCircleFill />
                        </button>
                    {/if}
                </div>
                <Select.Positioner>
                    <Select.Content
                        class="max-h-72 overflow-y-auto bg-gray-900 bordered"
                    >
                        {#each categoryOptionData as item}
                            <Select.Item
                                {item}
                                class="group flex cursor-pointer items-center gap-2 py-1.5 pl-4 pr-8 first:pt-4 last:pb-4"
                            >
                                <IconCheckCircleFill
                                    class="text-xl group-[&:not([data-state=checked])]:hidden"
                                />
                                <IconCircleFill
                                    class="text-xl text-gray-600 group-data-[state=checked]:hidden"
                                />
                                <Select.ItemText
                                    {item}
                                    class="text-sm [&:not([data-highlighted]):not([data-state=checked])]:text-gray-400"
                                >
                                    {item}
                                </Select.ItemText>
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Positioner>
            </Select.RootProvider>
        </li>
        {#each radioGroups as { label, radioGroup, values }}
            <li>
                <RadioGroup.RootProvider {radioGroup}>
                    <RadioGroup.Label
                        class="mb-2 inline-flex items-center gap-2"
                    >
                        <span>{label}</span>
                        {#if searchOptions[label]}
                            <button
                                class="flex text-gray-600 hover:text-gray-100"
                                onclick={() => {
                                    radioGroup.api.setValue("")
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
                                    class="flex cursor-pointer items-center gap-2 rounded-full py-1.5 pl-2 pr-4 clickable"
                                >
                                    <RadioGroup.ItemControl
                                        {value}
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
                                        {value}
                                        class="text-sm [&:not([data-state=checked])]:text-gray-400"
                                    />
                                    <RadioGroup.ItemHiddenInput {value} />
                                </RadioGroup.Item>
                            </li>
                        {/each}
                    </ul>
                </RadioGroup.RootProvider>
            </li>
        {/each}
    </ul>
{/if}

<div class="mt-4 space-y-6">
    {#if pageApis.length}
        <ul class="space-y-4">
            {#each pageApis as api}
                <ApiCard {api} />
            {/each}
        </ul>
    {:else}
        <p class="text-center">No results found.</p>
    {/if}

    {#if apisToShow.length}
        <Pagination>
            <PaginationButton
                onclick={() => {
                    if (Number(searchOptions.page) > 1) {
                        searchOptions.page = String(
                            Number(searchOptions.page) - 1,
                        )
                    }
                }}
                isDisabled={Number(searchOptions.page) === 1}
            >
                Previous
            </PaginationButton>
            <span class="flex justify-center text-sm">
                {searchOptions.page}/{pageCount}
            </span>
            <PaginationButton
                onclick={() => {
                    if (Number(searchOptions.page) < pageCount) {
                        searchOptions.page = String(
                            Number(searchOptions.page) + 1,
                        )
                    }
                }}
                isDisabled={Number(searchOptions.page) === pageCount}
            >
                Next
            </PaginationButton>
        </Pagination>
    {/if}
</div>
