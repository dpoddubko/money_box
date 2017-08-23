import React, {Component} from "react";
import {Image, ListView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AppHeader from "./AppHeader";
import icon from "./images/filter_icon.png";
import Constants from "./Constants";
import AppDispatcher from "./AppDispatcher";
import dao from "./dao";
import InputDialog from "./InputDialog";

// реализовать поиск и удаление массива из категорий, реализовать каскадное удаление
// delete from Category where _id in (1,2,3)

class AllCategories extends Component {
    constructor(props) {
        super(props);
        dao.AllCategoriesByFrequencyWithAdditionalKeys();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            needToShowDialog: false,
            categoryId: 0,
        };
    }

    componentDidMount() {
        window.ee.addListener(Constants.ACTION_SHOW_ALL_CATEGORIES, (categories) => {
            this.setState({dataSource: this.state.dataSource.cloneWithRows(categories)});
        });
        window.ee.addListener(Constants.ACTION_CATEGORY_NAME_WAS_UPDATED, () => {
            dao.AllCategoriesByFrequencyWithAdditionalKeys();
        });
    };

    leftCallback = () => {
        console.log('leftCallback clicked');
    };

    rightCallback = () => {
        console.log('rightCallback clicked');

    };

    handleDialog = () => {
        this.setState({needToShowDialog: !this.state.needToShowDialog});
    };

    renderRow = (record) => {
        return (
            <TouchableOpacity style={styles.button} onPress={() => {
                this.handleDialog();
                this.setState({categoryId: record._id});
            }}>
                <View style={styles.row}>
                    <View style={{flex: 1}}>
                        <Text style={styles.note}>{record.name}</Text>
                        <Text style={styles.id}>{record.count}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <AppHeader
                    title="CATEGORY EDITING"
                    leftName="arrow-left"
                    leftType="material-community"
                    leftCallback={() => this.leftCallback()}
                    rightName="search"
                    rightType="font-awesome"
                    rightCallback={() => this.rightCallback()}/>

                <View style={styles.header}>
                    <View style={styles.row}>
                        <View style={styles.row1}>
                            <Image source={icon} style={styles.icon}/>
                            <Text style={{color: "white"}}> Category</Text>
                        </View>
                    </View>
                </View>
                <ListView style={{margin: 10}}
                          dataSource={this.state.dataSource}
                          renderRow={this.renderRow}
                          enableEmptySections={true}/>

                {this.state.needToShowDialog ? (
                    <InputDialog handleDialog={() => this.handleDialog()}
                                 callback={(categoryName) => dao.updateCategoryName(categoryName, this.state.categoryId)}/>)
                    : (<Text/>)}
            </View>
        );
    }
}
//после каллбек вызвать dao.AllCategoriesByFrequencyWithAdditionalKeys(); для обновления экрана
AppDispatcher.register(action => {
    switch (action.type) {
        case Constants.ACTION_SHOW_ALL_CATEGORIES: {
            window.ee.emit(Constants.ACTION_SHOW_ALL_CATEGORIES, action.res);
            break;
        }
        case Constants.ACTION_CATEGORY_NAME_WAS_UPDATED: {
            window.ee.emit(Constants.ACTION_CATEGORY_NAME_WAS_UPDATED);
            break;
        }
        default: {
        }
    }
});
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
    },
    header: {
        marginTop: 70,
        backgroundColor: "grey",
        height: 30,
    },
    icon: {
        tintColor: 'white',
        height: 15,
        width: 15,
    },
    row: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        borderColor: '#f1f1f1',
        borderBottomWidth: 1,
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        marginLeft: 15,
    },
    id: {
        fontSize: 13,
    },
    note: {
        color: 'darkblue',
        fontSize: 15,
        fontWeight: 'bold',
    },

});

export default AllCategories;
