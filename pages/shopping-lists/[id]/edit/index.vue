<script setup>
import { useRoute } from "vue-router"
const route = useRoute()
const router = useRouter()
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { toggleMember, updateList, leaveList } = shoppingListsStore
const { currentShoppingList } = storeToRefs(shoppingListsStore)
const uid = useState("uid")

const input = ref()

const collaboratedList = computed(() => {
    return uid.value !== currentShoppingList.value.ownerId
})

const update = async () => {
    await updateList()
    router.back()
}
const leave = async () => {
    await leaveList()
    navigateTo("/shopping-lists")
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Listy zakupowe</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-item v-if="currentShoppingList" class="mb-4">
                <ion-input
                    label="Nazwa listy zakupowej"
                    label-placement="floating"
                    ref="input"
                    type="text"
                    v-model="currentShoppingList.name"
                ></ion-input>
            </ion-item>

            <FamilyDropdownSelectMember
                :members="currentShoppingList.members"
                @toggleMember="
                    (member) => toggleMember(member, route.params.id)
                "
                v-if="!collaboratedList"
            />

            <div class="flex justify-center" v-else>
                <uiButton
                    expand="block"
                    class="w-1/2"
                    size="small"
                    @click="leave()"
                >
                    Opuść listę
                </uiButton>
                <uiButton
                    expand="block"
                    class="w-1/2"
                    size="small"
                    @click="leave()"
                >
                    Opuść listę
                </uiButton>
            </div>
            <uiButton expand="block" @click="update" class="my-6"
                >Aktualizuj listę</uiButton
            >
        </ion-content>
    </ion-page>
</template>
