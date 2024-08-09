<script setup>
const router = useRouter()
const pantryName = ref("")
const familyMembers = ref([])

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { addPantry } = pantriesStore

const add = async () => {
    await addPantry(pantryName.value, familyMembers.value)
    router.back()
    setTimeout(() => {
        window.location.reload()
    }, 100)
}
const handleMember = (member) => {
    if (familyMembers.value.includes(member.id)) {
        familyMembers.value = familyMembers.value.filter((m) => m != member.id)
    } else {
        familyMembers.value.push(member.id)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-item>
                <ion-input
                    data-test="pantry-name-input"
                    label="Nazwa spiżarni"
                    label-placement="floating"
                    type="text"
                    v-model="pantryName"
                ></ion-input>
            </ion-item>
            <FamilyDropdownSelectMember @toggleMember="handleMember" />
            <uiButton expand="block" @click="add" class="my-6"
                >Dodaj listę</uiButton
            >
        </ion-content>
    </ion-page>
</template>
