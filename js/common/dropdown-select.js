$(document).ready(function() {

    $(".dropdown-show").click(function() {
        //if (.dropdown - show).style.
        var flag = true;
        if ($(this).siblings(".dropdown-hide").css("display") != "none") {
            flag = false;
        }
        if (flag == true) {
            $(".dropdown-show").removeClass("dropdown-selector-active");
            $(".dropdown-show").siblings(".dropdown-hide").hide();
            $(".dropdown-show").children(".dropdown-icon").removeClass("dropdown-icon-active");
        }
        $(this).toggleClass("dropdown-selector-active");
        $(this).siblings(".dropdown-hide").toggle();
        $(this).children(".dropdown-icon").toggleClass("dropdown-icon-active");



    })
    $(".dropdown-hide .dropdown-select").click(function() {
        var data = $(this).text();
        $(this).parents(".dropdown-hide").siblings(".dropdown-show").children("span").text(data);
        $(this).parents(".dropdown-hide").siblings(".dropdown-show").children("i").toggleClass("dropdown-icon-active");
        $(this).parents(".dropdown-hide").toggle();
        $(this).parents(".dropdown-hide").find("i").css("opacity", "0");
        $(this).parents(".dropdown-hide").find(".active").removeClass("active");
        $(this).addClass("active");
        $(this).find("i").css("opacity", "1");
        $(this).parents(".dropdown-hide").siblings(".dropdown-show").toggleClass("dropdown-selector-active");
    })
    window.onclick = function(event) {
        console.log(event.target);
        $('#contextmenu').css('display', `none`);
        if (!event.target.matches(".dropdown *")) {
            $(".dropdown-hide").css("display", "none");
            $(".dropdown-show i").css("transform", "none");
        }
    }
});