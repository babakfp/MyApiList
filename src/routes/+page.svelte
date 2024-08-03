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
    import { apis, apisPropsKeys, apisPropsKeysValues, type Api } from "$lib/db"

    const qp = queryParameters()

    if (!$qp.page) {
        $qp.page = 1
    }

    if (!$qp.pageSize) {
        $qp.pageSize = 10
    }

    const idx = lunr(function () {
        this.ref("url")
        this.field("name")
        this.field("description")

        apisPropsKeys.forEach((p) => {
            this.field(p)
        })

        apis.forEach((api) => {
            this.add(api)
        }, this)
    })

    let apisToShow: Api[] = []
    let pageApis: Api[] = []

    $: {
        apisToShow = apis

        apisPropsKeysValues.forEach((kv) => {
            if ($qp[kv.label]) {
                apisToShow = apisToShow.filter((api) => {
                    return api.props[kv.label] === $qp[kv.label]
                })
            }
        })

        $qp.page = 1

        pageApis = apisToShow.slice(
            (Number($qp.page) - 1) * $qp.pageSize,
            Number($qp.page) * $qp.pageSize,
        )
    }

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
        class="flex size-12 items-center justify-center border-2 border-gray-800 text-gray-600 hover:text-gray-100"
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
                        <ListboxButton
                            class="relative flex h-12 w-full cursor-pointer items-center justify-between border-2 border-gray-800 px-4 {label ===
                                field.label && 'text-gray-400'}"
                        >
                            {label}
                            <IconCaretDownFill class="text-gray-600" />
                            {#if $qp[field.label]}
                                <button
                                    class="absolute right-4 h-12 -translate-x-4 px-4 text-gray-600 inset-y-center hover:text-gray-100"
                                    on:click={() => {
                                        $qp[field.label] = undefined
                                    }}
                                >
                                    <IconXCircleFill />
                                </button>
                            {/if}
                        </ListboxButton>
                        <ListboxOptions
                            class="translate-y-4 border-2 border-gray-800"
                        >
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
                        <RadioGroupLabel class="mb-2 flex items-center gap-2">
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
                                    class="flex cursor-pointer items-center gap-2 border-2 border-gray-800 px-2 py-1.5"
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
                <ApiCard {...api} />
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
                        $qp.page = Number($qp.page) - 1
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
                        $qp.page = Number($qp.page) + 1
                    }
                }}
                isDisabled={Number($qp.page) === pageCount}
            >
                Next
            </PaginationButton>
        </Pagination>
    {/if}
</div>
