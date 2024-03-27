import { StatusBar } from 'expo-status-bar';
import { ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function AllShiftsScreen() {
    const [shifts, setShifts] = useState();
    const [allshifts, setAllShifts] = useState();
    const [categories, setCategories] = useState([]);
    const [data, setdata] = useState([
        { label: 'Helsinki', value: 0 },
        { label: 'Turku', value: 0 },
        { label: 'Tampere', value: 0 },
    ]);
    let items = [];

    const getShiftData = () => {
        // axios({
        //     method: 'get',
        //     url: 'http://0.0.0.0:8082/shifts',
        //     headers: { 
        //       'Content-Type': 'application/json'
        //     },

        // })
        axios.get('http://192.168.1.4:8082/shifts')
            .then(response => response.data)

            .then((json) => {
                setShifts(json.map((shift) => ({
                    ...shift,
                    startDate: new Date(shift.startTime),
                    endDate: new Date(shift.endTime),

                })));
                setAllShifts(json.map((shift) => ({
                    ...shift,
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
                // setSections(categories.map((category) => ({ startTime: category, data: [] })))
                // console.log(sections)
                // setSections(json.map((shift) => {
                //     const start = new Date(shift.startTime);

                //     // Using toLocaleDateString() with options
                //     const options = { month: 'long', day: 'numeric' };
                //     const formattedDate = start.toLocaleDateString('en-US', options);

                //     if (sections.findIndex(item => item.startDate === formattedDate) === -1) {
                //         return {
                //             startDate: formattedDate,
                //             data: [shift.toString()],
                //         }
                //     }
                //     else {
                //         return { data: [...sections[sections.findIndex(item => item.startDate === formattedDate)].data, shift.toString()] }
                //     }

                // }));
                items = json;
                // console.log(json.map((shift) => {
                //     const start = new Date(shift.startTime);

                //     // Using toLocaleDateString() with options
                //     const options = { month: 'long', day: 'numeric' };
                //     const formattedDate = start.toLocaleDateString('en-US', options);

                //     if (sections.findIndex(item => item.startDate === formattedDate) === -1) {
                //         return {
                //             startDate: formattedDate,
                //             data: [shift.toString()],
                //         }
                //     }
                //     else {
                //         return { data: [...sections[sections.findIndex(item => item.startDate === formattedDate)].data, shift.toString()] }
                //     }

                // }));
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

            <ScrollView>
                <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="label"
                        placeholder={!isFocus ? 'Select item' : '...'}
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
                                color={isFocus ? 'blue' : 'black'}
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
                                <Text>{category}</Text>
                                {!!shifts?.length && shifts?.filter(shift => {
                                    const start = new Date(shift.startTime);
                                    const options = { month: 'long', day: 'numeric' };
                                    const formattedDate = start.toLocaleDateString('en-US', options);
                                    return formattedDate == category
                                }).map((shift) => {
                                    return (
                                        <View style={styles.todo}>
                                            <View >
                                                <Text>{shift?.area}</Text>
                                            </View>
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
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    container: {
        marginTop: 50,
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
