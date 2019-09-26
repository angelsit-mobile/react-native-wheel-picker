import React from 'react';
import { DatePickerIOS, DatePickerIOSProps } from "react-native";

const DatePicker: React.FC<DatePickerIOSProps> = (props) => {
    const {
        mode = 'date',
        date = new Date(),
        ...rest
    } = props;

    return <DatePickerIOS mode={mode} date={date} {...rest} />;
};

export default React.memo(DatePicker);
