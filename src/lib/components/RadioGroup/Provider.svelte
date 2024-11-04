<script lang="ts">
    import { setContext, type Snippet } from "svelte"
    import { type RadioGroupContext } from "./state.svelte"

    let {
        children,
        radioGroup,
    }: {
        children: Snippet
        radioGroup: RadioGroupContext
    } = $props()

    setContext("radioGroup", radioGroup)
</script>

{@render children()}
