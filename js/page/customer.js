$(document).ready(function() {
    new CustomerJS();
    var modal = document.getElementById("modal");
    $("#employee-btn-close").click(function() {
        $(".modal").css("display", "none");
    })
    $("#add-employee").click(function() {
        $(".modal").css("display", "block");
    })
    $("#btn-x-close").click(function() {
        $(".modal").css("display", "none");
    })
    window.onclick = function(event) {
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
class CustomerJS extends BaseJS{
    constructor() {
        // this.loadData();
        super();
    };
    setDataURL() {
        this.getDataURL = "http://cukcuk.manhnv.net/v1/Employees"
    }
    /**
     * Thêm dữ liệu
     * CreatedBY: NTTan (6/7/2021)
     */
    add() {

    };
    /**
     * Sửa dữ liệu
     * CreatedBY: NTTan (6/7/2021)
     */
    edit() {

    };
    /**
     * Xóa dữ liệu
     * CreatedBY: NTTan (6/7/2021)
     */
    delete() {

    };
}



