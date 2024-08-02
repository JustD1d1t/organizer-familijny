import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import uiListItem from "./item.vue"

describe("uiListItem", () => {
    it("renders start slot correctly", () => {
        const wrapper = mount(uiListItem, {
            slots: {
                start: "start slot",
            },
        })

        expect(wrapper.find(".start-slot").text()).toBe("start slot")
    })
    it("renders end slot correctly", () => {
        const wrapper = mount(uiListItem, {
            slots: {
                end: "end slot",
            },
        })

        expect(wrapper.find(".end-slot").text()).toBe("end slot")
    })
})
