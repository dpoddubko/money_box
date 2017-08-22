import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {Icon} from "react-native-elements";

class NecessityIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRequired: this.props.isRequired,
        };
    }

    changeRequired = () => {
        let required = !this.state.isRequired;
        this.setState({isRequired: required});
        this.props.callback(required);
    };

    render() {
        return (
            <View style={styles.container}>
                <Icon style={styles.icon}
                      name='circle'
                      type='font-awesome'
                      color={this.state.isRequired ? 'green' : 'orange'}
                      reverseColor='red'
                      onPress={() => this.changeRequired()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 10
    },
});

export default NecessityIcon;
