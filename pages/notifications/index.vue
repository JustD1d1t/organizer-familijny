<script setup>
import { StateEntries } from "@/types"

const notificationsStore = useNotificationsStore()
const { updateNotification } = notificationsStore

const notificationsState = useState(StateEntries.Notifications, () => [])

const uid = useState(StateEntries.Uid)

const openNotification = async (notification) => {
    if (!notification.read) {
        const editedNotification = { ...notification, read: true }
        await updateNotification(editedNotification)
    }
    navigateTo(`/notifications/${notification.id}`)
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Powiadomienia</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none" v-if="notificationsState.length">
                <ion-item
                    v-for="notification in notificationsState"
                    :key="notification.id"
                    @click="() => openNotification(notification)"
                >
                    <ion-label :class="[notification.read ? '' : 'font-bold']">
                        {{ notification.title }}
                    </ion-label>
                </ion-item>
            </ion-list>
            <h2 v-else>Brak powiadomień</h2>
        </ion-content>
    </ion-page>
</template>
<style scoped>
ion-content > * {
    padding-left: 0;
    padding-right: 0;
}
</style>
