import { mount } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import addShoppingListModal from "./add-shopping-list-modal.vue"

describe("pantryAddModal.vue", () => {
    it("renders correctly with default props", () => {
        const wrapper = mount(addShoppingListModal)
        expect(wrapper.find('[data-test="test-name"]').text()).toBe("")
    })

    it("renders correctly with given name prop", () => {
        const wrapper = mount(addShoppingListModal, {
            props: {
                name: "Test Item",
            },
        })
        expect(wrapper.find('[data-test="test-name"]').text()).toBe("Test Item")
    })

    it('calls cancel function when "Nie" button is clicked', async () => {
        const cancelMock = vi.fn()
        const wrapper = mount(addShoppingListModal, {
            props: {
                cancel: cancelMock,
            },
        })

        await wrapper.find('[data-test="cancel-button"]').trigger("click")
        expect(cancelMock).toHaveBeenCalled()
    })

    it('calls confirmModal function when "Tak" button is clicked', async () => {
        const confirmModalMock = vi.fn()
        const wrapper = mount(addShoppingListModal, {
            props: {
                confirmModal: confirmModalMock,
            },
        })

        await wrapper.find('[data-test="submit-button"]').trigger("click")
        expect(confirmModalMock).toHaveBeenCalled()
    })
})
