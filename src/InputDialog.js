import React, {Component} from "react";
import {StyleSheet, TextInput} from "react-native";
import {MaterialDialog} from "react-native-material-dialog";

class InputDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basicOkCancelVisible: true,
        };
    }

    clearInput(textInput) {
        this.refs[textInput].setNativeProps({text: ''});
    }

    render() {
        return (
            <MaterialDialog
                title={"Edit category"}
                visible={this.state.basicOkCancelVisible}
                onOk={() => {
                    this.props.handleDialog();
                    this.setState({basicOkCancelVisible: false});

                    let categoryName = this.state.newCategoryName;
                    if (categoryName !== '' && categoryName !== undefined) {
                        this.props.callback(categoryName);
                        this.clearInput('inputCategory');
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
});

export default InputDialog;
