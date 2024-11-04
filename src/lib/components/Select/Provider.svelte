<script lang="ts">
    import { setContext, type Snippet } from "svelte"
    import { type SelectContext } from "./state.svelte"

    let {
        children,
        select,
    }: {
        children: Snippet
        select: SelectContext
    } = $props()

    setContext("select", select)
</script>

{@render children()}
