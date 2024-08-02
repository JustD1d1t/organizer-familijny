// nuxt.config.ts
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/ionic",
        "@nuxtjs/tailwindcss",
        "@nuxt/test-utils/module",
        "@pinia/nuxt",
        "@nuxt/fonts"
    ],
    plugins: ["~/plugins/firebase"],
    css: ["@/assets/scss/styles.scss", "@/theme/variables.css"],
    nitro: {
        serverHandlers: [
            {
                route: "/api/proxy",
                handler: "~/server/api/proxy.ts",
            },
        ],
    },
    // typescript: {
    //   typeCheck: true,
    // },
})