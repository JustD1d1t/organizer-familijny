export * from "./enums"
export {}
declare global {
    type SomeType = [boolean, string, number]

    interface Expense {
        name: string
        value: string
        timestamp: string
        shop: string
        userId: string
        id?: string
        category: string
    }

    interface PantryItem {
        name: string
        quantity: number
        checked: boolean
    }

    interface Pantry {
        collaborators: object[]
        collaboratorsIds: string[]
        items: PantryItem[]
        name: string
        ownerId: string
        id?: string
    }
}
