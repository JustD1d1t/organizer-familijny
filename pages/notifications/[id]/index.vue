<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const notificationsStore = useNotificationsStore()
const { updateNotification, sendNotification } = notificationsStore
const { notifications } = storeToRefs(notificationsStore)

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, getFamilyDetails } = familyMembersStore
const { familyMembersDetails, familyMembers } = storeToRefs(familyMembersStore)

const userStore = useUserStore()
const { email } = storeToRefs(userStore)

const route = useRoute()
const params = route.params

const uid = localStorage.getItem("uid")
const notification = computed(() =>
    notifications.value.find((n) => n.id === params.id)
)
const userEmail = computed(() => {
    return email.value !== "" ? email.value : localStorage.getItem("email")
})

const handleFamilyInvitation = async (accepted) => {
    const editedNotification = { ...notification.value, accepted }
    await getFamilyDetails(notification.value.ownerId)
    await updateNotification(editedNotification)

    const copiedMembersDetails = [...familyMembersDetails.value]
    const searchedMember = copiedMembersDetails.find((m) => m.id === uid)

    notification.value.accepted = accepted

    if (accepted) {
        if (searchedMember) {
            searchedMember.status = "accepted"
        }

        await updateMembers(
            familyMembersDetails.value,
            [...familyMembers.value, uid],
            notification.value.ownerId
        )
        await sendNotification(
            {
                title: `Użytkownik "${userEmail.value}" zaakceptował zaproszenie do rodziny`,
                content: `Zaproszenie do listy nie zostało zaakceptowane`,
            },
            notification.value.ownerId
        )
    } else {
        await sendNotification(
            {
                title: `Użytkownik "${userEmail.value}" nie zaakceptował zaproszenie do rodziny`,
                content: `Zaproszenie do listy zostało nie zaakceptowane`,
            },
            notification.value.ownerId
        )

        familyMembersDetails = familyMembersDetails.filter((m) => m.id !== uid)
        await updateMembers(familyMembersDetails, _, notification.value.ownerId)
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar>
                <ion-title v-if="notification">{{
                    notification.title
                }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content v-if="notification">
            <div>{{ notification.content }}</div>
            <div
                class="w-full flex justify-between flex-wrap"
                v-if="
                    notification.type === 'invitation-to-family' &&
                    notification.accepted === undefined
                "
            >
                <ion-button
                    @click="() => handleFamilyInvitation(false)"
                    color="danger"
                    >Odrzuć</ion-button
                >
                <ion-button
                    @click="() => handleFamilyInvitation(true)"
                    color="success"
                    >Akceptuj</ion-button
                >
            </div>
        </ion-content>
    </ion-page>
</template>
