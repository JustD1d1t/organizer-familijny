import { ref } from "vue"
import { Timestamp } from "firebase/firestore/lite"
import { useFirebase } from "@/composables/useFirebase"
import { useTime } from "@/composables/useTime"
import { StateEntries } from "@/types"

let startDateOutside
let endDateOutside
let startPriceOutside
let endPriceOutside
let shopNameOutside
let expenseNameOutside
export const useExpenses = () => {
    const { queryDocsInCollection } = useFirebase()
    const {
        getFirstDateOfCurrentMonth,
        getLastDateOfMonth,
        getFirstDayOfWeek,
        getLastDayOfWeek,
        getFirstDateOfQuarter,
        getLastDateOfQuarter,
    } = useTime()

    const uid = useState(StateEntries.Uid)
    const expenses = useState(StateEntries.Expenses, () => [])
    const selectedPeriod = ref("month")
    const startDate = ref(getFirstDateOfCurrentMonth.value)
    const endDate = ref(getLastDateOfMonth.value)
    const startPrice = ref(null)
    const endPrice = ref(null)
    const shopName = ref(null)
    const expenseName = ref(null)

    const updateStartPrice = (e) => {
        startPrice.value = e.detail.value
        startPriceOutside = e.detail.value
    }

    const updateEndPrice = (e) => {
        endPrice.value = e.detail.value
        endPriceOutside = e.detail.value
    }

    const updateShopName = (e) => {
        shopName.value = e.detail.value
        shopNameOutside = e.detail.value
    }

    const updateExpenseName = (e) => {
        expenseName.value = e.detail.value
        expenseNameOutside = e.detail.value
    }

    const updateStartDate = (e) => {
        startDate.value = e.detail.value
        startDateOutside = e.detail.value
        selectedPeriod.value = "custom"
    }

    const updateEndDate = (e) => {
        endDate.value = e.detail.value
        startDateOutside = e.detail.value
        selectedPeriod.value = "custom"
    }

    const updatePeriod = (e) => {
        selectedPeriod.value = e.detail.value
        if (e.detail.value === "month") {
            startDate.value = getFirstDateOfCurrentMonth.value
            endDate.value = getLastDateOfMonth.value
            startDateOutside = getFirstDateOfCurrentMonth.value
            endDateOutside = getLastDateOfMonth.value
        } else if (e.detail.value === "week") {
            startDate.value = getFirstDayOfWeek.value
            endDate.value = getLastDayOfWeek.value
            startDateOutside = getFirstDayOfWeek.value
            endDateOutside = getLastDayOfWeek.value
        } else if (e.detail.value === "quarter") {
            startDate.value = getFirstDateOfQuarter.value
            endDate.value = getLastDateOfQuarter.value
            startDateOutside = getFirstDateOfQuarter.value
            endDateOutside = getLastDateOfQuarter.value
        }
    }

    const queryExpensesByPeriod = async () => {
        const startPeriod = startDateOutside
            ? new Date(startDateOutside)
            : new Date(startDate.value)
        const endPeriod = endDateOutside
            ? new Date(endDateOutside)
            : new Date(endDate.value)
        const startPeriodTimestamp = Timestamp.fromDate(startPeriod)
        const endPeriodTimestamp = Timestamp.fromDate(endPeriod)
        const statements = [
            { key: "userId", value: uid.value, statement: "==" },
            { key: "timestamp", value: startPeriodTimestamp, statement: ">=" },
            { key: "timestamp", value: endPeriodTimestamp, statement: "<=" },
        ]
        const membershipStatements = [
            {
                key: StateEntries.FamilyMembers,
                value: uid.value,
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
        if (startPriceOutside) {
            statements.push({
                key: "value",
                value: Number(startPriceOutside),
                statement: ">=",
            })
            membershipStatements.push({
                key: "value",
                value: Number(startPriceOutside),
                statement: ">=",
            })
        }

        if (endPriceOutside) {
            statements.push({
                key: "value",
                value: Number(endPriceOutside),
                statement: "<=",
            })
            membershipStatements.push({
                key: "value",
                value: Number(endPriceOutside),
                statement: "<=",
            })
        }

        if (shopNameOutside) {
            statements.push({
                key: "shop",
                value: shopNameOutside,
                statement: ">=",
            })
            statements.push({
                key: "shop",
                value: shopNameOutside + "\uf8ff",
                statement: "<=",
            })
            membershipStatements.push({
                key: "shop",
                value: shopNameOutside,
                statement: ">=",
            })
            membershipStatements.push({
                key: "shop",
                value: shopNameOutside + "\uf8ff",
                statement: "<=",
            })
        }

        if (expenseNameOutside) {
            statements.push({
                key: "name",
                value: expenseNameOutside,
                statement: ">=",
            })
            statements.push({
                key: "name",
                value: expenseNameOutside + "\uf8ff",
                statement: "<=",
            })
            membershipStatements.push({
                key: "name",
                value: expenseNameOutside,
                statement: ">=",
            })
            membershipStatements.push({
                key: "name",
                value: expenseNameOutside + "\uf8ff",
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

        return sortedByDateExpenses
        // expenses.value = [...ownExpenses, ...expensesMembership]
    }

    return {
        expenses,
        updatePeriod,
        updateStartDate,
        updateEndDate,
        queryExpensesByPeriod,
        updateStartPrice,
        updateEndPrice,
        updateShopName,
        updateExpenseName,
        selectedPeriod,
        startDate,
        endDate,
        startPrice,
        endPrice,
    }
}
