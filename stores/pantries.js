import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()
import { useUserStore } from "./user"

export const usePantriesStore = defineStore({
    id: "pantries-store",
    state: () => {
        return {
            pantries: [],
            collaboratedPantries: [],
            currentPantry: null,
            isLoading: false,
            user: useUserStore(),
        }
    },
    actions: {
        addPantriesToStore(pantries) {
            this.pantries = [...pantries]
        },
        addCollaboratedPantriesToStore(pantries) {
            this.collaboratedPantries = [...pantries]
        },
        setCurrentPantry(pantry) {
            this.currentPantry = pantry
        },

        setPantryAfterSnap(snap) {
            this.currentPantry.items = snap.items
            this.currentPantry.name = snap.name
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        clearPantries() {
            this.pantries = []
            this.collaboratedPantries = []
        },

        async getAllPantries() {
            this.setLoading(true)
            try {
                const data = await request(
                    `${backendUrl}/pantries/get-all?userId=${this.user.uid}`
                )
                this.addPantriesToStore(data.pantries)
                this.addCollaboratedPantriesToStore(data.collaboratedPantries)
            } catch (error) {
                console.error("Failed to get pantries:", error)
            } finally {
                this.setLoading(false)
            }
        },

        async getCollaboratedPantries() {
            this.setLoading(true)
            try {
                const data = await request(
                    `${backendUrl}/pantries/get-collaborated?userId=${this.user.uid}`
                )
                this.addCollaboratedPantriesToStore(data.collaboratedPantries)
            } catch (error) {
                console.error("Failed to get collaborated pantries:", error)
            } finally {
                this.setLoading(false)
            }
        },

        async updatePantry(pantry) {
            this.setLoading(true)
            try {
                const data = await request(`${backendUrl}/pantries/update`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pantry }),
                })
                return data
            } catch (error) {
                console.error("Failed to update pantry:", error)
                throw error
            } finally {
                this.setLoading(false)
            }
        },

        async editPantry(pantry) {
            await this.updatePantry(pantry)
            const index = this.pantries.findIndex(
                (item) => item.id === pantry.id
            )
            this.pantries[index] = pantry
        },

        async addPantry(pantryName, members = [], membersIds = []) {
            const newPantry = {
                name: pantryName,
                items: [],
                members,
                membersIds,
                ownerId: this.user.uid,
            }
            try {
                const data = await request(`${backendUrl}/pantries/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pantry: newPantry }),
                })
                if (data.id) {
                    const id = data.id
                    this.pantries.push({
                        ...newPantry,
                        id,
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },

        async handlePantryItem(name, category) {
            const pantryItems = [...this.currentPantry.items]
            if (pantryItems.some((pantryItem) => pantryItem.name === name)) {
                pantryItems.splice(
                    pantryItems.findIndex(
                        (pantryItem) => pantryItem.name === name
                    ),
                    1
                )
            } else {
                pantryItems.push({
                    name: name,
                    category: category,
                    checked: false,
                    quantity: 1,
                })
            }
            await this.updatePantry({
                ...this.currentPantry,
                items: pantryItems,
            })
            this.currentPantry.items = pantryItems
        },

        async handlePantryItemsFromShoppingList(items, selectedPantry) {
            const pantryItems = [...selectedPantry.items]

            items.forEach((item) => {
                if (
                    pantryItems.some(
                        (pantryItem) => pantryItem.name === item.name
                    )
                ) {
                    const pantryItem = pantryItems.find(
                        (pantryItem) => pantryItem.name === item.name
                    )
                    pantryItem.quantity++
                } else {
                    pantryItems.push({
                        name: item.name,
                        checked: false,
                        quantity: 1,
                    })
                }
            })

            await this.updatePantry({
                ...selectedPantry,
                items: pantryItems,
            })
            this.selectedPantry.items = pantryItems
        },

        async decreaseQuantity(item) {
            let items = [...this.currentPantry.items]
            const itemIndex = items.findIndex(
                (pantryItem) => pantryItem.name === item.name
            )
            if (items[itemIndex].quantity > 1) {
                items[itemIndex].quantity--
            } else {
                items.splice(itemIndex, 1)
                this.currentPantry.items = items
            }
            await request(`${backendUrl}/pantries/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pantry: {
                        ...this.currentPantry,
                        items,
                    },
                }),
            })
            this.currentPantry.items = items
        },

        async increaseQuantity(item) {
            const items = [...this.currentPantry.items]
            const itemIndex = items.findIndex(
                (pantryItem) => pantryItem.name === item.name
            )
            items[itemIndex].quantity++
            await request(`${backendUrl}/pantries/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pantry: {
                        ...this.currentPantry,
                        items,
                    },
                }),
            })
            this.currentPantry.items = items
        },

        async leaveList() {
            try {
                const editedPantry = {
                    ...this.currentPantry,
                    members: this.currentPantry.members.filter(
                        (m) => m.id !== this.user.uid
                    ),
                }
                await this.updatePantry(editedPantry)
                this.setCurrentPantry(editedPantry)
                const data = await request(
                    `${backendUrl}/shopping-lists/get-collaborated?userId=${this.user.uid}`
                )
                this.setCollaboratedShoppingLists(
                    data.collaboratedShoppingLists
                )
            } catch (error) {
                console.error(error)
            }
        },

        async removePantry(id) {
            await request(`${backendUrl}/pantries/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pantryId: id }),
            })
            this.pantries = this.pantries.filter((list) => list.id !== id)
        },
    },
    getters: {
        getShoppingListById: (state) => (id) => {
            const list = state.shoppingLists.find(
                (shoppingList) => shoppingList.id === id
            )
            if (!list) {
                return state.collaboratedShoppingLists.find(
                    (shoppingList) => shoppingList.id === id
                )
            }
            return list
        },
    },
})
