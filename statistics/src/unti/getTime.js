const getNowFormatDate=(seperator)=> {
    let date = new Date();
    seperator =  "/";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
}
export default getNowFormatDate