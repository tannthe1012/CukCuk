class BaseJS {
    constructor() {
        this.getDataURL = null;
        this.setDataURL();
        this.loadData();
        this.initEvents();
    }
    setDataURL() {}
        /**
         * Hàm xử lí các sự kiện click
         */
    initEvents() {
        // sự kiện click khi nhấn vào thêm mới
        $("#btn-add-employee").click(function() {
            // Hiển thị layout modal Thông tin chi tiết nhân viên
            $(".modal").show();
        });
        // ấn form chi tiết khi ấn dấu button hủy
        $("#employee-btn-close").click(function() {
            $(".modal").hide();
        });
        // ấn form chi tiết khi nhấn x
        $("#btn-x-close").click(function() {
            $(".modal").hide();
        });
        // Load lại dữ liệu khi nhấp vào button nạp
        $("#btn-refresh").click(function() {
            this.loadData();
        }.bind(this));
        // Lưu dữ diệu
        $("#btn-save").click(function() {
            // validate dữ liệu

            // Thu thập thông tin dữ liệu

            // Gọi service tương ứng lưu dữ liệu

            // Sau khi lưu thành công thì 
            // đưa ra thông báo
            // ẩn form chi tiết 
            // load lại dữ liệu
        });
        // Hiện thị thông tin chi tiết khi nhấp vào 1 bản ghi trên danh sách dữ liệu
        $('table tbody').on('dblclick', 'tr', function() {
            $(".modal").show();
        });
        $('.input-required').blur(function() {
            // Kiem tra dữ liệu đã nhập, nếu bỏ trông thì cảnh báo
            var value = $(this).val();
            if (!value) {
                $(this).addClass("border-red");
            } else {
                $(this).removeClass("border-red");
            }
        });
    }

    /**
     * Hàm để load dữ liệu thông qua API
     * CreatedBy: NTTAN (6/7/2021)
     */
    loadData() {
        // Lấy thông tin các cột dữ liệu
        try {
            $('table tbody').empty(); // tránh việc có x2 x3 bản ghi sau mỗi lần refresh
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
                        switch (fieldName) {
                            case "DateOfBirth":
                                td.addClass("text-align-center");
                                value = formatDate(value);
                                break;
                            case "Address":
                                td.addClass("white-space");
                                td.attr('title', value);
                                break;
                            case "Salary":
                                value = formatMoney(value);
                                break;

                            default:
                                break;
                        }
                        td.append(value);
                        $(tr).append(td);
                    });
                    $('table tbody').append(tr);
                })
            }).fail(function(res) {

            })
        } catch (error) {
            console.log(error);
        }
    }
}
/**
 * Hàm định dạng hiện thị của ngày tháng năm dd/mm/yy
 * Created: NTTan (6/7/2021)
 * @param {any} date 
 * @returns 
 */
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