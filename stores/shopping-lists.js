import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { displayToast, showAlert, showConfirm, showPrompt } = useAlerts()
const { request } = useFetchRequest()
export const useShoppingListsStore = defineStore({
    id: "shopping-lists-store",
    state: () => {
        return {
            shoppingLists: [],
            collaboratedShoppingLists: [],
            currentShoppingList: null,
            currentRecipe: null,
            isLoading: false,
            error: null,
        }
    },
    actions: {
        setShoppingLists(shoppingLists) {
            this.shoppingLists = [...shoppingLists]
        },
        setCollaboratedShoppingLists(shoppingLists) {
            this.collaboratedShoppingLists = [...shoppingLists]
        },
        clearShoppingLists() {
            this.shoppingLists = []
            this.collaboratedShoppingLists = []
        },
        setCurrentShoppingList(shoppingList) {
            this.currentShoppingList = shoppingList
        },
        setCurrentRecipe(recipe) {
            this.currentRecipe = recipe
        },
        addShoppingListToStore(shoppingList) {
            this.shoppingLists.push(shoppingList)
        },
        removeShoppingListFromStore(id) {
            this.shoppingLists = this.shoppingLists.filter(
                (list) => list.id !== id
            )
        },
        updateCurrentList(list) {
            this.currentShoppingList = list
            const shoppingListIndex = this.shoppingLists.findIndex(
                (l) => l.id === list.id
            )
            if (shoppingListIndex !== -1) {
                this.shoppingLists[shoppingListIndex] = list
            }
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        setError(error) {
            this.error = error
        },

        async removeAllItems() {
            await this.updateShoppingList({
                ...this.currentShoppingList,
                items: [],
            })
            this.currentShoppingList.items = []
        },
        async selectAllItems() {
            const updatedItems = [...this.currentShoppingList.items].map(
                (item) => {
                    item.checked = true
                    return item
                }
            )
            await this.updateShoppingList({
                ...this.currentShoppingList,
                items: updatedItems,
            })
            this.currentShoppingList.items = updatedItems
        },
        async deselectAllItems() {
            const updatedItems = [...this.currentShoppingList.items].map(
                (item) => {
                    item.checked = false
                    return item
                }
            )
            await this.updateShoppingList({
                ...this.currentShoppingList,
                items: updatedItems,
            })
            this.currentShoppingList.items = updatedItems
        },
        async removeSelectedItems() {
            const updatedItems = [...this.currentShoppingList.items].filter(
                (item) => !item.checked
            )
            await this.updateShoppingList({
                ...this.currentShoppingList,
                items: updatedItems,
            })
            this.currentShoppingList.items = updatedItems
        },

        async updateShoppingList(shoppingList) {
            this.setLoading(true)
            this.setError(null)
            try {
                const data = await request(
                    `${backendUrl}/shopping-lists/update`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ shoppingList }),
                    }
                )
                return data
            } catch (error) {
                console.error("Failed to update shopping list:", error)
                this.setError(error.message)
                throw error
            } finally {
                this.setLoading(false)
            }
        },

        async getAllShoppingLists() {
            this.setLoading(true)
            this.setError(null)
            try {
                const data = await request(
                    `${backendUrl}/shopping-lists/get-all?userId=${localStorage.getItem(
                        "uid"
                    )}`
                )
                this.setShoppingLists(data.shoppingLists)
                this.setCollaboratedShoppingLists(
                    data.collaboratedShoppingLists
                )
            } catch (error) {
                console.error(error)
                this.setError("Failed to fetch shopping lists")
                showAlert(this.error)
            } finally {
                this.setLoading(false)
            }
        },

        async addList(name, members, membersIds) {
            this.setLoading(true)
            this.setError(null)
            try {
                const newShoppingList = {
                    name: name,
                    members: members,
                    membersIds: membersIds,
                    ownerId: localStorage.getItem("uid"),
                    items: [],
                    recipes: [],
                }
                const data = await request(`${backendUrl}/shopping-lists/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ shoppingList: newShoppingList }),
                })
                if (data.id) {
                    this.addShoppingListToStore({
                        ...newShoppingList,
                        id: data.id,
                    })
                }
            } catch (error) {
                console.error(error)
                this.setError("Failed to add shopping list")
            } finally {
                this.setLoading(false)
            }
        },

        async removeShoppingList(id) {
            this.setLoading(true)
            this.setError(null)
            try {
                await request(
                    `${backendUrl}/shopping-lists/remove?shoppingListId=${id}`,
                    {
                        method: "DELETE",
                    }
                )
                this.removeShoppingListFromStore(id)
            } catch (error) {
                console.error(error)
                this.setError("Failed to remove shopping list")
            } finally {
                this.setLoading(false)
            }
        },

        async removeItem(item) {
            this.setLoading(true)
            this.setError(null)
            try {
                const shoppingListItems = [...this.currentShoppingList.items]
                const index = shoppingListItems.findIndex(
                    (i) => i.name === item.name
                )
                if (index !== -1) {
                    shoppingListItems.splice(index, 1)
                    await this.updateShoppingList({
                        ...this.currentShoppingList,
                        items: shoppingListItems,
                    })
                    this.updateCurrentList({
                        ...this.currentShoppingList,
                        items: shoppingListItems,
                    })
                }
            } catch (error) {
                console.error(error)
                this.setError("Failed to remove item")
            } finally {
                this.setLoading(false)
            }
        },

        async handleItemChange(item) {
            this.setLoading(true)
            this.setError(null)
            try {
                const shoppingListItems = [...this.currentShoppingList.items]
                const shoppingItem = shoppingListItems.find(
                    (i) => i.name === item.name
                )
                shoppingItem.checked = !item.checked
                await this.updateShoppingList({
                    ...this.currentShoppingList,
                    items: shoppingListItems,
                })
                this.updateCurrentList({
                    ...this.currentShoppingList,
                    items: shoppingListItems,
                })
            } catch (error) {
                console.error(error)
                this.setError("Failed to update item status")
            } finally {
                this.setLoading(false)
            }
        },

        async removeRecipe(id) {
            this.setLoading(true)
            this.setError(null)
            try {
                const index = this.currentShoppingList.recipes.findIndex(
                    (recipe) => recipe.id === id
                )
                if (index !== -1) {
                    const recipes = [...this.currentShoppingList.recipes]
                    recipes.splice(index, 1)
                    await this.updateShoppingList({
                        ...this.currentShoppingList,
                        recipes,
                    })
                    this.updateCurrentList({
                        ...this.currentShoppingList,
                        recipes,
                    })
                }
            } catch (error) {
                console.error(error)
                this.setError("Failed to remove recipe")
            } finally {
                this.setLoading(false)
            }
        },

        async handleRecipeChange(boolean, recipe) {
            this.setLoading(true)
            this.setError(null)
            try {
                recipe.ingredients.forEach((ingredient) => {
                    ingredient.checked = boolean
                })
                await this.updateShoppingList(this.currentShoppingList)
                this.updateCurrentList(this.currentShoppingList)
            } catch (error) {
                console.error(error)
                this.setError("Failed to update recipe ingredients")
            } finally {
                this.setLoading(false)
            }
        },

        async handleItem(name, category) {
            this.setLoading(true)
            this.setError(null)
            try {
                const shoppingListItems = [...this.currentShoppingList.items]
                let message
                if (
                    shoppingListItems.some(
                        (shoppingItem) => shoppingItem.name === name
                    )
                ) {
                    shoppingListItems.splice(
                        shoppingListItems.findIndex(
                            (shoppingItem) => shoppingItem.name === name
                        ),
                        1
                    )
                    message = "removed"
                } else {
                    shoppingListItems.push({
                        name,
                        category: category ?? "",
                        checked: false,
                    })
                    message = "added"
                }
                await this.updateShoppingList({
                    ...this.currentShoppingList,
                    items: shoppingListItems,
                })
                this.updateCurrentList({
                    ...this.currentShoppingList,
                    items: shoppingListItems,
                })
                return message
            } catch (error) {
                console.error(error)
                this.setError("Failed to handle item")
            } finally {
                this.setLoading(false)
            }
        },

        async editShoppingList(name, members, membersIds) {
            this.setLoading(true)
            this.setError(null)
            try {
                const editedShoppingList = {
                    ...this.currentShoppingList,
                    name,
                    members,
                    membersIds,
                }
                await this.updateShoppingList(editedShoppingList)
                this.updateCurrentList(editedShoppingList)
            } catch (error) {
                console.error(error)
                this.setError("Failed to edit shopping list")
            } finally {
                this.setLoading(false)
            }
        },

        async leaveList() {
            this.setLoading(true)
            this.setError(null)
            try {
                const editedShoppingList = {
                    ...this.currentShoppingList,
                    members: this.currentShoppingList.members.filter(
                        (m) => m.id !== localStorage.getItem("uid")
                    ),
                }
                await this.updateShoppingList(editedShoppingList)
                this.updateCurrentList(editedShoppingList)
                const data = await request(
                    `${backendUrl}/shopping-lists/get-collaborated?userId=${localStorage.getItem(
                        "uid"
                    )}`
                )
                this.setCollaboratedShoppingLists(
                    data.collaboratedShoppingLists
                )
            } catch (error) {
                console.error(error)
                this.setError("Failed to leave list")
            } finally {
                this.setLoading(false)
            }
        },

        async handleIngredientChange(ing) {
            this.setLoading(true)
            this.setError(null)
            try {
                const ingredient = this.currentRecipe.ingredients.find((i) => {
                    return i.name === ing.name && i.quantity === ing.quantity
                })
                ingredient.checked = !ingredient.checked
                const recipeIndex = this.currentShoppingList.recipes.findIndex(
                    (r) => r.id === this.currentRecipe.id
                )
                this.currentShoppingList.recipes[recipeIndex] =
                    this.currentRecipe
                await this.updateShoppingList(this.currentShoppingList)
                this.updateCurrentList(this.currentShoppingList)
            } catch (error) {
                console.error(error)
                this.setError("Failed to update ingredient status")
            } finally {
                this.setLoading(false)
            }
        },

        async removeIngredient(ingredient) {
            this.setLoading(true)
            this.setError(null)
            try {
                const index = this.currentRecipe.ingredients.findIndex((i) => {
                    return (
                        i.name === ingredient.name &&
                        i.quantity === ingredient.quantity
                    )
                })
                this.currentRecipe.ingredients.splice(index, 1)
                const recipeIndex = this.currentShoppingList.recipes.findIndex(
                    (r) => r.id === this.currentRecipe.id
                )
                this.currentShoppingList.recipes[recipeIndex] =
                    this.currentRecipe
                await this.updateShoppingList(this.currentShoppingList)
                this.updateCurrentList(this.currentShoppingList)
            } catch (error) {
                console.error(error)
                this.setError("Failed to remove ingredient")
            } finally {
                this.setLoading(false)
            }
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
