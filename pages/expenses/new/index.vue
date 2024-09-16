<script setup>
import { StateEntries } from "@/types"
import { usePhotoGallery } from "../composables/usePhotoGallery"
const { photos, photoFromCamera, selectPhotoFromData } = usePhotoGallery()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { addExpenseToStore } = expensesStore
const uid = localStorage.getItem("uid")

const { billCategories } = useBillCategories()

const router = useRouter()
const selectedCategory = ref("")

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
        userId: uid,
        familyMembers: expenseMembers.value,
        category: selectedCategory.value,
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
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="end">
                    <ion-button
                        
                        :strong="true"
                        @click="addExpense()"
                        >Dodaj</ion-button
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="inner-content">
                <ion-list lines="none">
                    <uiInput label="Nazwa sklepu" v-model="newShopName" />
                    <uiInput label="Nawa wydatku" v-model="newExpenseName" />
                    <uiInput
                        label="Całkowita kwota"
                        type="number"
                        v-model="newExpenseValue"
                    />
                    <uiInput
                        label="Data"
                        type="date"
                        v-model="newExpenseDate"
                    />
                    <ion-item>
                        <ion-select
                            label="Kategoria"
                            label-placement="stacked"
                            placeholder= "--- Wybierz kategorię ---"
                            v-model="selectedCategory"
                        >
                            <ion-select-option
                                v-for="(category, index) in billCategories"
                                :key="index"
                                :value="category"
                                >{{ category }}</ion-select-option
                            >
                        </ion-select>
                    </ion-item>
                    <FamilyDropdownSelectMember @toggleMember="handleMember" />
                    <div class="flex justify-between">
                        <uiButton @click="addPhoto" type="secondary">
                            <span> Zrób zdjęcie</span>
                        </uiButton>
                        <uiButton @click="selectPhoto" class="ml-auto">
                            <span> Wybierz zdjęcie</span>
                        </uiButton>
                    </div>
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
