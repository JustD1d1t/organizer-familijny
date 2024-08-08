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
        async updateMembers(membersDetails, members = this.familyMembers) {
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
            this.familyMembers = members
            this.familyMembersDetails = membersDetails
        },
        async getFamilyDetails() {
            const data = await request(
                `${backendUrl}/family/get-family-details?familyId=${localStorage.getItem("uid")}`
            )
            console.log(data)
            if (data.members) {
                this.familyMembers = data.members
                this.familyMembersDetails = data.membersDetails
                this.familyId = localStorage.getItem("uid")
            }
        },
        async removeFamily() {
            await request(`${backendUrl}/family/remove-family`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    familyId: localStorage.getItem("uid"),
                }),
            })
            this.clearFamilyMembers()
        },
        async leaveFamily(membersDetails, members) {
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
            this.clearFamilyMembers()
        },
        async createFamily(membersDetails) {
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
            this.familyMembers = [localStorage.getItem("uid")]
            this.familyMembersDetails = membersDetails
            this.familyId = localStorage.getItem("uid")
        },
    },
})
