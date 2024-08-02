import { mount } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import pantryLists from "./lists.vue" // Adjust the path to your component
import { useFirebase } from "@/composables/useFirebase"

const pantriesList: Pantry[] = [
    {
        id: "1",
        name: "Pantry 1",
        collaborators: [],
        collaboratorsIds: [],
        items: [],
        ownerId: "test-user-id",
    },
    {
        id: "2",
        name: "Pantry 2",
        collaborators: [],
        collaboratorsIds: [],
        items: [],
        ownerId: "test-user-id",
    },
    {
        id: "3",
        name: "Pantry 3",
        collaborators: [],
        collaboratorsIds: [],
        items: [],
        ownerId: "test-user-id",
    },
]

vi.mock("@/composables/useFirebase", () => ({
    useFirebase: () => ({
        deleteDocument: vi.fn(),
        queryDocsInCollection: vi.fn().mockResolvedValue(pantriesList),
    }),
}))

describe("pantryLists.vue", () => {
    it("renders correctly", () => {
        let wrapper = mount(pantryLists)
        expect(wrapper.exists()).toBe(true)
    })

    //   it("renders correctly with 3 pantries", () => {
    //     let wrapper = mount(pantryLists);
    //     const pantryCards = wrapper.findAll("[data-test='own-pantry']");
    //     expect(pantryCards.length).toBe(3);
    //   });
})
