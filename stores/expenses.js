import { defineStore } from "pinia"

export const useExpensesStore = defineStore({
    id: "expenses-store",
    state: () => {
        return {
            expenses: [],
        }
    },
    actions: {
        addExpensesToStore(expenses) {
            this.expenses = []
            this.expenses = [...this.expenses, ...expenses]
        },
        removeExpenseFromStore(id) {
            this.expenses = this.expenses.filter((expense) => expense.id !== id)
        },
    },
    getters: {
        getExpenesesFromStore() {
            return this.expenses
        },
        getExpenseById(id) {
            return this.expenses.find((expense) => expense.id === id)
        },
    },
})
