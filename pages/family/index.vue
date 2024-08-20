<script setup>
const notificationsStore = useNotificationsStore()
const { sendNotification } = notificationsStore

const uid = localStorage.getItem("uid")

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, removeFamily, leaveFamily } = familyMembersStore
const { familyMembers, familyMembersDetails, familyId } =
    storeToRefs(familyMembersStore)
const modal = ref()

const familyOwner = computed(() => {
    return familyId.value === uid
})

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

const addMember = (newMembers) => {
    confirmModal()
    familyMembersDetails.value = newMembers
    familyOwner.value = true
}
const remove = async (member) => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== member.id
    )
    const newMembers = familyMembers.value.filter((m) => m !== member.id)
    await updateMembers(newMembersDetails, newMembers)
    await sendNotification(
        {
            title: `Zostałeś usunięty z rodziny "${localStorage.getItem(
                "email"
            )}"`,
            content: `Zostałeś usunięty z rodziny przez użytkownika "${localStorage.getItem(
                "email"
            )}`,
        },
        member.id
    )
}

const leave = async () => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== uid
    )
    const newMembers = familyMembers.value.filter((m) => m !== uid)
    await leaveFamily(newMembersDetails, newMembers)
    navigateTo("/")
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar >
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
                            <ion-button
                                @click="() => remove(member)"
                                size="small"
                                v-if="familyOwner && member.id !== uid"
                            >
                                <ion-icon :icon="ioniconsTrash"></ion-icon>
                            </ion-button>
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
                    <ion-fab-button v-if="!familyOwner" @click="leave">
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
