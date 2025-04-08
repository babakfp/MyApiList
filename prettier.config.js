/** @type {import("prettier").Config & import("prettier-plugin-svelte").PluginConfig & import("@ianvs/prettier-plugin-sort-imports").PluginConfig} */
export default {
    semi: false,
    tabWidth: 4,
    experimentalOperatorPosition: "start",
    experimentalTernaries: true,
    plugins: [
        "prettier-plugin-svelte",
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
    ],
    importOrder: [
        "^@",
        "<THIRD_PARTY_MODULES>",
        "^\\$(?!lib/)",
        "^\\$lib/",
        "^[.]",
    ],
}
