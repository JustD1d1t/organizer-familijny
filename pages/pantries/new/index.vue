<script setup>
const router = useRouter()
const pantryName = ref("")
const familyMembers = ref([])
const familyMembersIds = ref([])

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { addPantry } = pantriesStore

const add = async () => {
    await addPantry(
        pantryName.value,
        familyMembers.value,
        familyMembersIds.value
    )
    router.back()
}
const handleMember = (member) => {
    if (familyMembers.value.includes(member.id)) {
        familyMembersIds.value = familyMembersIds.value.filter(
            (m) => m != member.id
        )
        familyMembers.value = familyMembers.value.filter(
            (m) => m.id != member.id
        )
    } else {
        familyMembersIds.value.push(member.id)
        familyMembers.value.push(member)
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
            <ion-button expand="block" @click="add" class="my-6"
                >Dodaj listę</ion-button
            >
        </ion-content>
    </ion-page>
</template>
