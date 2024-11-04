<script lang="ts">
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { SelectContext } from "./state.svelte"

    let {
        children,
        ...htmlLabelAttributes
    }: { children: Snippet } & HTMLAttributes<HTMLLabelElement> = $props()

    const select = getContext<SelectContext>("select")
</script>

<label {...select.api.getLabelProps()} {...htmlLabelAttributes}>
    {@render children()}
</label>
