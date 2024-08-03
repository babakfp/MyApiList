<script lang="ts">
    export let isDisabled = false
</script>

<li>
    <button
        class="h-12 border-2 border-gray-800 bg-gray-900 px-4 {isDisabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-gray-100'}"
        on:click
        disabled={isDisabled}
    >
        <slot />
    </button>
</li>
