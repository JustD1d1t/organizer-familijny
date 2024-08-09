<script setup>
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { removeShoppingList, getAllShoppingLists, setCurrentShoppingList } =
    shoppingListsStore

const { shoppingLists, isLoading } = storeToRefs(shoppingListsStore)
const collaboratedShoppingLists = computed(
    () => shoppingListsStore.collaboratedShoppingLists
)

const shoppingListsWithMembers = computed(() =>
    shoppingLists.value.filter((list) => !list.members?.length)
)
const shoppingListsWithoutMembers = computed(() =>
    shoppingLists.value.filter((list) => list.members?.length)
)

const handleClick = (shopList) => {
    navigateTo(`/shopping-lists/${shopList.id}`)
    setCurrentShoppingList(shopList)
}

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
        <div
            v-if="shoppingLists.length"
            class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
        >
            <h2 class="col-span-2 text-center" v-if="shoppingListsWithMembers">
                Twoje listy zakupowe
            </h2>

            <uiCard
                v-for="shoppingList in shoppingListsWithMembers"
                :key="shoppingList.name"
                class="flex flex-col m-2"
            >
                <div
                    class="py-8 cursor-pointer flex justify-center grow"
                    @click="() => handleClick(shoppingList)"
                >
                    {{ shoppingList.name }}
                </div>
                <div class="flex">
                    <uiButton
                        @click="() => removeShoppingList(shoppingList.id)"
                        :color="'danger'"
                        :size="'small'"
                        class="w-full"
                    >
                        Usuń
                    </uiButton>
                </div>
            </uiCard>
        </div>
        <div
            v-else
            class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
        >
            <h2 class="col-span-2 text-center">Nie posiadasz swoich list</h2>
        </div>
        <div
            class="col-span-2 w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
            v-if="shoppingLists.length && shoppingListsWithoutMembers.length"
        >
            <h2 class="col-span-2 text-center">Współdzielone listy zakupowe</h2>
            <uiCard
                v-for="shoppingList in shoppingListsWithoutMembers"
                :key="shoppingList.name"
                class="flex flex-col m-2"
            >
                <div
                    class="py-8 cursor-pointer flex justify-center grow"
                    @click="() => handleClick(shoppingList)"
                >
                    {{ shoppingList.name }}
                </div>
                <div class="flex">
                    <uiButton
                        @click="() => removeShoppingList(shoppingList.id)"
                        :color="'danger'"
                        :size="'small'"
                        class="w-full"
                    >
                        Usuń
                    </uiButton>
                </div>
            </uiCard>
        </div>
        <div
            class="col-span-2 w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
            v-if="collaboratedShoppingLists.length"
        >
            <h2 class="col-span-2 text-center">
                Listy do których zostałeś zaproszony
            </h2>
            <uiCard
                v-for="shoppingList in collaboratedShoppingLists"
                :key="shoppingList.name"
                class="flex flex-col m-2 p-4"
            >
                <div
                    class="py-8 cursor-pointer flex justify-center grow"
                    @click="() => handleClick(shoppingList)"
                >
                    {{ shoppingList.name }}
                </div>
            </uiCard>
        </div>
    </div>
</template>
