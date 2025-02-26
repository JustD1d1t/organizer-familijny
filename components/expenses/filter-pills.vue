<script setup>
const props = defineProps({
    filters: {
        type: Array,
        default: () => [],
    },
    disableRemoveFilter: {
        type: Boolean,
        default: false,
    },
})

const expensesStore = useExpensesStore()
const {
    selectedPeriod,
    startDate,
    endDate,
    shopName,
    expenseName,
    startPrice,
    endPrice,
    category,
} = storeToRefs(expensesStore)

const {
    queryExpenses,
    updatePeriod,
    updateEndDate,
    updateStartDate,
    updateStartPrice,
    updateEndPrice,
    updateShopName,
    updateExpenseName,
    updateCategory,
} = expensesStore

const selectedDate = computed(() => {
    if (selectedPeriod.value.label) {
        return selectedPeriod.value.label
    } else if (startDate.value && endDate.value) {
        return `${startDate.value} - ${endDate.value}`
    } else {
        return ""
    }
})

const priceRange = computed(() => {
    if (startPrice.value && endPrice.value) {
        return `${startPrice.value} - ${endPrice.value}`
    } else if (startPrice.value) {
        return `od ${startPrice.value}`
    } else if (endPrice.value) {
        return `do ${endPrice.value}`
    } else {
        return ""
    }
})

const removeFilter = async (type) => {
    switch (type) {
        case "shopName":
            updateShopName("")
            break
        case "expenseName":
            updateExpenseName("")
            break
        case "category":
            updateCategory("")
            break
        case "priceRange":
            updateStartPrice(null)
            updateEndPrice(null)
            break
        case "selectedPeriod":
            updatePeriod({ value: "month", label: "Bieżący miesiąc" })
            break
    }
    await queryExpenses()
}
</script>
<template>
    <div class="flex overflow-auto gap-2 w-full">
        <UiPill>
            {{ selectedDate }}
            <uiButton
                type="tertiary"
                size="small"
                v-if="selectedPeriod.value !== 'month'"
                @click="removeFilter('selectedPeriod')"
            >
                <ion-icon v-if="!disableRemoveFilter" :icon="ioniconsCloseOutline"></ion-icon>
            </uiButton>
        </UiPill>
        <UiPill v-if="shopName">
            {{ shopName }}
            <uiButton
                type="tertiary"
                size="small"
                @click="removeFilter('shopName')"
            >
                <ion-icon v-if="!disableRemoveFilter" :icon="ioniconsCloseOutline"></ion-icon>
            </uiButton>
        </UiPill>
        <UiPill v-if="category">
            {{ category }}
            <uiButton
                type="tertiary"
                size="small"
                @click="removeFilter('category')"
            >
                <ion-icon v-if="!disableRemoveFilter" :icon="ioniconsCloseOutline"></ion-icon>
            </uiButton>
        </UiPill>
        <UiPill v-if="expenseName">
            {{ expenseName }}
            <uiButton
                type="tertiary"
                size="small"
                @click="removeFilter('expenseName')"
            >
                <ion-icon v-if="!disableRemoveFilter" :icon="ioniconsCloseOutline"></ion-icon>
            </uiButton>
        </UiPill>
        <UiPill v-if="priceRange">
            {{ priceRange }}
            <uiButton
                type="tertiary"
                size="small"
                @click="removeFilter('priceRange')"
            >
                <ion-icon v-if="!disableRemoveFilter" :icon="ioniconsCloseOutline"></ion-icon>
            </uiButton>
        </UiPill>
    </div>
</template>
<style lang="scss" scoped>
ion-button {
    height: 8px;
    min-height: unset;
    &::part(native) {
        padding: 0;
        margin: 0;
        height: 8px;
        min-height: unset;
    }
}
</style>
