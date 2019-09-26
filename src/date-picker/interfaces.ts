import { DatePickerIOSProps } from "react-native";

export interface ILabelUnit {
    year: string;
    month: string;
    date: string;
}

export interface IDatePickerProps extends DatePickerIOSProps {
    labelUnit?: ILabelUnit;
    order?: string;
    textColor?: string;
    textSize?: number;
    itemSpace?: number;
}
