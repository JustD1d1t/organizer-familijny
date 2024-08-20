<script setup>
const router = useRouter()
const { displayToast } = useAlerts()

import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { addList } = shoppingListsStore

const newShoppingListName = ref("")
const input = ref()

const add = async () => {
    await addList(newShoppingListName.value, familyMembers.value)
    router.back()

}

const familyMembers = ref([])

const handleMember = (member) => {
    if (familyMembers.value.includes(member.id)) {
        familyMembers.value = familyMembers.value.filter((m) => m != member.id)
        displayToast(`Usunięto ${member.nickname} z listy zakupowej`)
    } else {
        familyMembers.value.push(member.id)
        displayToast(`Dodano ${member.nickname} do listy zakupowej`)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar >
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="inner-content">
                <ion-item class="mb-6">
                    <ion-input
                        label="Nazwa listy zakupowej"
                        label-placement="floating"
                        ref="input"
                        type="text"
                        v-model="newShoppingListName"
                    ></ion-input>
                </ion-item>

                <FamilyDropdownSelectMember @toggleMember="handleMember" />

                <ion-button expand="block" @click="add" class="my-6"
                    >Dodaj listę</ion-button
                >
            </div>
        </ion-content>
    </ion-page>
</template>
