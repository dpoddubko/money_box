import React, {Component} from "react";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {FormLabel} from "react-native-elements";
import dao from "./dao";
import NecessityIcon from "./NecessityIcon";
import ChooseCategoryDialog from "./ChooseCategoryDialog";
import Constants from "./Constants";
import AppDispatcher from "./AppDispatcher";
import AppHeader from "./AppHeader";
import CalendarPicker from "./CalendarPicker";
import currentDate from './currentDate'

class AddNewCharge extends Component {
    constructor(props) {
        super(props);
        dao.selectFromCategoryById(1);
        this.state = {
            name: '',
            price: 0,
            isRequired: this.props.isRequired,
            basicScrolledListVisible: false,
            basicOkCancelVisible: false,
            category: {
                createdAt: '2017-08-16 13:03:18',
                required: 0,
                name: 'Default',
                _id: 1
            },
            date: currentDate.getDate(),
            needToShowDialog: false,

        };
    }

    componentDidMount() {
        window.ee.addListener(Constants.ACTION_UPDATE_CHOSEN_CATEGORY, (category) => {
            this.setState({category: category});
        });
    };

    save = () => {
        this.saveAndContinue();
        if (this.conditions()) {
            this.props.call();
        }
    };
    saveAndContinue = () => {
        if (this.conditions()) {
            this.clearInput('inputName');
            this.clearInput('inputPrice');
            this.clearPrice();
            this.clearName();
            dao.insertCharge(this.state.name, this.state.price, this.state.category._id, this.getRequired(), this.state.date);
        } else {
            this.dialog('Input data to first and second fields');
        }
    };

    conditions = () => {
        return (this.state.name !== '' && this.state.price !== 0);
    };

    dialog = (msg) => {
        Alert.alert('Missing data', msg, [{text: 'OK', onPress: () => console.log('OK Pressed')},], {cancelable: false}
        )
    };

    clearInput(textInput) {
        this.refs[textInput].setNativeProps({text: ''});
    }

    clearName() {
        this.setState({name: ''});
    }

    clearPrice = () => {
        this.setState({price: 0});
    };

    changeRequired = () => {
        this.setState({isRequired: !this.state.isRequired});
    };

    getRequired = () => {
        return (this.state.isRequired ? 1 : 0);
    };

    handleDialog = () => {
        this.setState({needToShowDialog: !this.state.needToShowDialog});
    };

    render() {
        let self = this;

        return (
            <View style={styles.container}>

                <AppHeader
                    title="NEW CHARGE"
                    leftName="arrow-left"
                    leftType="material-community"
                    leftCallback={() => this.props.call()}
                    rightName="save"
                    rightType="font-awesome"
                    rightCallback={() => this.save()}/>

                <View style={styles.container1}>
                    <FormLabel>Name</FormLabel>
                    <TextInput style={styles.welcome}
                               ref={'inputName'}
                               placeholder="Input charge name"
                               onChangeText={(name) => self.setState({name})}/>

                    <FormLabel>Price</FormLabel>
                    <TextInput style={styles.welcome}
                               ref={'inputPrice'}
                               placeholder="Input price"
                               onChangeText={(price) => self.setState({price})}
                               keyboardType='numeric'/>
                    <FormLabel>Category</FormLabel>

                    <TouchableOpacity style={styles.touchable}
                                      onPress={() => this.handleDialog()}>
                        <Text style={styles.welcome}>{this.state.category.name}</Text>
                    </TouchableOpacity>

                    <FormLabel>Date</FormLabel>

                    <CalendarPicker
                        callback={(date) => this.setState({date: date})}/>

                    <View style={styles.row}>
                        <FormLabel>Necessity</FormLabel>
                        <NecessityIcon isRequired={this.state.isRequired} callback={() => this.changeRequired()}/>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.saveAndContinue}>
                        <Text style={styles.text}>Save & continue</Text>
                    </TouchableOpacity>

                </View>
                {this.state.needToShowDialog ? (
                    <ChooseCategoryDialog handleDialog={() => this.handleDialog()}
                                          callback={(category) => this.setState({category: category})}/>) : (<Text/>)}

            </View>
        );
    }
}

AppDispatcher.register(action => {
    switch (action.type) {
        case Constants.ACTION_UPDATE_CHOSEN_CATEGORY: {
            window.ee.emit(Constants.ACTION_UPDATE_CHOSEN_CATEGORY, action.newCategory);
            break;
        }
        default: {
        }
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    container1: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 100
    },
    welcome: {
        fontSize: 15,
        textAlign: 'left',
        margin: 10,
        paddingLeft: 10
    },
    welcome1: {
        flex: 0,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    button: {
        backgroundColor: 'mediumslateblue',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,

    },
    touchable: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    row: {
        flexDirection: 'row',
        marginRight: 15,
        paddingBottom: 5,
    },
    scrollViewContainer: {
        paddingTop: 8,
    },

});

export default AddNewCharge;
