<script lang="ts">
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { SelectContext } from "./state.svelte"

    let {
        children,
        ...htmlUlAttributes
    }: { children: Snippet } & HTMLAttributes<HTMLUListElement> = $props()

    const select = getContext<SelectContext>("select")
</script>

<ul {...select.api.getContentProps()} {...htmlUlAttributes}>
    {@render children()}
</ul>
