import { App } from "@capacitor/app"

App.addListener("appUrlOpen", (event) => {
    const url = event.url

    if (url.includes("https://family-organizer.com")) {
        window.location.href = "/verify-email"
    }
})
