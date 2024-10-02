import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()

const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

export const useFamilyMembersStore = defineStore({
    id: "family-members-store",
    state: () => {
        return {
            familyMembers: [],
            familyMembersDetails: [],
            familyId: null,
            isLoading: false,
        }
    },
    actions: {
        setFamilyMembers(notifications) {
            this.notifications = [...notifications]
        },
        setFamilyMembersDetails(familyMembersDetails) {
            this.familyMembersDetails = [...familyMembersDetails]
        },
        setFamilyId(familyId) {
            this.familyId = familyId
        },
        clearFamilyMembers() {
            this.familyMembers = []
            this.familyMembersDetails = []
            this.familyId = null
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        async updateMembers(
            membersDetails,
            members = this.familyMembers,
            familyId
        ) {
            this.setLoading(true)
            await request(`${backendUrl}/family/update-members`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    membersDetails,
                    members,
                    familyId: this.familyId ?? uid.value,
                }),
            })
            this.setLoading(false)
            this.familyMembers = members
            this.familyMembersDetails = membersDetails
        },
        async getFamilyDetails(id) {
            this.setLoading(true)
            const data = await request(
                `${backendUrl}/family/get-family-details?familyId=${
                    id ?? uid.value
                }`
            )
            this.setLoading(false)
            if (data && data.members) {
                this.familyMembers = data.members
                this.familyMembersDetails = data.membersDetails
                this.familyId = data.familyId
            }
        },
        async removeFamily() {
            this.setLoading(true)
            await request(`${backendUrl}/family/remove-family`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    familyId: uid.value,
                }),
            })
            this.setLoading(false)
            this.clearFamilyMembers()
        },
        async leaveFamily(membersDetails, members) {
            this.setLoading(true)
            await request(`${backendUrl}/family/leave-family`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    membersDetails,
                    members,
                    familyId: this.familyId ?? uid.value,
                }),
            })
            this.setLoading(false)
            this.clearFamilyMembers()
        },
        async createFamily(membersDetails) {
            this.setLoading(true)
            await request(`${backendUrl}/family/create-family`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    membersDetails,
                    familyId: uid.value,
                }),
            })
            this.setLoading(false)
            this.familyMembers = [uid.value]
            this.familyMembersDetails = membersDetails
            this.familyId = uid.value
        },
    },
})
