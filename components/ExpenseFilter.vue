<script setup>
const emit = defineEmits(["downloadExpenses"])

import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const {
    selectedPeriod,
    startDate,
    endDate,
    startPrice,
    endPrice,
    shopName,
    expenseName,
} = storeToRefs(expensesStore)
const {
    updatePeriod,
    updateEndDate,
    updateStartDate,
    updateStartPrice,
    updateEndPrice,
    updateShopName,
    updateExpenseName,
} = expensesStore
</script>

<template>
    <ion-menu
        side="start"
        menu-id="expense-filter"
        content-id="main-content"
        swipeGesture="false"
    >
        <ion-header>
            <ion-toolbar>
                <ion-title>Filtry wydatków</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <div>
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

                <div class="flex justify-around gap-x-4">
                    <ion-input
                        class="custom-input"
                        label="Od:"
                        @ionInput="updateStartPrice"
                        :value="startPrice"
                        type="number"
                        placeholder="--,--"
                    />

                    <ion-input
                        class="custom-input"
                        label="Do:"
                        @ionInput="updateEndPrice"
                        :value="endPrice"
                        type="number"
                        placeholder="--,--"
                    />
                </div>
                <UiDivider class="my-2" />

                <h4 class="font-bold mb-1">Nazwa sklepu</h4>
                <span class="text-sm mb-2 block">
                    Pokaż wydatki z sieci sklepów:
                </span>
                <ion-input
                    class="custom-input"
                    @ionInput="updateShopName"
                    :value="shopName"
                    type="text"
                    placeholder="Nazwa sklepu"
                />
                <UiDivider class="my-2" />

                <h4 class="font-bold mb-1">Nazwa wydatku</h4>
                <span class="text-sm mb-2 block">
                    Pokaż wydatki o nazwie:
                </span>
                <ion-input
                    class="custom-input"
                    @ionInput="updateExpenseName"
                    :value="expenseName"
                    type="text"
                    placeholder="Nazwa sklepu"
                />
            </div>
            <ion-button @click="emit('downloadExpenses')" class="mt-5 w-full">
                Zastosuj filtry
            </ion-button>
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
