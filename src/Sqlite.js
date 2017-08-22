import React, {Component} from "react";
import dao from "./dao";
import {Text, View} from "react-native";
import ActionButton from "react-native-action-button";

class SQLite extends Component {
    constructor(props) {
        super(props);
        dao.initDB();
    }

    render() {
        return (
            <View>
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => { console.log("hi")}}
                />
            </View>)
    }

}


export default SQLite;

