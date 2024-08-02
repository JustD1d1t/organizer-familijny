<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { increaseQuantity, decreaseQuantity } = pantriesStore
const { currentPantry } = storeToRefs(pantriesStore)

const { updateDocument, queryDocsInCollection } = useFirebase()

const route = useRoute()
const uid = useState(StateEntries.Uid)

import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
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
    await updateDocument([StateEntries.ShoppingLists, list.id], {
        items: [...list.items, newItem],
    })
    list.items.push(newItem)
}

const confirmShoppingModal = async () => {
    if (!shoppingLists.value.length) {
        shoppingLists.value = await queryDocsInCollection(
            [StateEntries.ShoppingLists],
            false,
            [
                {
                    key: "ownerId",
                    value: uid.value,
                    statement: "==",
                },
            ]
        )
        collaboratedShoppingLists.value = await queryDocsInCollection(
            [StateEntries.ShoppingLists],
            false,
            [
                {
                    key: "members",
                    value: uid.value,
                    statement: "array-contains",
                },
            ]
        )
    }

    await updateDocument([StateEntries.Pantries, currentPantry.value.id], {
        items: currentPantry.value.items,
    })
    isOpenShoppingModal.value = false
    isOpenSelectShoppingListModal.value = true
}

const editPantry = () => {
    navigateTo(`/pantries/${currentPantry.value.id}/edit`)
}

const goToAddItemPage = () => {
    navigateTo(`/pantries/${currentPantry.value.id}/add-item`)
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title v-if="currentPantry">{{
                    currentPantry.name
                }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="h-[80%]">
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
                <ion-list lines="none" class="overflow-auto h-full">
                    <UiListItemCounter
                        v-for="item in itemsToDisplay"
                        :key="item.name"
                        @increaseQuantity="() => increaseQuantity(item)"
                        @decreaseQuantity="
                            () => decreaseQuantity(item, setRemovedItem)
                        "
                        :quantity="item.quantity"
                        class="h-9"
                    >
                        <template #label>
                            <ion-label class="grow my-0">{{
                                item.name
                            }}</ion-label>
                        </template>
                    </UiListItemCounter>
                </ion-list>
            </div>

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
                    <ion-fab-button @click="editPantry">
                        <ion-icon
                            :icon="ioniconsPencil"
                            size="large"
                        ></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
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
