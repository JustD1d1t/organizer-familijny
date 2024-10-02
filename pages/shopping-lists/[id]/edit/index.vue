<script setup>
import { useRoute } from "vue-router"
const route = useRoute()
const router = useRouter()
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { editShoppingList, leaveList } = shoppingListsStore
const { currentShoppingList } = storeToRefs(shoppingListsStore)

const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const input = ref()

const collaboratedList = computed(() => {
    return uid.value !== currentShoppingList.value.ownerId
})

const newMembers = ref(
    collaboratedList.value ? [] : currentShoppingList.value.members
)

const newMembersIds = ref(
    collaboratedList.value ? [] : currentShoppingList.value.membersIds
)

const newName = ref(currentShoppingList.value.name)

const update = async () => {
    await editShoppingList(newName.value, newMembers.value, newMembersIds.value)
    router.back()
}

const toggleMember = (member) => {
    const isMemberInMembers = newMembers.value.find((m) => m.id === member.id)
    if (isMemberInMembers) {
        newMembers.value = newMembers.value.filter((m) => m.id !== member.uid)
        newMembersIds.value = newMembersIds.value.filter(
            (id) => id !== member.uid
        )
    } else {
        newMembers.value.push(member)
        newMembersIds.value.push(member.uid)
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Edytuj listę zakupową</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list lines="none" class="mt-4">
                <uiInput
                    label="Nazwa listy zakupowej"
                    type="text"
                    v-model="newName"
                />
                <FamilyDropdownSelectMember
                    :members="currentShoppingList.members"
                    @toggleMember="(member) => toggleMember(member)"
                    v-if="!collaboratedList"
                />
            </ion-list>
            <uiButton
                v-if="collaboratedList"
                @click="leaveList()"
                class="my-6 w-full"
            >
                Opuść listę
            </uiButton>

            <uiButton @click="update" class="my-6 w-full">
                Zapisz zmiany
            </uiButton>
        </ion-content>
    </ion-page>
</template>
