import { ref } from "vue"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { Preferences } from "@capacitor/preferences"

const PHOTO_STORAGE = "photos"

export const usePhotoGallery = () => {
    const photos = ref([])

    const loadSaved = async () => {
        const { value } = await Preferences.get({ key: PHOTO_STORAGE })
        const photosInStorage = (value ? JSON.parse(value) : []) || []

        // Dodaj nowe zdjęcie do listy, jeśli nie istnieje jeszcze w photos.value
        photosInStorage.forEach((photo) => {
            const exists = photos.value.some(
                (p) => p.filepath === photo.filepath
            )
            if (!exists) {
                photos.value.unshift(photo)
            }
        })

        // Ustaw photos.value na aktualną listę zdjęć
        photos.value = photosInStorage
    }

    const selectPhotoFromGallery = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos,
                width: 600,
                correctOrientation: true,
            })
            return image
        } catch (error) {
            console.error("Error selecting photo", error)
        }
    }

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
            quality: 80,
            width: 600,
            correctOrientation: true,
        })

        if (photo && photo.dataUrl) {
            const savedFileImage = await savePhoto(photo)
            photos.value = [savedFileImage, ...photos.value]
            await Preferences.set({
                key: PHOTO_STORAGE,
                value: JSON.stringify(photos.value),
            })

            // Zwróć obiekt z webviewPath dla dalszej obróbki
            return {
                webviewPath: photo.dataUrl,
                ...photo, // Możesz również zwrócić inne dane z obiektu `photo`, jeśli są potrzebne
            }
        } else {
            console.warn("Nie udało się pobrać zdjęcia.")
            return null // Możesz zwrócić null lub rzucać błąd, jeśli to lepiej pasuje do logiki Twojej aplikacji
        }
    }

    const photoFromCamera = async () => {
        try {
            const photo = await takePhoto()

            if (photo && photo.webviewPath) {
                photos.value = []

                photos.value.push({
                    webviewPath: photo.webviewPath,
                    document: document.value,
                })
                return {
                    pb64: photo.dataUrl.split(",")[1],
                    doc: {
                        title: "New Photo",
                        description: "Photo taken with the app",
                        timestamp: new Date(),
                    },
                }
            } else {
                console.warn(
                    "Nieprawidłowe zdjęcie zwrócone lub zdjęcie zostało anulowane."
                )
            }
        } catch (error) {
            console.error("Error adding photo", error)
        }
    }

    const selectPhotoFromData = async () => {
        try {
            const photo = await selectPhotoFromGallery()
            if (photo && photo.dataUrl) {
                photos.value = []

                photos.value.push({
                    webviewPath: photo.dataUrl,
                    document: document.value,
                })
                return {
                    pb64: photo.dataUrl.split(",")[1],
                    doc: {
                        title: "New Photo",
                        description: "Photo taken with the app",
                        timestamp: new Date(),
                    },
                }
            } else {
                console.warn(
                    "Nieprawidłowe zdjęcie zwrócone lub zdjęcie zostało anulowane."
                )
            }
        } catch (error) {
            console.error("Error selecting photo", error)
        }
    }

    const savePhoto = async (photo) => {
        const base64Data = await fetch(photo.webPath).then((res) => res.blob())
        const reader = new FileReader()
        reader.readAsDataURL(base64Data)
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                resolve({
                    filepath: new Date().getTime() + ".jpeg",
                    webviewPath: photo.webPath,
                })
            }
            reader.onerror = reject
        })
    }

    return {
        photos,
        loadSaved,
        photoFromCamera,
        selectPhotoFromData,
    }
}
