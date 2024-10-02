import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()
import { useUserStore } from "./user"

export const useNotificationsStore = defineStore({
    id: "notifications-store",
    state: () => {
        return {
            notifications: [],
            isLoading: false,
            user: useUserStore(),
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
                `${backendUrl}/notifications/get-all?userId=${this.user.uid}`
            )
            this.setLoading(false)
            this.setNotifications(data.notifications)
        },
        async updateNotification(notification) {
            this.setLoading(true)
            await request(
                `${backendUrl}/notifications/update?userId=${this.user.uid}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ notification }),
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
                body: JSON.stringify({
                    notification: {
                        ...notification,
                        timestamp: new Date().getTime(),
                    },
                    userId,
                }),
            })
            this.setLoading(false)
            return data.id
        },
    },
})
