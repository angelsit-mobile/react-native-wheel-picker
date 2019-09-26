import * as React from "react";
import { PickerIOS } from "react-native";
import { IWheelCurvedPickerOwnProps, IWheelCurvedStatic } from "./interfaces";

const WheelCurvedPickerIOS: React.FC<IWheelCurvedPickerOwnProps> & IWheelCurvedStatic = (props) => {
    return <PickerIOS {...props} />;
};

WheelCurvedPickerIOS.Item = PickerIOS.Item;

export default WheelCurvedPickerIOS;
