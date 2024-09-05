import { Toast } from "@capacitor/toast"
import { Dialog } from "@capacitor/dialog"

export const useAlerts = () => {
    const displayToast = async (message) => {
        await Toast.show({
            text: message,
        })
    }

    const showAlert = async (title, message) => {
        await Dialog.alert({
            title,
            message,
        })
    }

    const showConfirm = async (title, message) => {
        const { value } = await Dialog.confirm({
            title,
            message,
        })
        if (value) {
            return true
        }
        return false
    }

    const showPrompt = async (title, message) => {
        const { value, cancelled } = await Dialog.prompt({
            title,
            message,
        })
    }

    return {
        displayToast,
        showAlert,
        showConfirm,
        showPrompt,
    }
}
