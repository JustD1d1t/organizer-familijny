import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const uid = localStorage.getItem("uid")
const { request } = useFetch()

export const useNotificationsStore = defineStore({
    id: "notifications-store",
    state: () => {
        return {
            notifications: [],
            isLoading: false,
        }
    },
    actions: {
        setNotifications(notifications) {
            this.notifications = [...notifications]
        },
        clearNotifications() {
            this.notifications = []
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        async getNotifications() {
            this.setLoading(true)
            const data = await request(
                `${backendUrl}/notifications/get-all?userId=${uid}`
            )
            this.setLoading(false)
            this.setNotifications(data.notifications)
        },
        async updateNotification(notification) {
            this.setLoading(true)
            await request(
                `${backendUrl}/notifications/update?userId=${notification.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(notification),
                }
            )
            this.setLoading(false)
            const notificationIndex = this.notifications.findIndex(
                (n) => n.id === notification.id
            )
            this.notifications.splice(notificationIndex, 1, {
                ...notification,
                id: notification.id,
            })
        },
        async sendNotification(notification, userId) {
            this.setLoading(true)
            const data = await request(`${backendUrl}/notifications/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notification, userId }),
            })
            this.setLoading(false)
            return data.id
        },
    },
})
