import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import dao from "./dao";
import {MaterialDialog} from "react-native-material-dialog";
import AppDispatcher from "./AppDispatcher";
import Constants from "./Constants";

class ChooseCategoryDialog extends Component {
    constructor(props) {
        super(props);
        dao.selectFromCategoryDialog();
        this.state = {
            basicScrolledListVisible: true,
            basicOkCancelVisible: false,
            res: [],
            newCategoryName: '',
            text: '',
        };
    }

    componentDidMount() {
        window.ee.addListener(Constants.ACTION_SHOW_CATEGORIES, (res) => {
            this.setState({res: res});
        });
        window.ee.addListener(Constants.ACTION_UPDATE_CHOSEN_CATEGORY, (res) => {
            this.props.callback(res);
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
                                this.props.handleDialog();
                                this.props.callback(row);
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
                            dao.insertCategory(categoryName);//вызовет потом action ACTION_UPDATE_CHOSEN_CATEGORY,NEW_CATEGORY
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
        case Constants.ACTION_SHOW_CATEGORIES: {
            console.log("ACTION_SHOW_CATEGORIES: " + action.res);
            window.ee.emit(Constants.ACTION_SHOW_CATEGORIES, action.res);
            break;
        }
        case Constants.ACTION_UPDATE_CHOSEN_CATEGORY: {
            console.log(" AppDispatcher ACTION_UPDATE_CHOSEN_CATEGORY: " + action.newCategory,Constants.ACTION_UPDATE_CHOSEN_CATEGORY);
            window.ee.emit(Constants.ACTION_UPDATE_CHOSEN_CATEGORY, action.newCategory);
            break;
        }
        default: {
        }
    }
});
export default ChooseCategoryDialog;
