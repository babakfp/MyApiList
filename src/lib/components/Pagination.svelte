<script lang="ts">
    import { type Snippet } from "svelte"

    let {
        children,
    }: {
        children: Snippet
    } = $props()
</script>

<nav
    class="sticky bottom-0 grid grid-cols-[1fr_auto_1fr] items-center gap-6 bg-gray-900"
>
    {@render children()}
</nav>
