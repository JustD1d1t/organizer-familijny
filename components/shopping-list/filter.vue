<script setup>
import { useRoute } from "vue-router"

const emit = defineEmits([
    "changeLayout",
    "sortByName",
    "sortByCategory",
    "addToPantry",
])
const props = defineProps({
    layout: {
        type: String,
        default: "",
    },
    nameDir: {
        type: String,
        default: "",
    },
    dir: {
        type: String,
        default: "",
    },
    lastSort: {
        type: String,
        default: "",
    },
})

const shoppingListsStore = useShoppingListsStore()
const { currentShoppingList } = storeToRefs(shoppingListsStore)
const { updateShoppingList } = shoppingListsStore

const removeAllItems = async () => {
    await updateShoppingList({
        ...currentShoppingList.value,
        items: [],
    })
    currentShoppingList.value.items = []
}

const selectAllItems = async () => {
    const updatedItems = [...currentShoppingList.value.items].map((item) => {
        item.checked = true
        return item
    })
    await updateShoppingList({
        ...currentShoppingList.value,
        items: updatedItems,
    })
    currentShoppingList.value.items = updatedItems
}

const deselectAllItems = async () => {
    const updatedItems = [...currentShoppingList.value.items].map((item) => {
        item.checked = false
        return item
    })
    await updateShoppingList({
        ...currentShoppingList.value,
        items: updatedItems,
    })
    currentShoppingList.value.items = updatedItems
}

const removeSelectedItems = async () => {
    const updatedItems = [...currentShoppingList.value.items].filter(
        (item) => !item.checked
    )
    await updateShoppingList({
        ...currentShoppingList.value,
        items: updatedItems,
    })
    currentShoppingList.value.items = updatedItems
}
</script>

<template>
    <ion-button fill="clear" id="shopping-list-menu">
        <ion-icon slot="icon-only" :icon="ioniconsEllipsisVerticalOutline" />
    </ion-button>
    <ion-popover
        trigger="shopping-list-menu"
        trigger-action="click"
        :dismiss-on-select="true"
    >
        <ion-content class="ion-padding">
            <ion-list lines="none">
                <ion-item @click="emit('changeLayout', 'category')">
                    <ion-label>Widok kategorii</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="layout === 'category'"
                    ></ion-icon>
                </ion-item>
                <ion-item @click="emit('changeLayout', 'products')">
                    <ion-label>Widok produktów</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="layout === 'products'"
                    ></ion-icon>
                </ion-item>
                <ion-item
                    @click="emit('sortByCategory')"
                    v-if="layout === 'products'"
                >
                    <ion-label>Sortuj po kategorii</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="lastSort === 'category'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowDown"
                        v-if="dir === 'desc'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowUp"
                        v-else
                    ></ion-icon>
                </ion-item>
                <ion-item
                    @click="emit('sortByName')"
                    v-if="layout === 'products'"
                >
                    <ion-label>Sortuj po nazwie</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="lastSort === 'name'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowDown"
                        v-if="nameDir === 'desc'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowUp"
                        v-else
                    ></ion-icon>
                </ion-item>
                <ion-item @click="emit('addToPantry')">
                    <ion-label>Dodaj zaznaczone produkty do spiżarni</ion-label>
                </ion-item>
                <ion-item @click="removeAllItems">
                    <ion-label>Usuń wszystkie produkty</ion-label>
                </ion-item>
                <ion-item @click="removeSelectedItems">
                    <ion-label>Usuń zakupione produkty</ion-label>
                </ion-item>
                <ion-item @click="selectAllItems">
                    <ion-label>Zaznacz wszystkie produkty</ion-label>
                </ion-item>
                <ion-item @click="deselectAllItems">
                    <ion-label>Odznacz wszystkie produkty</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-popover>
</template>

<style lang="scss" scoped>
ion-popover {
    --width: 350px;
}
</style>
