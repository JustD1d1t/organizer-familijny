<script setup>
import { useRoute } from "vue-router"

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { increaseQuantity, decreaseQuantity, editPantry } = pantriesStore
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

const openExpiryModal = ref(false)
const itemToAddExpiryDate = ref(null)
const itemExpiryDate = ref(null)

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

const closeModal = () => {
    openExpiryModal.value = false
}

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

const goToAddItemPage = () => {
    navigateTo(`/pantries/${currentPantry.value.id}/add-item`)
}

const goToEditPantryItem = (name) => {
    navigateTo(`/pantries/${currentPantry.value.id}/${name}`)
}

const addExpiryDate = (item) => {
    openExpiryModal.value = true
    const date = new Date(item.expiryDate)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0
    const year = date.getFullYear();
    
    itemToAddExpiryDate.value = item;
    const formattedDate = `${year}-${month}-${day}`;

    itemExpiryDate.value = formattedDate

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
const saveExpireDate = () => {
    const editedItems = currentPantry.value.items.map((item) => {
        if (item.name === itemToAddExpiryDate.value.name) {
            item.expiryDate = new Date(itemExpiryDate.value).getTime()
        }
        return item
    })
    editPantry({
        ...currentPantry.value,
        items: editedItems,
    })
    openExpiryModal.value = false
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar >
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                    
                <ion-buttons slot="end" v-if="itemsToDisplay.length">
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
                <h2 class="h1">{{ currentPantry.name }}</h2>
                
                <ion-accordion-group v-if="itemsToDisplay.length">
                    <ion-accordion value="first">
                        <ion-item slot="header" color="light">
                            <ion-label><b>Czy wiesz, że...</b></ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <uiInfoCard
                                subtitle="Możesz sortować swoje zapasy oraz dodawać do nich termin przydatności?"
                                icon="ioniconsBulb"
                                class="mb-4 mt-2"
                            >
                                <br />
                                <p>Termin przydatności dodasz klikając przycisk "3 kropki" na danym produkcie. Wyskoczy Ci okienko z możliwością ustawienia terminu przydatności. Jeśli masz wiele produktów i każdy z nich ma inna datę to podaj tę najkrótszą</p>
                                <br>
                                <p>
                                    Możesz też sortować swoje zapasy. Wystarczy, że klikniesz w ikonę "3
                                    kropek" w prawym górnym rogu. Możesz sortować produkty po nazwie oraz dacie przydatności. Jeśli produkt nie ma daty przydatności nie będzie brany pod uwagę przy sortowaniu po dacie
                                </p>
                            </uiInfoCard>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
                <UiList
                    v-if="itemsToDisplay.length">
                    <uiInput
                        label="Wyszukaj produkt"
                        type="text"
                        placeholder="Szukaj..."
                        v-model="searchValue"
                    />
                </UiList>   
                <uiInfoCard
                    v-else
                    title="Czy wiesz, że..."
                    subtitle="Możesz dodawać produkty z naszej bazy lub swoje własne?"
                    icon="ioniconsBulb"
                    class="mt-8"
                >
                    <br />
                    <p>
                        Wystarczy, że klikniesz w przycisk "+" na dole
                        ekranu i przejdziesz do strony z dodawaniem
                        artykułów do spiżarnii
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
                        Dodaj swój pierwszy produkt do spiżarnii
                    </p>
                </uiInfoCard>
                <UiList class="overflow-auto max-h-[75%]">
                    <UiListItemCounter
                        v-for="(item, index) in itemsToDisplay"
                        :key="item.name"
                        @increaseQuantity="() => increaseQuantity(item)"
                        @decreaseQuantity="() => decreaseQuantity(item)"
                        :quantity="item.quantity"
                        :category="item.category"
                    >
                        <template #label>
                            <div class="flex flex-col flex-grow">
                                <ion-label
                                    class="grow my-0"
                                    >{{ item.name }}</ion-label
                                >
                                <!-- <ion-label
                                    class="grow my-0"
                                    @click="() => goToEditPantryItem(item.name)"
                                    >{{ item.name }}</ion-label
                                > -->
                                <span v-if="item.expiryDate" class="text-sm">
                                    {{ formattedExpriyDate(item.expiryDate) }}
                                </span>
                            </div>
                        </template>
                        <template #actions>
                            <uiButton
                                type="tertiary"
                                :id="'open-pantry-menu-' + index"
                                class="ml-auto"
                                size="small"
                            >
                                <ion-icon
                                    size="medium"
                                    :icon="ioniconsEllipsisVerticalOutline"
                                />
                            </uiButton>
                            <ion-popover
                                :trigger="'open-pantry-menu-' + index"
                                trigger-action="click"
                                side="bottom"
                                alignment="center"
                                :dismiss-on-select="true"
                            >
                                <ion-content class="ion-padding mr-8">
                                    <uiList>
                                        <ion-item>
                                            <ion-label @click="() => addExpiryDate(item)"
                                                >
                                                <span v-if="!item.expiryDate">Dodaj termin
                                                    przydatności</span>
                                                    <span v-else>Edytuj termin
                                                        przydatności</span>
                                                </ion-label @click=
                                            >
                                        </ion-item>
                                    </uiList>
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
                    :is-open="openExpiryModal"
                    @didDismiss="closeModal()"
                >
                    <div class="p-2">
                        <uiList>
                            <uiInput
                            label="Dodaj termin przydatności"
                            v-model="itemExpiryDate"
                            type="date"
                            />
                        </uiList>
                        <div class="flex justify-center">
                            <uiButton @click="saveExpireDate" >
                                <span> Zapisz termin</span>
                            </uiButton>
                        </div>
                    </div>
                </ion-modal>

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
.list-inset {
    border-radius: 1rem !important;
    overflow: auto;
}
</style>
