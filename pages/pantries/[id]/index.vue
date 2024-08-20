<script setup>
import { useRoute } from "vue-router"

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { increaseQuantity, decreaseQuantity } = pantriesStore
const { currentPantry } = storeToRefs(pantriesStore)

const route = useRoute()

const shoppingListsStore = useShoppingListsStore()
const { getAllShoppingLists, updateShoppingList } = shoppingListsStore
const { shoppingLists, collaboratedShoppingLists } =
    storeToRefs(shoppingListsStore)

const itemsToDisplay = computed(() => {
    return (
        currentPantry?.value.items?.filter((item) =>
            item.name.toLowerCase().includes(searchValue.value.toLowerCase())
        ) ?? []
    )
})

const removedItem = ref("")
const searchValue = ref("")
const isOpenShoppingModal = ref(false)
const isOpenSelectShoppingListModal = ref(false)
const shoppingModal = ref()
const selectShoppingListModal = ref()

const cancelShoppingModal = () => (isOpenShoppingModal.value = false)

const cancelSelectShoppingListModal = () =>
    (isOpenSelectShoppingListModal.value = false)

watch(route, async (newRoute, oldRoute) => {
    cancelShoppingModal()
    cancelSelectShoppingListModal()
})

const onWillDismissShoppingModal = () => cancelShoppingModal()

const onWillDismissSelectModal = () => cancelSelectShoppingListModal()

const setRemovedItem = (name) => {
    removedItem.value = name
    isOpenShoppingModal.value = true
}

const confirmSelectShoppingListModal = async (list) => {
    isOpenSelectShoppingListModal.value = false
    const newItem = { name: removedItem.value, checked: false }
    await updateShoppingList({
        ...list,
        items: [...list.items, newItem],
    })
    list.items.push(newItem)
}

const confirmShoppingModal = async () => {
    if (!shoppingLists.value.length) {
        await getAllShoppingLists()
    }
    isOpenShoppingModal.value = false
    isOpenSelectShoppingListModal.value = true
}

const decrease = async (item) => {
    await decreaseQuantity(item)
    if (item.quantity === 0) {
        setRemovedItem(item.name)
    }
}

const goToAddItemPage = () => {
    navigateTo(`/pantries/${currentPantry.value.id}/add-item`)
}

const goToEditPantryItem = (name) => {
    navigateTo(`/pantries/${currentPantry.value.id}/${name}`)
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Spiżarnia</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="h-full overflow-auto">
                <h2>{{ currentPantry.name }}</h2>
                <ion-item class="mb-4">
                    <ion-input
                        data-test="shop-input"
                        label="Szukaj..."
                        label-placement="floating"
                        ref="shopInput"
                        class="shopInput"
                        type="text"
                        v-model="searchValue"
                    ></ion-input>
                </ion-item>
                <UiList class="overflow-auto max-h-[75%]">
                    <UiListItemCounter
                        v-for="(item, index) in itemsToDisplay"
                        :key="item.name"
                        @increaseQuantity="() => increaseQuantity(item)"
                        @decreaseQuantity="() => decrease(item)"
                        :quantity="item.quantity"
                        :category="item.category"
                    >
                        <template #label>
                            <ion-label
                                class="grow my-0"
                                @click="() => goToEditPantryItem(item.name)"
                                >{{ item.name }}</ion-label
                            >
                        </template>
                        <template #actions>
                            <ion-button
                                fill="clear"
                                :id="'open-pantry-menu-' + index"
                                class="ml-auto"
                                size="small"
                            >
                                <ion-icon
                                    size="medium"
                                    :icon="ioniconsEllipsisVerticalOutline"
                                />
                            </ion-button>
                            <ion-popover
                                :trigger="'open-pantry-menu-' + index"
                                trigger-action="click"
                                side="bottom"
                                alignment="center"
                                :dismiss-on-select="true"
                            >
                                <ion-content class="ion-padding mr-8">
                                    <ion-list>
                                        <ion-item>
                                            <ion-label
                                                >Dodaj termin
                                                przydatności</ion-label
                                            >
                                        </ion-item>
                                    </ion-list>
                                </ion-content>
                            </ion-popover>
                        </template>
                    </UiListItemCounter>
                </UiList>
            </div>

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToAddItemPage">
                    <ion-icon :icon="ioniconsAddCircle" size="large"></ion-icon>
                </ion-fab-button>
            </ion-fab>

            <ion-modal
                class="auto-height"
                ref="shoppingModal"
                :is-open="isOpenShoppingModal"
                @willDismiss="onWillDismissShoppingModal"
            >
                <PantryAddShoppingListModal
                    @cancelShoppingModal="cancelShoppingModal"
                    @confirmShoppingModal="confirmShoppingModal"
                    :name="removedItem"
                />
            </ion-modal>

            <ion-modal
                class="auto-height"
                ref="selectShoppingListModal"
                :is-open="isOpenSelectShoppingListModal"
                @willDismiss="onWillDismissSelectModal"
            >
                <PantrySelectShoppingListModal
                    :cancel="cancelSelectShoppingListModal"
                    :confirm-modal="confirmSelectShoppingListModal"
                    :shoppingLists="shoppingLists"
                    :collaboratedShoppingLists="collaboratedShoppingLists"
                />
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<style lang="scss" scoped>
ion-list {
    margin-left: 0 !important;
    margin-right: 0 !important;
    background-color: white !important;
}
.list-inset {
    border-radius: 1rem !important;
    overflow: auto;
}
</style>
