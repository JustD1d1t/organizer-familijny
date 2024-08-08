import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const uid = localStorage.getItem("uid")
const { request } = useFetch()

export const useNotificationsStore = defineStore({
    id: "notifications-store",
    state: () => {
        return {
            notifications: [],
        }
    },
    actions: {
        setNotifications(notifications) {
            this.notifications = [...notifications]
        },
        clearNotifications() {
            this.notifications = []
        },
        async getNotifications() {
            const data = await request(
                `${backendUrl}/notifications/get-all?userId=${uid}`
            )
            this.setNotifications(data.notifications)
        },
        async updateNotification(notification) {
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
            const notificationIndex = this.notifications.findIndex(
                (n) => n.id === notification.id
            )
            this.notifications.splice(notificationIndex, 1, {
                ...notification,
                id: notification.id,
            })
        },
        async sendNotification(notification, userId) {
            const data = await request(`${backendUrl}/notifications/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notification, userId }),
            })
            return data.id
        },
    },
})
