<script lang="ts">
    import { type Snippet } from "svelte"
    import Provider from "./Provider.svelte"
    import { type SelectContext } from "./state.svelte"

    let {
        children,
        select,
    }: {
        children: Snippet
        select: SelectContext
    } = $props()
</script>

<Provider {select}>
    <div {...select.api.getRootProps()}>
        {@render children()}
    </div>
</Provider>
