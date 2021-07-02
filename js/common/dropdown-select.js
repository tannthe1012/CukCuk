$(document).ready(function () {

    $("#dropdown-show").click(function () {

        if ($(".dropdown-hide").css('display') == 'none') {
            $("#dropdown-show i").css("transform", "rotate(180deg)");
            $(".dropdown-hide").css("display", "block");

        }
        else if ($(".dropdown-hide").css("display") == "block") {
            $("#dropdown-show i").css("transform", "none");
            $(".dropdown-hide").css("display", "none");
        }
    })
    $(".dropdown-hide .dropdown-select").click(function () {
        
        var data = $(this).text();
        $("#dropdown-show span").text(data)
        $("#dropdown-show i").css("transform", "none");
        $(".dropdown-hide").css("display", "none");
        $(".dropdown-hide").find("i").css("opacity","0");
        $(".dropdown-hide").find(".active").removeClass("active");
        $(this).addClass("active");
        $(this).find("i").css("opacity", "1");
        

    })
    window.onclick = function(event) {
        console.log(event.target);
        if (!event.target.matches(".dropdown *")) {
            $(".dropdown-hide").css("display", "none");
            $("#dropdown-show i").css("transform", "none");
        }
    }
});

