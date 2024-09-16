<script setup>
const notificationsStore = useNotificationsStore()
const { sendNotification } = notificationsStore

const uid = localStorage.getItem("uid")

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, removeFamily, leaveFamily } = familyMembersStore
const { familyMembers, familyMembersDetails, familyId } =
    storeToRefs(familyMembersStore)
const modal = ref()

const shoppingListsStore = useShoppingListsStore()
const { shoppingLists } = storeToRefs(shoppingListsStore)
const { getAllShoppingLists, updateShoppingList } = shoppingListsStore

const pantriesStore = usePantriesStore()
const { pantries } = storeToRefs(pantriesStore)
const { getAllPantries, editPantry } = pantriesStore

const expensesStore = useExpensesStore()
const { expenses } = storeToRefs(expensesStore)
const { getAllMyExpenses, editExpense } = expensesStore

const familyOwner = computed(() => {
    return familyId.value === uid
})

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

const addMember = (newMembers) => {
    confirmModal()
    familyMembersDetails.value = newMembers
    familyOwner.value = true
}
const removeMemberFromShoppingLists = async (member) => {
    if (shoppingLists.value.length) {
        shoppingLists.value.forEach(async (list) => {
            if (list.membersIds.includes(member.id)) {
                list.membersIds = list.membersIds.filter((m) => m !== member.id)
                list.members = list.members.filter((m) => m.id !== member.id)
                await updateShoppingList(list)
            }
        })
    } else {
        await getAllShoppingLists()
        if (shoppingLists.value.length) {
            shoppingLists.value.forEach(async (list) => {
                if (list.membersIds.includes(member.id)) {
                    list.membersIds = list.membersIds.filter(
                        (m) => m !== member.id
                    )
                    list.members = list.members.filter(
                        (m) => m.id !== member.id
                    )
                    await updateShoppingList(list)
                }
            })
        }
    }
}

const removeMemberFromPantries = async (member) => {
    if (pantries.value.length) {
        pantries.value.forEach(async (pantry) => {
            if (pantry.membersIds.includes(member.id)) {
                pantry.membersIds = pantry.membersIds.filter(
                    (m) => m !== member.id
                )
                pantry.members = pantry.members.filter(
                    (m) => m.id !== member.id
                )
                await editPantry(pantry)
            }
        })
    } else {
        await getAllPantries()
        if (pantries.value.length) {
            pantries.value.forEach(async (pantry) => {
                if (pantry.membersIds.includes(member.id)) {
                    pantry.membersIds = pantry.membersIds.filter(
                        (m) => m !== member.id
                    )
                    pantry.members = pantry.members.filter(
                        (m) => m.id !== member.id
                    )
                    await editPantry(pantry)
                }
            })
        }
    }
}

const removeMemberFromExpenses = async (member) => {
    if (expenses.value.length) {
        expenses.value.forEach(async (expense) => {
            if (expense.familyMembers.includes(member.id)) {
                expense.familyMembers = expense.familyMembers.filter(
                    (m) => m !== member.id
                )
                editExpense(expense)
            }
        })
    } else {
        await getAllMyExpenses()
        if (expenses.value.length) {
            expenses.value.forEach(async (expense) => {
                if (expense.familyMembers.includes(member.id)) {
                    expense.familyMembers = expense.familyMembers.filter(
                        (m) => m !== member.id
                    )
                    editExpense(expense)
                }
            })
        }
    }
}

const remove = async (member) => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== member.id
    )
    const newMembers = familyMembers.value.filter((m) => m !== member.id)
    await updateMembers(newMembersDetails, newMembers)
    await removeMemberFromShoppingLists(member)
    await removeMemberFromPantries(member)
    await removeMemberFromExpenses(member)
    await sendNotification(
        {
            title: `Zostałeś usunięty z rodziny "${localStorage.getItem(
                "email"
            )}"`,
            content: `Zostałeś usunięty z rodziny przez użytkownika "${localStorage.getItem(
                "email"
            )}`,
        },
        member.id
    )
}

const leave = async () => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== uid
    )
    const newMembers = familyMembers.value.filter((m) => m !== uid)
    await leaveFamily(newMembersDetails, newMembers)
    navigateTo("/")
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Rodzina</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div>
                <h2>Członkowie rodziny</h2>
                <h3 v-if="!familyMembersDetails.length">
                    Nie należysz do żadnej rodziny
                </h3>
                <ion-list lines="none">
                    <UiListItem
                        v-for="member in familyMembersDetails"
                        :key="member.id"
                        class="flex items-center"
                    >
                        <template #start>
                            <span
                                >{{ member.nickname }} ({{ member.email }})
                                <small v-if="member.status === 'pending'"
                                    >(oczekiwanie)</small
                                ></span
                            >
                        </template>
                        <template #end>
                            <uiButton
                                type="tertiary"
                                @click="() => remove(member)"
                                size="small"
                                v-if="familyOwner && member.id !== uid"
                            >
                                <ion-icon :icon="ioniconsTrash"></ion-icon>
                            </uiButton>
                        </template>
                    </UiListItem>
                </ion-list>
            </div>
            <ion-modal
                class="auto-height"
                ref="modal"
                trigger="open-modal"
                v-if="familyOwner || !familyMembers.length"
            >
                <FamilyEditModal @cancel="cancel" @confirmModal="addMember" />
            </ion-modal>
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button>
                    <ion-icon :icon="ioniconsArrowUpCircle"></ion-icon>
                </ion-fab-button>
                <ion-fab-list side="top">
                    <ion-fab-button
                        id="open-modal"
                        v-if="familyOwner || !familyMembers.length"
                    >
                        <ion-icon :icon="ioniconsAdd"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="!familyOwner" @click="leave">
                        <ion-icon
                            :icon="ioniconsPlayForwardCircleOutline"
                        ></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="familyOwner" @click="removeFamily">
                        <ion-icon :icon="ioniconsTrash"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
