import { alertController, toastController } from "@ionic/vue"

export const useAlerts = () => {
    const openToast = async (message, type = "success", duration = 2000) => {
        const toast = await toastController.create({
            message,
            duration,
            cssClass: type === "danger" ? "danger-toast" : "success-toast",
        })

        await toast.present()
    }

    const openAlert = async (
        message,
        header = "Alert",
        confirmClass,
        onConfirm
    ) => {
        const alert = await alertController.create({
            header,
            message,
            buttons: [
                {
                    text: "Anuluj",
                    role: "cancel",
                },
                {
                    text: "Potwierdź",
                    cssClass: confirmClass,
                    handler: () => {
                        if (onConfirm && typeof onConfirm === "function") {
                            onConfirm()
                        }
                    },
                },
            ],
        })

        await alert.present()
    }

    return {
        openAlert,
        openToast,
    }
}
