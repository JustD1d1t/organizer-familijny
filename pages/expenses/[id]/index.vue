<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { usePhotoGallery } from "../composables/usePhotoGallery"
import { StateEntries } from "@/types"
const { photos, photoFromCamera, selectPhotoFromData } = usePhotoGallery()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { removeExpenseFromStore, editExpense, getExpensePhoto } = expensesStore
const { currentExpense } = storeToRefs(expensesStore)

const router = useRouter()

const uid = localStorage.getItem("uid")

const openModal = ref(false)
const document = ref(null)
const photoBase64 = ref(null)
const photoEdited = ref(false)

const newShopName = ref(currentExpense.value.shop)
const newName = ref(currentExpense.value.name)
const newValue = ref(currentExpense.value.value)
const newTimestamp = ref(currentExpense.value.timestamp)
const newMembers = ref(currentExpense.value.members)

const convertTimestampToDate = () => {
    let date
    if (currentExpense.value.timestamp.seconds) {
        date = new Date(currentExpense.value.timestamp.seconds * 1000)
    } else {
        date = new Date(currentExpense.value.timestamp)
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // Miesiące są od 0 do 11, więc dodaj 1
    const day = String(date.getDate()).padStart(2, "0") // Pad start dla jednocyfrowych dni

    newTimestamp.value = `${year}-${month}-${day}`
}

const closeModal = () => {
    openModal.value = false
}

const editPhoto = async () => {
    try {
        const { pb64, doc } = await photoFromCamera()
        photoBase64.value = pb64
        document.value = doc
        photoEdited.value = true
    } catch (error) {
        console.error("Error adding photo", error)
    }
}

const selectPhoto = async () => {
    try {
        const { pb64, doc } = await selectPhotoFromData()
        photoBase64.value = pb64
        document.value = doc
    } catch (error) {
        console.error("Error selecting photo", error)
    }
}

const edit = async () => {
    const editedExpense = {
        name: newName.value,
        value: newValue.value,
        timestamp: new Date(newTimestamp.value).getTime(),
        shop: newShopName.value,
        familyMembers: newMembers.value,
        userId: currentExpense.value.userId,
        id: currentExpense.value.id,
    }
    await editExpense(editedExpense, document.value, photoBase64.value)

    router.back()
}

const removeExpense = async () => {
    await removeExpenseFromStore(currentExpense.value.id)
    router.back()
}

const fetchBillUrl = async () => {
    const url = await getExpensePhoto(currentExpense.value.id)
    if (url) {
        photos.value.push({
            webviewPath: url,
            document: {
                title: "New Photo",
                description: "Photo taken with the app",
                timestamp: new Date(),
            },
        })
    }
}

const openImageInPreview = async () => {
    openModal.value = true
}

onMounted(async () => {
    await fetchBillUrl()
    convertTimestampToDate()
})

const handleMember = (member) => {
    if (newMembers.value.includes(member.id)) {
        newMembers.value = newMembers.value.filter((m) => m != member.id)
    } else {
        newMembers.value.push(member.id)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-buttons
                    slot="start"
                    v-if="currentExpense && currentExpense.userId === uid"
                >
                    <uiButton
                        fill="clear"
                        :strong="true"
                        @click="removeExpense()"
                        >Usuń</uiButton
                    >
                </ion-buttons>
                <ion-buttons
                    slot="end"
                    v-if="currentExpense && currentExpense.userId === uid"
                >
                    <uiButton fill="clear" :strong="true" @click="edit()"
                        >Zapisz</uiButton
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="inner-content" v-if="currentExpense">
                <ion-item>
                    <ion-input
                        data-test="shop-input"
                        label="Nazwa sklepu"
                        label-placement="floating"
                        type="text"
                        v-model="newShopName"
                        :disabled="currentExpense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                        data-test="name-input"
                        label="Nazwa wydatku"
                        label-placement="floating"
                        type="text"
                        v-model="newName"
                        :disabled="currentExpense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                        data-test="value-input"
                        label="Całkowita kwota"
                        label-placement="floating"
                        type="number"
                        v-model="newValue"
                        :disabled="currentExpense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                        data-test="date-input"
                        label="Data"
                        label-placement="floating"
                        type="date"
                        v-model="newTimestamp"
                        :disabled="currentExpense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <FamilyDropdownSelectMember
                    :members="currentExpense.familyMembers"
                    @toggleMember="handleMember"
                    v-if="currentExpense.userId === uid"
                />
                <ion-item v-if="currentExpense.userId === uid">
                    <uiButton @click="editPhoto">Zrób zdjęcie</uiButton>
                    <uiButton @click="selectPhoto" class="ml-auto"
                        >Wybierz zdjęcie</uiButton
                    >
                </ion-item>
                <div v-if="photos.length" @click="openImageInPreview">
                    <ion-img
                        v-for="photo in photos"
                        :key="photo.webviewPath"
                        :src="photo.webviewPath"
                    />
                </div>
                <ion-modal
                    class="auto-height modal-img"
                    :is-open="openModal"
                    @didDismiss="closeModal()"
                >
                    <div class="modal-content">
                        <div>
                            <ion-img
                                v-for="photo in photos"
                                :key="photo.webviewPath"
                                :src="photo.webviewPath"
                            />
                        </div>
                    </div>
                </ion-modal>
            </div>
        </ion-content>
    </ion-page>
</template>
