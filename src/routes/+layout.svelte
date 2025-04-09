<script lang="ts">
    import "$lib/app.css"
    import Footer from "$lib/components/Footer.svelte"

    let { children } = $props()
</script>

<main class="container pt-8 pb-16">
    {@render children()}
</main>

<Footer />
