import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetch()
const uid = localStorage.getItem("uid")

export const useRecipesStore = defineStore({
    id: "recipes-store",
    state: () => {
        return {
            recipes: [],
            isLoading: false,
        }
    },
    actions: {
        setRecipes(recipes) {
            this.recipes = [...recipes]
        },
        clearRecipes() {
            this.recipes = []
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        async getRecipes() {
            this.setLoading(true)
            try {
                const data = await request(
                    `${backendUrl}/recipes/get-all?userId=${uid}`
                )
                this.setRecipes(data.recipes)
            } catch (error) {
                console.error("Failed to fetch recipes:", error)
            } finally {
                this.setLoading(false)
            }
        },
        async deleteRecipe(recipeId) {
            this.setLoading(true)
            await request(`${backendUrl}/recipes/delete?recipeId=${recipeId}`, {
                method: "DELETE",
            })
            this.setLoading(false)
            this.recipes = this.recipes.filter(
                (recipe) => recipe.id !== recipeId
            )
        },
        async addRecipe(recipe) {
            this.setLoading(true)
            const data = await request(`${backendUrl}/recipes/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipe,
                    userId: uid,
                }),
            })
            this.setLoading(false)
            this.recipes.push({
                ...recipe,
                id: data.id,
            })
        },
    },
})
