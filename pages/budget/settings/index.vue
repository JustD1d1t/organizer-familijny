<script setup>
const isAddCategoryModalOpen = ref(false)
const newCategory = ref("")
const newCategoryAmount = ref(0)
const { billCategories } = useBillCategories()

const budgetStore = useBudgetStore()
const { saveBudgetDetails } = budgetStore
const { budgetDetails } = storeToRefs(budgetStore)
const monthlyIncome = ref(budgetDetails.value.monthlyIncome)
const categories = ref(budgetDetails.value.items || [])

const error = ref(null)

const closeModal = () => {
    isAddCategoryModalOpen.value = false
    newCategory.value = ""
    newCategoryAmount.value = 0
}

const openAddCategoryModal = () => {
    isAddCategoryModalOpen.value = true
}

const addCategory = () => {
    const isCategoryAlreadyAdded = categories.value.some(
        (category) => category.category === newCategory.value
    )
    if (isCategoryAlreadyAdded) {
        error.value = "Kategoria już istnieje"
        return
    }
    categories.value.push({
        category: newCategory.value,
        amount: newCategoryAmount.value,
    })
    closeModal()
}

const categoriesToDisplay = computed(() => {
    return billCategories.filter(
        (category) =>
            !categories.value.some(
                (addedCategory) => addedCategory.category === category
            )
    )
})

const removeCategory = (category) => {
    categories.value = categories.value.filter(
        (addedCategory) => addedCategory.category !== category.category
    )
}

const saveCategories = async () => {
    const categoriesToSave = categories.value.map((category) => ({
        category: category.category,
        amount: category.amount,
    }))
    await saveBudgetDetails(categoriesToSave, monthlyIncome.value)
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Budżet</ion-title>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="h-dvh overflow-hidden">
            <uiList>
                <uiInput
                    label="Miesięczny przychód"
                    v-model="monthlyIncome"
                    type="number"
                />
                <ion-item
                    class="flex items-end justify-between"
                    v-for="cat in categories"
                    :key="cat.category"
                >
                    <uiInput
                        :label="cat.category"
                        v-model="cat.amount"
                        type="number"
                        slot="start"
                        class="w-5/6"
                    />
                    <uiButton
                        type="tertiary"
                        @click="() => removeCategory(cat)"
                        class="mb-2"
                    >
                        <ion-icon
                            slot="icon-only"
                            :icon="ioniconsTrash"
                        ></ion-icon>
                    </uiButton>
                </ion-item>
            </uiList>
            <uiButton
                type="tertiary"
                class="w-full"
                @click="openAddCategoryModal"
            >
                <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
                Dodaj kategorię wydatków
            </uiButton>
            <uiButton class="w-full" @click="saveCategories"> Zapisz </uiButton>
            <ion-modal
                class="auto-height"
                :is-open="isAddCategoryModalOpen"
                @willDismiss="closeModal"
            >
                <div class="px-2 py-4">
                    <uiList>
                        <ion-select label="Kategoria" v-model="newCategory">
                            <ion-select-option
                                v-for="(category, index) in categoriesToDisplay"
                                :key="index"
                                :value="category"
                                >{{ category }}</ion-select-option
                            >
                        </ion-select>
                        <p v-if="error">{{ error }}</p>
                        <uiInput
                            label="Miesięczny limit"
                            v-model="newCategoryAmount"
                            type="number"
                        />
                    </uiList>
                    <uiButton
                        type="primary"
                        class="w-full"
                        @click="addCategory"
                    >
                        Zapisz
                    </uiButton>
                    <uiButton
                        type="tertiary"
                        class="w-full"
                        @click="closeModal"
                    >
                        Anuluj
                    </uiButton>
                </div>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>
