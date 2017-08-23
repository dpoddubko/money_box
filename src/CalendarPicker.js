import React, {Component} from "react";
import DatePicker from "react-native-datepicker";
import currentDate from './currentDate'

class CalendarPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: currentDate.getDate(),
        };
    }

    render() {
        return (
            <DatePicker
                style={{width: 200}}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2016-05-01"
                maxDate="2030-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 15
                    },
                    dateInput: {
                        marginLeft: 50
                    }
                }}
                onDateChange={(date) => {
                    this.setState({date: date});
                    this.props.callback(date);
                }}
            />
        );
    }
}

export default CalendarPicker;
