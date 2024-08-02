import { defineStore } from "pinia"
import { getAuth } from "firebase/auth"
import { StateEntries } from "@/types"
const auth = getAuth()
const { addDocument, deleteDocument, updateDocument, queryDocsInCollection } =
    useFirebase()

export const usePantriesStore = defineStore({
    id: "pantries-store",
    state: () => {
        return {
            pantries: [],
            collaboratedPantries: [],
            currentPantry: null,
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
        async addPantry(pantryName, members = []) {
            const newPantry = {
                name: pantryName,
                items: [],
                members,
                ownerId: auth.currentUser.uid,
            }
            const addPantryResponse = await addDocument(
                [StateEntries.Pantries],
                newPantry
            )
            if (addPantryResponse.type === "document") {
                const id = addPantryResponse._key.path.segments[1]
                this.pantries.push({
                    ...newPantry,
                    id,
                })
            }
        },

        async handlePantryItem(item) {
            const pantryItems = [...this.currentPantry.items]
            if (pantryItems.some((pantryItem) => pantryItem.name === item)) {
                pantryItems.splice(
                    pantryItems.findIndex(
                        (pantryItem) => pantryItem.name === item
                    ),
                    1
                )
            } else {
                pantryItems.push({
                    name: item,
                    checked: false,
                    quantity: 1,
                })
            }

            await updateDocument(
                [StateEntries.Pantries, this.currentPantry.id],
                {
                    items: pantryItems,
                }
            )
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

            await updateDocument([StateEntries.Pantries, selectedPantry.id], {
                items: pantryItems,
            })
            this.currentPantry.items = pantryItems
        },

        setPantryAfterSnap(snap) {
            this.currentPantry.items = snap.items
            this.currentPantry.name = snap.name
        },

        async decreaseQuantity(item, setRemovedItem) {
            item.quantity--
            if (item.quantity === 0) {
                this.currentPantry.items = this.currentPantry.items.filter(
                    (i) => i.name !== item.name
                )
                setRemovedItem(item.name)
            }
            await updateDocument(
                [StateEntries.Pantries, this.currentPantry.id],
                {
                    items: this.currentPantry.items,
                }
            )
        },

        async increaseQuantity(item) {
            item.quantity++
            await updateDocument(
                [StateEntries.Pantries, this.currentPantry.id],
                {
                    items: this.currentPantry.items,
                }
            )
        },

        async leaveList() {
            const newMembers = this.currentPantry.members.filter(
                (member) => member !== auth.currentUser.uid
            )
            await updateDocument(
                [StateEntries.Pantries, this.currentPantry.id],
                {
                    members: newMembers,
                }
            )
            this.currentPantry.members = this.currentPantry.members.filter(
                (member) => member !== auth.currentUser.uid
            )
            collaboratedPantries.value = collaboratedPantries.value.filter(
                (pan) => pan.id !== this.currentPantry.id
            )
            router.back()
        },

        async toggleMember(member) {
            if (this.currentPantry.members.includes(member.id)) {
                this.currentPantry.members = this.currentPantry.members.filter(
                    (m) => m != member.id
                )
            } else {
                this.currentPantry.members.push(member.id)
            }
            await updateDocument(
                [StateEntries.Pantries, this.currentPantry.id],
                {
                    members: this.currentPantry.members,
                }
            )
        },

        async removePantry(pan) {
            await deleteDocument([StateEntries.Pantries, pan.id])
            this.pantries = this.pantries.filter((list) => list.id !== pan.id)
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
