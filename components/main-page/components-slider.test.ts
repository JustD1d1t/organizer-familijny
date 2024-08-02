import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import componentsSlider from "./components-slider.vue"
import components from "@/data/components.json"
import { useComponents } from "@/composables/useFirebase"

interface Component {
    name: string
}

const typedComponents: Component[] = components

vi.mock("@/composables/useComponents", () => ({
    useComponents: () => components,
}))

vi.mock("@/composables/useComponents", async (importOriginal) => {
    const mod = await importOriginal()
    return {
        ...(mod as object),
        namedExport: vi.fn(),
    }
})

describe("componentsSlider", () => {
    it("renders data correctly", () => {
        const wrapper = mount(componentsSlider)
        expect(wrapper.text()).toContain(typedComponents[0].name)
        expect(wrapper.findAll(".swiper-slide").length).toBe(
            typedComponents.length
        )
    })
})
