<script lang="ts">
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { SelectContext } from "./state.svelte"

    let {
        children,

        // HTMLAttributes<HTMLButtonElement>
        ...htmlButtonAttributes
    }: {
        children: Snippet
    } & HTMLAttributes<HTMLButtonElement> = $props()

    const select = getContext<SelectContext>("select")
</script>

<button {...select.api.getTriggerProps()} {...htmlButtonAttributes}>
    {@render children()}
</button>
