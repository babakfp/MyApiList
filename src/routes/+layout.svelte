<script lang="ts">
    import "$lib/app.css"
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
    {@html `<style>
        @font-face {
            font-family: 'Recursive Variable';
            font-style: normal;
            font-display: block;
            font-weight: 300 1000;
            src: url(${recursiveMonoUrl}) format('woff2-variations');
            unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
        }
    </style>`}
</svelte:head>

<main class="container pb-16 pt-8">
    <slot />
</main>

<footer class="border-t border-gray-800 py-8">
    <ul class="container list-inside list-disc space-y-2 text-sm">
        <li>
            Made by
            <a class="underline" href="https://babakfp.ir" target="_blank">
                Babak
            </a>
        </li>
        <li>
            Source code on
            <a
                class="underline"
                href="https://github.com/babakfp/MyApiList"
                target="_blank"
            >
                GitHub
            </a>
        </li>
        <li>
            Favicon by
            <a class="underline" href="https://flaticon.com" target="_blank">
                FlatIcon
            </a>
        </li>
    </ul>
</footer>
