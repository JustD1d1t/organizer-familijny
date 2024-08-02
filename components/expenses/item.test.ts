import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import expenseItem from "./item.vue"

describe("expenseItem", () => {
    it("renders data correctly", () => {
        const expense: Expense = {
            date: "2024-06-03T00:00:00.000Z",
            name: "chleb",
            shop: "putka",
            value: "4.78",
            userId: "1",
        }

        const wrapper = mount(expenseItem, {
            props: {
                expense: expense,
            },
        })

        expect(wrapper.find(".price-big").text()).toBe("4")
        expect(wrapper.find(".price-small").text()).toBe("78")
        expect(wrapper.find(".expense-date").text()).toBe("3.06.2024")
        expect(wrapper.find(".expense-name").text()).toBe("chleb")
        expect(wrapper.find(".expense-shop").text()).toBe("putka")
    })
    it("emits removeExpense when removeExpense is called", async () => {
        const expense: Expense = {
            date: "2024-06-03T00:00:00.000Z",
            name: "chleb",
            shop: "putka",
            value: "4.78",
            userId: "1",
        }
        const wrapper = mount(expenseItem, {
            props: {
                expense,
            },
        })

        await wrapper.vm.removeExpense(wrapper.props().expense)

        expect(wrapper.emitted().removeExpense).toBeTruthy()
        expect(wrapper.emitted().removeExpense[0]).toEqual([
            wrapper.props().expense,
        ])
    })
    it("emits openEditExpense when openEditExpense is called", async () => {
        const expense: Expense = {
            date: "2024-06-03T00:00:00.000Z",
            name: "chleb",
            shop: "putka",
            value: "4.78",
            userId: "1",
        }
        const wrapper = mount(expenseItem, {
            props: {
                expense,
            },
        })

        await wrapper.vm.openEditExpense(wrapper.props().expense)

        expect(wrapper.emitted().openEditExpense).toBeTruthy()
        expect(wrapper.emitted().openEditExpense[0]).toEqual([
            wrapper.props().expense,
        ])
    })
})
