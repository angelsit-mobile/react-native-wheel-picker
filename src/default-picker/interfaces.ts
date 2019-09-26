import { PickerIOSProps } from "react-native";

export interface IDefaultPickerOwnProps extends PickerIOSProps {
    textColor?: string;
    textSize?: number;
    itemSpace?: number;
    pickerData: any[];
}