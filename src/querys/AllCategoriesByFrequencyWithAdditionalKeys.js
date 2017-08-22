export default {
    getAllCategoriesByFrequencyWithAdditionalKeys(){
        return (
            `SELECT
    c._id,
    c.name,
    c.required,
    COUNT(ch._id) as count
  
FROM
    Category c LEFT JOIN Charge ch ON c._id = ch.categoryId

WHERE
    c._id > 1

GROUP BY
   c._id

ORDER BY
     count DESC`
        );
    }
}
// SQL_AllCategoriesByFrequencyWithAdditionalKeys

 
 