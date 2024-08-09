<script setup>
import { useRoute } from "vue-router"
const route = useRoute()
const router = useRouter()
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { editShoppingList, leaveList } = shoppingListsStore
const { currentShoppingList } = storeToRefs(shoppingListsStore)

const input = ref()

const collaboratedList = computed(() => {
    return localStorage.getItem("uid") !== currentShoppingList.value.ownerId
})

const newMembers = ref(
    collaboratedList.value ? [] : currentShoppingList.value.members
)
const newName = ref(currentShoppingList.value.name)

const update = async () => {
    await editShoppingList(newName.value, newMembers.value)
    router.back()

}

const toggleMember = (member) => {
    if (newMembers.value.includes(member.uid)) {
        newMembers.value = newMembers.value.filter((m) => m !== member.uid)
    } else {
        newMembers.value.push(member.uid)
    }
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
                    v-model="newName"
                ></ion-input>
            </ion-item>

            <FamilyDropdownSelectMember
                :members="newMembers"
                @toggleMember="(member) => toggleMember(member)"
                v-if="!collaboratedList"
            />

            <div class="flex justify-center" v-else>
                <ion-button
                    expand="block"
                    class="w-1/2"
                    size="small"
                    @click="leaveList()"
                >
                    Opuść listę
                </ion-button>
                <ion-button
                    expand="block"
                    class="w-1/2"
                    size="small"
                    @click="leave()"
                >
                    Opuść listę
                </ion-button>
            </div>
            <ion-button expand="block" @click="update" class="my-6"
                >Aktualizuj listę</ion-button
            >
        </ion-content>
    </ion-page>
</template>
