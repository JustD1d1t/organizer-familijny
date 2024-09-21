export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    // app: {
    //     baseURL: "/organizer-familijny-deploy/",
    //     buildAssetsDir: "assets",
    // },
    buildModules: ["@nuxtjs/style-resources"],
    modules: [
        "@nuxtjs/ionic",
        "@nuxtjs/tailwindcss",
        "@nuxt/test-utils/module",
        "@pinia/nuxt",
        "@nuxt/fonts",
        "nuxt-echarts",
        // "@nuxt/http",
        // "@nuxtjs/proxy",
    ],
    css: ["@/assets/scss/styles.scss", "@/theme/variables.css"],
    styleResources: {
        scss: ["@/assets/scss/variables.scss"], // Tutaj importuj tylko plik z zmiennymi, nie cały styles.scss
    },
    plugins: [{ src: "~/plugins/file-jsevent-ex.js", mode: "client" }],
    // typescript: {
    //   typeCheck: true,
    // },
    // http: {
    //     proxy: true,
    // },
    // proxy: {
    //     "/api/": {
    //         target: "https://your-backend-url.com",
    //         secure: false, // jeśli masz problem z certyfikatami samopodpisanymi
    //         changeOrigin: true,
    //         pathRewrite: {
    //             "^/api/": "",
    //         },
    //     },
    // },
})
