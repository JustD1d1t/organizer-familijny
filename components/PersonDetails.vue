<script setup>
import { StateEntries } from "@/types"

const { logoutUser } = useFirebaseAuth()

const notificationsState = useState(StateEntries.Notifications)
const userEmail = useState(StateEntries.UserEmail)
const shoppingLists = useState(StateEntries.ShoppingLists)
const recipes = useState(StateEntries.Recipes)
const expenses = useState(StateEntries.Expenses)
const notifications = useState(StateEntries.Notifications)
const collaboratedPantries = useState(StateEntries.CollaboratedPantries)

const unreadNotifications = computed(() => {
    return notificationsState.value
        ? notificationsState.value.filter((notification) => !notification.read)
        : []
})

const handleLogout = () => {
    logoutUser()
    shoppingLists.value = []
    recipes.value = []
    expenses.value = []
    notifications.value = []
    collaboratedPantries.value = []
}

const navigate = (url) => {
    navigateTo(url)
}
</script>
<template>
    <ion-menu side="end" menu-id="person" content-id="main-content">
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Użytkownik</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none" :inset="true">
                <ion-item>
                    {{ userEmail }}
                </ion-item>
            </ion-list>
            <ion-list lines="none" :inset="true">
                <ion-menu-toggle auto-hide="false">
                    <ion-item
                        router-direction="root"
                        @click="navigate('/notifications')"
                    >
                        <ion-badge slot="end" v-if="unreadNotifications.length">
                            {{ unreadNotifications.length }}
                        </ion-badge>
                        Powiadomienia
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        @click="navigate('/family')"
                    >
                        Rodzina
                    </ion-item>
                    <ion-item @click="handleLogout()"> Wyloguj </ion-item>
                </ion-menu-toggle>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>
