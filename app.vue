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
const route = useRoute()

CapacitorApp.addListener("backButton", (e) => {
    if (!e.canGoBack) {
        CapacitorApp.exitApp()
    }
})
const isLoading = ref(false)

onMounted(async () => {
    if (localStorage.getItem("uid")) {
        await getFamilyDetails()
    }
})

const downloadExpenses = async () => {
    await queryExpenses()
}
</script>
<template>
    <ion-app>
        <ion-page v-if="isLoading">
            <ion-header>
                <ion-toolbar >
                    <ion-title>Cześć</ion-title>
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
