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

        // HTMLAttributes<HTMLSpanElement>
        ...htmlSpanAttributes
    }: {
        children: Snippet
    } & select.ItemProps &
        HTMLAttributes<HTMLSpanElement> = $props()

    const select_ = getContext<SelectContext>("select")
</script>

<span
    {...select_.api.getItemTextProps({ item, persistFocus })}
    {...htmlSpanAttributes}
>
    {@render children()}
</span>
