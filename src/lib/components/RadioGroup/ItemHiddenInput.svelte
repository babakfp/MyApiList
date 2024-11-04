<script lang="ts">
    import * as radio from "@zag-js/radio-group"
    import { getContext } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { RadioGroupContext } from "./state.svelte"

    let {
        // radio.ItemProps
        value,
        disabled,
        invalid,

        // HTMLAttributes<HTMLInputElement>
        ...htmlInputAttributes
    }: radio.ItemProps & HTMLAttributes<HTMLInputElement> = $props()

    const radioGroup = getContext<RadioGroupContext>("radioGroup")
</script>

<input
    {...radioGroup.api.getItemHiddenInputProps({ value, disabled, invalid })}
    {...htmlInputAttributes}
/>
