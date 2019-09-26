import WheelCurvedPickerIOS from './wheel-curved-picker-ios';
import WheelCurvedPickerAndroid from "./wheel-curved-picker-android";
import { Platform } from "react-native";

const WheelCurvedPicker = Platform.select({
    ios: WheelCurvedPickerIOS,
    android: WheelCurvedPickerAndroid,
});

export default WheelCurvedPicker;
