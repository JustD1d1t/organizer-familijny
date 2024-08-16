<script setup>
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { getAllShoppingLists } = shoppingListsStore

const { shoppingLists, isLoading, collaboratedShoppingLists } =
    storeToRefs(shoppingListsStore)

const shoppingListsWithMembers = computed(() =>
    shoppingLists.value.filter((list) => list.members?.length)
)
const shoppingListsWithoutMembers = computed(() =>
    shoppingLists.value.filter((list) => !list.members?.length)
)

useAsyncData(async () => {
    await getAllShoppingLists()
})
</script>
<template>
    <div
        v-if="isLoading"
        class="w-full flex justify-center items-center h-full"
    >
        <ion-spinner name="lines-sharp"></ion-spinner>
    </div>
    <div v-else>
        <ShoppingListListsContainer
            v-if="shoppingLists.length"
            title="Twoje listy zakupowe"
            :shoppingLists="shoppingListsWithoutMembers"
        />
        <div
            v-else
            class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
        >
            <h2 class="col-span-2 text-center">Nie posiadasz swoich list</h2>
        </div>

        <ShoppingListListsContainer
            v-if="shoppingLists.length && shoppingListsWithMembers.length"
            title="Współdzielone listy zakupowe"
            :shoppingLists="shoppingListsWithMembers"
        />
        <ShoppingListListsContainer
            v-if="collaboratedShoppingLists.length"
            title="Listy do których zostałeś zaproszony"
            :shoppingLists="collaboratedShoppingLists"
        />
    </div>
</template>
