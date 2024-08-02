import { KeyboardResize, KeyboardStyle } from "@capacitor/keyboard"

const config = {
    plugins: {
        Keyboard: {
            resize: KeyboardResize.Body,
            style: KeyboardStyle.Dark,
            resizeOnFullScreen: true,
        },
    },
}

export default config
