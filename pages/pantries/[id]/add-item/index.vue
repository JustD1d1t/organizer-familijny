<script setup>
const { shoppingItems } = useShoppingItems()

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { handlePantryItem } = pantriesStore
const { currentPantry } = storeToRefs(pantriesStore)

const pantryItemInput = ref("")
const activeCategory = ref("")
const addingItem = ref(false)

const availableShoppingItemsByPhrase = computed(() => {
    const itemsWithCategory = shoppingItems.map((item) =>
        item.items.map((i) => ({ name: i, category: item.category }))
    )
    const flattendItemsWithCategory = itemsWithCategory.flat()
    return [
        {
            name: pantryItemInput.value.toLowerCase(),
            category: "bez kateogrii",
        },
        ...flattendItemsWithCategory.filter((item) =>
            item.name
                .toLowerCase()
                .includes(pantryItemInput.value.toLowerCase())
        ),
    ]
})

const handleCategory = (cat) => {
    activeCategory.value = activeCategory.value === cat ? "" : cat
}

const handleItem = async (name, category) => {
    addingItem.value = true
    await handlePantryItem(name, category)
    addingItem.value = false
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Listy zakupowe</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list lines="none">
                <uiInput
                    label="Napisz czego szukasz"
                    type="text"
                    v-model="pantryItemInput"
                    placeholder="Szukaj..."
                />
            </ion-list>
            <ion-accordion-group
                v-if="pantryItemInput.length < 3"
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
                    <div
                        class="ion-padding"
                        slot="content"
                        v-if="currentPantry.items"
                    >
                        <div
                            class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
                            v-if="items.category === activeCategory"
                        >
                            <shoppingListItemToAdd
                                v-for="item in items.items"
                                :key="item"
                                :shopping-item="item"
                                :active="
                                    currentPantry.items.some(
                                        (pantryItem) => pantryItem.name === item
                                    )
                                "
                                @click="() => handleItem(item, items.category)"
                            />
                        </div>
                    </div>
                </ion-accordion>
            </ion-accordion-group>
            <div
                class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
                v-else
            >
                <shoppingListItemToAdd
                    v-for="item in availableShoppingItemsByPhrase"
                    :key="item"
                    :shopping-item="item.name"
                    :active="
                        currentPantry.items.some(
                            (shoppingItem) => shoppingItem.name === item.name
                        )
                    "
                    @click="() => handleItem(item.name, item.category)"
                />
            </div>
            <div class="background" v-if="addingItem">
                <ion-spinner name="lines-sharp"></ion-spinner>
                <span>Aktualizacja listy</span>
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
