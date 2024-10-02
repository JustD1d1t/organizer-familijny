<script setup>
import { StateEntries } from "@/types"
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const expensesStore = useExpensesStore()
const { queryExpenses, setCurrentExpense } = expensesStore

const { expenses, isLoading } = storeToRefs(expensesStore)
const showSelect = ref("all")

const filters = [
    {
        value: "all",
        label: "Wszystkie",
    },
    {
        value: "my",
        label: "Moje",
    },
    {
        value: "common",
        label: "Wspólne",
    },
]
useAsyncData(async () => {
    await queryExpenses()
})

const editExpense = (expense) => {
    setCurrentExpense(expense)
    navigateTo(`/expenses/${expense.id}`)
}

const goToNewExpense = () => {
    navigateTo("/expenses/new")
}

const totalSum = computed(() => {
    return parseFloat(
        expensesToShow.value.reduce(
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

const openFilterMenu = async () => {
    await menuController.open("expense-filter")
}

const handleExpensesVisibility = (filter) => {
    if (filter.label === "Wszystkie") {
        showSelect.value = "all"
    } else if (filter.label === "Moje") {
        showSelect.value = "my"
    } else {
        showSelect.value = "common"
    }
}

const openExpensesCharts = () => {
    navigateTo("/expenses/charts")
}
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
                    <uiButton type="tertiary" @click="openExpensesCharts">
                        <ion-icon
                            slot="icon-only"
                            :icon="ioniconsBarChartOutline"
                        />
                    </uiButton>
                    <uiButton type="tertiary" @click="openFilterMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsFilter" />
                    </uiButton>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="h-dvh overflow-hidden">
            <div>
                <UiFilterTabs
                    :filters="filters"
                    :active="showSelect"
                    @click="handleExpensesVisibility"
                />
                <ExpensesFilterPills />
            </div>
            <div
                v-if="isLoading"
                class="w-full flex justify-center items-center h-full"
            >
                <ion-spinner name="lines-sharp"></ion-spinner>
            </div>
            <h2 v-else-if="!isLoading && !expensesToShow.length">
                Brak wydatków
            </h2>
            <div v-else class="h-full overflow-auto">
                <div class="text-2xl my-4 flex justify-between font-bold">
                    <span>Razem </span>
                    <span>{{ totalSum }} zł</span>
                </div>
                <UiDivider class="mb-6" />
                <ion-list lines="none" class="overflow-auto h-[70%]">
                    <expenses-item
                        v-for="expense in expensesToShow"
                        :key="`${expense.name}-${expense.id}`"
                        :expense="expense"
                        @click="() => editExpense(expense)"
                    />
                </ion-list>
            </div>
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToNewExpense">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
<style lang="scss" scoped>
ion-text {
    h1 {
        margin-top: 0.5rem;
    }
}

ion-popover {
    --width: 60%;
}
</style>
