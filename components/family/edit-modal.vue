<script setup>
const notificationsStore = useNotificationsStore()
const { sendNotification } = notificationsStore
const { backendUrl } = useConfig()
const { request } = useFetchRequest()

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, createFamily } = familyMembersStore
const { familyMembersDetails } = storeToRefs(familyMembersStore)

const emit = defineEmits("cancel", "confirmModal")

const email = ref("")
const emailInput = ref()
const uid = localStorage.getItem("uid")

const addMember = async (user) => {
    const newMembersDetails = [
        ...familyMembersDetails.value,
        { ...user, status: "pending" },
    ]
    await updateMembers(newMembersDetails)
    return newMembersDetails
}

const create = async (user) => {
    const newMembersDetails = [
        {
            email: localStorage.getItem("email"),
            id: localStorage.getItem("uid"),
            uid: localStorage.getItem("uid"),
            nickname: localStorage.getItem("nickname"),
            status: "accepted",
        },
        { ...user, status: "pending" },
    ]
    await createFamily(newMembersDetails)
    return newMembersDetails
}

const handleFamilyMember = async () => {
    const data = await request(
        `${backendUrl}/users/get-users?email=${email.value.toLowerCase()}`
    )
    const users = data.users
    if (!users.length) {
        return
    }
    const user = users[0]
    let newMembersDetails
    if (familyMembersDetails.value.length) {
        newMembersDetails = await addMember(user)
    } else {
        newMembersDetails = await create(user)
    }

    await sendNotification(
        {
            title: `Zaproszenie do rodziny użytkownika "${localStorage.getItem(
                "email"
            )}"`,
            content: `Zostałeś zaproszony do rodziny przez użytkownika "${localStorage.getItem(
                "email"
            )}"`,
            type: "invitation-to-family",
            ownerId: uid,
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
        <ion-header>
            <ion-toolbar>
                <ion-buttons fill="clear" slot="start">
                    <ion-button @click="cancel()">Anuluj</ion-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button :strong="true" @click="handleFamilyMember()"
                        >Dodaj</ion-button
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-list lines="none">
            <ion-item>
                <ion-text>
                    <h3>Dodaj członka rodziny</h3>
                </ion-text>
            </ion-item>
            <ion-item>
                <ion-input
                    data-test="shop-input"
                    label="Mail"
                    label-placement="floating"
                    ref="emailInput"
                    class="shopInput"
                    type="text"
                    v-model="email"
                ></ion-input>
            </ion-item>
        </ion-list>
    </div>
</template>
