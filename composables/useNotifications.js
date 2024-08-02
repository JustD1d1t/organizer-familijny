const { addDocument } = useFirebase()
const sendNotification = async (message, userId) => {
    const addNotificationResponse = await addDocument(
        ["notifications", "users", userId],
        message
    )
    return addNotificationResponse._key.path.segments[3]
}

export const useNotifications = () => {
    return {
        sendNotification,
    }
}
