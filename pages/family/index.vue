<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { updateDocument, deleteDocument, onSnapshotDoc, clearSnapshot } =
    useFirebase()
const { sendNotification } = useNotifications()

const route = useRoute()

const uid = useState(StateEntries.Uid)
const familyMembersDetails = useState(
    StateEntries.FamilyMembersDetails,
    () => []
)
const familyMembers = useState(StateEntries.FamilyMembers, () => [])
const familyId = useState(StateEntries.FamilyId)

const modal = ref()

import { getAuth } from "firebase/auth"
const auth = getAuth()

const familyOwner = computed(() => {
    return familyId.value === auth.currentUser?.uid
})

const setFamilyAfterSnap = (snap) => {
    familyMembersDetails.value = [...snap.membersDetails]
    familyMembers.value = [...snap.members]
}

onMounted(async () => {
    onSnapshotDoc(["family", familyId.value], setFamilyAfterSnap)
})

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

const clearFamilyDetails = () => {
    familyMembersDetails.value = []
    familyMembers.value = []
    familyOwner.value = false
}

const addMember = (newMembers) => {
    confirmModal()
    familyMembersDetails.value = newMembers
    familyOwner.value = true
}
const removeFamilyMember = async (member) => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== member.id
    )
    const newMembers = familyMembers.value.filter((m) => m !== member.id)
    await updateDocument(["family", uid.value], {
        membersDetails: newMembersDetails,
        members: newMembers,
    })
    familyMembersDetails.value = [...newMembersDetails]
    await sendNotification(
        {
            title: `Zostałeś usunięty z rodziny "${auth.value.currentUser.email}"`,
            content: `Zostałeś usunięty z rodziny przez użytkownika "${auth.value.currentUser.email}"`,
        },
        member.id
    )
}

const leaveFamily = async () => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== auth.currentUser.uid
    )
    const newMembers = familyMembers.value.filter(
        (m) => m !== auth.currentUser.uid
    )
    await updateDocument(["family", familyId.value], {
        membersDetails: newMembersDetails,
        members: newMembers,
    })
    clearFamilyDetails()
    navigateTo("/")
}

const removeFamily = async () => {
    await deleteDocument(["family", auth.currentUser.uid])
    clearFamilyDetails()
    navigateTo("/")
}

watch(route, async (newRoute, oldRoute) => {
    clearSnapshot()
})
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Rodzina</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div>
                <h2>Członkowie rodziny</h2>
                <h3 v-if="!familyMembersDetails.length">
                    Nie należysz do żadnej rodziny
                </h3>
                <ion-list lines="none">
                    <UiListItem
                        v-for="member in familyMembersDetails"
                        :key="member.id"
                        class="flex items-center"
                    >
                        <template #start>
                            <span
                                >{{ member.nickname }} ({{ member.email }})
                                <small v-if="member.status === 'pending'"
                                    >(oczekiwanie)</small
                                ></span
                            >
                        </template>
                        <template #end>
                            <uiButton
                                slot="end"
                                @click="() => removeFamilyMember(member)"
                                size="small"
                                v-if="
                                    familyOwner &&
                                    member.id !== auth.currentUser?.uid
                                "
                            >
                                <ion-icon :icon="ioniconsTrash"></ion-icon>
                            </uiButton>
                        </template>
                    </UiListItem>
                </ion-list>
            </div>
            <ion-modal
                class="auto-height"
                ref="modal"
                trigger="open-modal"
                v-if="familyOwner || !familyMembers.length"
            >
                <FamilyEditModal @cancel="cancel" @confirmModal="addMember" />
            </ion-modal>
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button>
                    <ion-icon :icon="ioniconsArrowUpCircle"></ion-icon>
                </ion-fab-button>
                <ion-fab-list side="top">
                    <ion-fab-button
                        id="open-modal"
                        v-if="familyOwner || !familyMembers.length"
                    >
                        <ion-icon :icon="ioniconsAdd"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="!familyOwner" @click="leaveFamily">
                        <ion-icon :icon="ioniconsTrash"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="familyOwner" @click="removeFamily">
                        <ion-icon :icon="ioniconsTrash"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
