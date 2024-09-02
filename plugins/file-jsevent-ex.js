import { App } from "@capacitor/app"

App.addListener("appUrlOpen", (event) => {
    const url = event.url

    if (url.includes("https://justd1d1t.github.io/organizer-familijny/app")) {
        const slug = url.split("/app")[1]
        window.location.href = slug
    }
})
