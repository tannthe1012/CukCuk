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
            var inputValidates = $('input[type="email"],.input-required');
            $.each(inputValidates, function(index, input) {
                var value = $(input).val();

                $(input).trigger('blur');
            });
            var inputNotValids = $('input[validate="false"]');
            if (inputNotValids && inputNotValids.length > 0) {
                alert("Dữ liệu không hợp lệ, vui long kiếm tra lại");
                inputNotValids[0].focus();
                return;
            }
            // Thu thập thông tin dữ liệu
            var employee = {
                "EmployeeCode": $("#txtEmployeeCode").val(),
                "FullName": $("#txtFullName").val(),
                "DateOfBirth": $("#dtDateofBirth").val(),
                "GenderName": $("#Gender").text(),
                "PhoneNumber": $("#txtPhoneNumber").val(),
                "Email": $("#txtEmail").val(),
                "Address": $("#txtEmployeeCode").val(),
                "IdentityNumber": $('#txtIdentityNumber').val(),
                "Salary": $("#salary").val(),
                "PositionName": $("#txtPositionName").val(),

            };
            console.log(employee);
            // Gọi service tương ứng lưu dữ liệu
            // $.ajax({
            //     url: 'http://cukcuk.manhnv.net/v1/Employees',
            //     method: 'POST',
            //     data: JSON.stringify(employee),
            //     contentType: 'application/json'

            // }).done(function(res) {
            //     console.log("thanh cong");
            // }).fail(function(res) {

            // });
            // Sau khi lưu thành công thì 
            // đưa ra thông báo
            alert("đã lưu thành công");
            // ẩn form chi tiết 
            // load lại dữ liệu
        });
        // Hiện thị thông tin chi tiết khi nhấp vào 1 bản ghi trên danh sách dữ liệu
        // $('table tbody').on('dblclick', 'tr', function() {
        //     $(".modal").show();
        //     var valueEmployeeCode = $(this).
        //     $("#txtEmployeeCode").value()
        // });
        /**
         * Validate bắt buộc nhập
         * Created: NTTAN (7/7/2021)
         */
        $('.input-required').blur(function() {
            // Kiem tra dữ liệu đã nhập, nếu bỏ trông thì cảnh báo
            var value = $(this).val();
            if (!value) {
                $(this).addClass("border-red");
                $(this).attr('title', 'Trường này không được phép bỏ trống');
                $(this).attr("validate", false);
            } else {
                $(this).removeClass("border-red");
                $(this).attr("validate", true);
            }

        });
        /**
         * Validate email
         * Created: NTTAN (7/7/2021)
         */
        $('input[type="email"]').blur(function() {
            var email = $(this).val();
            var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            console.log(emailReg.test(email));
            // return emailReg.test(email);
            if (!emailReg.test(email)) {
                $(this).addClass("border-red");
                $(this).attr('title', 'Email không đúng định dạng');
                $(this).attr("validate", false);
            } else {
                $(this).removeClass("border-red");
                $(this).attr("validate", true);
            }

        })


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
                    $(tr).click(function(event) {
                        $(".modal").show();
                        var genderName = obj.GenderName;
                        switch (genderName) {
                            case "Nam":
                                break;
                            case "Nữ":
                                break;
                            case "Không xác định":
                                break;
                            default:
                                genderName = "";
                                break;
                        }
                        var workstatus = obj.WorkStatus;
                        switch (workstatus) {
                            case 0:
                                workstatus = "Đang làm việc";
                                break;
                            case 1:
                                workstatus = "Đang thử việc";
                                break;
                            case 2:
                                workstatus = "Đã Nghỉ việc";
                                break;
                            case 3:
                                workstatus = "Khác ...";
                                break;
                            default:
                                workstatus = "Không Xác Định";
                                break;
                        }
                        $("#txtEmployeeCode").val(obj.EmployeeCode);
                        $("#txtFullName").val(obj.FullName);
                        $("#dtDateofBirth").val(formatDateInput(obj.DateOfBirth));
                        $("#Gender").text(genderName);
                        $("#txtIdentityNumber").val(obj.IdentityNumber);
                        $("#IdentityDate").val(formatDateInput(obj.IdentityDate));
                        $("#IdentityPlace").val(obj.IdentityPlace);
                        $("#txtEmail").val(obj.Email);
                        $("#txtPhoneNumber").val(obj.PhoneNumber);
                        $("#txtPositionName").val(obj.txtPositionName);
                        $("#txtDepartmentName").val(obj.DepartmentName);
                        $("#txtPersonalTaxCode").val(obj.PersonalTaxCode);
                        $("#salary").val(formatMoney(obj.Salary));
                        $("#JoinDate").val(formatDateInput(obj.JoinDate));
                        $("#WorkStatus").text(workstatus);
                        console.log($('#Gender').text());

                    })

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

function formatDateInput(date) {
    var date = new Date(date);
    var day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    day = day > 9 ? day : `0${day}`;
    month = month > 9 ? month : `0${month}`;
    return year + '-' + month + '-' + day;
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