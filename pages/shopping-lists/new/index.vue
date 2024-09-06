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

const handleMember = (member) => {
    if (familyMembersIds.value.includes(member.id)) {
        familyMembersIds.value = familyMembersIds.value.filter(
            (m) => m != member.id
        )
        familyMembers.value = familyMembers.value.filter(
            (m) => m.id != member.id
        )
        openToast(`Usunięto ${member.nickname} z listy zakupowej`, "danger")
    } else {
        familyMembersIds.value.push(member.id)
        familyMembers.value.push(member)
        openToast(`Dodano ${member.nickname} do listy zakupowej`)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <UiInput
                v-model="newShoppingListName"
                label="Nazwa listy zakupowej"
                :error="shoppingListInputError"
            />

            <FamilyDropdownSelectMember @toggleMember="handleMember" />

            <ion-button expand="block" @click="add" class="my-6"
                >Dodaj listę</ion-button
            >
        </ion-content>
    </ion-page>
</template>
