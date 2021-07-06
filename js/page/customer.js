$(document).ready(function() {
    new CustomerJS();
    var modal = document.getElementById("modal");

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
class CustomerJS extends BaseJS {
    constructor() {
        // this.loadData();
        super();
    };
    setDataURL() {
        this.getDataURL = "http://cukcuk.manhnv.net/v1/Employees"
    }

}