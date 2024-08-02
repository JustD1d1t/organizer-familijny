import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import uiListCheckboxItem from "./checkbox-item.vue"

describe("uiListCheckboxItem", () => {
    //   it("calls handleItemChange when ion-checkbox is changed", async () => {
    //     const handleItemChange = vi.fn();
    //     const wrapper = mount(uiListCheckboxItem, {
    //       props: {
    //         item: { name: "Test Item", category: "Test Category", checked: false },
    //         handleItemChange,
    //         removeItem: () => {},
    //       },
    //       slots: {
    //         label: '<div class="label-slot">Label Slot Content</div>',
    //       },
    //     });

    //     const checkbox = wrapper.find("ion-checkbox");
    //     await checkbox.trigger("ionChange");

    //     expect(handleItemChange).toHaveBeenCalledWith(wrapper.props().item);
    //   });

    it("calls removeItem when ion-button is clicked", async () => {
        const removeItem = vi.fn()
        const wrapper = mount(uiListCheckboxItem, {
            props: {
                item: {
                    name: "Test Item",
                    category: "Test Category",
                    checked: false,
                },
                handleItemChange: () => {},
                removeItem,
            },
            slots: {
                label: '<div class="label-slot">Label Slot Content</div>',
            },
        })

        const button = wrapper.find("ion-button")
        await button.trigger("click")

        expect(removeItem).toHaveBeenCalledWith(wrapper.props().item)
    })

    it("renders slot content correctly", () => {
        const wrapper = mount(uiListCheckboxItem, {
            props: {
                item: {
                    name: "Test Item",
                    category: "Test Category",
                    checked: false,
                },
                handleItemChange: () => {},
                removeItem: () => {},
            },
            slots: {
                label: '<div class="label-slot">Label Slot Content</div>',
            },
        })

        expect(wrapper.find(".label-slot").exists()).toBe(true)
        expect(wrapper.find(".label-slot").text()).toBe("Label Slot Content")
    })
})
