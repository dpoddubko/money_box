import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import dao from "./dao";
import {MaterialDialog} from "react-native-material-dialog";
import AppDispatcher from "./AppDispatcher";
import AppConstants from "./AppConstants";

const CATEGORIES_DIALOG = "action_show_categories";
const NEW_CATEGORY = "new_category";

class ChooseCategoryDialog extends Component {
    constructor(props) {
        super(props);
        dao.selectFromCategoryDialog();
        this.state = {
            isRequired: this.props.isRequired,
            basicScrolledListVisible: true,
            res: [],
            category: {
                createdAt: '2017-08-16 13:03:18',
                required: 0,
                name: 'Default',
                _id: 1
            },
            basicOkCancelVisible: false,
            newCategoryName: '',
            text: '',
        };
    }

    componentDidMount() {
        window.ee.addListener(CATEGORIES_DIALOG, (res) => {
            this.setState({res: res});
        });
        window.ee.addListener(NEW_CATEGORY, (res) => {
            console.log("NEW_CATEGORY componentDidMount form: " + JSON.stringify(res));
            this.setState({category: res});
            console.log('this.state.category._id =' + this.state.category._id, 'this.props.chargeId=' + this.props.chargeId)
            this.props.callback(res._id, this.props.chargeId);
        });
    };

    clearInput(textInput) {
        this.refs[textInput].setNativeProps({text: ''});
    }

    render() {
        return (
            <View style={styles.container}>
                <MaterialDialog
                    visible={this.state.basicScrolledListVisible}
                    scrolled
                    cancelLabel={'All categories'}
                    okLabel={'Create category'}
                    onOk={() => {
                        this.setState({basicScrolledListVisible: false});
                        this.setState({basicOkCancelVisible: true});
                    }}
                    onCancel={() => {
                        this.setState({basicScrolledListVisible: false});
                        this.props.handleDialog();
                    }}>
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContainer}>
                        {this.state.res.map((row) => (
                            <TouchableOpacity key={row._id} onPress={() => {
                                this.setState({category: row});
                                console.log('categoryId = ', this.state.category._id);
                                this.props.callback(row._id, this.props.chargeId);

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
                        this.props.handleDialog();
                        this.setState({basicOkCancelVisible: false});

                        let categoryName = this.state.newCategoryName;
                        if (categoryName !== '') {
                            dao.insertCategory(categoryName);
                            this.clearInput('inputCategory');
                            this.setState({newCategoryName: ''});
                        }
                    }}
                    onCancel={() => {
                        this.props.handleDialog();
                        this.setState({basicOkCancelVisible: false});

                    }}>
                    <TextInput style={styles.welcome}
                               ref={'inputCategory'}
                               placeholder="Input category name"
                               onChangeText={(newCategoryName) => this.setState({newCategoryName})}/>
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
    welcome: {
        fontSize: 15,
        textAlign: 'left',
        margin: 10,
        paddingLeft: 10
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
        case AppConstants.ACTION_SHOW_CATEGORIES_DIALOG: {
            console.log("ACTION_SHOW_CATEGORIES_DIALOG: " + action.res);
            window.ee.emit(CATEGORIES_DIALOG, action.res);
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
export default ChooseCategoryDialog;
