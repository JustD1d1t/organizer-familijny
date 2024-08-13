export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    buildModules: ["@nuxtjs/style-resources"],
    modules: [
        "@nuxtjs/ionic",
        "@nuxtjs/tailwindcss",
        "@nuxt/test-utils/module",
        "@pinia/nuxt",
        "@nuxt/fonts",
    ],
    css: ["@/assets/scss/styles.scss", "@/theme/variables.css"],
    nitro: {
        serverHandlers: [
            {
                route: "/api/proxy",
                handler: "~/server/api/proxy.ts",
            },
        ],
    },
    styleResources: {
        scss: ["@/assets/scss/variables.scss"], // Tutaj importuj tylko plik z zmiennymi, nie cały styles.scss
    },
    // typescript: {
    //   typeCheck: true,
    // },
})
