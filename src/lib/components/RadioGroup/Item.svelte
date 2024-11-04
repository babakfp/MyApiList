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

        // HTMLAttributes<HTMLLabelElement>
        ...htmlLabelAttributes
    }: {
        children: Snippet
    } & radio.ItemProps &
        HTMLAttributes<HTMLLabelElement> = $props()

    const radioGroup = getContext<RadioGroupContext>("radioGroup")
</script>

<label
    {...radioGroup.api.getItemProps({ value, disabled, invalid })}
    {...htmlLabelAttributes}
>
    {@render children()}
</label>
