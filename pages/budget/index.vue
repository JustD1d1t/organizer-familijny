<script setup>
const budgetStore = useBudgetStore()
const { getBudgetDetails } = budgetStore
const { budgetDetails } = storeToRefs(budgetStore)
const categoryItems = computed(() => budgetDetails.value.items || [])
const monthlyIncome = computed(() => budgetDetails.value.monthlyIncome)
const expensesStore = useExpensesStore()
const { expenses } = storeToRefs(expensesStore)
const { queryExpenses } = expensesStore
const setBudget = () => {
    navigateTo("/budget/settings")
}

const groupExpensesByCategory = computed(() => {
    const groupedExpenses = new Map()

    expenses.value.forEach((expense) => {
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
useAsyncData(async () => {
    await getBudgetDetails()
    await queryExpenses()
})
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
            <uiInfoCard
                title="Czy wiesz, że..."
                subtitle="Możesz ustalić swój miesięczny budżet?"
                icon="ioniconsBulb"
                class="mt-8"
                v-if="!categoryItems.length"
            >
                <p class="mt-4">
                    Ustal swój budżet, a następnie rozdziel go na poszczególne
                    kategorie. Wraz ze wzrostem wydatków będziesz mógł
                    monitorować czy odpowiednio dzielisz budżet oraz, która z
                    katgorii pochłania najwięcej środków.
                </p>
                <p class="mt-2">Tak więc przejdź do ustalania budżetu.</p>
                <p class="mt-2">
                    <b>Pamiętaj, że możesz go edytować w każdej chwili</b>
                </p>
            </uiInfoCard>
            <uiList>
                <uiListItem>
                    <template #start> Budżet </template>
                    <template #end>
                        {{ monthlyIncome }}
                    </template>
                </uiListItem>
                <ion-item
                    v-for="cat in categoryItems"
                    :key="cat.category"
                    class="border rounded-xl"
                >
                    <div
                        class="flex justify-center w-full relativeh h-full items-center"
                    >
                        <span
                            class="progress"
                            :style="{
                                width:
                                    (groupExpensesByCategory.get(cat.category) /
                                        cat.amount) *
                                        100 +
                                    '%',
                            }"
                        />
                        <p class="content z-10 bg-white px-2 small">
                            <span>{{ cat.category }} &nbsp;</span>
                            <span>{{
                                groupExpensesByCategory.get(cat.category) || 0
                            }}</span>
                            <span>&nbsp;/ &nbsp;</span>
                            <span>{{ cat.amount }}</span>
                        </p>
                    </div>
                </ion-item>
            </uiList>
            <uiButton @click="setBudget" class="w-full">
                <span v-if="!categoryItems.length"> Ustal swój budżet</span>
                <span v-else> Edytuj swój budżet</span>
            </uiButton>
        </ion-content>
    </ion-page>
</template>
<style lang="scss" scoped>
.progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: blue;
}
</style>
