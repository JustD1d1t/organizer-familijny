<script setup>
import { StateEntries } from "@/types"

const props = defineProps({
    members: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(["toggleMember"])

const uid = localStorage.getItem("uid")
const familyMembersStore = useFamilyMembersStore()
const { familyMembersDetails, familyMembers } = storeToRefs(familyMembersStore)

const membersToShow = computed(() => {
    return familyMembersDetails.value.filter(
        (member) =>
            member.status === "accepted" &&
            familyMembers.value.includes(member.id) &&
            member.id !== uid
    )
})

const handleMember = (e) => {
    const members = e.target.value
    members.forEach((member) => {
        emit("toggleMember", member)
    })
}
</script>
<template>
    <ion-item>
        <ion-select
            label="Wybierz osoby które mają dostęp"
            placholder="Wybierz osoby"
            label-placement="floating"
            :multiple="true"
            @ionChange="handleMember($event)"
            v-model="membersToShow"
        >
            <ion-select-option
                v-for="member in membersToShow"
                :key="member.id"
                :value="member"
            >
                {{ member.nickname }}&nbsp;
                <small> ({{ member.email }})</small>
            </ion-select-option>
        </ion-select>
    </ion-item>
    <!-- <ion-accordion-group v-if="familyMembers.length && familyMembersDetails.length > 1">
        <ion-accordion value="first" class="custom-accordion">
            <ion-item slot="header" color="light" @click="() => {}">
                <p>Wybierz osoby które mają dostęp</p>
            </ion-item>
            <ion-list class="ion-padding" slot="content">
                <ion-item
                    v-for="member in membersToShow"
                    :key="member.id"
                    @ionChange="() => handleMember(member)"
                >
                    <ion-checkbox
                        slot="start"
                        class="mr-4"
                        aria-label="Toggle task completion"
                        :checked="props.members.some((m) => m === member.id)"
                    ></ion-checkbox>
                    {{ member.nickname }}&nbsp;
                    <small> ({{ member.email }})</small>
                </ion-item>
            </ion-list>
        </ion-accordion>
    </ion-accordion-group> -->
</template>

<style lang="scss" scoped>
ion-accordion {
    ion-item {
        &::part(native) {
            background: transparent;
        }
    }
}
</style>
