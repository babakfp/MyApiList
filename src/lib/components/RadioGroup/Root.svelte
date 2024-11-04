<script lang="ts">
    import * as radio from "@zag-js/radio-group"
    import { type Snippet } from "svelte"
    import RootProvider from "./RootProvider.svelte"
    import { useRadioGroup } from "./state.svelte"

    let {
        children,
        ...context
    }: {
        children: Snippet
    } & radio.Context = $props()

    const radioGroup = useRadioGroup(context)
</script>

<RootProvider {radioGroup}>
    {@render children()}
</RootProvider>
