<script setup>
import { StateEntries } from "@/types"
const uid = localStorage.getItem("uid")

const expensesStore = useExpensesStore()
const { queryExpenses, setCurrentExpense } = expensesStore

const { expenses, isLoading } = storeToRefs(expensesStore)
const showSelect = ref("all")

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
                expense.userId === uid &&
                expense.familyMembers.length === 0
        )
    } else {
        return expenses.value.filter(
            (expense) =>
                (expense.userId === uid &&
                    expense.familyMembers.length > 0) ||
                expense.familyMembers.includes(uid)
        )
    }
})

const showAll = () => {
    showSelect.value = "all"
}

const showMy = () => {
    showSelect.value = "my"
}

const showCommon = () => {
    showSelect.value = "common"
}

const openFilterMenu = async () => {
    await menuController.open("expense-filter")
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Wydatki</ion-title>
                <ion-buttons slot="start">
                    <ion-button fill="clear" @click="openFilterMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsFilter" />
                    </ion-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button fill="clear" id="open-menu">
                        <ion-icon
                            slot="icon-only"
                            :icon="ioniconsEllipsisVerticalOutline"
                        />
                    </ion-button>
                    <ion-popover trigger="open-menu" trigger-action="click">
                        <ion-content class="ion-padding">
                            <ion-list lines="none">
                                <ion-item @click="showAll">
                                    <ion-label>Pokaż wszystkie</ion-label>

                                    <ion-icon
                                        slot="end"
                                        :icon="ioniconsCheckmarkOutline"
                                        v-if="showSelect === 'all'"
                                    ></ion-icon>
                                </ion-item>
                                <ion-item @click="showCommon">
                                    <ion-icon
                                        slot="end"
                                        :icon="ioniconsCheckmarkOutline"
                                        v-if="showSelect === 'common'"
                                    ></ion-icon>
                                    <ion-label>Pokaż wspólne</ion-label>
                                </ion-item>
                                <ion-item @click="showMy">
                                    <ion-icon
                                        slot="end"
                                        :icon="ioniconsCheckmarkOutline"
                                        v-if="showSelect === 'my'"
                                    ></ion-icon>
                                    <ion-label>Pokaż moje</ion-label>
                                </ion-item>
                            </ion-list>
                        </ion-content>
                    </ion-popover>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div
                v-if="isLoading"
                class="w-full flex justify-center items-center h-full"
            >
                <ion-spinner name="lines-sharp"></ion-spinner>
            </div>
            <div v-else-if="!isLoading && !expenses.length">
                <h2>Brak wydatków</h2>
            </div>
            <div v-else class="ion-padding">
                <div class="text-center text-4xl my-4">
                    Razem {{ totalSum }} zł
                </div>
                <ion-list>
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
