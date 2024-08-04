<script lang="ts">
    export let isDisabled = false
</script>

<li>
    <button
        class="clickable h-12 bg-gray-900 px-4 {isDisabled &&
            'cursor-not-allowed opacity-50'}"
        on:click
        disabled={isDisabled}
    >
        <slot />
    </button>
</li>
