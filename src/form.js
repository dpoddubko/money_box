import React, {Component} from "react";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import {FormLabel, Icon, Header} from "react-native-elements";
import dao from "./dao";
import {MaterialDialog} from 'react-native-material-dialog';
import AppDispatcher from "./AppDispatcher";
import AppConstants from "./AppConstants";
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';
import NecessityIcon from "./NecessityIcon";

const CATEGORIES = "action_show_categories";
const NEW_CATEGORY = "new_category";

class Form extends Component {
//data piker + Necessity доделать
    constructor(props) {
        super(props);
        dao.selectFromCategory();
        dao.selectFromCategoryById(1);
        this.state = {
            name: '',
            price: 0,
            isRequired: this.props.isRequired,
            basicScrolledListVisible: false,
            res: [],
            category: {
                createdAt: '2017-08-16 13:03:18',
                required: 0,
                name: 'Default',
                _id: 1
            },
            basicOkCancelVisible: false,
            newCategoryName: '',
            date: this.getDate(),

        };
    }

    getDate = () => {
        Moment.locale('en');
        var dt = new Date();
        return Moment(dt).format('YYYY-MM-DD');
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

    handleCategoryClick = () => {
        this.setState({basicScrolledListVisible: true});
    };

    componentDidMount() {
        window.ee.addListener(CATEGORIES, (res) => {
            console.log("CATEGORIES componentDidMount form: " + res);
            this.setState({res: res});
        });
        window.ee.addListener(NEW_CATEGORY, (res) => {
            console.log("NEW_CATEGORY componentDidMount form: " + JSON.stringify(res));
            this.setState({category: res});
        });
    }

    render() {
        let self = this;

        return (
            <View style={styles.container}>

                {/*dsytcnb header в компонент */}
                <Header
                    leftComponent={
                        <Icon
                            name='arrow-left'
                            type='material-community'
                            color='white'
                            reverseColor='red'
                            onPress={() => this.props.call()}/>}
                    centerComponent={{text: 'NEW CHARGE', style: {color: '#fff'}}}
                    rightComponent={
                        <Icon
                            name='save'
                            type='font-awesome'
                            color='white'
                            reverseColor='red'
                            onPress={() => this.save()}/>
                    }
                    backgroundColor='blue'
                />

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
                                      onPress={() => this.handleCategoryClick()}>
                        <Text style={styles.welcome}>{this.state.category.name}</Text>
                    </TouchableOpacity>

                    <FormLabel>Date</FormLabel>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        maxDate="2030-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 15
                            },
                            dateInput: {
                                marginLeft: 50
                            }
                        }}
                        onDateChange={(date) => {
                            this.setState({date: date})
                        }}
                    />

                    <View style={styles.row}>
                        <FormLabel>Necessity</FormLabel>
                        <NecessityIcon isRequired={this.state.isRequired} callback={() => this.changeRequired()}/>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.saveAndContinue}>
                        <Text style={styles.text}>Save & continue</Text>
                    </TouchableOpacity>

                </View>
                {/*вынести диалог в компонент  */}
                <MaterialDialog
                    visible={this.state.basicScrolledListVisible}
                    // title={'Categories list'}
                    scrolled
                    cancelLabel={'All categories'}
                    okLabel={'Create category'}
                    onOk={() => {
                        this.setState({basicScrolledListVisible: false});
                        this.setState({basicOkCancelVisible: true});
                    }}
                    onCancel={() => {
                        this.setState({basicScrolledListVisible: false});
                    }}>
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContainer}>
                        {this.state.res.map((row) => (
                            <TouchableOpacity key={row._id} onPress={() => {
                                this.setState({category: row});
                                console.log('categoryId = ', this.state.category._id);
                                this.setState({basicScrolledListVisible: false});
                            }}>
                                <View style={styles.row}>
                                    <Text style={styles.welcome}>{row.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </MaterialDialog>
                <MaterialDialog
                    title={"Create new category"}
                    visible={this.state.basicOkCancelVisible}
                    onOk={() => {
                        this.setState({basicOkCancelVisible: false});
                        let categoryName = this.state.newCategoryName;
                        if (categoryName !== '') {
                            dao.insertCategory(categoryName);
                            this.clearInput('inputCategory');
                            this.setState({newCategoryName: ''});
                            //записать в category только что вставленный объект newCategoryName
                        }
                    }}
                    onCancel={() => {
                        this.setState({basicOkCancelVisible: false});
                    }}>
                    <TextInput style={styles.welcome}
                               ref={'inputCategory'}
                               placeholder="Input category name"
                               onChangeText={(newCategoryName) => self.setState({newCategoryName})}/>
                </MaterialDialog>
            </View>
        );
    }
}

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

AppDispatcher.register(action => {

    switch (action.type) {
        case AppConstants.ACTION_SHOW_CATEGORIES: {
            console.log("AppDispatcher ACTION_SHOW_CATEGORIES: " + action.res);
            window.ee.emit(CATEGORIES, action.res);
            break;
        }
        case AppConstants.ACTION_UPDATE_CHOSEN_CATEGORY: {
            console.log(" AppDispatcher ACTION_UPDATE_CHOSEN_CATEGORY: " + action.newCategory);
            window.ee.emit(NEW_CATEGORY, action.newCategory);
            break;
        }

        default: {
        }
    }
});
export default Form;
