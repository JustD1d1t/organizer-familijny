import { App } from "@capacitor/app"

App.addListener("appUrlOpen", (event) => {
    const url = event.url

    if (url.includes("foapp://family")) {
        window.location.href = "/verify-email"
    }
})
