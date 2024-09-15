<script setup>
import { App as CapacitorApp } from "@capacitor/app"
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import "swiper/swiper-bundle.css"
defineCustomElements(window)
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { queryExpenses } = expensesStore
const familyMembersStore = useFamilyMembersStore()
const { getFamilyDetails } = familyMembersStore
const nofiticationsStore = useNotificationsStore()
const { getNotifications } = nofiticationsStore
const newspapersStore = useNewspapersStore()
const { setShops } = newspapersStore
const userStore = useUserStore()
const { logoutUser, getUserData } = userStore
const { uid, email, emailVerified, nickname } = storeToRefs(userStore)
const route = useRoute()

CapacitorApp.addListener("backButton", (e) => {
    if (!e.canGoBack) {
        CapacitorApp.exitApp()
    }
})
const isLoading = ref(false)

const isMobile = ref(true)

const onWidthChange = () => {
    if (window.innerWidth < 750) {
        isMobile.value = true
    } else {
        isMobile.value = false
    }
}

onMounted(async () => {
    window.addEventListener("resize", onWidthChange)
    isMobile.value = window.innerWidth < 750
    const localUid = localStorage.getItem("uid")
    const localEmail = localStorage.getItem("email")
    const localEmailVerified = localStorage.getItem("emailVerified")
    const localNickname = localStorage.getItem("nickname")
    const localIdToken = localStorage.getItem("idToken")
    await getUserData()
    if (localStorage.getItem("uid")) {
        await getFamilyDetails()
        await getNotifications()
        setShops()
    }
    const localEmailVerifiedBool = localEmailVerified === "true"
    if (
        !localUid ||
        uid.value !== localUid ||
        !localEmail ||
        email.value !== localEmail ||
        !localEmailVerified ||
        emailVerified.value !== localEmailVerifiedBool ||
        !localNickname ||
        nickname.value !== localNickname ||
        !localIdToken
    ) {
        await logoutUser()
        return
    }
})

const downloadExpenses = async () => {
    await queryExpenses()
    await menuController.close("expense-filter")
}
</script>
<template>
    <ion-app>
        <ion-page v-if="isLoading">
            <ion-header style="background: var(--ion-color-light);">
                <ion-toolbar>
                    <ion-title>Cześć</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div class="w-full flex justify-center items-center h-full">
                    <ion-spinner name="lines-sharp"></ion-spinner>
                </div>
            </ion-content>
        </ion-page>
        <ion-page v-else-if="!isMobile">
            <ion-header style="background: var(--ion-color-light);">
                <ion-toolbar>
                    <ion-title>Cześć</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div class="flex flex-col items-center justify-center h-full">
                    <h2>Masz za dużą szerokość. Maksymalna to 750px</h2>
                </div>
            </ion-content>
        </ion-page>
        <ion-split-pane when="md" content-id="main-content" v-else>
            <person-details />
            <expense-filter @downloadExpenses="downloadExpenses" />
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
