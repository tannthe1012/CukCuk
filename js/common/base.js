class BaseJS {
    constructor() {
        this.getDataURL = null;
        this.setDataURL();
        this.loadData();
    }
    setDataURL() {}
    loadData() {
        // Lấy thông tin các cột dữ liệu
        var ths = $('table thead th');

        var getDataURL = this.getDataURL;

        // Lấy dữ liệu về tu api
        // Lấy thông tin dũ liệu map tưởng ứng với các cột
        $.ajax({
            url: getDataURL,
            method: "GET",
            //Get : Lấy dữ liệu

        }).done(function(res) {
            $.each(res, function(index, obj) {
                var tr = $(`<tr></tr>`);
                $.each(ths, function(index, th) {
                    var td = $(`<td></td>`);
                    var fieldName = $(th).attr('fieldname');
                    var value = obj[fieldName];
                    if (value == null) {
                        value = "null";
                    }
                    if (fieldName == "DateOfBirth") {
                        td.addClass("text-align-center");
                        value = formatDate(value);
                    }
                    if (fieldName == "Address") {
                        td.addClass("white-space");
                        td.attr('title', value);
                    }
                    if (fieldName == "salary") {
                        value = formatMoney(value);
                    }
                    td.append(value);
                    // var fieldName = $(th).attr('fieldname');
                    // var value = obj[fieldName];
                    // var td =$(`<td>`+value+`</td>`);
                    $(tr).append(td);
                });
                debugger;
                $('table tbody').append(tr);
            })
        }).fail(function(res) {

        })

    }
}

function formatDate(date) {
    var date = new Date(date);
    var day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    day = day > 9 ? day : `0${day}`;
    month = month > 9 ? month : `0${month}`;
    return day + '/' + month + '/' + year;
}
/**
 * Hàm định dạng hiển thị tiền tệ
 * @param {Number} money số tiền
 * Created: NTTan (5/7/2021)
 */
function formatMoney(money) {
    if (money == null)
        return "0"
    else
        return money.toLocaleString("it-IT");
}