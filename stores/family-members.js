import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetch()

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
        async updateMembers(membersDetails, members = this.familyMembers) {
            this.setLoading(true)
            await request(`${backendUrl}/family/update-members`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    membersDetails,
                    members,
                    familyId: localStorage.getItem("uid"),
                }),
            })
            this.setLoading(false)
            this.familyMembers = members
            this.familyMembersDetails = membersDetails
        },
        async getFamilyDetails() {
            this.setLoading(true)
            const data = await request(
                `${backendUrl}/family/get-family-details?familyId=${localStorage.getItem("uid")}`
            )
            this.setLoading(false)
            if (data.members) {
                this.familyMembers = data.members
                this.familyMembersDetails = data.membersDetails
                this.familyId = localStorage.getItem("uid")
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
                    familyId: localStorage.getItem("uid"),
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
                    familyId: localStorage.getItem("uid"),
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
                    familyId: localStorage.getItem("uid"),
                }),
            })
            this.setLoading(false)
            this.familyMembers = [localStorage.getItem("uid")]
            this.familyMembersDetails = membersDetails
            this.familyId = localStorage.getItem("uid")
        },
    },
})
