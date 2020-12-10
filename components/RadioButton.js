import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

class RadioButton extends Component {
    // Value of selected button can be utilized through "this.state.value"
    state = {
        value: null,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'oxygen-bold': require('../assets/fonts/Oxygen-Bold.ttf'),
            'oxygen-regular': require('../assets/fonts/Oxygen-Regular.ttf'),
            'oxygen-light': require('../assets/fonts/Oxygen-Light.ttf')
        });
    }

    update = (val) => {
        this.props.onUpdate(val);
    };

    render() {
        const { options } = this.props;
        const { value } = this.state;

        return (
            <View>
                {options.map(res => {
                    return (
                        <View key={res.key} style={styles.container}>
                            <TouchableOpacity
                                style={styles.radioCircle}
                                onPress={() => {
                                    this.update(res.text)
                                    this.setState({
                                        value: res.key,
                                    });
                                }}>
                                {value === res.key && <View style={styles.selectedButton} />}
                            </TouchableOpacity>
                            <Text style={styles.radioText}>{res.text}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioText: {
        marginLeft: 20,
        fontSize: 20,
        color: '#000',
        fontWeight: '700',
        fontFamily: 'oxygen-light',
    },
    radioCircle: {
        height: 25,
        width: 25,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#48a0e8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedButton: {
        width: 13,
        height: 13,
        borderRadius: 50,
        backgroundColor: '#48a0e8',
    }
});

export default RadioButton;