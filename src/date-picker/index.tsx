import React from "react";
import { Platform } from "react-native";
import DatePickerIOS from './date-picker-ios';
import DatePickerAndroid from './date-picker-android';
import { IDatePickerProps } from "./interfaces";

const DatePicker = Platform.select({
    ios: DatePickerIOS,
    android: DatePickerAndroid,
});

export default DatePicker as React.FC<IDatePickerProps>;
