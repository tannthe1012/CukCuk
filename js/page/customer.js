$(document).ready(function() {
    loadData();
    var modal = document.getElementById("modal");
    

    
    $("#add-employee").click(function() {
        $(".modal").css("display","block");
    })
    $("#btn-x-close").click(function() {
        $(".modal").css("display","none");
    })
    window.onclick = function(event) {
        console.log(event.target);
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

})
function loadData() {
    $.ajax({
        url: "http://cukcuk.manhnv.net/v1/Employees",
        method: "GET",
    }).done(function (res) {
        var data = res;
        
      
        $.each(data, function (index, item) {
            var checkbox="";
            if(item.Gender == null)
                checkbox = '<input type="checkbox"/>';
            else if (item.Gender>0 && item.Gender < 3) {
                checkbox = '<input type="checkbox" checked/>';
            } else {
                checkbox = '<input type="checkbox"/>';
            }
            
            var tr = $(`<tr>
                        <td>`+item.EmployeeCode+`</td>
                        <td>`+item['FullName']+`</td>
                        <td class="text-align-center">`+checkbox+`</td>
                        <td class="text-align-center">`+formatDate(item.DateOfBirth)+`</td>
                        <td style="white-space:nowrap" title="`+item.Address+`">`+item.Address+`</td>
                        <td>`+item.PhoneNumber+`</td>
                        <td>`+item.Email+`</td>
                        <td>`+item.PositionName+`</td>
                        <td>`+item.DepartmentName+`</td>
                        <td class="text-align-right">`+formatMoney(item.Salary)+`</td>
                        <td>`+item.WorkStatus+`</td>
                        
                    </tr>
            `);
            $('table tbody').append(tr);
        })
    }).fail(function (res) {

    })
}
function formatDate(date) {
    var date = new Date(date);
   
   
        var day = date.getDate();
            month = date.getMonth() + 1;
            year = date.getFullYear();
        return day + '/' +  month + '/' + year;
    
        
}
/**
 * Hàm định dạng hiển thị tiền têk
 * @param {Number} money số tiền
 * Created: NTTan (5/7/2021)
 */
    function formatMoney(money) {
        if(money == null)
            return "0"
        else
            return money.toLocaleString("it-IT");
            // return money.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    console.log(formatMoney(32197312));