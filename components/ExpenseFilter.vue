<script setup>
const emit = defineEmits(["downloadExpenses"])
const {
    selectedPeriod,
    startDate,
    endDate,
    startPrice,
    endPrice,
    updatePeriod,
    updateEndDate,
    updateStartDate,
    updateStartPrice,
    updateEndPrice,
    updateShopName,
    updateExpenseName,
} = useExpenses()
</script>

<template>
    <ion-menu
        side="start"
        menu-id="expense-filter"
        content-id="main-content"
        @ionWillClose="emit('downloadExpenses')"
    >
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Filtry wydatków</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <div>
                <ion-item>
                    <ion-select
                        v-model="selectedPeriod"
                        ok-text="OK"
                        cancel-text="Anuluj"
                        label="Wybierz okres"
                        @ionChange="updatePeriod"
                    >
                        <ion-select-option value="week"
                            >Tydzień</ion-select-option
                        >
                        <ion-select-option value="month"
                            >Miesiąc</ion-select-option
                        >
                        <ion-select-option value="quarter"
                            >Kwartał</ion-select-option
                        >
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label>Data początkowa</ion-label>
                    <ion-datetime-button
                        datetime="startTime"
                        :value="startDate"
                    ></ion-datetime-button>
                </ion-item>
                <ion-item>
                    <ion-label>Data końcowa</ion-label>
                    <ion-datetime-button
                        datetime="endTime"
                        :value="endDate"
                    ></ion-datetime-button>
                </ion-item>
                <ion-item>
                    <ion-input @ionInput="updateStartPrice" type="number">Cena od</ion-input>
                </ion-item>
                <ion-item>
                    <ion-input @ionInput="updateEndPrice" type="number">Cena do</ion-input>
                </ion-item>
                <ion-item>
                    <ion-input @ionInput="updateShopName" type="text">Nazwa sklepu</ion-input>
                </ion-item>
                <ion-item>
                    <ion-input @ionInput="updateExpenseName" type="text">Nazwa wydatku</ion-input>
                </ion-item>
            </div>
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
