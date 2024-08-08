import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetch()
const uid = localStorage.getItem("uid")

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
            const data = await request(
                `${backendUrl}/recipes/get-all?userId=${uid}`
            )
            this.setRecipes(data.recipes)
        },
        async deleteRecipe(recipeId) {
            await request(`${backendUrl}/recipes/delete?recipeId=${recipeId}`, {
                method: "DELETE",
            })
            this.recipes = this.recipes.filter(
                (recipe) => recipe.id !== recipeId
            )
        },
        async addRecipe(recipe) {
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
            this.recipes.push({
                ...recipe,
                id: data.id,
            })
        },
    },
})
