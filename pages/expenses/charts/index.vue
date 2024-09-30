<script setup>
import { ref, onMounted } from "vue"
import { init } from "echarts"

const expensesStore = useExpensesStore()
const { expenses } = storeToRefs(expensesStore)

const { billCategoriesIcons } = useBillCategories()

const totalSum = computed(() => {
    return parseFloat(
        expenses.value.reduce(
            (acc, expense) => Number(acc) + Number(expense.value),
            0
        )
    ).toFixed(2)
})

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

    const sortedExpenses = new Map(
        [...groupedExpenses.entries()].sort((a, b) => b[1] - a[1])
    )

    return sortedExpenses
}

const groupedItemsByCategory = computed(() => {
    const groupedItems = new Map()

    expenses.value.forEach((expense) => {
        if (expense.items && expense.items.length) {
            expense.items.forEach((item) => {
                const { category, price } = item

                if (groupedItems.has(category)) {
                    groupedItems.set(
                        category,
                        groupedItems.get(category) + price
                    )
                } else {
                    groupedItems.set(category, price)
                }
            })
        } else {
            const { category, value } = expense

            if (groupedItems.has(category)) {
                groupedItems.set(category, groupedItems.get(category) + value)
            } else {
                groupedItems.set(category, value)
            }
        }
    })

    const sortedItems = new Map(
        [...groupedItems.entries()].sort((a, b) => b[1] - a[1])
    )
    groupedItems.value = sortedItems
    return sortedItems
})

const chart = ref(null)

const prepareChart = () => {
    const groupedExpenses = groupedItemsByCategory.value
    const myChart = init(chart.value)

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

    const option = {
        legend: {
            data: [],
        },
        tooltip: {},
        grid: {
            left: "50px",
            bottom: "30px",
            top: "20px",
        },
        xAxis: {
            type: "category",
            axisTick: { show: false },
            data: [],
            axisLabel: {
                show: false,
            },
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                name: "Wydatki",
                type: "bar",
                data: [],
                barWidth: 40, // Szerokość słupków ustawiona na 40px
                barGap: "200%", // Zwiększony odstęp między słupkami
                itemStyle: {
                    color: function (params) {
                        return colors[params.dataIndex % colors.length]
                    },
                },
                label: {
                    show: true,
                    position: "bottom",
                    formatter: function (params) {
                        return option.xAxis.data[params.dataIndex]
                    },
                    color: "#000",
                    rotate: 0,
                    align: "center",
                    verticalAlign: "middle",
                    distance: 20,
                    fontSize: 10,
                },
            },
        ],
    }

    for (const [key, value] of groupedExpenses.entries()) {
        option.xAxis.data.push(key)
        option.series[0].data.push(value.toFixed(2))
    }

    myChart.setOption(option)
}
const openFilterMenu = async () => {
    await menuController.open("expense-filter")
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
                <ion-buttons slot="end">
                    <uiButton type="tertiary" @click="openFilterMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsFilter" />
                    </uiButton>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="h-dvh overflow-hidden">
            <!-- Kontener z przewijaniem w poziomie -->
            <div style="overflow-x: auto">
                <!-- Ustaw szerokość na większą od 400px, aby pomieścić szerokie słupki -->
                <div
                    ref="chart"
                    :style="{
                        'min-width': '350px !important',
                        width: `${70 * groupedItemsByCategory.size}px`,
                        height: '400px',
                        margin: '0 auto',
                    }"
                ></div>
            </div>
            <uiList>
                <ion-item
                    class="flex flex-col py-2 pl-6 pr-2 bg-white rounded-2xl shadow-lg"
                >
                    <ion-label>Razem {{ totalSum }}</ion-label>
                </ion-item>
                <ion-item
                    v-for="[key, value] in groupedItemsByCategory"
                    :key="key"
                    class="flex flex-col py-2 pl-6 pr-2 bg-white rounded-2xl shadow-lg"
                >
                    <ion-label class="flex items-center">
                        <ion-icon :icon="billCategoriesIcons[key]" class="mr-2">
                        </ion-icon>
                        {{ key }}
                    </ion-label>
                    <ion-label slot="end"> {{ value.toFixed(2) }} </ion-label>
                </ion-item>
            </uiList>
        </ion-content>
    </ion-page>
</template>

<style lang="scss" scoped>
ion-item {
    ion-label {
        display: flex !important;
    }
}
</style>
