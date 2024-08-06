import { defineStore } from "pinia"
const { addDocument, deleteDocument, updateDocument, queryDocsInCollection } =
    useFirebase()
import { getAuth } from "firebase/auth"
const auth = getAuth()
const { backendUrl } = useConfig()

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
            const response = await fetch(
                `${backendUrl}/family/update-members`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        membersDetails,
                        members,
                        familyId: auth.currentUser.uid,
                    }),
                }
            )
            if (response.status !== 200) {
                throw new Error("Failed to remove family member")
            }
            this.familyMembers = members
            this.familyMembersDetails = membersDetails
        },
        async getFamilyDetails() {
            const response = await fetch(
                `${backendUrl}/family/get-family-details?familyId=${auth.currentUser.uid}`
            )
            if (response.status !== 200) {
                throw new Error("Failed to get family details")
            }
            const data = await response.json()
            if (data.members) {
                this.familyMembers = data.members
                this.familyMembersDetails = data.membersDetails
                this.familyId = auth.currentUser.uid
            }
        },
        async removeFamily() {
            const response = await fetch(`${backendUrl}/family/remove-family`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    familyId: auth.currentUser.uid,
                }),
            })
            if (response.status !== 200) {
                throw new Error("Failed to remove family")
            }
            this.clearFamilyMembers()
        },
        async leaveFamily(membersDetails, members) {
            const response = await fetch(`${backendUrl}/family/leave-family`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    membersDetails,
                    members,
                    familyId: auth.currentUser.uid,
                }),
            })
            if (response.status !== 200) {
                throw new Error("Failed to leave family")
            }
            this.clearFamilyMembers()
        },
        async createFamily(membersDetails) {
            const response = await fetch(`${backendUrl}/family/create-family`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    membersDetails,
                    familyId: auth.currentUser.uid,
                }),
            })
            if (response.status !== 200) {
                throw new Error("Failed to create family")
            }
            this.familyMembers = [auth.currentUser.uid]
            this.familyMembersDetails = membersDetails
            this.familyId = auth.currentUser.uid
        },
    },
})
