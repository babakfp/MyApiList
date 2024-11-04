<script lang="ts">
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { RadioGroupContext } from "./state.svelte"

    let {
        children,
        ...htmlHeadingAttributes
    }: { children: Snippet } & HTMLAttributes<HTMLHeadingElement> = $props()

    const radioGroup = getContext<RadioGroupContext>("radioGroup")
</script>

<h3 {...radioGroup.api.getLabelProps()} {...htmlHeadingAttributes}>
    {@render children()}
</h3>
