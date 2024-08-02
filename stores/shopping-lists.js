import { defineStore } from "pinia"
import { getAuth } from "firebase/auth"
const auth = getAuth()
const { addDocument, deleteDocument, updateDocument, queryDocsInCollection } =
    useFirebase()

export const useShoppingListsStore = defineStore({
    id: "shopping-lists-store",
    state: () => {
        return {
            shoppingLists: [],
            collaboratedShoppingLists: [],
            currentShoppingList: null,
            currentRecipe: null,
        }
    },
    actions: {
        addShoppingListsToStore(shoppingLists) {
            this.shoppingLists = [...shoppingLists]
        },
        addCollaboratedShoppingListsToStore(shoppingLists) {
            this.collaboratedShoppingLists = [...shoppingLists]
        },
        setCurrentShoppingList(shoppingList) {
            this.currentShoppingList = shoppingList
        },
        setCurrentRecipe(recipe) {
            this.currentRecipe = recipe
        },
        async addShoppingList(name, members = []) {
            const newShoppingList = {
                name: name,
                items: [],
                recipes: [],
                members,
                ownerId: auth.currentUser.uid,
            }
            const addShoppingListResponse = await addDocument(
                ["shoppingLists"],
                newShoppingList
            )
            if (addShoppingListResponse.type === "document") {
                const id = addShoppingListResponse._key.path.segments[1]
                this.shoppingLists.push({
                    ...newShoppingList,
                    id,
                })
            }
        },
        async removeShoppingList(id) {
            await deleteDocument(["shoppingLists", id])
            this.shoppingLists = this.shoppingLists.filter(
                (list) => list.id !== id
            )
        },
        async toggleMember(member, id) {
            if (this.currentShoppingList.members.includes(member.id)) {
                this.currentShoppingList.members =
                    this.currentShoppingList.members.filter(
                        (m) => m != member.id
                    )
            } else {
                this.currentShoppingList.members.push(member.id)
            }
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    members: this.currentShoppingList.members,
                }
            )
        },
        async updateList() {
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                this.currentShoppingList
            )
        },
        async toggleShoppingItem(item, category) {
            const shoppingListItems = [...this.currentShoppingList.items]
            if (
                shoppingListItems.some(
                    (shoppingItem) => shoppingItem.name === item.name
                )
            ) {
                shoppingListItems.splice(
                    shoppingListItems.findIndex(
                        (shoppingItem) => shoppingItem.name === item.name
                    ),
                    1
                )
            } else {
                shoppingListItems.push({
                    name: item,
                    category: category ?? "",
                    checked: false,
                })
            }
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    items: shoppingListItems,
                }
            )
            this.currentShoppingList.items = shoppingListItems
        },
        async handleItemChange(item) {
            const shoppingItem = this.currentShoppingList.items.find(
                (i) => i.name === item.name
            )
            shoppingItem.checked = !item.checked
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    items: this.currentShoppingList.items,
                }
            )
        },

        async removeItem(item) {
            const index = this.currentShoppingList.items.findIndex(
                (i) => i.name === item.name
            )
            if (index !== -1) {
                this.currentShoppingList.items.splice(index, 1)
                await updateDocument(
                    ["shoppingLists", this.currentShoppingList.id],
                    {
                        items: this.currentShoppingList.items,
                    }
                )
            }
        },

        async handleIngredientChange(ing) {
            const ingredient = this.currentRecipe.ingredients.find((i) => {
                return i.name === ing.name && i.quantity === ing.quantity
            })
            ingredient.checked = !ingredient.checked
            const recipe = this.currentShoppingList.recipes.findIndex(
                (r) => r.id === this.currentRecipe.id
            )
            this.currentShoppingList.recipes[recipe] = this.currentRecipe
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    recipes: this.currentShoppingList.recipes,
                }
            )
        },
        async removeIngredient(ingredient) {
            const index = this.currentRecipe.ingredients.findIndex((i) => {
                return (
                    i.name === ingredient.name &&
                    i.quantity === ingredient.quantity
                )
            })
            this.currentRecipe.ingredients.splice(index, 1)
            const recipe = this.currentShoppingList.recipes.findIndex(
                (r) => r.id === this.currentRecipe.id
            )
            this.currentShoppingList.recipes[recipe] = this.currentRecipe
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    recipes: this.currentShoppingList.recipes,
                }
            )
        },

        async removeRecipe(id) {
            const index = this.currentShoppingList.recipes.findIndex(
                (recipe) => recipe.id === id
            )
            if (index !== -1) {
                this.currentShoppingList.recipes.splice(index, 1)
                await updateDocument(
                    ["shoppingLists", this.currentShoppingList.id],
                    {
                        recipes: this.currentShoppingList.recipes,
                    }
                )
            }
        },
        async handleRecipeChange(boolean, recipe) {
            recipe.ingredients.forEach((ingredient) => {
                ingredient.checked = boolean
            })
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    recipes: this.currentShoppingList.recipes,
                }
            )
        },
        async leaveList() {
            const newMembers = this.currentShoppingList.members.filter(
                (m) => m !== auth.currentUser.uid
            )
            await updateDocument(
                ["shoppingLists", this.currentShoppingList.id],
                {
                    members: newMembers,
                }
            )
            collaboratedShoppingLists = await queryDocsInCollection(
                "shoppingLists",
                false,
                [
                    {
                        key: "members",
                        value: auth.currentUser.uid,
                        statement: "array-contains",
                    },
                ]
            )
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
