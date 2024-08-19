<script setup>
import { useRoute } from "vue-router"

const route = useRoute()

const pantriesStore = usePantriesStore()
const { handlePantryItemsFromShoppingList } = pantriesStore

const shoppingListsStore = useShoppingListsStore()
const { updateShoppingList } = shoppingListsStore
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
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Listy zakupowe</ion-title>

                <ion-buttons slot="end">
                    <ShoppingListFilter
                        @sortByCategory="sortByCategory"
                        @sortByName="sortByName"
                        @changeLayout="changeLayout"
                        :layout="layout"
                        :nameDir="nameDir"
                        :dir="dir"
                        :lastSort="lastSort"
                        @addToPantry="openPantryModal"
                    />
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="h-[90%]">
                <h2>{{ name }}</h2>
                <div v-if="currentShoppingList.items.length">
                    <ShoppingListProducts
                        v-if="layout == 'products'"
                        :dir="dir"
                        :nameDir="nameDir"
                        :lastSort="lastSort"
                    />
                    <ShoppingListSortedByCategory v-else />
                </div>
                <h3 v-else>Brak produktów na liście</h3>

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
