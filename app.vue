<script setup>
import { App as CapacitorApp } from "@capacitor/app"
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import "swiper/swiper-bundle.css"
import { StateEntries } from "./types"
const route = useRoute()
defineCustomElements(window)
const auth = getAuth()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { queryExpenses } = expensesStore

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
    if (!canGoBack) {
        CapacitorApp.exitApp()
    }
})

const familyMembersStore = useFamilyMembersStore()
const { getFamilyDetails } = familyMembersStore

const pantriesStore = usePantriesStore()
const { getAllPantries } = pantriesStore

const notificationsStore = useNotificationsStore()
const { getNotifications } = notificationsStore

const uid = useState(StateEntries.Uid)
const isLoading = ref(true)

const userEmail = useState(StateEntries.UserEmail)

const downloadExpenses = async () => {
    await queryExpenses()
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userEmail.value = user.email
        isLoading.value = true
        uid.value = user.uid
        await getNotifications()
        await getAllPantries()

        isLoading.value = false
        await getFamilyDetails()
    } else {
        isLoading.value = false
        uid.value = null
    }
})
</script>
<template>
    <ion-app>
        <ion-page v-if="isLoading">
            <ion-header>
                <ion-toolbar class="ion-color-primary ion-color">
                    <ion-title>Family organizer</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div class="w-full flex justify-center items-center h-full">
                    <ion-spinner name="lines-sharp"></ion-spinner>
                </div>
            </ion-content>
        </ion-page>
        <ion-split-pane when="md" content-id="main-content" v-else>
            <person-details />
            <expense-filter @downloadExpenses="downloadExpenses" />
            <!-- <settings /> -->
            <ion-router-outlet id="main-content" />
        </ion-split-pane>
    </ion-app>
</template>
<style lang="scss" scoped>
ion-spinner {
    width: 100px;
    height: 100px;
}
</style>
