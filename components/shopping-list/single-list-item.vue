<script setup>
const props = defineProps({
    shoppingList: {
        type: Object,
        default: () => {},
    },
})
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

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

const collaboratedList = computed(
    () => props.shoppingList.ownerId !== uid.value
)

const familyMembers = computed(() => {
    return (
        props.shoppingList.members
            ?.map((member) => member.nickname)
            .join(", ") ?? ""
    )
})
</script>
<template>
    <div
        class="flex flex-col py-2 pl-6 pr-2 my-1 bg-white rounded-2xl shadow-2xl"
    >
        <div class="flex items-center">
            <div class="flex flex-col grow">
                <ion-label
                    class="flex-grow font-bold"
                    @click="() => handleClick(shoppingList)"
                    >{{ shoppingList.name }}</ion-label
                >
                <div>
                    <span class="mr-4">
                        {{ boughtItems }} /
                        {{ shoppingList.items.length }}
                    </span>
                    <span>
                        {{ familyMembers }}
                    </span>
                </div>
            </div>
            <uiButton
                :id="'open-shopping-menu-' + shoppingList.id"
                class="ml-auto"
                size="small"
                type="tertiary"
                v-if="!collaboratedList"
            >
                <ion-icon
                    size="medium"
                    :icon="ioniconsEllipsisVerticalOutline"
                />
            </uiButton>
            <ion-popover
                :trigger="'open-shopping-menu-' + shoppingList.id"
                trigger-action="click"
                side="bottom"
                alignment="center"
                :dismiss-on-select="true"
                v-if="!collaboratedList"
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
