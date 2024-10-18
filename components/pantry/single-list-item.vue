<script setup>
const props = defineProps({
    pantry: {
        type: Object,
        default: () => {},
    },
})

const pantriesStore = usePantriesStore()
const { removePantry, setCurrentPantry } = pantriesStore

const handleClick = (shopList) => {
    navigateTo(`/pantries/${shopList.id}`)
    setCurrentPantry(shopList)
}
const goToEditPantry = () => {
    setCurrentPantry(props.pantry)
    navigateTo(`/pantries/${props.pantry.id}/edit`)
}

const familyMembers = computed(() => {
    return props.pantry.members.map((member) => member.nickname).join(", ")
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
                    @click="() => handleClick(pantry)"
                    >{{ pantry.name }}</ion-label
                >
                <div v-if="familyMembers.length">
                    {{ familyMembers }}
                </div>
            </div>
            <uiButton
                :id="'open-pantry-menu-' + pantry.id"
                class="ml-auto"
                type="tertiary"
            >
                <ion-icon
                    size="medium"
                    :icon="ioniconsEllipsisVerticalOutline"
                />
            </uiButton>
            <ion-popover
                :trigger="'open-pantry-menu-' + pantry.id"
                trigger-action="click"
                side="bottom"
                alignment="center"
                :dismiss-on-select="true"
            >
                <ion-content class="ion-padding mr-8">
                    <uiList>
                        <ion-item @click="goToEditPantry">
                            <ion-label>Edytuj</ion-label>
                        </ion-item>
                        <ion-item @click="removePantry(pantry.id)">
                            <ion-label>Usuń</ion-label>
                        </ion-item>
                    </uiList>
                </ion-content>
            </ion-popover>
        </div>
    </div>
</template>
