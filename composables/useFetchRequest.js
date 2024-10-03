const { backendUrl } = useConfig()
export const useFetchRequest = () => {
    const request = async (url, options) => {
        try {
            const token = localStorage.getItem("idToken")
            const updatedHeaders = {
                ...options?.headers, // Istniejące nagłówki (jeśli są)
                Authorization: `Bearer ${token}`, // Dodanie nagłówka Authorization
            }
            const response = await fetch(url, {
                ...options,
                credentials: "include",
                headers: updatedHeaders,
            })
            if (response.status === 401) {
                const refreshResponse = await fetch(
                    `${backendUrl}/token/refresh-token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        headers: {
                            refreshToken: localStorage.getItem("refreshToken"),
                        },
                    }
                )
                const dataResponse = await refreshResponse.json()
                if (dataResponse.idToken) {
                    localStorage.setItem("idToken", dataResponse.idToken)
                    localStorage.setItem(
                        "refreshToken",
                        dataResponse.refreshToken
                    )
                    return await request(url, options)
                }
            }
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
