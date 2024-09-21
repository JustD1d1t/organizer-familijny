import { alertController, toastController } from "@ionic/vue"

export const useAlerts = () => {
    const openToast = async (message, type = "success", duration = 1000) => {
        const toast = await toastController.create({
            message,
            duration,
            cssClass: type === "danger" ? "danger-toast" : "success-toast",
        })

        await toast.present()
    }

    const openAlert = async (
        header = "Alert",
        message,
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

    const openInfoModal = async (header, message) => {
        const alert = await alertController.create({
            header,
            message,
            buttons: [
                {
                    text: "OK",
                    role: "cancel",
                },
            ],
        })

        await alert.present()
    }

    const openDecideModal = async (
        header,
        message,
        onConfirm,
        onSecondConfirm,
        buttonText,
        secondButtonText
    ) => {
        const alert = await alertController.create({
            header,
            message,
            buttons: [
                {
                    text: buttonText ?? "Anuluj",
                    role: "cancel",
                    handler: () => {
                        if (onConfirm && typeof onConfirm === "function") {
                            onConfirm()
                        }
                    },
                },
                {
                    text: secondButtonText ?? "Potwierdź",
                    cssClass: "danger",
                    handler: () => {
                        if (
                            onSecondConfirm &&
                            typeof onSecondConfirm === "function"
                        ) {
                            onSecondConfirm()
                        }
                    },
                },
            ],
        })

        await alert.present()
    }

    return {
        openAlert,
        openDecideModal,
        openInfoModal,
        openToast,
    }
}
