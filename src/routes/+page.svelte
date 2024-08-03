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
    import { unique } from "remeda"
    import { queryParameters } from "sveltekit-search-params"
    import ApiCard from "$lib/components/ApiCard.svelte"
    import ApiSearchBox from "$lib/components/ApiSearchBox.svelte"
    import { apis, type Api } from "$lib/db"

    const qp = queryParameters()

    const apiProperties = apis.map((a) => a.properties)
    const apiPropertyKeys = unique(
        apis.flatMap((a) => Object.keys(a.properties)),
    )
    const apiPropertyKeysAndValues = apiPropertyKeys.map((p) => ({
        label: p,
        values: unique(apiProperties.map((a) => a[p])),
    }))

    const idx = lunr(function () {
        this.ref("url")
        this.field("name")
        this.field("description")

        apiPropertyKeys.forEach((p) => {
            this.field(p)
        })

        apis.forEach((api) => {
            this.add(api)
        }, this)
    })

    let apisToShow: Api[] = []

    $: {
        apisToShow = apis

        apiPropertyKeysAndValues.forEach((kv) => {
            if ($qp[kv.label]) {
                apisToShow = apisToShow.filter((api) => {
                    return api.properties[kv.label] === $qp[kv.label]
                })
            }
        })
    }

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
        {#each apiPropertyKeysAndValues as field}
            <li>
                {#if field.label === "Category"}
                    {@const label = $qp[field.label] || field.label}

                    <Listbox bind:value={$qp[field.label]}>
                        <ListboxButton
                            class="flex h-12 w-full cursor-pointer items-center justify-between border-2 border-gray-800 px-4 {label ===
                                field.label && 'text-gray-400'}"
                        >
                            {label}
                            <IconCaretDownFill class="text-gray-600" />
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
                        <RadioGroupLabel class="mb-2 inline-block">
                            {field.label}
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

<div class="mt-4">
    {#if apisToShow.length}
        <ul class="space-y-4">
            {#each apisToShow as api}
                <ApiCard {...api} />
            {/each}
        </ul>
    {:else}
        <p>No results found.</p>
    {/if}
</div>
