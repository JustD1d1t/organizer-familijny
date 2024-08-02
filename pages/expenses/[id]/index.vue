<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useFirebase } from "../composables/useFirebase"
import { usePhotoGallery } from "../composables/usePhotoGallery"
import { StateEntries } from "@/types"
const { formatDate } = useFormatters()
const { photos, photoFromCamera, selectPhotoFromData } = usePhotoGallery()
const {
    updateDocument,
    savePhotoToStorageWithId,
    getPhotoById,
    deleteDocument,
} = useFirebase()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { removeExpenseFromStore } = expensesStore
import { Timestamp } from "firebase/firestore/lite"

const route = useRoute()
const router = useRouter()

const uid = useState(StateEntries.Uid)
const expenses = computed(() => expensesStore.getExpenesesFromStore)

const openModal = ref(false)
const expense = ref(null)
const newExpenseName = ref("")
const newExpenseValue = ref("")
const newShopName = ref("")
const document = ref(null)
const photoBase64 = ref(null)
const photoEdited = ref(false)
const billOwner = ref(false)

const closeModal = () => {
    openModal.value = false
}

const loadExpenseData = () => {
    const currentExpense = expenses.value.find((e) => e.id === route.params.id)
    if (currentExpense) {
        expense.value = currentExpense
        newExpenseName.value = currentExpense.name
        newExpenseValue.value = currentExpense.value
        newShopName.value = currentExpense.shop
        billOwner.value = uid.value === currentExpense.userId
    }
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

const editExpense = async () => {
    const editedExpense = {
        name: newExpenseName.value,
        value: newExpenseValue.value,
        timestamp: Timestamp.fromDate(new Date(expense.value.timestamp)),
        shop: newShopName.value,
        familyMembers: expense.value.familyMembers,
        userId: expense.value.userId,
    }
    await updateDocument(
        [StateEntries.Expenses, expense.value.id],
        editedExpense
    )

    const index = expenses.value.findIndex((e) => e.id === expense.value.id)
    expenses.value[index] = {
        ...editedExpense,
        timestamp: new Date(editedExpense.timestamp.seconds * 1000),
        id: expenses.value[index].id,
    }
    if (document.value && photoBase64.value) {
        await savePhotoToStorageWithId(
            "photosCollection",
            expense.value.id,
            document.value,
            photoBase64.value
        )
    }

    router.back()
}

const removeExpense = async () => {
    await deleteDocument([StateEntries.Expenses, expense.value.id])
    removeExpenseFromStore(expense.value.id)
    router.back()
}

const fetchBillUrl = async () => {
    const url = await getPhotoById("photosCollection", expense.value.id)
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
    loadExpenseData()
    expense.value.timestamp = formatDate(expense.value.timestamp)
    await fetchBillUrl()
})

const handleMember = (member) => {
    if (expense.value.familyMembers.includes(member.id)) {
        expense.value.familyMembers = expense.value.familyMembers.filter(
            (m) => m != member.id
        )
    } else {
        expense.value.familyMembers.push(member.id)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-buttons slot="start" v-if="expense && expense.userId === uid">
                    <uiButton
                        fill="clear"
                        :strong="true"
                        @click="removeExpense()"
                        >Usuń</uiButton
                    >
                </ion-buttons>
                <ion-buttons slot="end" v-if="expense && expense.userId === uid">
                    <uiButton fill="clear" :strong="true" @click="editExpense()"
                        >Zapisz</uiButton
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="inner-content" v-if="expense">
                <ion-item>
                    <ion-input
                        data-test="shop-input"
                        label="Nazwa sklepu"
                        label-placement="floating"
                        type="text"
                        v-model="newShopName"
                        :disabled="expense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                        data-test="name-input"
                        label="Nazwa wydatku"
                        label-placement="floating"
                        type="text"
                        v-model="newExpenseName"
                        :disabled="expense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                        data-test="value-input"
                        label="Całkowita kwota"
                        label-placement="floating"
                        type="number"
                        v-model="newExpenseValue"
                        :disabled="expense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                        data-test="date-input"
                        label="Data"
                        label-placement="floating"
                        type="date"
                        v-model="expense.timestamp"
                        :disabled="expense.userId !== uid"
                    ></ion-input>
                </ion-item>
                <FamilyDropdownSelectMember
                    :members="expense.familyMembers"
                    @toggleMember="handleMember"
                    v-if="expense.userId === uid"
                />
                <ion-item v-if="expense.userId === uid">
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
