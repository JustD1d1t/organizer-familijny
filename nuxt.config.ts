export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    app: {
        baseURL: "/organizer-familijny/",
        buildAssetsDir: "assets",
    },
    buildModules: ["@nuxtjs/style-resources"],
    modules: [
        "@nuxtjs/ionic",
        "@nuxtjs/tailwindcss",
        "@nuxt/test-utils/module",
        "@pinia/nuxt",
        "@nuxt/fonts",
        "nuxt-echarts",
    ],
    css: ["@/assets/scss/styles.scss", "@/theme/variables.css"],
    styleResources: {
        scss: ["@/assets/scss/variables.scss"], // Tutaj importuj tylko plik z zmiennymi, nie cały styles.scss
    },
    plugins: [{ src: "~/plugins/file-jsevent-ex.js", mode: "client" }],
    // typescript: {
    //   typeCheck: true,
    // },
})
