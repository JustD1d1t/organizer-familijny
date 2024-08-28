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

const sortType = ref({
    name: 'date',
    dir: 'asc',
});

const itemsToDisplay = computed(() => {
    const items = currentPantry?.value.items?.filter((item) =>
            item.name.toLowerCase().includes(searchValue.value.toLowerCase())
        ) ?? []
        if(items.length) {
            const itemsWithExpiryDate = items.filter(item => item.expiryDate)
            const itemsWithoutExpiryDate = items.filter(item => !item.expiryDate)
            if(sortType.value.name === 'date') {
                if(sortType.value.dir === 'asc') {
                    itemsWithExpiryDate.sort((a, b) => {
                        return new Date(a.expiryDate) - new Date(b.expiryDate)
                    })
                    return [...itemsWithExpiryDate, ...itemsWithoutExpiryDate]
                } else if (sortType.value.dir === 'desc') {
                    itemsWithExpiryDate.sort((a, b) => {
                        return new Date(b.expiryDate) - new Date(a.expiryDate)
                    })
                    return [...itemsWithExpiryDate, ...itemsWithoutExpiryDate]
                }
            } else if (sortType.value.name === 'name') {
                if(sortType.value.dir === 'asc') {
                    return items.sort((a,b) => {
                        return a.name.localeCompare(b.name)
                    })
                } else if (sortType.value.dir === 'desc') {
                    return items.sort((a,b) => {
                        return b.name.localeCompare(a.name)
                    })

                }
                
            }
        }
        return items
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

const setRemovedItem = (item) => {
    removedItem.value = item
    isOpenShoppingModal.value = true
}

const confirmSelectShoppingListModal = async (list) => {
    isOpenSelectShoppingListModal.value = false
    await updateShoppingList({
        ...list,
        items: [...list.items, removedItem.value],
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
    if (item.quantity === 1) {
        setRemovedItem({
            category: item.category,
            name: item.name,
            checked: false
        })
    }
}

const goToAddItemPage = () => {
    navigateTo(`/pantries/${currentPantry.value.id}/add-item`)
}

const goToEditPantryItem = (name) => {
    navigateTo(`/pantries/${currentPantry.value.id}/${name}`)
}

const addExpiryDate = (item) => {
    navigateTo(`/pantries/${currentPantry.value.id}/${item.name}`)
}

const formattedExpriyDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : ""
}

const handleSortType = (type) => {
    if(sortType.value !== undefined) {
        if (type !== sortType.value.name) {
            sortType.value = {
                name: type,
                dir: 'asc',
            }
        } else {
            let newDir = sortType.value.dir === 'asc' ? 'desc' : 'asc'
            sortType.value = {
                name: type,
                dir: newDir,
            }
        }
    } else {
        sortType.value = {
            name: type,
            dir: 'asc',
        }
    }
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
                    
                <ion-buttons slot="end">
                    <PopoverContainer sortId="pantries-sort" width="250px">
                        <SortItem label="Sortuj po nazwie" @click="handleSortType('name')" type="name" :dir="sortType.dir" :active="sortType.name === 'name'"/>
                        <SortItem label="Sortuj po dacie" @click="handleSortType('date')" type="amount" :dir="sortType.dir" :active="sortType.name === 'date'"/>
                    </PopoverContainer>
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
                <UiList class="overflow-auto max-h-[75%]" 
                    v-if="itemsToDisplay.length">
                    <UiListItemCounter
                        v-for="(item, index) in itemsToDisplay"
                        :key="item.name"
                        @increaseQuantity="() => increaseQuantity(item)"
                        @decreaseQuantity="() => decrease(item)"
                        :quantity="item.quantity"
                        :category="item.category"
                    >
                        <template #label>
                            <div class="flex flex-col flex-grow">
                                <ion-label
                                    class="grow my-0"
                                    @click="() => goToEditPantryItem(item.name)"
                                    >{{ item.name }}</ion-label
                                >
                                <span v-if="item.expiryDate" class="text-sm">
                                    {{ formattedExpriyDate(item.expiryDate) }}
                                </span>
                            </div>
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
                                            <ion-label @click="() => addExpiryDate(item)"
                                                >Dodaj termin
                                                przydatności</ion-label @click=
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
                    :name="removedItem.name"
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
