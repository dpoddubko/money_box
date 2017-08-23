import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {FormLabel, Icon, Header} from "react-native-elements";


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
                <Header
                    leftComponent={
                        <Icon
                            name='arrow-left'
                            type='material-community'
                            color='white'
                            reverseColor='red'
                            onPress={() => () => console.log('arrow-left')}/>}
                    centerComponent={{text: 'CATEGORY EDITING', style: {color: '#fff'}}}
                    rightComponent={
                        <Icon
                            name='search'
                            type='font-awesome'
                            color='white'
                            reverseColor='red'
                            onPress={() => console.log('search')}/>
                    }
                    backgroundColor='blue'
                />
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
