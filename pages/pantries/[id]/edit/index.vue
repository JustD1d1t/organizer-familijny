<script setup>
const router = useRouter()
const uid = useState("uid")

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
    if (newMembers.value.includes(member.id)) {
        newMembers.value = newMembers.value.filter((m) => m != member.id)
    } else {
        newMembers.value.push(member.id)
    }
}

const collaboratedPantry = computed(
    () => currentPantry.value.ownerId !== uid
)

const leave = async () => {
    await leaveList()
    router.back()

}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Listy zakupowe</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
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
            <ion-button expand="block" class="my-6" @click="leave">
                Opuść spiżarnię
            </ion-button>
            <ion-button expand="block" @click="updatePantry" class="my-6"
                >Aktualizuj spiżarnię</ion-button
            >
        </ion-content>
    </ion-page>
</template>
