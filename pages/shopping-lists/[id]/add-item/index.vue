<script setup>
const { shoppingItems } = useShoppingItems()

import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { handleItem } = shoppingListsStore
const { currentShoppingList, isLoading } = storeToRefs(shoppingListsStore)

const activeCategory = ref("")
const addingItem = ref(false)
const shoppingItemInput = ref("")
const { openToast } = useAlerts()

const availableShoppingItemsByPhrase = computed(() => {
    const itemsWithCategory = shoppingItems.map((item) =>
        item.items.map((i) => ({ name: i, category: item.category }))
    )
    const flattendItemsWithCategory = itemsWithCategory.flat()
    return [
        ...flattendItemsWithCategory.filter((item) =>
            item.name
                .toLowerCase()
                .includes(shoppingItemInput.value.toLowerCase())
        ),
        {
            name: shoppingItemInput.value.toLowerCase(),
            category: "bez kateogrii",
        },
    ]
})

const localHandleItem = async (name, category) => {
    const message = await handleItem(name, category)
    if (message === "added") {
        openToast("Dodano produkt do listy")
    } else {
        openToast("Usunięto produkt z listy", 'danger')
    }
}

const handleCategory = (cat) => {
    activeCategory.value = activeCategory.value === cat ? "" : cat
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar>
                <ion-title>Listy zakupowe</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="ion-padding inner-content">
                <ion-list>
                    <ion-item>
                        <ion-input
                            label="Czego szukasz..."
                            label-placement="floating"
                            ref="input"
                            type="text"
                            :clear-input="true"
                            v-model="shoppingItemInput"
                            class="border-b-2 mb-4"
                        ></ion-input>
                    </ion-item>
                </ion-list>
                <ion-accordion-group
                    v-show="shoppingItemInput.length === 0"
                    class="shopping-accordion-group"
                >
                    <ion-accordion
                        v-for="items in shoppingItems"
                        :key="items.category"
                        :value="items.category"
                    >
                        <ion-item
                            slot="header"
                            color="light"
                            @click="() => handleCategory(items.category)"
                        >
                            <ion-label>{{ items.category }}</ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <div
                                class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
                                v-if="
                                    currentShoppingList &&
                                    items.category === activeCategory
                                "
                            >
                                <shoppingListItemToAdd
                                    v-for="item in items.items"
                                    :key="item"
                                    :shopping-item="item"
                                    :active="
                                        currentShoppingList.items.some(
                                            (shoppingItem) =>
                                                shoppingItem.name === item
                                        )
                                    "
                                    @click="
                                        () =>
                                            localHandleItem(
                                                item,
                                                items.category
                                            )
                                    "
                                />
                            </div>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
                <div
                    class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
                    v-if="shoppingItemInput.length"
                >
                    <shoppingListItemToAdd
                        v-for="item in availableShoppingItemsByPhrase"
                        :key="item"
                        :shopping-item="item.name"
                        v-if="availableShoppingItemsByPhrase.length"
                        :active="
                            currentShoppingList.items.some(
                                (shoppingItem) =>
                                    shoppingItem.name === item.name
                            )
                        "
                        @click="() => localHandleItem(item.name, item.category)"
                    />
                </div>
                <div class="background" v-if="isLoading">
                    <ion-spinner name="lines-sharp"></ion-spinner>
                    <span>Aktualizacja listy</span>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
<style inner-content lang="scss" scoped>
.shopping-accordion-group {
    height: calc(100% - 100px);
    overflow: auto;
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999999999999;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
        color: white;
    }
}
</style>
