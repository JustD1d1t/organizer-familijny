<script setup lang="ts">
const props = defineProps<{
    expense: Expense
}>()
const emit = defineEmits<{
    (event: "openEditExpense", item: Expense): void
    (event: "removeExpense", item: Expense): void
}>()

const expenseValueMain = computed(() => {
    return parseInt(props.expense.value)
})
const expenseValuePart = computed(() => {
    return (
        Number(props.expense.value) - Math.floor(Number(props.expense.value))
    )
        .toFixed(2)
        .toString()
        .slice(2)
})

const convertedDate = computed(() => {
    if (props.expense.timestamp.seconds) {
        return new Date(props.expense.timestamp.seconds * 1000).toLocaleString(
            "default",
            {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            }
        )
    } else {
        return new Date(props.expense.timestamp).toLocaleString("default", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        })
    }
})

const openEditExpense = async (item: Expense) => {
    emit("openEditExpense", item)
}

const removeExpense = async (item: Expense) => {
    emit("removeExpense", item)
}
</script>
<template>
    <ion-item class="flex flex-col">
        <div class="flex h-full w-full justify-between items-start">
            <div class="flex flex-col">
                <p class="text-base expense-shop">
                    {{ expense.shop }} - {{ expense.name }}
                </p>
                <p class="text-lg font-bold expense-date">
                    {{ convertedDate }}
                </p>
            </div>
            <div class="flex items-end font-bold">
                <p class="flex items-start">
                    <span class="text-3xl price-big">
                        {{ expenseValueMain }}
                    </span>
                    <span class="text-sm price-small">
                        {{ expenseValuePart }}
                    </span>
                </p>
            </div>
        </div>
    </ion-item>
</template>
