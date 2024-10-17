<script setup>
const notificationsStore = useNotificationsStore()
const { sendNotification } = notificationsStore
const userStore = useUserStore()
const { uid, email } = storeToRefs(userStore)

const familyMembersStore = useFamilyMembersStore()
const { updateMembers, removeFamily, leaveFamily } = familyMembersStore
const { familyMembers, familyMembersDetails, familyId, familyName } =
    storeToRefs(familyMembersStore)
const modal = ref()
const createModal = ref()

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
    return familyId.value === uid.value
})

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

const cancelCreateModal = () => createModal.value.$el.dismiss(null, "cancel")
const confirmCreateModal = () => createModal.value.$el.dismiss(null, "confirm")

const addMember = (newMembers) => {
    confirmModal()
    familyMembersDetails.value = newMembers
    familyOwner.value = true
}

const createFamily = () => {
    confirmCreateModal()
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
            title: `Zostałeś usunięty z rodziny "${email.value}"`,
            content: `Zostałeś usunięty z rodziny przez użytkownika "${email.value}`,
        },
        member.id
    )
}

const leave = async () => {
    const newMembersDetails = familyMembersDetails.value.filter(
        (m) => m.id !== uid.value
    )
    const newMembers = familyMembers.value.filter((m) => m !== uid.value)
    await leaveFamily(newMembersDetails, newMembers)
    navigateTo("/")
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title
                    >Rodzina
                    <span v-if="familyName">"{{ familyName }}"</span></ion-title
                >
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div>
                <uiInfoCard
                    v-if="!familyMembersDetails.length"
                    title="Czy wiesz, że..."
                    subtitle="Możesz utworzyć własną rodzinę a następnie dodawać do niej członków?"
                    icon="ioniconsBulb"
                    class="mt-8"
                >
                    <br />
                    <p>
                        Osoby z rodziny możesz dodawać do list zakupowych,
                        spiżarni czy wydatków.
                    </p>
                    <br />
                    <p>Dzięki temu:</p>
                    <br />
                    <ul>
                        <li>Możecie wspólnie planować zakupy</li>
                        <li>Możecie razem zarządzać zapasami w domu</li>
                        <li>Możecie kontrolować Wasze wspólne wydatki</li>
                    </ul>
                    <br />
                    <p class="h3 font-bold">Załóż rodzinę już teraz</p>
                </uiInfoCard>
                <ion-accordion-group v-else>
                    <ion-accordion value="first">
                        <ion-item slot="header" color="light">
                            <ion-label><b>Czy wiesz, że...</b></ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <uiInfoCard
                                subtitle="Możesz utworzyć własną rodzinę a następnie dodawać do niej członków?"
                                icon="ioniconsBulb"
                                class="mb-4 mt-2"
                            >
                                <br />
                                <p>
                                    Osoby z rodziny możesz dodawać do list
                                    zakupowych, spiżarni czy wydatków.
                                </p>
                                <br />
                                <p>Dzięki temu:</p>
                                <br />
                                <ul>
                                    <li>Możecie wspólnie planować zakupy</li>
                                    <li>
                                        Możecie razem zarządzać zapasami w domu
                                    </li>
                                    <li>
                                        Możecie kontrolować Wasze wspólne
                                        wydatki
                                    </li>
                                </ul>
                            </uiInfoCard>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
                <h2 v-if="familyMembersDetails.length">Członkowie rodziny</h2>
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
            <ion-modal class="auto-height" ref="modal" trigger="open-modal">
                <FamilyEditModal @cancel="cancel" @confirmModal="addMember" />
            </ion-modal>
            <ion-modal
                class="auto-height"
                ref="createModal"
                trigger="open-create-modal"
            >
                <FamilyCreateModal
                    @cancel="cancel"
                    @confirmModal="createFamily"
                />
            </ion-modal>
            <ion-fab
                slot="fixed"
                vertical="bottom"
                horizontal="end"
                v-if="!familyOwner && !familyMembers.includes(uid)"
            >
                <ion-fab-button id="open-create-modal" v-if="!familyOwner">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
            <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-else>
                <ion-fab-button>
                    <ion-icon :icon="ioniconsArrowUpCircle"></ion-icon>
                </ion-fab-button>
                <ion-fab-list side="top">
                    <ion-fab-button id="open-modal" v-if="familyOwner">
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
