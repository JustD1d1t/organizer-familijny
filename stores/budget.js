import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()
import { useUserStore } from "./user"

export const useBudgetStore = defineStore({
    id: "budget-store",
    state: () => {
        return {
            budgetDetails: {},
            user: useUserStore(),
        }
    },
    actions: {
        setBudgetDetails(details) {
            this.budgetDetails = {
                items: details.details,
                monthlyIncome: details.income,
            }
        },
        async getBudgetDetails() {
            const data = await request(
                `${backendUrl}/budget/get?uid=${this.user.uid}`
            )
            this.setBudgetDetails(data)
        },
        async saveBudgetDetails(details, income) {
            const data = await request(`${backendUrl}/budget/save`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    details,
                    uid: this.user.uid,
                    monthlyIncome: income,
                }),
            })
            this.setBudgetDetails({ details, income })
        },
    },
})
