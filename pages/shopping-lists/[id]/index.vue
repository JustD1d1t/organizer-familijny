<script setup>
import { useRoute } from "vue-router"

const route = useRoute()

const pantriesStore = usePantriesStore()
const { handlePantryItemsFromShoppingList } = pantriesStore

const shoppingListsStore = useShoppingListsStore()
const {
    updateShoppingList,
    removeAllItems,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems,
} = shoppingListsStore
const { currentShoppingList } = storeToRefs(shoppingListsStore)

const layout = ref("products")
const dir = ref("asc")
const nameDir = ref("asc")
const lastSort = ref("")

const selectPantryModalOpen = ref(false)
const modal = ref()
const cancel = () => (selectPantryModalOpen.value = false)
const confirmModal = async (pantry) => {
    const selectedItems = currentShoppingList.value.items.filter(
        (item) => item.checked
    )
    currentShoppingList.value.items = currentShoppingList.value.items.filter(
        (item) => !item.checked
    )
    await handlePantryItemsFromShoppingList(selectedItems, pantry)
    await updateShoppingList({
        ...currentShoppingList.value,
        items: currentShoppingList.value.items,
    })
    selectPantryModalOpen.value = false
}

const name = computed(() =>
    currentShoppingList?.value ? currentShoppingList.value.name : ""
)

const sortByCategory = () => {
    dir.value = dir.value === "asc" ? "desc" : "asc"
    lastSort.value = "category"
}

const sortByName = () => {
    nameDir.value = nameDir.value === "asc" ? "desc" : "asc"
    lastSort.value = "name"
}

const changeLayout = (lay) => {
    layout.value = lay
}

const goToAddItemPage = () => {
    navigateTo(`/shopping-lists/${route.params.id}/add-item`)
}

const openPantryModal = () => {
    selectPantryModalOpen.value = true
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

                <ion-buttons
                    slot="end"
                    v-if="
                        currentShoppingList.items.length ||
                        currentShoppingList.recipes.length
                    "
                >
                    <ShoppingListSortAndFilter
                        :layout="layout"
                        :dir="dir"
                        :nameDir="nameDir"
                        :lastSort="lastSort"
                        @changeLayout="changeLayout"
                        @sortByCategory="sortByCategory"
                        @sortByName="sortByName"
                        @openPantryModal="openPantryModal"
                        @removeAllItems="removeAllItems"
                        @removeSelectedItems="removeSelectedItems"
                        @selectAllItems="selectAllItems"
                        @deselectAllItems="deselectAllItems"
                    />
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="h-[90%]">
                <h2 class="h1">{{ name }}</h2>
                <div
                    v-if="
                        currentShoppingList.items.length ||
                        currentShoppingList.recipes.length
                    "
                >
                    <ion-accordion-group>
                        <ion-accordion value="first">
                            <ion-item slot="header" color="light">
                                <ion-label><b>Czy wiesz, że...</b></ion-label>
                            </ion-item>
                            <div class="ion-padding" slot="content">
                                <uiInfoCard
                                    subtitle="Możesz zmieniać widoki, sortować i przeprowadzać masowe operacje na produktach?"
                                    icon="ioniconsBulb"
                                    class="mb-4 mt-2"
                                >
                                    <br />
                                    <p>
                                        Wystarczy, że klikniesz w ikonę "3
                                        kropek" w prawym górnym rogu
                                    </p>
                                    <br />
                                    <p>Możesz:</p>
                                    <ul class="my-2">
                                        <li>Wyświetlać produkty lub pogrupować po kategorii, żebyś kupił wszystko w danej alejce sklepu</li>
                                        <li>Możesz sortować po nazwie lub kategorii, ale tylko w widoku produktów</li>
                                        <li>Możesz dodawać zaznaczone produkty do spiżarni</li>
                                        <li>Zaznaczać lub odznaczać wszystkie produkty</li>
                                        <li>Usuwać wszystkie lub tylko zakupione produkty</li>
                                    </ul>
                                </uiInfoCard>
                            </div>
                        </ion-accordion>
                    </ion-accordion-group>
                    <ShoppingListProducts
                        v-if="layout == 'products'"
                        :dir="dir"
                        :nameDir="nameDir"
                        :lastSort="lastSort"
                    />
                    <ShoppingListSortedByCategory v-else />
                </div>
                <div v-else>
                    <uiInfoCard
                        title="Czy wiesz, że..."
                        subtitle="Możesz dodawać produkty z naszej bazy lub swoje własne?"
                        icon="ioniconsBulb"
                        class="mt-8"
                    >
                        <br />
                        <p>
                            Wystarczy, że klikniesz w przycisk "+" na dole
                            ekranu i przejdziesz do strony z dodawaniem
                            artykułów do listy zakupowej
                        </p>
                        <br />
                        <p>Możesz:</p>
                        <ul>
                            <li>szukać artykułów w danej kategorii</li>
                            <li>
                                wyszukać artykuł spośród wszystkich kategorii
                            </li>
                            <li>
                                doodać swój produkt, jeśli nie znaleziono
                                produktu w żadnej z kategorii. Twój produkt
                                zostanie dodany bez kategorii
                            </li>
                        </ul>
                        <br />
                        <p class="h3 font-bold">
                            Dodaj swój pierwszy produkt do listy zakupowej
                        </p>
                    </uiInfoCard>
                </div>

                <ion-modal
                    class="auto-height"
                    ref="modal"
                    :is-open="selectPantryModalOpen"
                    @willDismiss="cancel"
                >
                    <ShoppingListSelectPantryModal
                        :cancel="cancel"
                        :confirmModal="confirmModal"
                    />
                </ion-modal>

                <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                    <ion-fab-button @click="goToAddItemPage">
                        <ion-icon
                            :icon="ioniconsAddCircle"
                            size="large"
                        ></ion-icon>
                    </ion-fab-button>
                </ion-fab>
            </div>
        </ion-content>
    </ion-page>
</template>
