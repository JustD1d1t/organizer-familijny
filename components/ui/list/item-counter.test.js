import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import uiListItemCounter from "./item-counter.vue"

describe("uiListItemCounter", () => {
    it("emits increaseQuantity when increaseQuantity is called", async () => {
        const wrapper = mount(uiListItemCounter, {
            props: {
                quantity: 5,
            },
        })

        await wrapper.vm.increaseQuantity()

        expect(wrapper.emitted().increaseQuantity).toBeTruthy()
    })

    it("emits decreaseQuantity when decreaseQuantity is called", async () => {
        const wrapper = mount(uiListItemCounter, {
            props: {
                quantity: 5,
            },
        })

        await wrapper.vm.decreaseQuantity(wrapper.props().item)

        expect(wrapper.emitted().decreaseQuantity).toBeTruthy()
    })

    it("renders quantity correctly", () => {
        const wrapper = mount(uiListItemCounter, {
            props: {
                quantity: 5,
            },
        })

        expect(wrapper.find(".quantity").exists()).toBe(true)
        expect(wrapper.find(".quantity").text()).toBe("5")
    })
})
