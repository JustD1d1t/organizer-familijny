import { defineEventHandler, getQuery } from "h3"
import axios from "axios"

export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)
    if (!url) {
        event.res.statusCode = 400
        return { error: "Missing URL parameter" }
    }

    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0", // Możesz tutaj ustawić nagłówki, których potrzebujesz
            },
        })
        return response.data
    } catch (error) {
        console.error("Error fetching the URL:", error)
        event.res.statusCode = 500
        return { error: "Failed to fetch the URL" }
    }
})
