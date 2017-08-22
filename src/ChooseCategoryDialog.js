import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import dao from "./dao";
import {MaterialDialog} from "react-native-material-dialog";
import AppDispatcher from "./AppDispatcher";
import AppConstants from "./AppConstants";

const CATEGORIES_DIALOG = "action_show_categories";

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
        };
    }

    componentDidMount() {
        window.ee.addListener(CATEGORIES_DIALOG, (res) => {
            this.setState({res: res});
        });

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
                        this.props.handleDialog();
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
                                this.setState({basicScrolledListVisible: false});
                            }}>
                                <View style={styles.row}>
                                    <Text style={styles.welcome}>{row.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
        default: {
        }
    }
});
export default ChooseCategoryDialog;
