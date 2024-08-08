<script setup>
import { StateEntries } from "@/types"
import { usePhotoGallery } from "../composables/usePhotoGallery"
const { photos, photoFromCamera, selectPhotoFromData } = usePhotoGallery()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { addExpenseToStore } = expensesStore
const uid = localStorage.getItem("uid")

const router = useRouter()

const newExpenseName = ref("")
const newExpenseValue = ref("")
const newExpenseDate = ref("")
const newShopName = ref("")
const expenseMembers = ref([])
const document = ref(null)
const photoBase64 = ref(null)

const selectPhoto = async () => {
    try {
        const { pb64, doc } = await selectPhotoFromData()
        photoBase64.value = pb64
        document.value = doc
    } catch (error) {
        console.error("Error selecting photo", error)
    }
}

const addPhoto = async () => {
    try {
        const { pb64, doc } = await photoFromCamera()
        photoBase64.value = pb64
        document.value = doc
        photoEdited.value = true
    } catch (error) {
        console.error("Error adding photo", error)
    }
}

const addExpense = async () => {
    const newExpense = {
        name: newExpenseName.value.toLowerCase(),
        value: parseFloat(newExpenseValue.value),
        timestamp: new Date(newExpenseDate.value).getTime(),
        shop: newShopName.value.toLowerCase(),
        userId: uid.value,
        familyMembers: expenseMembers.value,
    }
    await addExpenseToStore(newExpense, document.value, photoBase64.value)
    router.back()
}

const handleMember = (member) => {
    if (expenseMembers.value.includes(member.id)) {
        expenseMembers.value = expenseMembers.value.filter(
            (m) => m != member.id
        )
    } else {
        expenseMembers.value.push(member.id)
    }
}
</script>

<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-buttons slot="end">
                    <uiButton fill="clear" :strong="true" @click="addExpense()"
                        >Dodaj</uiButton
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="inner-content">
                <ion-list>
                    <ion-item>
                        <ion-input
                            data-test="shop-input"
                            label="Nazwa sklepu"
                            label-placement="floating"
                            class="shopInput"
                            type="text"
                            v-model="newShopName"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input
                            data-test="name-input"
                            label="Nazwa wydatku"
                            label-placement="floating"
                            class="nameInput"
                            type="text"
                            v-model="newExpenseName"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input
                            data-test="value-input"
                            label="Całkowita kwota"
                            label-placement="floating"
                            class="valueInput"
                            type="number"
                            v-model="newExpenseValue"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input
                            data-test="date-input"
                            label="Data"
                            label-placement="floating"
                            class="dateInput"
                            type="date"
                            v-model="newExpenseDate"
                        ></ion-input>
                    </ion-item>
                    <FamilyDropdownSelectMember @toggleMember="handleMember" />
                    <ion-item>
                        <uiButton @click="addPhoto">Zrób zdjęcie</uiButton>
                        <uiButton @click="selectPhoto" class="ml-auto"
                            >Wybierz zdjęcie</uiButton
                        >
                    </ion-item>
                </ion-list>
                <div v-if="photos.length">
                    <ion-img
                        v-for="photo in photos"
                        :key="photo.filepath"
                        :src="photo.webviewPath"
                    />
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
