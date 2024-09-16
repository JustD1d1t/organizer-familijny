<script setup>
const emit = defineEmits(["downloadExpenses"])

import { useExpensesStore } from "~/stores/expenses"
const { billCategories } = useBillCategories()
const expensesStore = useExpensesStore()
const {
    selectedPeriod,
    startDate,
    endDate,
    startPrice,
    endPrice,
    shopName,
    expenseName,
    category,
} = storeToRefs(expensesStore)
const {
    updatePeriod,
    updateEndDate,
    updateStartDate,
    updateEndPrice,
    updateShopName,
    updateExpenseName,
    clearCategory,
    resetFilters,
} = expensesStore

const resetFiltersFunction = () => {
    resetFilters()
    emit("downloadExpenses")
}
</script>

<template>
    <ion-menu
        side="start"
        menu-id="expense-filter"
        content-id="main-content"
        swipeGesture="false"
    >
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Filtry wydatków</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <div class="flex flex-col h-[80dvh] overflow-auto">
                <div class="flex-grow">
                    <h4 class="font-bold mb-1">Okres</h4>
                    <span class="text-sm mb-2 block">Pokaż okres:</span>
                    <div class="flex gap-x-4 gap-y-2 flex-wrap">
                        <UiPill
                            @click="
                                updatePeriod({
                                    value: 'week',
                                    label: 'Bieżący tydzień',
                                })
                            "
                            :active="selectedPeriod.value == 'week'"
                        >
                            Bieżący tydzień
                        </UiPill>
                        <UiPill
                            @click="
                                updatePeriod({
                                    value: 'month',
                                    label: 'Bieżący miesiąc',
                                })
                            "
                            :active="selectedPeriod.value == 'month'"
                        >
                            Bieżący miesiąc
                        </UiPill>
                        <UiPill
                            @click="
                                updatePeriod({
                                    value: 'quarter',
                                    label: 'Bieżący kwartał',
                                })
                            "
                            :active="selectedPeriod.value == 'quarter'"
                        >
                            Bieżący kwartał
                        </UiPill>
                    </div>
                    <span class="text-sm block my-2"
                        >Wybierz niestandardowy okres:</span
                    >
                    <div class="flex justify-around">
                        <div class="flex items-center">
                            <span>Od:</span>
                            <ion-datetime-button
                                datetime="startTime"
                                :value="startDate"
                            ></ion-datetime-button>
                        </div>
                        <div class="flex items-center">
                            <span>Do:</span>
                            <ion-datetime-button
                                datetime="endTime"
                                :value="endDate"
                            ></ion-datetime-button>
                        </div>
                    </div>
                    <UiDivider class="my-2" />

                    <h4 class="font-bold mb-1">Cena</h4>
                    <span class="text-sm mb-2 block">
                        Pokaż wydatki z zakresu:
                    </span>

                    <ion-list lines="none" class="flex flex-row">
                        <uiInput
                            label="Od:"
                            v-model="startPrice"
                            type="number"
                            placeholder="--,--"
                            class="w-1/2"
                        />

                        <uiInput
                            label="Do:"
                            v-model="endPrice"
                            type="number"
                            placeholder="--,--"
                            class="w-1/2"
                        />
                    </ion-list>
                    <UiDivider class="my-2" />

                    <h4 class="font-bold mb-1">Nazwa sklepu</h4>
                    <span class="text-sm mb-2 block">
                        Pokaż wydatki z sieci sklepów:
                    </span>
                    <ion-list lines="none">
                        <uiInput v-model="shopName" label="Nazwa sklepu" />
                    </ion-list>
                    <UiDivider class="my-2" />

                    <h4 class="font-bold mb-1">Nazwa wydatku</h4>
                    <span class="text-sm mb-2 block">
                        Pokaż wydatki o nazwie:
                    </span>
                    <ion-list lines="none">
                        <uiInput v-model="expenseName" label="Nazwa sklepu" />
                    </ion-list>
                    <UiDivider class="my-2" />

                    <h4 class="font-bold mb-1">Kategoria wydatku</h4>
                    <span class="text-sm mb-2 block">
                        Pokaż wydatki o kategorii:
                    </span>
                    <div class="flex items-center">
                        <ion-select label="Kategoria" v-model="category">
                            <ion-select-option
                                v-for="(category, index) in billCategories"
                                :key="index"
                                :value="category"
                                >{{ category }}</ion-select-option
                            >
                        </ion-select>
                        <ion-button  @click="clearCategory"
                            >Wyczyść</ion-button
                        >
                    </div>
                </div>
            </div>
            <uiButton @click="emit('downloadExpenses')" class="w-full">
                <span> Zastosuj filtry</span>
            </uiButton>
            <uiButton
                @click="resetFiltersFunction"
                class="w-full"
                type="secondary"
            >
                <span> Resetuj filtry</span>
            </uiButton>
        </ion-content>
    </ion-menu>
    <ion-modal :keep-contents-mounted="true">
        <ion-datetime
            id="startTime"
            preferWheel="false"
            presentation="date"
            v-model="startDate"
            @ionChange="updateStartDate"
        ></ion-datetime>
    </ion-modal>
    <ion-modal :keep-contents-mounted="true">
        <ion-datetime
            id="endTime"
            preferWheel="false"
            presentation="date"
            v-model="endDate"
            @ionChange="updateEndDate"
        ></ion-datetime>
    </ion-modal>
</template>
<style scoped lang="scss">
:deep .custom-input .native-wrapper {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
}
</style>
