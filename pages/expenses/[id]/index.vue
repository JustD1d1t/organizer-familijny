<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { usePhotoGallery } from "../composables/usePhotoGallery"
const { photos, photoFromCamera, selectPhotoFromData } = usePhotoGallery()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { removeExpenseFromStore, editExpense, getExpensePhoto } = expensesStore
const { currentExpense } = storeToRefs(expensesStore)
const { billCategories } = useBillCategories()
const { openAlert } = useAlerts()
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const router = useRouter()

const selectedCategory = ref(currentExpense.value.category)

const document = ref(null)
const photoBase64 = ref(null)
const photoEdited = ref(false)

const newShopName = ref(currentExpense.value.shop)
const newName = ref(currentExpense.value.name)
const newValue = ref(currentExpense.value.value)
const newTimestamp = ref(currentExpense.value.timestamp)
const newMembers = ref(currentExpense.value.familyMembers)

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

const edit = async () => {
    const editedExpense = {
        name: newName.value,
        value: Number(newValue.value),
        timestamp: new Date(newTimestamp.value).getTime(),
        shop: newShopName.value,
        familyMembers: newMembers.value,
        userId: currentExpense.value.userId,
        id: currentExpense.value.id,
        category: selectedCategory.value,
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

onMounted(async () => {
    // await fetchBillUrl()
    convertTimestampToDate()
})

const handleMember = (members) => {
    newMembers.value = members
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="inner-content" v-if="currentExpense">
                <ion-list lines="none">
                    <uiInput
                        label="Nazwa sklepu"
                        type="text"
                        v-model="newShopName"
                        :disabled="currentExpense.userId !== uid"
                    />
                    <uiInput
                        label="Nazwa wydatku"
                        type="text"
                        v-model="newName"
                        :disabled="currentExpense.userId !== uid"
                    />
                    <uiInput
                        label="Całkowita kwota"
                        type="number"
                        v-model="newValue"
                        :disabled="currentExpense.userId !== uid"
                    />
                    <uiInput
                        label="Data"
                        type="date"
                        v-model="newTimestamp"
                        :disabled="currentExpense.userId !== uid"
                    />
                    <ion-item>
                        <ion-select
                            label="Kategoria"
                            label-placement="stacked"
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
                    <FamilyDropdownSelectMember
                        :members="currentExpense.familyMembers"
                        @toggleMember="handleMember"
                        v-if="currentExpense.userId === uid"
                    />
                </ion-list>

                <div
                    class="flex justify-between mt-4"
                    v-if="currentExpense.userId === uid"
                >
                    <uiButton
                        type="tertiary"
                        :strong="true"
                        color="danger"
                        @click="
                            () =>
                                openAlert(
                                    'Usuwanie wydatku',
                                    'Czy na pewno chcesz usunąć wydatek?',
                                    'alert-button-confirm',
                                    removeExpense
                                )
                        "
                        >Usuń</uiButton
                    >
                    <uiButton
                        type="tertiary"
                        :strong="true"
                        color="success"
                        @click="edit()"
                        >Zapisz</uiButton
                    >
                </div>
                <!-- <div
                    class="flex justify-between mt-4"
                    v-if="currentExpense.userId === uid"
                >
                    <uiButton @click="editPhoto" type="secondary">Zrób zdjęcie</uiButton>
                    <uiButton @click="selectPhoto">Wybierz zdjęcie</uiButton>
                </div> -->
            </div>
        </ion-content>
    </ion-page>
</template>

<style lang="scss" scoped>
ion-modal {
    --height: 400px;
}
</style>
