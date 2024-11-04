<script lang="ts">
    import { type Snippet } from "svelte"
    import Provider from "./Provider.svelte"
    import { type RadioGroupContext } from "./state.svelte"

    let {
        children,
        radioGroup,
    }: {
        children: Snippet
        radioGroup: RadioGroupContext
    } = $props()
</script>

<Provider {radioGroup}>
    <div {...radioGroup.api.getRootProps()}>
        {@render children()}
    </div>
</Provider>
