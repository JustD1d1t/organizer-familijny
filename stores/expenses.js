import { defineStore } from "pinia"
import { Timestamp } from "firebase/firestore/lite"
import { StateEntries } from "@/types"
import { getAuth } from "firebase/auth"
const auth = getAuth()

const {
    queryDocsInCollection,
    savePhotoToStorageWithId,
    addDocument,
    updateDocument,
} = useFirebase()

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
        }
    },
    actions: {
        addExpensesToStore(expenses) {
            this.expenses = []
            this.expenses = [...this.expenses, ...expenses]
        },
        setCurrentExpense(expense) {
            this.currentExpense = expense
        },
        async addExpenseToStore(expense, document, photoBase64) {
            const addExpenseResponse = await addDocument(
                [StateEntries.Expenses],
                expense
            )
            if (addExpenseResponse.type === "document") {
                const id = addExpenseResponse._key.path.segments[1]
                this.expenses.unshift({
                    ...expense,
                    id,
                })
                this.expenses.sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )
                if (document && photoBase64) {
                    await savePhotoToStorageWithId(
                        "photosCollection",
                        id,
                        document,
                        photoBase64
                    )
                }
            }
        },
        async updateExpense(expense, document, photoBase64) {
            console.log(expense)
            await updateDocument([StateEntries.Expenses, expense.id], expense)
            if (document && photoBase64) {
                await savePhotoToStorageWithId(
                    "photosCollection",
                    expense.id,
                    document,
                    photoBase64
                )
            }
        },
        removeExpenseFromStore(id) {
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
        async queryExpenseByPeriod() {
            const startPeriod = new Date(this.startDate)
            const endPeriod = new Date(this.endDate)
            const startPeriodTimestamp = Timestamp.fromDate(startPeriod)
            const endPeriodTimestamp = Timestamp.fromDate(endPeriod)
            const statements = [
                { key: "userId", value: auth.currentUser.uid, statement: "==" },
                {
                    key: "timestamp",
                    value: startPeriodTimestamp,
                    statement: ">=",
                },
                {
                    key: "timestamp",
                    value: endPeriodTimestamp,
                    statement: "<=",
                },
            ]
            const membershipStatements = [
                {
                    key: StateEntries.FamilyMembers,
                    value: auth.currentUser.uid,
                    statement: "array-contains",
                },
                {
                    key: "timestamp",
                    value: startPeriodTimestamp,
                    statement: ">=",
                },
                {
                    key: "timestamp",
                    value: endPeriodTimestamp,
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

            const ownExpenses = await queryDocsInCollection(
                [StateEntries.Expenses],
                true,
                statements
            )

            const expensesMembership = await queryDocsInCollection(
                [StateEntries.Expenses],
                true,
                membershipStatements
            )
            const allExpenses = [...ownExpenses, ...expensesMembership]
            const sortedByDateExpenses = allExpenses.sort((a, b) => {
                return b.timestamp - a.timestamp
            })
            this.expenses = [...sortedByDateExpenses]
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
