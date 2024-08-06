<script setup>
import { App as CapacitorApp } from "@capacitor/app"
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import "swiper/swiper-bundle.css"
import { StateEntries } from "./types"
const route = useRoute()
defineCustomElements(window)
const auth = getAuth()
const { queryDocsByCollection, queryDoc, queryDocsInCollection } = useFirebase()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { queryExpenses } = expensesStore

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
    if (!canGoBack) {
        CapacitorApp.exitApp()
    }
})

const familyMembersDetails = useState(
    StateEntries.FamilyMembersDetails,
    () => []
)
const familyMembers = useState(StateEntries.FamilyMembers, () => [])
const familyId = useState(StateEntries.FamilyId)
const notificationsState = useState(StateEntries.Notifications, () => [])
const pantries = useState(StateEntries.Pantries, () => [])
const collaboratedPantries = useState(
    StateEntries.CollaboratedPantries,
    () => []
)

const uid = useState(StateEntries.Uid)
const isLoading = ref(true)

const userEmail = useState(StateEntries.UserEmail)
const loadFamily = async () => {
    let family = await queryDoc(["family"], uid.value)
    if (family.membersDetails?.length) {
        familyMembersDetails.value = family.membersDetails
        familyMembers.value = family.members
        familyId.value = family.id
    } else {
        family = await queryDocsInCollection(["family"], false, [
            {
                key: "members",
                value: uid.value,
                statement: "array-contains",
            },
        ])
        if (family.length) {
            const searchedFamily = family[0]
            familyMembersDetails.value = searchedFamily.membersDetails
            familyMembers.value = searchedFamily.members
            familyId.value = searchedFamily.id
        }
    }
}

const downloadExpenses = async () => {
    await queryExpenses()
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userEmail.value = user.email
        isLoading.value = true
        uid.value = user.uid
        if (notificationsState.value.length) return
        const notifications = await queryDocsByCollection([
            StateEntries.Notifications,
            "users",
            uid.value,
        ])
        pantries.value = await queryDocsInCollection(
            [StateEntries.Pantries],
            false,
            [
                {
                    key: "ownerId",
                    value: uid.value,
                    statement: "==",
                },
            ]
        )
        collaboratedPantries.value = await queryDocsInCollection(
            [StateEntries.Pantries],
            false,
            [
                {
                    key: "members",
                    value: uid.value,
                    statement: "array-contains",
                },
            ]
        )

        notificationsState.value = notifications
        isLoading.value = false
        await loadFamily()
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
