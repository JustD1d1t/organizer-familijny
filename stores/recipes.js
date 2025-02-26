import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()
import { useUserStore } from "./user"

export const useRecipesStore = defineStore({
    id: "recipes-store",
    state: () => {
        return {
            recipes: [],
            currentRecipe: null,
            isLoading: false,
            user: useUserStore(),
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
        setCurrentRecipe(recipe) {
            this.currentRecipe = recipe
        },
        async getRecipes() {
            this.setLoading(true)
            try {
                const data = await request(
                    `${backendUrl}/recipes/get-all?userId=${this.user.uid}`
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
