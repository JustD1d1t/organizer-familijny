<script setup>
const notificationsStore = useNotificationsStore()
const { sendNotification } = notificationsStore
const { backendUrl } = useConfig()
const { request } = useFetchRequest()

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, createFamily } = familyMembersStore
const { familyMembersDetails, familyName } = storeToRefs(familyMembersStore)
const userStore = useUserStore()
const { uid, email } = storeToRefs(userStore)

const emit = defineEmits("cancel", "confirmModal")

const memberEmail = ref("")

const addMember = async (user) => {
    const newMembersDetails = [
        ...familyMembersDetails.value,
        { ...user, status: "pending" },
    ]
    await updateMembers(newMembersDetails)
    return newMembersDetails
}

const handleFamilyMember = async () => {
    const data = await request(
        `${backendUrl}/users/get-users?email=${memberEmail.value.toLowerCase()}`
    )
    const users = data.users
    if (!users.length) {
        return
    }
    const user = users[0]
    let newMembersDetails
    if (familyMembersDetails.value.length) {
        newMembersDetails = await addMember(user)
    }

    await sendNotification(
        {
            title: `Zaproszenie do rodziny "${familyName.value}"`,
            content: `Zostałeś zaproszony do rodziny "${familyName.value}" przez użytkownika "${email.value}"`,
            type: "invitation-to-family",
            ownerId: uid.value,
        },
        user.uid
    )

    emit("confirmModal", newMembersDetails)
}

const cancel = () => {
    emit("cancel")
}
</script>

<template>
    <div class="ion-padding inner-content">
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="cancel()">Anuluj</ion-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button :strong="true" @click="handleFamilyMember()"
                        >Dodaj</ion-button
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <uiList>
            <ion-item>
                <ion-text>
                    <h3>Dodaj członka rodziny</h3>
                </ion-text>
            </ion-item>
            <uiInput
                data-test="shop-input"
                label="Mail"
                class="shopInput"
                type="text"
                v-model="memberEmail"
            />
        </uiList>
    </div>
</template>
