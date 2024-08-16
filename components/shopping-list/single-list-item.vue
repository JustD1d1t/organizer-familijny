<script setup>
const props = defineProps({
    shoppingList: {
        type: Object,
        default: () => {},
    },
})

const shoppingListsStore = useShoppingListsStore()
const { removeShoppingList, setCurrentShoppingList } = shoppingListsStore

const handleClick = (shopList) => {
    navigateTo(`/shopping-lists/${shopList.id}`)
    setCurrentShoppingList(shopList)
}
const goToEditShoppingList = () => {
    setCurrentShoppingList(props.shoppingList)
    navigateTo(`/shopping-lists/${props.shoppingList.id}/edit`)
}

const boughtItems = computed(
    () => props.shoppingList.items.filter((item) => item.checked).length
)
</script>
<template>
    <div
        class="flex flex-col py-2 pl-6 pr-2 my-1 bg-white rounded-2xl shadow-2xl"
    >
        <div class="flex items-center">
            <div class="flex flex-col">
                <ion-label
                    class="flex-grow font-bold"
                    @click="() => handleClick(shoppingList)"
                    >{{ shoppingList.name }}</ion-label
                >

                <div>{{ boughtItems }} / {{ shoppingList.items.length }}</div>
            </div>
            <ion-button
                fill="clear"
                id="open-menu"
                class="ml-auto"
                size="small"
            >
                <ion-icon
                    size="medium"
                    :icon="ioniconsEllipsisVerticalOutline"
                />
            </ion-button>
            <ion-popover
                trigger="open-menu"
                trigger-action="click"
                side="bottom"
                alignment="center"
                :dismiss-on-select="true"
            >
                <ion-content class="ion-padding mr-8">
                    <ion-list>
                        <ion-item @click="goToEditShoppingList">
                            <ion-label>Edytuj</ion-label>
                        </ion-item>
                        <ion-item @click="removeShoppingList(shoppingList.id)">
                            <ion-label>Usuń</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-content>
            </ion-popover>
        </div>
    </div>
</template>
