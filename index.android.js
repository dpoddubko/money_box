import React, {Component} from "react";
import {AppRegistry, Image, ListView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AddNewCharge from "./src/AddNewCharge";
import ActionButton from "react-native-action-button";
import AppDispatcher from "./src/AppDispatcher";
import Constants from "./src/Constants";
import EventEmitter from "./src/EventEmitter";
import dao from "./src/dao";
import iconSum from "./src/images/icon_summ.png";
import NecessityIcon from "./src/NecessityIcon";
import ChooseCategoryDialog from "./src/ChooseCategoryDialog";

window.ee = new EventEmitter();

export default class money_box extends Component {

    constructor(props) {
        super(props);
        dao.initDB();
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.state = {
            dataSource: ds.cloneWithRowsAndSections([]),
            showForm: false,
            needToShowDialog: false,
            chargeId: 0,
        };

        dao.selectFromCharge();
    }

    componentDidMount() {
        window.ee.addListener('News.add', (rows) => {
            console.log("action.row componentDidMount: " + JSON.stringify(rows));
            this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertRowsToMap(rows))});
        });
    }

    changeShowForm() {
        console.log("changeShowForm clicked!!!!!!!!!!!!!!!");
        console.log("this.state.showForm = " + this.state.showForm);
        this.setState({showForm: !this.state.showForm});
    }

    convertRowsToMap(rows) {
        var dateMap = {};
        rows.forEach(function (item) {
            if (!dateMap[item.createdDate]) {
                dateMap[item.createdDate] = [];
            }
            dateMap[item.createdDate].push(item);
        });
        return dateMap;
    }

    renderSectionHeader = (sectionData, date) => {
        return (
            <View style={styles.header}>
                <View style={styles.row}>

                    <View>
                        <Text style={{marginLeft: 15, color: "white"}}>{date}</Text>
                    </View>

                    <View style={styles.row1}>
                        <Image source={iconSum} style={styles.icon}/>
                        <Text style={{color: "white"}}>{`:  ${this.getSum(sectionData)}`}</Text>
                    </View>


                </View>
            </View>
        )
    };

    getSum(sectionData) {
        let sum = 0;
        sectionData.forEach(function (item) {
            sum += item.money;
        });
        return sum;
    };

    handleDialog = () => {
        this.setState({needToShowDialog: !this.state.needToShowDialog});
    };
    renderRow = (record) => {
        return (
            <View style={styles.row}>
                <View style={{flex: 1}}>
                    <Text style={styles.note}>{record.name}</Text>
                    <Text style={styles.id}>{record.money}</Text>
                </View>
                <View style={styles.row1}>
                    <NecessityIcon isRequired={record.required}
                                   callback={(required) => dao.updateCategoryRequired(required, record._id)}/>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.handleDialog();
                        this.setState({chargeId: record._id});
                        console.log("bool = ", this.state.needToShowDialog);

                    }}>
                        <Text style={styles.id}>{record.categoryName}</Text>
                    </TouchableOpacity>


                </View>
            </View>
        );
    }

    render() {
        let showForm = this.state.showForm;
        let self = this;
        return (
            <View style={styles.container}>
                {showForm ? (
                    <AddNewCharge isRequired={false} call={() => {
                        self.changeShowForm()
                    }}/>
                ) : (
                    <View style={styles.container}>

                        {console.log('dataSource= ', this.state.dataSource._cachedRowCount)}
                        {this.state.dataSource._cachedRowCount > 0 ? (<ListView
                            dataSource={self.state.dataSource}
                            renderRow={self.renderRow}
                            renderSectionHeader={this.renderSectionHeader}
                            enableEmptySections={true}/>) : (
                            <View style={styles.message}>
                                <Text style={{fontSize: 25}}> Add charges</Text>
                            </View>)}
                        <ActionButton
                            buttonColor="rgba(231,76,60,1)"
                            onPress={() => {
                                self.changeShowForm()
                            }}/>
                        {this.state.needToShowDialog ? (
                            <ChooseCategoryDialog handleDialog={() => this.handleDialog()}
                                                  callback={(category) =>
                                                      dao.updateCategoryOfCharge(category._id, this.state.chargeId)}/>)
                            : (<Text/>)}

                    </View>
                )}

            </View>
        );
    }
}

AppDispatcher.register(action => {

    switch (action.type) {
        case Constants.ACTION_SHOW_BASE: {
            console.log("action.row AppDispatcher: " + action.row);
            window.ee.emit('News.add', action.row);
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
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    welcome: {
        fontSize: 15,
        textAlign: 'left',
        margin: 10,
        paddingLeft: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    id: {
        fontSize: 13,
    },
    note: {
        color: 'darkblue',
        fontSize: 15,
        fontWeight: 'bold',
    },
    header: {
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
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    info: {
        paddingLeft: 15,
        paddingRight: 5,
    },
    message: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

AppRegistry.registerComponent('money_box', () => money_box);
