$(document).ready(function() {
    var modal = document.getElementById("modal");
    var data = `
                    <tr>
                        <td>NV532408</td>
                        <td>Ngô Thế Tấn</td>
                        <td>Nam</td>
                        <td>10/12/2000</td>
                        <td>Dục Nội - Việt Hùng - Đông Anh - Hà Nội</td>
                        <td>0984984467</td>
                        <td>ngothetan2k@gmail.com</td>
                        <td>Nhân viên</td>
                        <td>Phòng Đào tạo</td>
                        <td>19.156.547</td>
                        <td>Nghi lam</td>
                    </tr>
    `;
    $('table tbody').append(data);

    
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
