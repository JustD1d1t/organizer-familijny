<script setup>
import { ref, computed, onMounted, watch, onBeforeMount } from "vue"
import { init } from "echarts"

const expensesStore = useExpensesStore()
const { expenses, showSelect } = storeToRefs(expensesStore)
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const { billCategoriesIcons } = useBillCategories()

const totalSum = computed(() => {
    return parseFloat(
        expenses.value.reduce(
            (acc, expense) => Number(acc) + Number(expense.value),
            0
        )
    ).toFixed(2)
})

const expensesToShow = computed(() => {
    if (showSelect.value === "all") {
        return expenses.value
    } else if (showSelect.value === "my") {
        return expenses.value.filter(
            (expense) =>
                expense.userId === uid.value &&
                expense.familyMembers.length === 0
        )
    } else {
        return expenses.value.filter(
            (expense) =>
                (expense.userId === uid.value &&
                    expense.familyMembers.length > 0) ||
                expense.familyMembers.includes(uid.value)
        )
    }
})

const minChartSize = ref(350)

const groupExpensesByCategory = computed(() => {
    const groupedExpenses = new Map()

    expensesToShow.value.forEach((expense) => {
        const { category, value } = expense
        if (groupedExpenses.has(category)) {
            groupedExpenses.set(category, groupedExpenses.get(category) + value)
        } else {
            groupedExpenses.set(category, value)
        }
    })

    for (const [key, value] of groupedExpenses) {
        groupedExpenses.set(key, value.toFixed(2))
    }

    const sortedExpenses = new Map(
        [...groupedExpenses.entries()].sort((a, b) => b[1] - a[1])
    )

    return sortedExpenses
})

const chart = ref(null)

const prepareChart = () => {
    // Jeśli instancja wykresu już istnieje, zniszcz ją

    // Utwórz nową instancję wykresu
    const myChart = init(chart.value)

    const groupedExpenses = groupExpensesByCategory.value

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
                    borderRadius: [10, 10, 0, 0],
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
        option.series[0].data.push(Number(value).toFixed(2))
    }

    myChart.setOption(option)

    // Resize chart to fit the container
    myChart.resize()
}

const openFilterMenu = async () => {
    await menuController.open("expense-filter")
}

onBeforeMount(() => {
    minChartSize.value = window.innerWidth - 2 * 16
})

onMounted(() => {
    prepareChart()
})

watch(expenses, () => {
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
                <!-- <ion-buttons slot="end">
                    <uiButton type="tertiary" @click="openFilterMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsFilter" />
                    </uiButton>
                </ion-buttons> -->
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="h-dvh overflow-hidden">
            <ExpensesFilterPills :disableRemoveFilter="true" />
            <div style="overflow-x: auto">
                <div
                    ref="chart"
                    :style="{
                        width: `${Math.max(
                            70 * groupExpensesByCategory.size,
                            minChartSize
                        )}px`,
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
                    v-for="[key, value] in groupExpensesByCategory"
                    :key="key"
                    class="flex flex-col py-2 pl-6 pr-2 bg-white rounded-2xl shadow-lg"
                >
                    <ion-label class="flex items-center">
                        <ion-icon :icon="billCategoriesIcons[key]" class="mr-2">
                        </ion-icon>
                        {{ key }}
                    </ion-label>
                    <ion-label slot="end">
                        {{ Number(value).toFixed(2) }}
                    </ion-label>
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
