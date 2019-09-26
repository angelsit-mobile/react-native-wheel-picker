import * as React from 'react';
import { View } from "react-native";
import moment from "moment";
import styles from './styles';
import { IDatePickerProps } from "./interfaces";
import Picker from "../default-picker";
import { IPickerItemProps } from "../wheel-curved-picker/interfaces";

interface IDateObject {
    date: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
}

const DatePicker: React.FC<IDatePickerProps> = (props) => {
    const parseDate = (date?: Date) => {
        const momentDate = moment(date);

        return [ 'year', 'month', 'date', 'hour', 'minute' ].reduce<IDateObject>((accumulator, current) => ({
            ...accumulator,
            [current]: momentDate.get(current as any),
        }), {} as any);
    };

    const datePickerRef = React.useRef<any>(null);
    const monthPickerRef = React.useRef<any>(null);
    const yearPickerRef = React.useRef<any>(null);
    const hourPickerRef = React.useRef<any>(null);
    const minutePickerRef = React.useRef<any>(null);

    const {
        labelUnit = { year: '', month: '', date: '' },
        order = 'D-M-Y',
        mode = 'date',
        maximumDate = moment().add(10, 'years').toDate(),
        minimumDate = moment().add(-10, 'years').toDate(),
        date = new Date(),
        textColor = '#333',
        textSize = 26,
        itemSpace = 20,
        style,
    } = props;

    const [ stateDate, setStateDate ] = React.useState();
    const [ stateValue, setStateValue ] = React.useState<IDateObject>(parseDate(date));
    const [ dayRange, setDayRange ] = React.useState<IPickerItemProps[]>([]);
    const [ monthRange, setMonthRange ] = React.useState<IPickerItemProps[]>([]);
    const [ yearRange, setYearRange ] = React.useState<IPickerItemProps[]>([]);

    React.useEffect(() => {
        const momentDate = moment(date);
        setDayRange(getDateRange(momentDate.daysInMonth()));

        const minimalYear = minimumDate.getFullYear();
        const maximalYear = maximumDate.getFullYear();

        const newMonthRange = [];
        const newYearRange = [];

        for (let i = 1; i <= 12; i += 1) {
            newMonthRange.push({ value: i, label: `${i}${labelUnit.month}` });
        }

        newYearRange.push({ value: minimalYear, label: `${minimalYear}${labelUnit.year}` });
        for (let i = minimalYear + 1; i <= maximalYear; i += 1) {
            newYearRange.push({ value: i, label: `${i}${labelUnit.year}` });
        }

        setMonthRange(newMonthRange);
        setYearRange(newYearRange);
    }, []);

    React.useEffect(() => {
        setStateDate(parseDate(date));
    }, [ date ]);

    const getValue = (): Date => {
        const { year, month, date, hour, minute } = stateValue;
        const nextDate = new Date(year, month, date, hour, minute);

        if (nextDate < minimumDate) {
            return minimumDate;
        }

        return nextDate > maximumDate ? maximumDate : nextDate;
    };

    const getDateRange = (dayNum: number) => {
        const days: IPickerItemProps[] = [];

        for (let i = 1; i <= dayNum; i += 1) {
            days.push({ value: i, label: `${i}${labelUnit.date}` });
        }

        return days;
    };

    const checkDate = (oldYear?: number, oldMonth?: number) => {
        const { date: currentDay, month: currentMonth, year: currentYear } = stateValue;

        const newValue = { ...stateValue };
        let dateRange = dayRange;
        let dayNum = dateRange.length;

        if (oldMonth !== currentMonth || oldYear !== currentYear) {
            dayNum = moment(`${currentYear}-${currentMonth + 1}`, 'YYYY-MM').daysInMonth();
        }

        if (dayNum !== dateRange.length && datePickerRef) {
            dateRange = getDateRange(dayNum);

            if (currentDay > dayNum && datePickerRef.current) {
                newValue.date = dayNum;
                datePickerRef.current.setSelectedValue(dayNum);
            }

            setDayRange(dateRange);
        }

        const unit = mode === 'date' ? 'day' : undefined;
        const current = { ...stateValue, date: newValue.date };

        let currentTime = moment(current);
        const min = moment(minimumDate);
        const max = moment(maximumDate);

        let isCurrentTimeChanged = false;

        if (currentTime.isBefore(min, unit)) {
            [ currentTime, isCurrentTimeChanged ] = [ min, true ];
        } else if (currentTime.isAfter(max, unit)) {
            [ currentTime, isCurrentTimeChanged ] = [ max, true ];
        }

        if (isCurrentTimeChanged) {
            monthPickerRef.current && monthPickerRef.current.setSelectedValue(currentTime.get('month') + 1);
            yearPickerRef.current && yearPickerRef.current.setStateValue(currentTime.get('year'));
            datePickerRef.current && datePickerRef.current.setStateValue(currentTime.get('date'));
            hourPickerRef.current && hourPickerRef.current.setStateValue(currentTime.get('hour'));
            minutePickerRef.current && minutePickerRef.current.setStateValue(currentTime.get('minute'));
        }
    };

    const handleDayChange = React.useCallback((date: number) => {
        setStateValue(value => ({ ...value, date }));
        checkDate(stateValue.year, stateValue.month);
        props.onDateChange && props.onDateChange(getValue());
    }, [ setStateValue, stateValue, props.onDateChange ]);

    const handleMonthChange = React.useCallback((month: number) => {
        setStateValue(value => ({ ...value, month }));
        checkDate(stateValue.year, stateValue.month);
        props.onDateChange && props.onDateChange(getValue());
    }, [ setStateValue, stateValue, props.onDateChange ]);

    const handleYearChange = React.useCallback((year: number) => {
        setStateValue(value => ({ ...value, year }));
        checkDate(year, stateValue.month);
        props.onDateChange && props.onDateChange(getValue());
    }, [ setStateValue, stateValue, props.onDateChange ]);

    const handleHourChange = React.useCallback((hour: number) => {
        setStateValue(value => ({ ...value, hour }));
        props.onDateChange && props.onDateChange(getValue());
    }, [ setStateValue, props.onDateChange ]);

    const handleMinuteChange = React.useCallback((minute: number) => {
        setStateValue(value => ({ ...value, minute }));
        props.onDateChange && props.onDateChange(getValue());
    }, [ setStateValue, props.onDateChange ]);

    const renderDatePicker = () => {
        if (!order.includes('D') && !order.includes('M') && !order.includes('Y')) {
            throw new Error(`WheelDatePicker: you are using order prop wrong, default value is 'D-M-Y'`);
        }

        return order.split('-').map((key) => {
            switch (key) {
                case 'D':
                    return (
                        <View key='date' style={styles.picker}>
                            <Picker
                                itemSpace={itemSpace}
                                textColor={textColor}
                                textSize={textSize}
                                style={style}
                                ref={datePickerRef}
                                selectedValue={stateDate.getDate()}
                                pickerData={dayRange}
                                onValueChange={handleDayChange}
                            />
                        </View>
                    );
                case 'M':
                    return (
                        <View key='month' style={styles.picker}>
                            <Picker
                                itemSpace={itemSpace}
                                textColor={textColor}
                                textSize={textSize}
                                style={style}
                                ref={monthPickerRef}
                                selectedValue={stateDate.getMonth() + 1}
                                pickerData={monthRange}
                                onValueChange={handleMonthChange}
                            />
                        </View>
                    );
                case 'Y':
                    return (
                        <View key='year' style={styles.picker}>
                            <Picker
                                itemSpace={itemSpace}
                                textColor={textColor}
                                textSize={textSize}
                                style={style}
                                ref={yearPickerRef}
                                selectedValue={stateDate.getFullYear()}
                                pickerData={yearRange}
                                onValueChange={handleYearChange}
                            />
                        </View>
                    );

                default:
                    return null;
            }
        })
    };

    const renderTimePicker = () => {
        const [ hours, minutes ]: number[][] = [ [], [] ];

        for (let i = 0; i <= 24; i += 1) {
            hours.push(i);
        }

        for (let i = 0; i <= 59; i += 1) {
            minutes.push(i);
        }

        return [
            <View key='hour' style={styles.picker}>
                <Picker
                    ref={hourPickerRef}
                    itemSpace={itemSpace}
                    textColor={textColor}
                    textSize={textSize}
                    style={style}
                    selectedValue={date.getHours()}
                    pickerData={hours}
                    onValueChange={handleHourChange}
                />
            </View>,
            <View key='minute' style={styles.picker}>
                <Picker
                    ref={minutePickerRef}
                    itemSpace={itemSpace}
                    textColor={textColor}
                    textSize={textSize}
                    style={style}
                    selectedValue={date.getMinutes()}
                    pickerData={minutes}
                    onValueChange={handleMinuteChange}
                />
            </View>,
        ];
    };

    return (
        <View style={styles.row}>
            {[ 'date', 'datetime' ].includes(mode) && renderDatePicker()}
            {[ 'time', 'datetime' ].includes(mode) && renderTimePicker()}
        </View>
    );
};

export default React.memo(DatePicker);
