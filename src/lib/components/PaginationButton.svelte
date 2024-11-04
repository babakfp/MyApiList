<script lang="ts">
    import { type Snippet } from "svelte"
    import { type MouseEventHandler } from "svelte/elements"

    let {
        isDisabled,
        onclick,
        children,
    }: {
        isDisabled?: boolean
        onclick: MouseEventHandler<HTMLButtonElement>
        children: Snippet
    } = $props()
</script>

<button
    class="h-12 bg-gray-900 px-4 clickable {isDisabled &&
        'cursor-not-allowed opacity-25'}"
    {onclick}
    disabled={isDisabled}
>
    {@render children()}
</button>
