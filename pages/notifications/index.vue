<script setup>
import { StateEntries } from "@/types"

const notificationsStore = useNotificationsStore()
const { updateNotification, getNotifications } = notificationsStore
const { notifications } = storeToRefs(notificationsStore)
const openNotification = async (notification) => {
    if (!notification.read) {
        const editedNotification = { ...notification, read: true }
        await updateNotification(editedNotification)
    }
    navigateTo(`/notifications/${notification.id}`)
}

useAsyncData(async () => {
    await getNotifications()
})
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar>
                <ion-title>Powiadomienia</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none" v-if="notifications.length">
                <ion-item
                    v-for="notification in notifications"
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
