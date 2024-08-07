import { defineStore } from "pinia"
import { getAuth } from "firebase/auth"
const auth = getAuth()
const { backendUrl } = useConfig()

export const useRecipesStore = defineStore({
    id: "recipes-store",
    state: () => {
        return {
            recipes: [],
        }
    },
    actions: {
        setRecipes(recipes) {
            this.recipes = [...recipes]
        },
        async getRecipes() {
            const response = await fetch(
                `${backendUrl}/recipes/get-all?userId=${auth.currentUser.uid}`
            )
            const data = await response.json()
            this.setRecipes(data.recipes)
        },
        async deleteRecipe(recipeId) {
            await fetch(`${backendUrl}/recipes/delete?recipeId=${recipeId}`, {
                method: "DELETE",
            })
            this.recipes = this.recipes.filter(
                (recipe) => recipe.id !== recipeId
            )
        },
        async addRecipe(recipe) {
            const response = await fetch(`${backendUrl}/recipes/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipe,
                    userId: auth.currentUser.uid,
                }),
            })
            const data = await response.json()
            this.recipes.push({
                ...recipe,
                id: data.id,
            })
        },
    },
})
