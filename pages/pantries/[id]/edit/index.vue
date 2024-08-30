<script setup>
const router = useRouter()
const uid = localStorage.getItem("uid")

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { editPantry } = pantriesStore
const { currentPantry } = storeToRefs(pantriesStore)

const newPantryName = ref(currentPantry.value.name)
const newMembers = ref(currentPantry.value.members)

const updatePantry = async () => {
    const editedPantry = {
        ...currentPantry.value,
        name: newPantryName.value,
        members: newMembers.value,
    }
    await editPantry(editedPantry)
    router.back()
}

const handleMember = (member) => {
    const isMemberInMembers = newMembers.value.find((m) => m.id === member.id)
    if (isMemberInMembers) {
        newMembers.value = newMembers.value.filter((m) => m.id != member.id)
    } else {
        newMembers.value.push(member)
    }
}

const collaboratedPantry = computed(() => currentPantry.value.ownerId !== uid)

const leave = async () => {
    await leaveList()
    router.back()
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Spiżarnia</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <h2>{{ newPantryName }}</h2>
            <ion-item>
                <ion-input
                    label="Nazwa spiżarni"
                    label-placement="floating"
                    ref="input"
                    type="text"
                    v-model="newPantryName"
                ></ion-input>
            </ion-item>
            <FamilyDropdownSelectMember
                :members="currentPantry.members"
                @toggleMember="handleMember"
                v-if="!collaboratedPantry"
            />
            <ion-button expand="block" class="my-6" @click="leave" v-if="collaboratedPantry">
                Opuść spiżarnię
            </ion-button>
            <ion-button expand="block" @click="updatePantry" class="my-6"
                >Aktualizuj spiżarnię</ion-button
            >
        </ion-content>
    </ion-page>
</template>
