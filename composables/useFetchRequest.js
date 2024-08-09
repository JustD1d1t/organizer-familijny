export const useFetchRequest = () => {
    const request = async (url, options) => {
        try {
            const response = await fetch(url, {
                ...options,
                credentials: "include",
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error(error)
        }
    }
    return {
        request,
    }
}
