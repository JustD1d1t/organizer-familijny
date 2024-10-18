<script setup>
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const expensesStore = useExpensesStore()
const { queryExpenses, setCurrentExpense, handleExpensesVisibility } =
    expensesStore

const { expenses, isLoading, showSelect } = storeToRefs(expensesStore)

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
            <uiInfoCard
                v-else-if="
                    !isLoading &&
                    !expensesToShow.length &&
                    showSelect !== 'common'
                "
                title="Czy wiesz, że..."
                subtitle="Możesz dodawać swoje wydatki i zarządzać nimi w jednym miejscu?"
                icon="ioniconsBulb"
                class="mt-8"
            >
                <br />
                <p>
                    Wystarczy, że klikniesz w przycisk "+" na dole ekranu i
                    przejdziesz do strony z dodawaniem wydatku
                </p>
                <br />
                <p>Jak dodać wydatek:</p>
                <ul>
                    <li>
                        Zeskanuj paragon (najlepiej zdjęcie z funkcją dokument z
                        aparatu). Zdjęcie musi być pionowo
                    </li>
                    <li>
                        Aplikacja zeskanuje nazwę sklepu, całkowitą kwotę, datę.
                        Jeśli coś się nie uda to uzupełnij dane ręcznie
                    </li>
                    <li>
                        Dodaj nazwę wydatku oraz kategorię - to pomoże Ci w
                        doglądaniu na co wydajesz pieniądze
                    </li>
                    <li>Dodaj osoby, które powinny zobaczyć wydatek</li>
                </ul>
                <br />
                <p class="h3 font-bold">Dodaj swój pierwszy wydatek</p>
            </uiInfoCard>
            <div v-else class="h-full overflow-auto">
                <ion-accordion-group>
                    <ion-accordion value="first">
                        <ion-item slot="header" color="light">
                            <ion-label><b>Czy wiesz, że...</b></ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <uiInfoCard
                                subtitle="Możesz zmieniać filtry swoich wydatków?"
                                icon="ioniconsBulb"
                                class="mb-4 mt-2"
                            >
                                <br />
                                <p>
                                    Możesz odfiltrować wszystkie wydatki, Twoje
                                    wydatki, lub wydatki wspólne czyli te
                                    których jesteś właścicielem lub możesz je
                                    podglądać
                                </p>
                                <br />
                                <p>
                                    Możesz też filtrować wydatki. Wystarczy, że
                                    klikniesz ikonkę filtrów w prawym górnym
                                    rogu i otworzy Ci się panel w którym
                                    określasz jakie wydatki chcesz zobaczyć
                                </p>
                                <br />
                                <p>
                                    Możesz również zobaczyć pogrupowane wydatki
                                    na wykresie. Mogą to być wydatki wszystkie,
                                    Twoje lub wspólne. Wystarzy, że na tej
                                    stronie zaznaczysz, które wydatki chcesz
                                    zobaczyć. Kliknij w ikonę wykresu w prawym
                                    górnym rogu
                                </p>
                            </uiInfoCard>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
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
