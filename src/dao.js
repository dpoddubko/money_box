import Sqlite from "react-native-sqlite-storage";
import schema from "./querys/schema";
import AllCategories from "./querys/AllCategoriesByFrequencyWithAdditionalKeys";

import AppDispatcher from "./AppDispatcher";
import AppConstants from "./Constants";

let db = Sqlite.openDatabase({name: "core.db"});

function splitString(stringToSplit, separator) {
    return stringToSplit.split(separator);
}

export default {
    initDB(){
        splitString(schema.getSchema(), ';').forEach((q) => {
            db.executeSql(q);
        });
    },

    insertCharge(name, price, categoryId = 1, required = 0, createdDate) {
        db.executeSql("INSERT INTO Charge (name,money,categoryId,required,createdDate) VALUES (?,?,?,?,?)",
            [name, price, categoryId, required, createdDate], (res) => {
                this.selectFromCharge();
            }, (e) => {
                console.log("ERROR insertCharge: " + e.message);
            });
    },

    selectFromCharge() {
        db.executeSql(
            'SELECT ch.*, c.name as categoryName FROM Category c inner JOIN Charge ch ON c._id = ch.categoryId',
            [], (res) => {
                AppDispatcher.dispatch({
                    type: AppConstants.ACTION_SHOW_BASE,
                    row: res.rows.raw()
                });
            }, (e) => {
                console.log("ERROR selectFromCharge: " + e.message);
            });
    },
    insertCategory(name) {
        db.executeSql("INSERT INTO Category (name) VALUES (?)", [name], (res) => {
            console.log("INSERT_CATEGORY: insertId = " + res.insertId);
            this.selectFromCategoryById(res.insertId);
            this.selectFromCategory();
        }, (e) => {
            console.log("ERROR insertCharge: " + e.message);
        });
    },
    updateCategoryRequired(required, id) {
        db.executeSql("UPDATE Charge SET required=? WHERE _id=?", [required, id], (res) => {

            console.log(`UPDATE_CATEGORY_REQUIRED _id=${id}, required = ${required}`);

        }, (e) => {
            console.log("ERROR insertCharge: " + e.message);
        });
    },

    updateCategoryOfCharge(categoryId, chargeId) {
        db.executeSql("UPDATE Charge SET categoryId=? WHERE _id=?", [categoryId, chargeId], (res) => {
            console.log(`UPDATE_CATEGORY_OF_CHARGE categoryId=${categoryId}, chargeId = ${chargeId}`);
            this.selectFromCharge();
        }, (e) => {
            console.log("ERROR insertCharge: " + e.message);
        });
    },
    selectFromCategoryById(id) {
        db.executeSql(
            'SELECT * FROM Category WHERE _id=(?)', [id], (res) => {
                AppDispatcher.dispatch({
                    type: AppConstants.ACTION_UPDATE_CHOSEN_CATEGORY,
                    newCategory: res.rows.item(0)
                });
            }, (e) => {
                console.log("ERROR ACTION_SHOW_CATEGORIES: " + e.message);
            });
    },

    selectFromCategoryDialog() {
        db.executeSql(
            'SELECT * FROM Category', [], (res) => {
                console.log("SELECT_FROM_CATEGORY: " + JSON.stringify(res.rows.raw()));
                AppDispatcher.dispatch({
                    type: AppConstants.ACTION_SHOW_CATEGORIES,
                    res: res.rows.raw()
                });
            }, (e) => {
                console.log("ERROR ACTION_SHOW_CATEGORIES: " + e.message);
            });
    },
    AllCategoriesByFrequencyWithAdditionalKeys(){
        db.executeSql(AllCategories.getAllCategoriesByFrequencyWithAdditionalKeys(),[],(res)=>{
            
        })

    }
}
