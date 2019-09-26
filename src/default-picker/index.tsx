import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, ReactElement } from 'react';
import WheelCurvedPicker from '../wheel-curved-picker';
import styles from './styles';
import { IDefaultPickerOwnProps } from "./interfaces";
import { PickerIOSItemProps } from "react-native";

const PickerItem = WheelCurvedPicker.Item;

export interface IPickerRefMethods {
    setSelectedValue: (value?: number | string) => void;
}

const PickerWithRef: React.FC<IDefaultPickerOwnProps> = (props, ref) => {
    const { pickerData, style, onValueChange, ...rest } = props;
    const [ selectedValue, setSelectedValue ] = useState(props.selectedValue);

    useImperativeHandle<IPickerRefMethods, IPickerRefMethods>(ref, () => ({
        setSelectedValue,
    }), [ setSelectedValue ]);

    useEffect(() => {
        selectedValue !== props.selectedValue && setSelectedValue(props.selectedValue);
    }, [ selectedValue, props.selectedValue ]);

    const handleChange = useCallback((newValue) => {
        setSelectedValue(newValue);
        onValueChange && onValueChange(newValue);
    }, []);

    const renderItems = () => pickerData.map((data, index): ReactElement<PickerIOSItemProps> => {
        const value = typeof data.value !== 'undefined' ? data.value : data;
        const label = typeof data.label !== 'undefined' ? data.label : data.toString();

        return (
            <PickerItem
                key={String(value) + index}
                value={value}
                label={label}
            />
        );
    });

    return (
        <WheelCurvedPicker
            {...rest}
            data={pickerData}
            style={[styles.picker, style]}
            selectedValue={selectedValue}
            onValueChange={handleChange}
        >
            {renderItems()}
        </WheelCurvedPicker>
    );
};

const Picker = forwardRef<IPickerRefMethods, IDefaultPickerOwnProps>(PickerWithRef);
export default Picker;
