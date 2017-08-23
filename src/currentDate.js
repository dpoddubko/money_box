import Moment from "moment";

export default {
    getDate(){
        Moment.locale('en');
        var dt = new Date();
        return Moment(dt).format('YYYY-MM-DD');
    }
}
