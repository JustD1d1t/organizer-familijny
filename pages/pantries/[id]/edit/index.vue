<script setup>
const { updateDocument } = useFirebase()
const router = useRouter()
const uid = useState("uid")

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { toggleMember } = pantriesStore
const { currentPantry } = storeToRefs(pantriesStore)

const updatePantry = async () => {
    await updateDocument(
        ["pantries", currentPantry.value.id],
        currentPantry.value
    )
    router.back()
}

const collaboratedPantry = computed(
    () => currentPantry.value.ownerId !== uid.value
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
                    v-model="currentPantry.name"
                ></ion-input>
            </ion-item>
            <FamilyDropdownSelectMember
                :members="currentPantry.members"
                @toggleMember="toggleMember"
                v-if="!collaboratedPantry"
            />
            <uiButton expand="block" class="my-6" @click="leave">
                Opuść spiżarnię
            </uiButton>
            <uiButton expand="block" @click="updatePantry" class="my-6"
                >Aktualizuj spiżarnię</uiButton
            >
        </ion-content>
    </ion-page>
</template>
