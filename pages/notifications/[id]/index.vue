<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { updateDocument, queryDoc } = useFirebase()
const { sendNotification } = useNotifications()

const route = useRoute()
const params = route.params

const uid = useState(StateEntries.Uid)
const notificationsState = useState(StateEntries.Notifications)
const notification = computed(() =>
    notificationsState.value.find((n) => n.id === params.id)
)
const userEmail = useState(StateEntries.UserEmail)

const handleFamilyInvitation = async (accepted) => {
    await updateDocument(
        [StateEntries.Notifications, "users", uid.value, notification.value.id],
        { accepted }
    )
    const editedNotification = { ...notification.value, accepted }
    let family = await queryDoc(["family"], editedNotification.ownerId)
    let membersDetails = family.membersDetails

    const searchedMember = membersDetails.find((m) => m.id === uid.value)

    notification.value.accepted = accepted

    if (accepted) {
        if (searchedMember) {
            searchedMember.status = "accepted"
        }

        await updateDocument(["family", notification.value.ownerId], {
            members: [...family.members, uid.value],
            membersDetails,
        })
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

        membersDetails = membersDetails.filter((m) => m.id !== uid.value)
        await updateDocument(["family", notification.value.ownerId], {
            membersDetails,
        })
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
                <uiButton
                    @click="() => handleFamilyInvitation(false)"
                    color="danger"
                    >Odrzuć</uiButton
                >
                <uiButton
                    @click="() => handleFamilyInvitation(true)"
                    color="success"
                    >Akceptuj</uiButton
                >
            </div>
        </ion-content>
    </ion-page>
</template>
