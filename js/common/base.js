
var employeeList = [];
var updateData = false;
// function Employee(employeeId, em)
class BaseJS {


    constructor() {
        this.host = "http://cukcuk.manhnv.net";
        this.apiRouter = null;
        this.setApiRouter();
        this.initEvents();
        this.loadData();
        
        
    }
    setApiRouter() {};
    setDataURL() { };
    initEvents() { };

    /**
     * Hàm để load dữ liệu thông qua API
     * CreatedBy: NTTAN (6/7/2021)
     */
    loadData() {
        var me = this;
        // Lấy thông tin các cột dữ liệu
        try {
            $('table tbody').empty(); // tránh việc có x2 x3 bản ghi sau mỗi lần refresh
            var ths = $('table thead th');

            var url = me.host + me.apiRouter;
            // Lấy dữ liệu về tu api
            // Lấy thông tin dũ liệu map tưởng ứng với các cột
            $.ajax({
                url: url,
                method: "GET",
                //Get : Lấy dữ liệu

            }).done(function (res) {
                $.each(res, function (index, obj) {
                    var tr = $(`<tr></tr>`);
                    $.each(ths, function (index, th) {
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
                    // xử lý sự kiện khi dblclick vào các thẻ tr trong bảng
                    $(tr).dblclick(function (event) {
                        updateData = true; // cho biết click btn-save là api PUT
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

                    })
                    employeeList.push(obj);
                    // console.log(obj.DepartmentId + ':' + obj.DepartmentName);
                    $('table tbody').append(tr);
                })



            }).fail(function (res) {

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
 * hàm format lại date từ dd/mm/yyyy -> yyyy-mm-dd
 * Created: NTTan (8/7/2021)
 * @param {date} date 
 * @returns 
 */
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
/**
 * Hàm xác định lại gender từ gendenNam trong form chi tiét
 * @param {genderName} genderName 
 * @returns 
 * Created: NTTan(8/7/2021)
 */
function formatGenderNamePost(genderName) {
    if (genderName == "Nam") {
        return 1;
    } else if (genderName == "Nữ") {
        return 0;
    } else if (genderName = "Không xác định") {
        return 2;
    } else {
        return 3;
    }

}
/**
 * Hàm clear data trong các input khi modal của thêm nhân viên xuất hiện
 */
function clearDataForm() {
    $("#txtEmployeeCode").val("");
    $("#txtFullName").val("");
    $("#dtDateofBirth").val("");
    $("#Gender").text("");
    $("#txtIdentityNumber").val("");
    $("#IdentityDate").val("");
    $("#IdentityPlace").val("");
    $("#txtEmail").val("");
    $("#txtPhoneNumber").val("");
    $("#txtPositionName").val("");
    $("#txtDepartmentName").val("");
    $("#txtPersonalTaxCode").val("");
    $("#salary").val("");
    $("#JoinDate").val("");
    $("#WorkStatus").text("");
}
/**
 * Hàm convert từ Name sang IDdepartment
 * @param {*} nameDepartment 
 * @returns 
 */
function formatDepartmentId(nameDepartment) {
    var departmentId;
    switch (nameDepartment) {
        case "Phòng Nhân sự":
            departmentId = "469b3ece-744a-45d5-957d-e8c757976496";
            break;
        case "Phòng Công nghệ":
            departmentId = "4e272fc4-7875-78d6-7d32-6a1673ffca7c";
            break;
        case "Phòng đào tạo":
            departmentId = "17120d02-6ab5-3e43-18cb-66948daf6128";
            break;
        case "Phòng Marketting":
            departmentId = "142cb08f-7c31-21fa-8e90-67245e8b283e";
            break;
        default:
            break;
    }
    return departmentId;
}