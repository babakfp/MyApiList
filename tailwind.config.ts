import { omit } from "remeda"
import type { Config } from "tailwindcss"
import { allAddons } from "tailwindcss-addons"
import { zinc } from "tailwindcss/colors"
import { fontWeight } from "tailwindcss/defaultTheme"
import { default as plugin } from "tailwindcss/plugin"

export default {
    content: ["./src/**/*.{html,svelte}"],
    theme: {
        extend: {
            colors: {
                gray: zinc,
                favicon: {
                    100: "#f2c029",
                    200: "#f2921d",
                    300: "#f26938",
                },
            },
            container: {
                center: true,
                padding: "1rem",
            },
        },
        fontFamily: {
            sans: ["Recursive Variable"],
            mono: ["Recursive Variable", { fontVariationSettings: "'MONO' 1" }],
        },
        fontWeight: {
            ...omit(fontWeight, ["thin", "extralight"]),
            extrablack: "1000",
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
        disableColorOpacityUtilitiesByDefault: true,
    },
    plugins: [
        ...allAddons(),
        plugin(({ addUtilities }) => {
            addUtilities({
                ".bordered": {},
                ".clickable": {},
                ".clickable-with-icon": {},
                ".writable": {},
            })
        }),
    ],
} satisfies Config
