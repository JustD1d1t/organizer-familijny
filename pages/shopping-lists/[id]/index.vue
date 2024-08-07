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

const goToEditShoppingList = () => {
    navigateTo(`/shopping-lists/${route.params.id}/edit`)
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
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>{{ name }}</ion-title>

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
                <ShoppingListProducts
                    v-if="layout == 'products'"
                    :dir="dir"
                    :nameDir="nameDir"
                    :lastSort="lastSort"
                />
                <ShoppingListSortedByCategory v-else />

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
                    <ion-fab-button>
                        <ion-icon :icon="ioniconsArrowUpCircle"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-list side="top">
                        <ion-fab-button @click="goToAddItemPage">
                            <ion-icon
                                :icon="ioniconsAddCircle"
                                size="large"
                            ></ion-icon>
                        </ion-fab-button>
                        <ion-fab-button @click="goToEditShoppingList">
                            <ion-icon
                                :icon="ioniconsPencil"
                                size="large"
                            ></ion-icon>
                        </ion-fab-button>
                    </ion-fab-list>
                </ion-fab>
            </div>
        </ion-content>
    </ion-page>
</template>
