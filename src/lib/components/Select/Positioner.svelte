<script lang="ts">
    import { portal } from "@zag-js/svelte"
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { SelectContext } from "./state.svelte"

    let {
        children,
        ...htmlDivAttributes
    }: { children: Snippet } & HTMLAttributes<HTMLDivElement> = $props()

    const select = getContext<SelectContext>("select")
</script>

<div use:portal {...select.api.getPositionerProps()} {...htmlDivAttributes}>
    {@render children()}
</div>
