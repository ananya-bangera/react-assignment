import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, Pressable, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function AllShiftsScreen({shifts, setShifts}) {
    
    const [allshifts, setAllShifts] = useState();
    const [categories, setCategories] = useState([]);
    const [data, setdata] = useState([
        { label: 'Helsinki', value: 0 },
        { label: 'Turku', value: 0 },
        { label: 'Tampere', value: 0 },
    ]);
    let items = [];
    const start1 = new Date(Date.now());
    const options1 = { month: 'long', day: 'numeric' };
    const today = start1.toLocaleDateString('en-US', options1)
    const yesterdayst = new Date(Date.now() - 86400000);
    const yesterday = yesterdayst.toLocaleDateString('en-US', options1);

    console.log("init");

    const bookShift = (id) => {
        console.log(id);

        axios.get(`http://192.168.1.4:8082/shifts/${id}/book`).then(response => response.data
        ).then(data => setShifts(shifts.map((shift) => {
            console.log(data);
            if (shift.id === id) {
                return { ...shift, booked: true }
            }
            else if (data.endTime > shift.startTime && data.startTime < shift.endTime) {
                return { ...shift, notPossible: true }
            }
            else return shift
        }))).catch((error) => console.error(error))



    }
    const cancelShift = (id) => {
        console.log(id);

        axios.get(`http://192.168.1.4:8082/shifts/${id}/cancel`).then(response => response.data
        ).then(data => setShifts(shifts.map((shift) => {
            if (shift.id === id) {
                return { ...shift, booked: false }
            }
            else if (data.endTime > shift.startTime && data.startTime < shift.endTime) {
                return { ...shift, notPossible: false }
            }
            else return shift
        }))).catch((error) => console.error(error))

    }

    const getShiftData = () => {

        axios.get('http://192.168.1.4:8082/shifts')
            .then(response => response.data)

            .then((json) => {
                setShifts(json.map((shift) => ({
                    ...shift,
                    notPossible: false,
                    startDate: new Date(shift.startTime),
                    endDate: new Date(shift.endTime),

                })));
                setAllShifts(json.map((shift) => ({
                    ...shift,
                    notPossible: false,
                    startDate: new Date(shift.startTime),
                    endDate: new Date(shift.endTime),

                })));
                setCategories(Array.from(new Set(json.map
                    (shift => {
                        const start = new Date(shift.startTime);

                        // Using toLocaleDateString() with options
                        const options = { month: 'long', day: 'numeric' };
                        const formattedDate = start.toLocaleDateString('en-US', options);
                        return formattedDate
                    }))));

                items = json;
            })
            .then(() => {
                const areaCounts = items.reduce((counts, shift) => {
                    const areaIndex = data.findIndex(item => item.label === shift.area);
                    if (areaIndex !== -1) {
                        counts[areaIndex]++;
                    }
                    return counts;
                }, new Array(data.length).fill(0));

                // Update state with the counts
                setdata(prevData => prevData.map((item, index) => ({
                    index: index,
                    name: item.label,
                    label: item.label + " ( " + areaCounts[index] + " )",
                })));
                console.log(areaCounts)
                console.log(data.map((item, index) => ({
                    index: index,
                    name: item.label,
                    value: areaCounts[index],
                    label: item.label + " ( " + areaCounts[index] + " )",
                })))
            })

            .catch((error) => console.error(error))

    }

    useEffect(() => {
        getShiftData();

    }, [])

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };


    return (

        <View style={styles.container}>
            {/* <Text>Integrating APIs</Text> */}
            {/* <Ionicons name="calendar" size={24} color="black" /> */}

            <ScrollView style={{ color: '#A4B8D3' }}>
                <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: '#F7F8FB' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="label"
                        placeholder={!isFocus ? 'Select Area' : '...'}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.label);
                            setIsFocus(false);
                            setShifts(allshifts.filter(shift => shift.area === item.name));

                        }}
                        renderLeftIcon={() => (
                            <FontAwesome
                                style={styles.icon}
                                color={isFocus ? '#4F6C92' : '#4F6C92'}
                                name="map-marker"
                                size={20}
                            />
                        )}
                    />
                </View>
                {
                    !!categories.length && categories.map((category) => {
                        return (
                            <View style={styles.todo}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        padding: 20,
                                        backgroundColor: '#F1F4F8',
                                        borderBlockColor: "red",
                                        // borderColor: "black"
                                        borderColor: "#CBD2E1"
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: '#4F6C92',
                                            letterSpacing: 0.5,
                                            marginLeft: 10,
                                            marginRight: 10

                                        }}
                                    >{(category == today) ? "Today" : (category == yesterday ? "Yesterday" : category)}</Text>
                                </View>
                                {!!shifts?.length && shifts?.filter(shift => {
                                    const start = new Date(shift.startTime);
                                    const options = { month: 'long', day: 'numeric' };
                                    const formattedDate = start.toLocaleDateString('en-US', options);

                                    return formattedDate == category
                                }).map((shift) => {
                                    return (
                                        <View
                                            style={styles.cell}>
                                            {/* <View style={{ flex: 0.4 }}> */}
                                            <Text style={styles.cellTime}>
                                                {(shift.startDate.getHours() < 10 ? '0' : '') + shift.startDate.getHours().toString()}:{(shift.startDate.getMinutes() < 10 ? '0' : '') + shift.startDate.getMinutes().toString() + ' '}
                                                -
                                                {' ' + (shift.endDate.getHours() < 10 ? '0' : '') + shift.endDate.getHours().toString()}:{(shift.endDate.getMinutes() < 10 ? '0' : '') + shift.endDate.getMinutes().toString()}

                                            </Text>

                                            {shift.booked ? <Text style={{...styles.cellStatus, marginRight: 18, color: '#4F6C92'}}>Booked </Text> : shift.notPossible ? <Text style={{...styles.cellStatus,  color: '#E2006A'}}>Overlapping</Text> : <Text style={styles.cellStatus}>                         </Text>}

                                            {shift.booked ?
                                                <Pressable style={{ ...styles.button, borderColor: '#E2006A', }} onPress={() => cancelShift(shift.id)}>
                                                    <Text style={{ ...styles.text, color: '#E2006A', }}>Cancel</Text>
                                                </Pressable> :
                                                ((shift.startTime < start1 || shift.notPossible) ? <Pressable disabled style={{ ...styles.button, borderColor: '#A4B8D3' }} onPress={() => bookShift(shift.id)}>
                                                    <Text style={{ ...styles.text, color: '#A4B8D3', }} >Book</Text>
                                                </Pressable> : <Pressable style={{ ...styles.button, borderColor: '#16A64D' }} onPress={() => bookShift(shift.id)}>
                                                    <Text style={{ ...styles.text, color: '#16A64D', }} >Book</Text>
                                                </Pressable>)}
                                        </View>
                                    )
                                })}
                            </View>
                        )
                    })}
                {/* <SectionList
                    sections={categories}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item}</Text>
                        </View>
                    )}
                    renderSectionHeader={({ section: { startDate } }) => (
                        <Text style={styles.header}>{startDate}</Text>
                    )}
                /> */}
                {/* <SectionList
                sections={shifts}
                keyExtractor={(item, index) => item + index}
                renderItem={({shift}) => (
                    <View style={styles.item}>
                    <Text style={styles.title}>{shift.id}</Text>
                    </View>
                )}
                
            /> */}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    cell: {
        flexDirection: 'row',
        borderWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#F7F8FB',
        borderColor: "#CBD2E1"
    },
    cellTime:
    {
        fontSize: 16,
        marginTop: 5,
        color: '#4F6C92',
        letterSpacing: 0.2,
        marginLeft: 5,
        marginRight: 10
    }
    ,
    cellStatus: {
        fontSize: 16,
        fontWeight: 'bold',
       
        // letterSpacing: 0.5,
        marginLeft: 10,
        // marginRight: 10,
        marginTop: 5

    },
    button: {
        alignItems: 'center',
        marginLeft: 30,
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 32,
        borderRadius: 20,
        borderWidth: 0.5,
        backgroundColor: '#F7F8FB',

        elevation: 2,

    },
    buttonOnPress: {

    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,

    },
    icon: {
        marginRight: 15,
        marginLeft: 15
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        marginTop: 5,
        color: '#4F6C92',
        letterSpacing: 0.2,
        marginLeft: 5,
        marginRight: 10
    },
    dropdown: {
        backgroundColor: '#F7F8FB'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#4F6C92'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        backgroundColor: '#F7F8FB'
    },
    container: {
        marginTop: 10,
        color: '#F7F8FB',
        backgroundColor: '#F7F8FB'
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
    },
});
