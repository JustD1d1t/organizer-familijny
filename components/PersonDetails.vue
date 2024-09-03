<script setup>
import { StateEntries } from "@/types"

// const { logoutUser } = useFirebaseAuth()
const userStore = useUserStore()
const { logoutUser } = userStore
const { email } = storeToRefs(userStore)
const localStorageMail = localStorage.getItem("email")
const userEmail = email ?? localStorageMail
const emailVerified = localStorage.getItem("emailVerified")

const shoppingListsStore = useShoppingListsStore()
const recipesStore = useRecipesStore()
const expensesStore = useExpensesStore()
const notificationsStore = useNotificationsStore()
const pantriesStore = usePantriesStore()

const { clearShoppingLists } = shoppingListsStore
const { clearRecipes } = recipesStore
const { clearExpenses } = expensesStore
const { clearNotifications } = notificationsStore
const { clearPantries } = pantriesStore

const { notifications } = storeToRefs(notificationsStore)

const unreadNotifications = computed(() => {
    return notifications.value
        ? notifications.value.filter((notification) => !notification.read)
        : []
})

const handleLogout = () => {
    localStorage.removeItem("uid")
    logoutUser()
    clearShoppingLists()
    clearRecipes()
    clearExpenses()
    clearNotifications()
    clearPantries()
    navigateTo("/login")
}

const navigate = (url) => {
    navigateTo(url)
}
</script>
<template>
    <ion-menu
        side="end"
        menu-id="person"
        content-id="main-content"
        swipeGesture="false"
    >
        <ion-header>
            <ion-toolbar>
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
                        v-if="emailVerified !== 'false'"
                        router-direction="root"
                        @click="navigate('/notifications')"
                    >
                        <ion-badge slot="end" v-if="unreadNotifications.length">
                            {{ unreadNotifications.length }}
                        </ion-badge>
                        Powiadomienia
                    </ion-item>
                    <ion-item
                        v-if="emailVerified !== 'false'"
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
