<script lang="ts">
    import * as select from "@zag-js/select"
    import { getContext, type Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"
    import type { SelectContext } from "./state.svelte"

    let {
        children,

        // select.ItemProps
        item,
        persistFocus,

        // HTMLAttributes<HTMLLIElement>
        ...htmlLiAttributes
    }: {
        children: Snippet
    } & select.ItemProps &
        HTMLAttributes<HTMLLIElement> = $props()

    const select_ = getContext<SelectContext>("select")
</script>

<li {...select_.api.getItemProps({ item, persistFocus })} {...htmlLiAttributes}>
    {@render children()}
</li>
