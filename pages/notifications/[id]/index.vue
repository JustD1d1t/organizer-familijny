<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const notificationsStore = useNotificationsStore()
const { updateNotification, sendNotification } = notificationsStore

const familyMembersStore = useFamilyMembersStore()
const { updateFamilyMembers } = familyMembersStore
const { membersDetails, members } = familyMembersStore

const route = useRoute()
const params = route.params

const uid = localStorage.getItem("uid")
const notificationsState = useState(StateEntries.Notifications)
const notification = computed(() =>
    notificationsState.value.find((n) => n.id === params.id)
)
const userEmail = useState(StateEntries.UserEmail)

const handleFamilyInvitation = async (accepted) => {
    const editedNotification = { ...notification.value, accepted }
    await updateNotification(editedNotification)

    const copiedMembersDetails = [...membersDetails.value]
    const searchedMember = copiedMembersDetails.find((m) => m.id === uid)

    notification.value.accepted = accepted

    if (accepted) {
        if (searchedMember) {
            searchedMember.status = "accepted"
        }

        await updateFamilyMembers(membersDetails, [
            ...copiedMembersDetails,
            uid,
        ])
        await sendNotification(
            {
                title: `Użytkownik "${userEmail.value}" nie zaakceptował zaproszenie do rodziny`,
                content: `Zaproszenie do listy nie zostało zaakceptowane`,
            },
            notification.value.ownerId
        )
    } else {
        await sendNotification(
            {
                title: `Użytkownik "${userEmail.value}" zaakceptował zaproszenie do rodziny`,
                content: `Zaproszenie do listy zostało zaakceptowane`,
            },
            notification.value.ownerId
        )

        membersDetails = membersDetails.filter((m) => m.id !== uid)
        await updateFamilyMembers(membersDetails)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
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
