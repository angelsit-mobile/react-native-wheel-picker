import React, { useEffect, useState } from 'react';
import { requireNativeComponent } from "react-native";
import {
    IPickerItemProps,
    IWheelCurvedPickerOwnProps,
    IWheelCurvedStatic,
    WheelCurvedChangeCallback
} from "./interfaces";
import PickerItemAndroid from "./picker-item-android";

const WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker');

const WheelCurvedPickerAndroid: React.FC<IWheelCurvedPickerOwnProps> & IWheelCurvedStatic = (props) => {
    const [ items, setItems ] = useState<IPickerItemProps[]>([]);
    const [ selectedIndex, setSelectedIndex ] = useState(0);

    const { children, onValueChange, ...rest } = props;

    useEffect(() => {
        if (!children || !children.length) {
            return;
        }

        let newSelectedIndex = 0;

        const newItems: IPickerItemProps[] = children.map((child, index) => {
            const { props: { label, value } } = child;

            if (value === props.selectedValue) {
                newSelectedIndex = index;
            }

            return { value, label };
        });

        setItems(newItems);
        setSelectedIndex(newSelectedIndex);
    }, [ children ]);

    const handleValueChange = React.useCallback<WheelCurvedChangeCallback>(({ nativeEvent: { data } }) => {
        onValueChange && onValueChange(data);
    }, [ onValueChange ]);

    return (
        <WheelCurvedPickerNative
            {...rest}
            onValueChange={handleValueChange}
            data={items}
            selectedIndex={selectedIndex}
        />
    );
};

WheelCurvedPickerAndroid.Item = React.memo(PickerItemAndroid);
export default WheelCurvedPickerAndroid;
