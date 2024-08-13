<script lang="ts">
    export let isDisabled = false
</script>

<button
    class="h-12 bg-gray-900 px-4 clickable {isDisabled &&
        'cursor-not-allowed opacity-25'}"
    on:click
    disabled={isDisabled}
>
    <slot />
</button>
