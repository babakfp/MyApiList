<script lang="ts">
    import * as select from "@zag-js/select"
    import { type Snippet } from "svelte"
    import RootProvider from "./RootProvider.svelte"
    import { useSelect } from "./state.svelte"

    let {
        children,
        ...context
    }: {
        children: Snippet
    } & select.Context = $props()

    const select_ = useSelect(context)
</script>

<RootProvider select={select_}>
    {@render children()}
</RootProvider>
