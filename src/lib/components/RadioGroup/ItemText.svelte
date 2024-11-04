<script lang="ts">
    import * as radio from "@zag-js/radio-group"
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { RadioGroupContext } from "./state.svelte"

    let {
        children,

        // radio.ItemProps
        value,
        disabled,
        invalid,

        // HTMLAttributes<HTMLSpanElement>
        ...htmlSpanAttributes
    }: {
        children?: Snippet
    } & radio.ItemProps &
        HTMLAttributes<HTMLSpanElement> = $props()

    const radioGroup = getContext<RadioGroupContext>("radioGroup")
</script>

<span
    {...radioGroup.api.getItemTextProps({ value, disabled, invalid })}
    {...htmlSpanAttributes}
>
    {#if children}
        {@render children()}
    {:else}
        {value}
    {/if}
</span>
