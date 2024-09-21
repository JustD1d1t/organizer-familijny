<script setup>
import { ref, onMounted } from "vue"
import { init } from "echarts" // Importuj tylko funkcję init z ECharts

const expensesStore = useExpensesStore()
const { expenses } = storeToRefs(expensesStore)

function groupExpensesByCategory() {
    const groupedExpenses = new Map()

    expenses.value.forEach((expense) => {
        const { category, value } = expense

        if (groupedExpenses.has(category)) {
            groupedExpenses.set(category, groupedExpenses.get(category) + value)
        } else {
            groupedExpenses.set(category, value)
        }
    })

    // Sortowanie według wartości
    const sortedExpenses = new Map(
        [...groupedExpenses.entries()].sort((a, b) => b[1] - a[1])
    )

    return sortedExpenses
}

function groupItemsByCategory() {
    const groupedItems = new Map()

    expenses.value.forEach((expense) => {
        expense.items.forEach((item) => {
            const { category, price } = item

            if (groupedItems.has(category)) {
                groupedItems.set(category, groupedItems.get(category) + price)
            } else {
                groupedItems.set(category, price)
            }
        })
    })

    // Sortowanie według wartości
    const sortedItems = new Map(
        [...groupedItems.entries()].sort((a, b) => b[1] - a[1])
    )

    return sortedItems
}

// Referencja do div, w którym będzie rysowany wykres
const chart = ref(null)

const prepareChart = () => {
    const groupedExpenses = groupItemsByCategory()

    // Inicjalizacja ECharts na referencji do elementu
    const myChart = init(chart.value)

    // Przykładowa tablica z kolorami (możesz dodać więcej kolorów)
    const colors = [
        "#5470C6",
        "#91CC75",
        "#FAC858",
        "#EE6666",
        "#73C0DE",
        "#3BA272",
        "#FC8452",
        "#9A60B4",
        "#EA7CCC",
    ]

    // Opcje wykresu
    const option = {
        title: {
            text: "Twoje wydatki",
        },
        legend: {
            data: [], // Legenda będzie zawierała kategorie
        },
        tooltip: {},
        grid: {
            left: "50px", // Padding z lewej strony
            bottom: "100px", // Padding z dołu, zwiększony, aby etykiety osi X były widoczne
        },
        xAxis: {
            type: "category",
            axisTick: { show: false },
            data: [], // Kategoria na osi X
            axisLabel: {
                show: false, // Ukrywa etykiety na osi X
            },
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                name: "Wydatki",
                type: "bar",
                data: [], // Dane dla słupków
                itemStyle: {
                    color: function (params) {
                        // Funkcja zwraca kolor na podstawie indeksu słupka
                        return colors[params.dataIndex % colors.length]
                    },
                },
                label: {
                    show: true, // Pokazuje etykiety nad słupkami
                    position: "bottom", // Umieszcza etykiety nad słupkami
                    formatter: function (params) {
                        // Zwraca kategorię (klucz) z danych
                        return option.xAxis.data[params.dataIndex]
                    },
                    color: "#000", // Kolor etykiety
                    rotate: 90, // Obraca etykiety o 90 stopni
                    align: "center", // Wyrównanie etykiety
                    verticalAlign: "middle", // Wyrównanie pionowe etykiety
                    distance: 50, // Odległość etykiety od słupka
                },
            },
        ],
    }

    // Dodajemy dane do wykresu
    for (const [key, value] of groupedExpenses.entries()) {
        option.xAxis.data.push(key) // Dodajemy kategorię do osi X
        option.series[0].data.push(value) // Dodajemy wartość do serii
    }

    // Ustawienie opcji na wykresie
    myChart.setOption(option)
}

onMounted(() => {
    prepareChart()
})
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Wydatki</ion-title>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="h-dvh overflow-hidden">
            <div
                ref="chart"
                style="width: 400px; height: 400px; margin: 0 auto"
            ></div>
        </ion-content>
    </ion-page>
</template>
