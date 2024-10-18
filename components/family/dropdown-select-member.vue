<script setup>
const props = defineProps({
    members: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(["toggleMember"])
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)
const familyMembersStore = useFamilyMembersStore()
const { familyMembersDetails, familyMembers } = storeToRefs(familyMembersStore)

const membersToShow = computed(() => {
    return familyMembersDetails.value.filter(
        (member) =>
            member.status === "accepted" &&
            familyMembers.value.includes(member.id) &&
            member.id !== uid.value
    )
})

const handleMember = (e) => {
    const membersIds = e.target.value
    const members = familyMembersDetails.value.filter((member) =>
        membersIds.includes(member.id)
    )
    emit("toggleMember", membersIds, members)
}

const selectedMembers = computed(() => {
    return props.members.map((member) => {
        // w expense mamy tylko id
        return member.id ?? member
    })
})
</script>
<template>
    <ion-item v-if="membersToShow.length">
        <ion-select
            label="Wybierz osoby które mają dostęp"
            placholder="Wybierz osoby"
            label-placement="stacked"
            placeholder="--- Wybierz osoby ---"
            :multiple="true"
            @ionChange="handleMember($event)"
            :value="selectedMembers"
        >
            <ion-select-option
                v-for="member in membersToShow"
                :key="member.id"
                :value="member.id"
            >
                {{ member.nickname }}&nbsp;
                <small> ({{ member.email }})</small>
            </ion-select-option>
        </ion-select>
    </ion-item>
</template>
