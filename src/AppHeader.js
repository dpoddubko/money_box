import React, {Component} from "react";
import {Header, Icon} from "react-native-elements";

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let title = {text: this.props.title, style: {color: '#fff'}};
        return (
            <Header
                leftComponent={
                    <Icon
                        name={this.props.leftName}
                        type={this.props.leftType}
                        color='white'
                        onPress={() => this.props.leftCallback()}/>}
                centerComponent={title}
                rightComponent={
                    <Icon
                        name={this.props.rightName}
                        type={this.props.rightType}
                        color='white'
                        onPress={() => this.props.rightCallback()}/>
                }
                backgroundColor='blue'
            />
        );
    }
}

export default AppHeader;