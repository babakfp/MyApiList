import type { Config } from "tailwindcss"
import { allAddons } from "tailwindcss-addons"

export default {
    content: ["./src/**/*.{html,svelte}"],
    plugins: [...allAddons()],
} satisfies Config
