import { defineStore } from "pinia"
import { StateEntries } from "@/types"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()

const {
    getFirstDateOfCurrentMonth,
    getLastDateOfMonth,
    getFirstDayOfWeek,
    getLastDayOfWeek,
    getFirstDateOfQuarter,
    getLastDateOfQuarter,
} = useTime()

export const useExpensesStore = defineStore({
    id: "expenses-store",
    state: () => {
        return {
            expenses: [],
            currentExpense: null,
            selectedPeriod: "month",
            startDate: getFirstDateOfCurrentMonth.value,
            endDate: getLastDateOfMonth.value,
            startPrice: null,
            endPrice: null,
            shopName: null,
            expenseName: null,
            isLoading: false,
            error: null,
        }
    },
    actions: {
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        setError(error) {
            this.error = error
        },
        addExpensesToStore(expenses) {
            this.expenses = []
            this.expenses = [...this.expenses, ...expenses]
        },
        setCurrentExpense(expense) {
            this.currentExpense = expense
        },
        clearExpenses() {
            this.expenses = []
        },

        async getExpensePhoto(id) {
            this.setLoading(true)
            const data = await request(
                `${backendUrl}/expenses/get-image?photoId=${id}`
            )
            this.setLoading(false)
            return data.url
        },
        async addExpenseToStore(expense, document, photoBase64) {
            this.setLoading(true)
            await request(`${backendUrl}/expenses/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ expense, document, photoBase64 }),
            })
            this.expenses.unshift(expense)
            this.setLoading(false)
        },
        async updateExpense(expense, document, photoBase64) {
            this.setLoading(true)
            const data = await request(`${backendUrl}/expenses/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ expense, document, photoBase64 }),
            })
            this.setLoading(false)
            return data
        },
        async editExpense(expense, document, photoBase64) {
            await this.updateExpense(expense, document, photoBase64)
            const index = this.expenses.findIndex(
                (item) => item.id === expense.id
            )
            this.expenses[index] = expense
        },
        async removeExpenseFromStore(id) {
            this.setLoading(true)
            await request(`${backendUrl}/expenses/delete?expenseId=${id}`, {
                method: "DELETE",
            })
            this.setLoading(false)
            this.expenses = this.expenses.filter((expense) => expense.id !== id)
        },
        updateStartPrice(e) {
            this.startPrice = e.detail.value
        },
        updateEndPrice(e) {
            this.endPrice = e.detail.value
        },
        updateShopName(e) {
            this.shopName = e.detail.value
        },
        updateExpenseName(e) {
            this.expenseName = e.detail.value
        },
        updateStartDate(e) {
            this.startDate = e.detail.value
            this.selectedPeriod = "custom"
        },
        updateEndDate(e) {
            this.endDate = e.detail.value
            this.selectedPeriod = "custom"
        },
        updatePeriod(e) {
            this.selectedPeriod = e.detail.value
            if (e.detail.value === "month") {
                this.startDate = getFirstDateOfCurrentMonth.value
                this.endDate = getLastDateOfMonth.value
            } else if (e.detail.value === "week") {
                this.startDate = getFirstDayOfWeek.value
                this.endDate = getLastDayOfWeek.value
            } else if (e.detail.value === "quarter") {
                this.startDate = getFirstDateOfQuarter.value
                this.endDate = getLastDateOfQuarter.value
            }
        },
        async queryExpenses() {
            this.setLoading(true)
            const startPeriod = new Date(this.startDate).getTime()
            const endPeriod = new Date(this.endDate).getTime()
            const statements = [
                {
                    key: "userId",
                    value: localStorage.getItem("uid"),
                    statement: "==",
                },
                {
                    key: "timestamp",
                    value: startPeriod,
                    statement: ">=",
                },
                {
                    key: "timestamp",
                    value: endPeriod,
                    statement: "<=",
                },
            ]
            const membershipStatements = [
                {
                    key: StateEntries.FamilyMembers,
                    value: localStorage.getItem("uid"),
                    statement: "array-contains",
                },
                {
                    key: "timestamp",
                    value: startPeriod,
                    statement: ">=",
                },
                {
                    key: "timestamp",
                    value: endPeriod,
                    statement: "<=",
                },
            ]
            if (this.startPrice) {
                statements.push({
                    key: "value",
                    value: Number(this.startPrice),
                    statement: ">=",
                })
                membershipStatements.push({
                    key: "value",
                    value: Number(this.startPrice),
                    statement: ">=",
                })
            }

            if (this.endPrice) {
                statements.push({
                    key: "value",
                    value: Number(this.endPrice),
                    statement: "<=",
                })
                membershipStatements.push({
                    key: "value",
                    value: Number(this.endPrice),
                    statement: "<=",
                })
            }

            if (this.shopName) {
                statements.push({
                    key: "shop",
                    value: this.shopName,
                    statement: ">=",
                })
                statements.push({
                    key: "shop",
                    value: this.shopName + "\uf8ff",
                    statement: "<=",
                })
                membershipStatements.push({
                    key: "shop",
                    value: this.shopName,
                    statement: ">=",
                })
                membershipStatements.push({
                    key: "shop",
                    value: this.shopName + "\uf8ff",
                    statement: "<=",
                })
            }

            if (this.expenseName) {
                statements.push({
                    key: "name",
                    value: this.expenseName,
                    statement: ">=",
                })
                statements.push({
                    key: "name",
                    value: this.expenseName + "\uf8ff",
                    statement: "<=",
                })
                membershipStatements.push({
                    key: "name",
                    value: this.expenseName,
                    statement: ">=",
                })
                membershipStatements.push({
                    key: "name",
                    value: this.expenseName + "\uf8ff",
                    statement: "<=",
                })
            }
            this.setLoading(true)
            const data = await request(
                `${backendUrl}/expenses/get-all?userId=${localStorage.getItem(
                    "uid"
                )}`
            )
            this.setLoading(false)
            const allExpenses = [...data.expenses, ...data.collaboratedExpenses]
            const sortedByDateExpenses = allExpenses.sort((a, b) => {
                return b.timestamp - a.timestamp
            })
            this.expenses = [...sortedByDateExpenses]

            this.setLoading(false)
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
