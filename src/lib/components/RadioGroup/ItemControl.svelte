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

        // HTMLAttributes<HTMLDivElement>
        ...htmlDivAttributes
    }: {
        children: Snippet
    } & radio.ItemProps &
        HTMLAttributes<HTMLDivElement> = $props()

    const radioGroup = getContext<RadioGroupContext>("radioGroup")
</script>

<div
    {...radioGroup.api.getItemControlProps({ value, disabled, invalid })}
    {...htmlDivAttributes}
>
    {@render children()}
</div>
