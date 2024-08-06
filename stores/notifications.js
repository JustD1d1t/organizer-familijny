import { defineStore } from "pinia"
const { addDocument, deleteDocument, updateDocument, queryDocsInCollection } =
    useFirebase()
import { getAuth } from "firebase/auth"
const auth = getAuth()
const { backendUrl } = useConfig()

export const useNotificationsStore = defineStore({
    id: "pantries-store",
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
            const response = await fetch(
                `${backendUrl}/notifications/get-all?userId=${auth.currentUser.uid}`
            )
            const data = await response.json()
            this.setNotifications(data.notifications)
        },
        async updateNotification(notification) {
            const response = await fetch(
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
            const response = await fetch(`${backendUrl}/notifications/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notification,
                    userId,
                }),
            })
            const data = await response.json()
            return data.id
        },
    },
})
