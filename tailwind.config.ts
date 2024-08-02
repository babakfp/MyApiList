import { omit } from "remeda"
import type { Config } from "tailwindcss"
import { allAddons } from "tailwindcss-addons"
import { fontWeight } from "tailwindcss/defaultTheme"

export default {
    content: ["./src/**/*.{html,svelte}"],
    theme: {
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
    plugins: [...allAddons()],
} satisfies Config
