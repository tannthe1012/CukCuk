$(document).ready(function () {
    new EmployeeJS();
    
});
var statusForm = "ADD";
var statusConfirm = null;
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
        $("#btn-add-employee").click(me.btnAddOnClick.bind(me));
        // ấn form chi tiết khi ấn dấu button hủy
        $("#employee-btn-close").click(me.btnCloseForm.bind(me));
        // ấn form chi tiết khi nhấn x
        $("#btn-x-close").click(me.btnCloseForm.bind(me));
        // Load lại dữ liệu khi nhấp vào button nạp
        $("#btn-refresh").click(me.btnRefresh.bind(me));
        // Xử lí sự kiện click chuột phải
        $('table tbody').on('contextmenu', 'tr', function (event) {
            $('table tbody').find('tr').removeClass('background-color-focus');
            var tr = this;
            me.recordID = $(tr).attr('recordId');
            // thêm background vào tr đang được focus
            $(tr).addClass('background-color-focus');
            // $(this).find(td).addClass('background-color-focus');
            event.preventDefault();
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
            clearDataForm(); // clear hết dữ liệu rồi mơi rend data
            $(".modal").show();
            // Gọi API GET lấy về đối tượng đấy
            $.ajax({
                url: me.host + me.apiRouter + '/' + me.recordID,
                method: "GET",
            }).done(function (obj) {
                // bind dữ liệu vào bảng
               me.bindDataToForm(obj);

            }).fail(function (obj) {
                console.log("That bai khi lay doi tuong");
            });
        })
        // Xử lí sự kiện nút Xóa trong contextmenu
        $("#contextmenu-delete").on("click", me.btnDelete);
        // sự kiện Confirm trong các popup
        $('.popup-btn-confirm').on("click", me.btnPopupConfirm.bind(me));
        // Sự kiện nhấn nút Hủy trong popup
        $('.popup-btn-close').on("click", me.closePopup);
        // Sự kiện nhấn nút X
        $('.popup-btn-x').on("click", me.closePopup);
        // hiện form khi double click vào các thẻ tr
        $("table tbody").on("dblclick", "tr", function () {
            statusForm = "UPDATE";
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
                me.bindDataToForm(obj);
            }).fail(function (obj) {
                console.log("That bai khi lay doi tuong");
            });

        })
        // Lưu dữ diệu
        $("#btn-save").click(me.btnSaveOnClick.bind(me));
        // validate các trường bắt buộc
        $('.input-required').blur(me.validateInput);
        // validate định dạng email
        $('input[type="email"]').blur(me.validateEmail);
        /**
        * Format lương ngay cả khi đang nhập liệu trong form
        * Created By : NTTan (8/7/2021)
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
    /**
     * Hàm xử lí sự kiện click vào nút Thêm nhân viên
     * Created By: NTTan (6/7/2021)
     */
    btnAddOnClick() {
        // Hiển thị layout modal Thông tin chi tiết nhân viên
        $(".modal").show();
        // clear hết data trong form trước khi thêm mới
        clearDataForm();
    }
    /**
     * Hàm để bind dữ liệu nhận được từ API vào form
     * @param {response obj} obj 
     */
    bindDataToForm(obj) {
        // bind dữ liệu vào bảng
        var inputs = $('input[fieldName], span[fieldName]');
        $.each(inputs, function (index, input) {
            var fieldName = $(this).attr('fieldName');
            console.log($(this));
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
    }
    /**
     * Hàm xử lí khi yêu cầu đóng form sẽ hiện ra Popup
     * Created By: NTTan (6/7/2021)
     */
    btnCloseForm() {
        // Hiện ra Popup Đóng form\
        $("#modal-popup").show();
        $(".popup-title").text("Đóng form thông tin chung");
        $(".popup-content-icon i").css("color", "#b3bb41");
        $(".popup-content-text").text("Bạn có chắc muốn Đóng form thông tin chung trên hay không?");
        $(".popup-btn-confirm").text("Đóng");
        statusConfirm = "CLOSE";
    }
    /**
     * Hàm xử lí nút refresh lại dữ liệu
     * Created By: NTTan (6/7/2021)
     */
    btnRefresh() {
        var me = this;
        me.loadData();
    }
     /**
     * Hàm để hiện Popup "Xóa bản ghi"
     * Created By: NTTan (10/7/2021)
     */
      btnDelete() {
        // ẩn đi contextmenu
        $('#contextmenu').css('display', `none`);
        // Hiện Popup kiểm tra xem có muốn xóa hay không
        statusConfirm = "DELETE";
        $('#modal-popup').show();
        $(".popup-title").text("Xóa Bản Ghi");
        $(".popup-content-icon i").css("color", "red");
        $(".popup-content-text").text("Bạn có chắc muốn Xoá bản ghi trên hay không?");
        $(".popup-btn-confirm").text("Xóa");
    }
    /**
     * Hàm xử lí nút confirm của các Popup UPDATE hoặc DELETE data
     * Created By: NTTan (10/7/2021)
     */
    btnPopupConfirm() {
        var me = this;
        //ân đi popup
        $('#modal-popup').hide();
        console.log(statusConfirm);
        // Gọi API xóa
        console.log(statusConfirm == "DELETE");
        if (statusConfirm == "DELETE") {
            console.log("da vao ben trong");
            try {
                $.ajax({
                    url: me.host + me.apiRouter + '/' + me.recordID,
                    method: "DELETE",
                }).done(function (obj) {
                    Toast.toast("Bản ghi đã được xóa thành công", "success");
                    me.loadData();
                }).fail(function (obj) {
                    Toast.toast("Thất bại khi xóa", "success");
                    me.loadData();
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            $('table tbody').find('tr').removeClass('background-color-focus');
            $("#modal").hide();
        }
    }
    /**
     * Hàm xử lí để đóng Popup
     * Created By: NTTan (10/7/2021)
     */
    closePopup() {
        $("#modal-popup").hide();
    }
   
    /**
     * Validate bắt buộc nhập
     * Created: NTTAN (7/7/2021)
     */
    validateInput() {
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
    }
    /**
     * Validate email
     * Created: NTTAN (7/7/2021)
     */
    validateEmail() {
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
    }
    /**
     * Hàm xử lí sự kiện khi nhấp vào nút Lưu
     * Created By (7/7/2021)
     * @returns 
     */
    btnSaveOnClick() {
        var me = this;
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
                case "Salary":
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
    }
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
