import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import shoppingListItem from "./item.vue"

describe("shoppingListItem", () => {
    it("emits handleItemChange when handleItemChange is called", async () => {
        const wrapper = mount(shoppingListItem, {
            props: {
                item: { name: "Test Item", category: "Test Category" },
            },
        })

        await (wrapper.vm as any).handleItemChange(wrapper.props().item)

        expect(wrapper.emitted().handleItemChange).toBeTruthy()
        expect(wrapper.emitted().handleItemChange[0]).toEqual([
            wrapper.props().item,
        ])
    })

    it("emits removeItem when removeItem is called", async () => {
        const wrapper = mount(shoppingListItem, {
            props: {
                item: { name: "Test Item", category: "Test Category" },
            },
        })

        await (wrapper.vm as any).removeItem(wrapper.props().item)

        expect(wrapper.emitted().removeItem).toBeTruthy()
        expect(wrapper.emitted().removeItem[0]).toEqual([wrapper.props().item])
    })
})
