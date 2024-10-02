<script setup>
const router = useRouter()
const pantryName = ref("")
const familyMembers = ref([])
const familyMembersIds = ref([])

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { addPantry } = pantriesStore
const { openToast } = useAlerts()

const pantryInputError = ref("")

const add = async () => {
    if (!pantryName.value) {
        pantryInputError.value = "Nazwa spiżarni jest wymagana"
        return
    }
    pantryInputError.value = ""
    await addPantry(
        pantryName.value,
        familyMembers.value,
        familyMembersIds.value
    )
    openToast("Dodano spiżarnię")
    router.back()
}
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
                    v-model="pantryName"
                    label="Nazwa spiżarni"
                    :error="pantryInputError"
                />
                <FamilyDropdownSelectMember @toggleMember="handleMember" />
            </ion-list>
            <uiButton @click="add" class="my-6 w-full"> Dodaj listę </uiButton>
        </ion-content>
    </ion-page>
</template>
