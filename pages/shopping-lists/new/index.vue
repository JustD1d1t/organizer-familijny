<script setup>
const router = useRouter()
const { openToast } = useAlerts()

import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { addList } = shoppingListsStore

const newShoppingListName = ref("")
const shoppingListInputError = ref("")

const add = async () => {
    if (!newShoppingListName.value) {
        shoppingListInputError.value = "Nazwa listy zakupowej jest wymagana"
        return
    }
    shoppingListInputError.value = ""
    await addList(
        newShoppingListName.value,
        familyMembers.value,
        familyMembersIds.value
    )
    openToast("Dodano nową listę zakupową")
    router.back()
}

const familyMembersIds = ref([])
const familyMembers = ref([])

const handleMember = (membersIds, members) => {
    familyMembersIds.value = membersIds
    familyMembers.value = members
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list lines="none" class="mt-4">
                <UiInput
                    v-model="newShoppingListName"
                    label="Nazwa listy zakupowej"
                    :error="shoppingListInputError"
                />

                <FamilyDropdownSelectMember @toggleMember="handleMember" />
            </ion-list>
            <uiButton @click="add" class="my-6 w-full"> Dodaj listę </uiButton>
        </ion-content>
    </ion-page>
</template>
