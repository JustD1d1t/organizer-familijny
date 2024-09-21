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

const router = useRouter()

const uid = localStorage.getItem("uid")

const selectedCategory = ref("")

const openModal = ref(false)
const document = ref(null)
const photoBase64 = ref(null)
const photoEdited = ref(false)
const editingItem = ref(null)
const newItem = ref({
    name: "",
    price: "",
    category: "",
})

const newShopName = ref(currentExpense.value.shop)
const newName = ref(currentExpense.value.name)
const newValue = ref(currentExpense.value.value)
const newTimestamp = ref(currentExpense.value.timestamp)
const newMembers = ref(currentExpense.value.familyMembers)
const newItems = ref([...currentExpense.value.items])

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

const isOpen = ref(false)
const isOpenAddModal = ref(false)

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
        value: Number(newValue.value),
        timestamp: new Date(newTimestamp.value).getTime(),
        shop: newShopName.value,
        familyMembers: newMembers.value,
        userId: currentExpense.value.userId,
        id: currentExpense.value.id,
        category: currentExpense.value.category,
        items: newItems.value,
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

const setOpen = (open) => (isOpen.value = open)
const setAddOpen = (open) => (isOpenAddModal.value = open)

const editExpenseItem = (item) => {
    editingItem.value = item
    setOpen(true)
}

const addNewProduct = () => {
    newItems.value.push({
        name: newItem.value.name,
        price: parseFloat(newItem.value.price),
        category: newItem.value.category,
    })
    setAddOpen(false)
    newItem.value = {
        name: "",
        price: "",
        category: "",
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons
                    slot="start"
                    v-if="currentExpense && currentExpense.userId === uid"
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
                </ion-buttons>
                <ion-buttons
                    slot="end"
                    v-if="currentExpense && currentExpense.userId === uid"
                >
                    <uiButton
                        type="tertiary"
                        :strong="true"
                        color="success"
                        @click="edit()"
                        >Zapisz</uiButton
                    >
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
                            v-model="currentExpense.category"
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

                <uiList>
                    <ExpensesNewItem
                        v-for="(item, index) in newItems"
                        :key="index"
                        :name="item.name"
                        :price="item.price"
                        :category="item.category"
                        @buttonClick="() => editExpenseItem(item)"
                        @removeClick="() => newItems.splice(index, 1)"
                    />
                </uiList>
                <uiButton
                    type="tertiary"
                    class="w-full"
                    @click="setAddOpen(true)"
                >
                    <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
                    Dodaj produkt
                </uiButton>

                <!-- <div
                    class="flex justify-between mt-4"
                    v-if="currentExpense.userId === uid"
                >
                    <uiButton @click="editPhoto" type="secondary">Zrób zdjęcie</uiButton>
                    <uiButton @click="selectPhoto">Wybierz zdjęcie</uiButton>
                </div> -->
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
            <ion-modal :is-open="isOpen" @willDismiss="() => setOpen(false)">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Edytuj produkt</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="setOpen(false)"
                                >Close</ion-button
                            >
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <uiList>
                        <uiInput
                            v-model="editingItem.name"
                            label="Nazwa produktu"
                        />
                        <uiInput
                            v-model="editingItem.price"
                            label="Cena produktu"
                            type="number"
                        />
                        <ion-item>
                            <ion-select
                                label="Kategoria"
                                label-placement="stacked"
                                placeholder="--- Wybierz kategorię ---"
                                v-model="editingItem.category"
                            >
                                <ion-select-option
                                    v-for="(category, index) in billCategories"
                                    :key="index"
                                    :value="category"
                                >
                                    {{ category }}
                                </ion-select-option>
                            </ion-select>
                        </ion-item>
                    </uiList>
                </ion-content>
            </ion-modal>
            <ion-modal
                :is-open="isOpenAddModal"
                @willDismiss="() => setAddOpen(false)"
            >
                <ion-header>
                    <ion-toolbar>
                        <ion-buttons slot="start">
                            <ion-button @click="setOpen(false)"
                                >anuluj</ion-button
                            >
                        </ion-buttons>
                        <ion-title>Nowy produkt</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="addNewProduct"
                                >Zapisz</ion-button
                            >
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <uiList>
                        <uiInput
                            v-model="newItem.name"
                            label="Nazwa produktu"
                        />
                        <uiInput
                            v-model="newItem.price"
                            label="Cena produktu"
                            type="number"
                        />
                        <ion-item>
                            <ion-select
                                label="Kategoria"
                                label-placement="stacked"
                                placeholder="--- Wybierz kategorię ---"
                                v-model="newItem.category"
                            >
                                <ion-select-option
                                    v-for="(category, index) in billCategories"
                                    :key="index"
                                    :value="category"
                                >
                                    {{ category }}
                                </ion-select-option>
                            </ion-select>
                        </ion-item>
                    </uiList>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<style lang="scss" scoped>
ion-modal {
    --height: 400px;
}
</style>
