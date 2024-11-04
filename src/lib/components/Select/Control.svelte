<script lang="ts">
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { SelectContext } from "./state.svelte"

    let {
        children,

        // HTMLAttributes<HTMLDivElement>
        ...htmlDivAttributes
    }: {
        children: Snippet
    } & HTMLAttributes<HTMLDivElement> = $props()

    const select = getContext<SelectContext>("select")
</script>

<div {...select.api.getControlProps()} {...htmlDivAttributes}>
    {@render children()}
</div>
