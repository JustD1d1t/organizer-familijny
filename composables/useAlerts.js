import { Toast } from "@capacitor/toast"
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

    const showConfirm = async () => {
        const { value } = await Dialog.confirm({
            title,
            message,
        })

        console.log("Confirmed:", value)
    }

    const showPrompt = async (title, message) => {
        const { value, cancelled } = await Dialog.prompt({
            title,
            message,
        })

        console.log("Name:", value)
        console.log("Cancelled:", cancelled)
    }

    return {
        displayToast,
        showAlert,
        showConfirm,
        showPrompt,
    }
}
