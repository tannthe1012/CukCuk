$(document).ready(function () {
    new EmployeeJS();
});
var statusForm = "ADD";
/**
 * Class quản lí các sự kiện cho trang employee
 * CreatedBY: NTTan (6/7/2021)
 */
class EmployeeJS extends BaseJS {
    constructor() {
        super();
    };
    /**
     * Hàm này để lấy apiRouter
     * Created By: NTTan (8/7/2021)
     */
    setApiRouter() {
        this.apiRouter = "/v1/Employees";
    }
    /**
     * Hàm xử lí các sự kiện click
     * Created By: NTTan (5/7/2021)
     */
    initEvents() {
        // sử dụng đối tượng this, tránh các trường hợp this là các element
        var me = this;
        // sự kiện click khi nhấn vào thêm mới
        $("#btn-add-employee").click(function () {
            // Hiển thị layout modal Thông tin chi tiết nhân viên
            $(".modal").show();
            clearDataForm();
        });
        // ấn form chi tiết khi ấn dấu button hủy
        $("#employee-btn-close").click(function () {
            $(".modal").hide();
        });
        // ấn form chi tiết khi nhấn x
        $("#btn-x-close").click(function () {
            $(".modal").hide();
        });
        // Load lại dữ liệu khi nhấp vào button nạp
        $("#btn-refresh").click(function () {
            this.loadData();
        }.bind(this));
        // Xử lí sự kiện nút xóa trong contextmenu

        // xử lí sự kiện nút sửa trong contextmenu


        // Xử lí sự kiện click chuột phải
        $('table tbody').on('contextmenu', 'tr', function (event) {
            var tr = this;
            me.recordID = $(tr).attr('recordId');
            // thêm background vào tr đang được focus
            $(tr).addClass('background-color-focus');
            event.preventDefault();
            // $(this).find(td).addClass('background-color-focus');
            let contextMenu = $('#contextmenu');
            const { clientX: mouseX, clientY: mouseY } = event;
            $(contextMenu).css('top', `${mouseY}px`);
            $(contextMenu).css('left', `${mouseX}px`);
            $(contextMenu).css('display', `flex`);
        })

        // Xử lí sự kiện nút Sửa
        $('#contextmenu-update').on("click", function() {
            $('#contextmenu').css('display', `none`);
            statusForm = "UPDATE";
            // updateData = true; // cho biết click btn-save là api PUT
            $(".modal").show();
            // Gọi API GET lấy về đối tượng đấy
            $.ajax({
                url: me.host + me.apiRouter + '/' + me.recordID,
                method: "GET",
            }).done(function (obj) {
                console.log(obj);
                // bind dữ liệu vào bảng
                var inputs = $('input[fieldName], span[fieldName]');
                $.each(inputs, function (index, input) {
                    var fieldName = $(this).attr('fieldName');
                    var value = obj[fieldName];
                    switch (fieldName) {
                        case "Salary":
                            value = formatMoney(value);
                            $(this).val(value);
                            break;
                        case "DateOfBirth":
                        case "IdentityDate":
                        case "JoinDate":
                            value = formatDateInput(value);
                            $(this).val(value);
                            break;
                        case "WorkStatus":
                            value = convertWorkStatus(value);
                            $(this).text(value);
                            break;
                        case "GenderName":
                            $(this).text(value);
                        default:
                            $(this).val(value);
                            break;
                    }
                });

            }).fail(function (obj) {
                console.log("That bai khi lay doi tuong");
            });
        })

        // Xử lí sự kiện nút Xóa
        $("#contextmenu-delete").on("click", function() {
            $('#contextmenu').css('display', `none`);
            // Hiện Popup kiểm tra xem có muốn xóa hay không
            // Thực hiện xóa
            $.ajax({
                url: me.host + me.apiRouter + '/' + me.recordID,
                method: "DELETE",
            }).done(function (obj) {
               console.log("đa xóa thành công bản ghi");
            }).fail(function (obj) {
                console.log("That bai khi lay doi tuong");
            });
            alert("Đã xóa thành công bản ghi");
            me.loadData();
            // me.loadData();

        })




        // hiện form khi double click vào các thẻ tr
        $("table tbody").on("dblclick", "tr", function () {
            statusForm = "UPDATE";
            updateData = true; // cho biết click btn-save là api PUT
            $(".modal").show();
            // Lấy id của đối tượng được chứa trong thẻ tr
            var recordID = $(this).attr('recordId');
            me.recordID = recordID;
            // Gọi API GET lấy về đối tượng đấy
            $.ajax({
                url: me.host + me.apiRouter + '/' + recordID,
                method: "GET",
            }).done(function (obj) {
                // bind dữ liệu vào bảng
                var inputs = $('input[fieldName], span[fieldName]');
                $.each(inputs, function (index, input) {
                    var fieldName = $(this).attr('fieldName');
                    var value = obj[fieldName];
                    switch (fieldName) {
                        case "Salary":
                            value = formatMoney(value);
                            $(this).val(value);
                            break;
                        case "DateOfBirth":
                        case "IdentityDate":
                        case "JoinDate":
                            value = formatDateInput(value);
                            $(this).val(value);
                            break;
                        case "WorkStatus":
                            value = convertWorkStatus(value);
                            $(this).text(value);
                            break;
                        case "GenderName":
                            $(this).text(value);
                        default:
                            $(this).val(value);
                            break;
                    }
                });

            }).fail(function (obj) {
                console.log("That bai khi lay doi tuong");
            });

        })



        // Lưu dữ diệu
        $("#btn-save").click(function () {
            // validate dữ liệu
            var inputValidates = $('input[type="email"],.input-required');
            $.each(inputValidates, function (index, input) {
                $(input).trigger('blur');
            });
            // sẽ focus tới trường bị sai input
            var inputNotValids = $('input[validate="false"]');
            if (inputNotValids && inputNotValids.length > 0) {
                alert("Dữ liệu không hợp lệ, vui long kiếm tra lại");
                inputNotValids[0].focus();
                return;
            }
            // Thu thập thông tin dữ liệu
            // Lấy tất cả các control nhập liệu vào input
            var inputs = $('input[fieldName], span[fieldName]');
            var employee = {}
            // lấy dữ liệu của từng input trong mảng các element
            $.each(inputs, function (index, input) {
                var propertyName = $(this).attr('fieldName');
                var value = $(this).val();
                employee[propertyName] = value;
                switch (propertyName) {
                    case "GenderName":
                        value = formatGenderNamePost($(this).text());
                        employee["Gender"] = value;
                        break;
                    case "salary":
                        $(this).val().replaceAll(".", "");
                        $(this).val().replaceAll(",", "");
                        value = $(this).val();
                        employee[propertyName] = parseFloat(value);
                        break;
                    case "DepartmentName":
                        value = formatDepartmentId($(this).val());
                        employee["DepartmentId"] = value;
                        break;
                    default:
                        break;
                }
            });
            // Gọi service tương ứng lưu dữ liệu
            // Kiểm tra xem là api POST hay PUT với mặc định là POST
            var method = 'POST';
            var urlAPI = me.host + me.apiRouter;
            var contentAlert = "tạo bản ghi"
            if (statusForm == "UPDATE") {
                method = 'PUT';
                urlAPI = urlAPI + `/${me.recordID}`;
                contentAlert = "cập nhật bản ghi";
            }
            try {
                $.ajax({
                    url: urlAPI,
                    method: method,
                    data: JSON.stringify(employee),
                    contentType: 'application/json'
    
                }).done(function (res) {
                    console.log("thanh cong");
                }).fail(function (res) {
    
                });
                // Sau khi lưu thành công thì 
                // đưa ra thông báo
                alert("đã " + contentAlert + " thành công");
                // updateData = false;
                statusForm = "ADD";
                // ẩn form chi tiết 
                $(".modal").hide();
                // load lại dữ liệu
                me.loadData();
            } catch (error) {
                console.log(error);
            }
            

        });
        /**
         * Validate bắt buộc nhập
         * Created: NTTAN (7/7/2021)
         */
        $('.input-required').blur(function () {
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
        $('input[type="email"]').blur(function () {
            var email = $(this).val();
            var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            // return emailReg.test(email);
            if (!emailReg.test(email)) {
                $(this).addClass("border-red");
                $(this).attr('title', 'Email không đúng định dạng');
                $(this).attr("validate", false);
            } else {
                $(this).removeClass("border-red");
                $(this).attr("validate", true);
            }

        });
        /**
        * Format lương ngay cả khi đang nhập liệu trong form
        */
        $("#salary").on("input", function (event) {
            var el = event.target;
            var value = el.value;
            value = value.replaceAll(".", "");
            value = value.replaceAll(",", "");
            value = BigInt(value).toLocaleString("it-IT");
            $("#salary").val(value);
        });

    };



}



// Dùng để set value workstatus cho dữ liệu trong table và form
const workstatus = [{
    workStatus: 0,
    workStatusName: "Đang làm việc"
},
{
    workStatus: 1,
    workStatusName: "Đang thử việc"
},
{
    workStatus: 2,
    workStatusName: "Đã Nghỉ việc"
},
{
    workStatus: 3,
    workStatusName: "Khác ..."
},
{
    workStatus: null,
    workStatusName: "Không Xác Định"
}
]