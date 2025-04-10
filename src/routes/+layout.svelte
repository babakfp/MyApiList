<script lang="ts">
    import "$lib/app.css"
    import Footer from "$lib/components/Footer.svelte"

    let { children } = $props()
</script>

{@render children()}

<Footer />
