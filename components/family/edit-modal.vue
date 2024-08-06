<script setup>
import { getAuth } from "firebase/auth"
import { StateEntries } from "@/types"

const { queryDocsInCollection } = useFirebase()
const notificationsStore = useNotificationsStore()
const { sendNotification } = notificationsStore

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, createFamily } = familyMembersStore
const { familyMembersDetails } = storeToRefs(familyMembersStore)

const emit = defineEmits("cancel", "confirmModal")

const email = ref("")
const emailInput = ref()
const uid = useState(StateEntries.Uid)
const auth = getAuth()

const addMember = async (family, user) => {
    const newMembersDetails = [
        ...family.membersDetails,
        { ...user, status: "pending" },
    ]
    await updateMembers(newMembersDetails)
    return newMembersDetails
}

const create = async (currUser, user) => {
    const newMembersDetails = [
        {
            email: currUser.email,
            id: currUser.uid,
            uid: currUser.uid,
            nickname: currUser.displayName,
            status: "accepted",
        },
        { ...user, status: "pending" },
    ]
    await createFamily(newMembersDetails)
    return newMembersDetails
}

const handleFamilyMember = async () => {
    const users = await queryDocsInCollection(["users"], false, [
        {
            key: "email",
            value: email.value.toLowerCase(),
            statement: "==",
        },
    ])
    if (!users.length) {
        return
    }
    const user = users[0]
    const currUser = auth.currentUser
    let newMembersDetails
    if (familyMembersDetails.length) {
        newMembersDetails = await addMember(family, user)
    } else {
        newMembersDetails = await create(currUser, user)
    }

    await sendNotification(
        {
            title: `Zaproszenie do rodziny użytkownika "${currUser.email}"`,
            content: `Zostałeś zaproszony do rodziny przez użytkownika "${currUser.email}"`,
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
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-buttons fill="clear" slot="start">
                    <uiButton @click="cancel()">Anuluj</uiButton>
                </ion-buttons>
                <ion-buttons slot="end">
                    <uiButton :strong="true" @click="handleFamilyMember()"
                        >Dodaj</uiButton
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
