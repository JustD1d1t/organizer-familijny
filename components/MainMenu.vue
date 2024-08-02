<script setup>
import { getAuth } from "firebase/auth"
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { logoutUser } = useFirebaseAuth()
const route = useRoute()
const { onSnapshotCollection } = useFirebase()

const auth = getAuth()

const notificationsState = useState(StateEntries.Notifications)
const userEmail = useState(StateEntries.UserEmail)
const shoppingLists = useState(StateEntries.ShoppingLists)
const recipes = useState(StateEntries.Recipes)
const expenses = useState(StateEntries.Expenses)
const notifications = useState(StateEntries.Notifications)
const collaboratedPantries = useState(StateEntries.CollaboratedPantries)

const setNotificationsAfterSnap = (notifications) => {
    notificationsState.value = notifications
}

const isActive = (path) => {
    if (path === "/") {
        return route.path === path
    } else {
        return route.path.includes(path)
    }
}

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

onMounted(() => {
    onSnapshotCollection(
        [StateEntries.Notifications, "users", auth.currentUser.uid],
        setNotificationsAfterSnap
    )
})
</script>
<template>
    <ion-menu side="end" content-id="main-content">
        <ion-header>
            <ion-toolbar color="danger">
                <ion-title>Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none">
                <ion-item>
                    {{ userEmail }}
                </ion-item>
                <ion-menu-toggle auto-hide="false">
                    <ion-item
                        router-direction="root"
                        router-link="/"
                        :style="{
                            '--background': isActive('/') && 'lightgrey',
                        }"
                    >
                        Strona główna
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        router-link="/shopping-lists"
                        :style="{
                            '--background':
                                isActive('/shopping-lists') && 'lightgrey',
                        }"
                    >
                        Listy zakupowe
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        router-link="/recipes"
                        :style="{
                            '--background': isActive('/recipes') && 'lightgrey',
                        }"
                    >
                        Przepisy
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        router-link="/expenses"
                        :style="{
                            '--background':
                                isActive('/expenses') && 'lightgrey',
                        }"
                    >
                        Wydatki
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        router-link="/pantries"
                        :style="{
                            '--background':
                                isActive('/pantries') && 'lightgrey',
                        }"
                    >
                        Spiżarnia
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        router-link="/notifications"
                        :style="{
                            '--background':
                                isActive('/notifications') && 'lightgrey',
                        }"
                    >
                        <ion-badge
                            slot="end"
                            v-if="unreadNotifications.length"
                            >{{ unreadNotifications.length }}</ion-badge
                        >
                        Powiadomienia
                    </ion-item>
                    <ion-item
                        router-direction="root"
                        router-link="/family"
                        :style="{
                            '--background':
                                isActive('/notifications') && 'lightgrey',
                        }"
                    >
                        Rodzina
                    </ion-item>
                    <ion-item @click="handleLogout()"> Wyloguj </ion-item>
                </ion-menu-toggle>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>

<style scoped>
.active {
    color: green;
}
</style>
