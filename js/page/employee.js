$(document).ready(function () {
    new EmployeeJS();
    var modal = document.getElementById("modal");
    window.onclick = function (event) {
        console.log(event.target);
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});
/**
 * Class quản lí các sự kiện cho trang employee
 * CreatedBY: NTTan (6/7/2021)
 */
class EmployeeJS extends BaseJS {
    constructor() {
        super();
    };
    setApiRouter () {
        this.apiRouter = "/v1/Employees";
    }

    /**
     * Hàm xử lí các sự kiện click
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
        // Lưu dữ diệu
        $("#btn-save").click(function () {
            // validate dữ liệu
            var inputValidates = $('input[type="email"],.input-required');
            $.each(inputValidates, function (index, input) {
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

            // // Tìm đối tượng cần được update data theo so chung minh nhan dan
            var result = employeeList.filter(function (obj) {
                if (employee.IdentityNumber == obj.IdentityNumber)
                    return obj;
            })

            // Gọi service tương ứng lưu dữ liệu
            // Kiểm tra xem là api POST hay PUT với mặc định là POST
            var method = 'POST';
            var urlAPI = me.host + me.apiRouter;
            var contentAlert = "tạo bản ghi"
            if (updateData == true) {
                method = 'PUT';
                urlAPI = urlAPI + `/${result[0].EmployeeId}`;
                contentAlert = "cập nhật bản ghi";
            }
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
            alert("đã "+contentAlert+" thành công");
            updateData = false;
            // ẩn form chi tiết 
            $(".modal").hide();
            // load lại dữ liệu
            me.loadData();

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

        })


    };



}

/**
 * Hàm này để format lương ngay cả khi đang nhập liệu trong form
 */

function myFunction() {
    var x = document.getElementById("salary").value;
    x.replaceAll(".","");
    x.replaceAll(",","");
    x.replaceAll(".","");
    var x1 = Number(x).toLocaleString("it-IT");
    console.log(x1);
    $("#salary").val(x1);
  }