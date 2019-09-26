import React from 'react';
import { PickerIOSItemProps, ViewProps } from "react-native";

interface IWheelCurvedChangeEvent {
    nativeEvent: {
        data: any;
    }
}

export type WheelCurvedChangeCallback = (event: IWheelCurvedChangeEvent) => void;

export interface IWheelCurvedPickerOwnProps extends ViewProps {
    children: Array<React.ReactElement<PickerIOSItemProps>>;
    onValueChange: (value: any) => void;
    data: any[];
    textColor?: string;
    textSize?: number;
    itemSpace?: number;
    selectedValue?: any;
    selectedIndex?: number;
}

export type IPickerItemProps = PickerIOSItemProps;

export interface IWheelCurvedStatic {
    Item: React.ElementType<IPickerItemProps>;
}
