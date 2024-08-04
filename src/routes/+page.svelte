<script lang="ts">
    import {
        Listbox,
        ListboxButton,
        ListboxOption,
        ListboxOptions,
        RadioGroup,
        RadioGroupLabel,
        RadioGroupOption,
    } from "@rgossiaux/svelte-headlessui"
    import lunr from "lunr"
    import IconCaretDownFill from "phosphor-icons-svelte/IconCaretDownFill.svelte"
    import IconCheckCircleFill from "phosphor-icons-svelte/IconCheckCircleFill.svelte"
    import IconCircleFill from "phosphor-icons-svelte/IconCircleFill.svelte"
    import IconGearSixFill from "phosphor-icons-svelte/IconGearSixFill.svelte"
    import IconXCircleFill from "phosphor-icons-svelte/IconXCircleFill.svelte"
    import { queryParameters } from "sveltekit-search-params"
    import ApiCard from "$lib/components/ApiCard.svelte"
    import ApiSearchBox from "$lib/components/ApiSearchBox.svelte"
    import Pagination from "$lib/components/Pagination.svelte"
    import PaginationButton from "$lib/components/PaginationButton.svelte"
    import { apis, apisPropsKeysValues, type Api } from "$lib/db"

    const qp = queryParameters()

    if (!$qp.search) {
        $qp.search = ""
    }

    if (!$qp.page) {
        $qp.page = "1"
    }

    if (!$qp.pageSize) {
        $qp.pageSize = "10"
    }

    const idx = lunr(function () {
        this.ref("url")
        this.field("name")
        this.field("description")
        apis.forEach((api) => this.add(api))
    })

    let apisToShow: Api[] = []
    let pageApis: Api[] = []

    let oldPage = $qp.page
    qp.subscribe((v) => {
        // When user changes the filters, reset the page to 1, this condition is to avoid
        // the page to be reset to 1 when the user changes the page manually.
        if (v.page === oldPage) {
            v.page = 1
        }

        oldPage = v.page

        apisToShow = apis

        if (v.search) {
            const foundUrls = idx.search(v.search).map((r) => r.ref)
            const foundApis = foundUrls
                .map((url) => apisToShow.find((a) => a.url === url))
                .filter((a) => a !== undefined)
            apisToShow = foundApis
        }

        apisPropsKeysValues.forEach((kv) => {
            if (v[kv.label]) {
                apisToShow = apisToShow.filter((api) => {
                    return api.props[kv.label] === v[kv.label]
                })
            }
        })

        pageApis = apisToShow.slice(
            (Number(v.page) - 1) * v.pageSize,
            Number(v.page) * v.pageSize,
        )
    })

    $: pageCount = Math.ceil(apisToShow.length / Number($qp.pageSize))

    let isAdvancedSearchOpen = false
</script>

<svelte:head>
    <title>My API List</title>
    <meta name="description" content="Discover the top free APIs available." />
</svelte:head>

<div class="flex gap-2">
    <ApiSearchBox bind:value={$qp.search} />

    <button
        class="clickable-with-icon flex size-12 items-center justify-center text-gray-600"
        aria-label="Open advanced search"
        on:click={() => (isAdvancedSearchOpen = !isAdvancedSearchOpen)}
    >
        <IconGearSixFill />
    </button>
</div>

{#if isAdvancedSearchOpen}
    <ul class="mt-4 space-y-4">
        {#each apisPropsKeysValues as field}
            <li>
                {#if field.label === "Category"}
                    {@const label = $qp[field.label] || field.label}

                    <Listbox bind:value={$qp[field.label]}>
                        <div class="flex gap-2">
                            <ListboxButton
                                class="clickable relative flex h-12 w-full flex-1 cursor-pointer items-center justify-between px-4 {label ===
                                    field.label && 'text-gray-400'}"
                            >
                                {label}
                                <IconCaretDownFill class="text-gray-600" />
                            </ListboxButton>
                            {#if $qp[field.label]}
                                <button
                                    class="clickable-with-icon size-12 text-gray-600"
                                    on:click={() => {
                                        $qp[field.label] = undefined
                                    }}
                                >
                                    <IconXCircleFill />
                                </button>
                            {/if}
                        </div>

                        <ListboxOptions class="bordered translate-y-4">
                            {#each field.values as v (v)}
                                {@const checked = $qp[field.label] === v}
                                <ListboxOption
                                    class="flex cursor-pointer items-center gap-2 px-4 py-1.5 first:pt-4 last:pb-4"
                                    value={v}
                                >
                                    {#if checked}
                                        <IconCheckCircleFill class="text-xl" />
                                    {:else}
                                        <IconCircleFill
                                            class="text-xl text-gray-600"
                                        />
                                    {/if}
                                    <span
                                        class="text-sm {!checked &&
                                            'text-gray-400'}"
                                    >
                                        {v}
                                    </span>
                                </ListboxOption>
                            {/each}
                        </ListboxOptions>
                    </Listbox>
                {:else}
                    <RadioGroup bind:value={$qp[field.label]}>
                        <RadioGroupLabel
                            class="mb-2 inline-flex items-center gap-2"
                        >
                            <span>{field.label}</span>
                            {#if $qp[field.label]}
                                <button
                                    class="flex text-gray-600 hover:text-gray-100"
                                    on:click={() => {
                                        $qp[field.label] = undefined
                                    }}
                                >
                                    <IconXCircleFill />
                                </button>
                            {/if}
                        </RadioGroupLabel>

                        <ul class="flex flex-wrap gap-2">
                            {#each field.values as value}
                                <RadioGroupOption
                                    class="clickable flex cursor-pointer items-center gap-2 px-2 py-1.5"
                                    {value}
                                    let:checked
                                >
                                    {#if checked}
                                        <IconCheckCircleFill class="text-xl" />
                                    {:else}
                                        <IconCircleFill
                                            class="text-xl text-gray-600"
                                        />
                                    {/if}
                                    <span
                                        class="text-sm {!checked &&
                                            'text-gray-400'}"
                                    >
                                        {value}
                                    </span>
                                </RadioGroupOption>
                            {/each}
                        </ul>
                    </RadioGroup>
                {/if}
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
                on:click={() => {
                    if (Number($qp.page) > 1) {
                        $qp.page = String(Number($qp.page) - 1)
                    }
                }}
                isDisabled={Number($qp.page) === 1}
            >
                Previous
            </PaginationButton>
            <span>{$qp.page}/{pageCount}</span>
            <PaginationButton
                on:click={() => {
                    if (Number($qp.page) < pageCount) {
                        $qp.page = String(Number($qp.page) + 1)
                    }
                }}
                isDisabled={Number($qp.page) === pageCount}
            >
                Next
            </PaginationButton>
        </Pagination>
    {/if}
</div>
