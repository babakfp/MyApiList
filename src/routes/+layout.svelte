<script lang="ts">
    import "$lib/app.css"
    import "@fontsource-variable/recursive/mono.css"
    import recursiveMonoUrl from "@fontsource-variable/recursive/files/recursive-latin-mono-normal.woff2?url"
</script>

<svelte:head>
    <link
        rel="preload"
        as="font"
        type="font/woff2"
        href={recursiveMonoUrl}
        crossorigin="anonymous"
    />
</svelte:head>

<slot />
