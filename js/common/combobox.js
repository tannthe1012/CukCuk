$(document).ready(function () {
    var statusHide = false;
    var sumSuggest = null;
    var suggestIndex = null;

    // Xét sự kiện click vào icon-dropdown
    $(".cbx-icon-dropdown").on("click", function () {
        // Hiện các div bị ẩn

        if (statusHide == false) {
            $(this).parent(".cbx-show").siblings(".cbx-hide").find(".cbx-select").show();
            statusHide = true;
        } else {
            // mà trước đó đã hiện ra thì ẩn nó đi
            $(this).parent(".cbx-show").siblings(".cbx-hide").find(".cbx-select").hide();
            statusHide = false;
        }
    })
    $(".cbx-hide .cbx-select").on("click", function () {
        // Lấy dữ liệu tại select
        var data = $(this).text();
        $(this).parents(".cbx-hide").siblings(".cbx-show").children("input").val(data);
        $(this).parents(".cbx-hide").find(".cbx-select").hide();
        // cho tất cả thẻ i display none hết và bro hết active của cá select
        $(this).parents(".cbx-hide").find("i").css("opacity", "0");
        $(this).parents(".cbx-hide").find(".active").removeClass("active");
        $(this).addClass("active");
        $(this).find("i").css("opacity", "1");
        statusHide = false;

    })

    // gợi ý khi nhập liệu cho focus bằng vị trí đầu tiền luôn

    $(".cbx-show input").on("input", function () {

        // lấy giá trị nhập liệu
        var inputs = $(this).val().toLowerCase();
        // var select = $('.cbx-select');
        // lấy ra cá thẻ select trong hide
        var select = $(this).parent(".cbx-show").siblings(".cbx-hide").find(".cbx-select");
        // ẩn hết tất cả và bỏ focus của các select
        $('.cbx-select').removeClass("cbx-select-focus");
        $('.cbx-select').hide();
        // trả về các element có chứa inputs
        var suggestions = select.filter(function (element) {
            // console
            if (inputs == "")
                return;
            return $(this).text().toLowerCase().includes(inputs);
        })
        // cái nào chứa show nó lên
        $.each(suggestions, function (index, element) {
            var value = $(this).text();
            $.each(select, function (index, element) {
                if ($(this).text() == value) {
                    $(this).show();
                }
            })
            
        })
        // show lên thì gán focus cái đầu và giá trị đi kèm
        $(suggestions[0]).addClass("cbx-select-focus");
        sumSuggest = suggestions.length;
        suggestIndex = 0;
        
    })
    $(".cbx-show input").on("keydown", function(e) {
        // nếu bằng 0 
        if (suggestIndex == 0) {
            if (e.which == 38) {
                changeSelectForcus(suggestIndex,sumSuggest-1, this);
            }
            if (e.which == 40) {
                changeSelectForcus(suggestIndex,suggestIndex+1, this);
            }
        } 
        // nếu bằng length - 1
        else if (suggestIndex == sumSuggest-1){
            if (e.which == 38) {
                changeSelectForcus(suggestIndex,suggestIndex-1, this);
            }
            if (e.which == 40) {
                changeSelectForcus(suggestIndex, 0 , this);
            }
        }
        // nếu bình thường
        else {
            if (e.which == 38) {
                changeSelectForcus(suggestIndex,suggestIndex-1, this);
            }
            if (e.which == 40) {
                changeSelectForcus(suggestIndex, suggestIndex+1 , this);
            }
        }
        if (e.which == 13) {
            chooseSelectForcus(suggestIndex, this);
        }
    })

    function changeSelectForcus(index, nextindex, elementInput) {
        var inputs = $(elementInput).val().toLowerCase();
        var select = $('.cbx-select');
        var suggestions = select.filter(function (element) {
            if (inputs == "")
                return;
            return $(this).text().toLowerCase().includes(inputs);
        })
        $(suggestions[index]).removeClass("cbx-select-focus");
        $(suggestions[nextindex]).addClass("cbx-select-focus");
        suggestIndex = nextindex;
    }

    function chooseSelectForcus(index, elementInput) {
        var inputs = $(elementInput).val().toLowerCase();
        var select = $('.cbx-select');
        var suggestions = select.filter(function (element) {
            if (inputs == "")
                return;
            return $(this).text().toLowerCase().includes(inputs);
        })

        var data = $(suggestions[index]).text();
        $(suggestions[index]).parents(".cbx-hide").siblings(".cbx-show").children("input").val(data);
        $(suggestions[index]).parents(".cbx-hide").find(".cbx-select").hide();
        // cho tất cả thẻ i display none hết và bro hết active của cá select
        $(suggestions[index]).parents(".cbx-hide").find("i").css("opacity", "0");
        $(suggestions[index]).parents(".cbx-hide").find(".active").removeClass("active");
        $(suggestions[index]).addClass("active");
        $(suggestions[index]).find("i").css("opacity", "1");
    }
    
    $.fn.getValue = function() {
        var inputText = $(this).children(".cbx-show").find('input').val();
        var select = $(this).children(".cbx-hide").find(".cbx-select");
        $.each(select, function(index, element) {
            if ($(this).text() == inputText) {
                value = parseInt($(this).attr("value"));
            }
        })
        return value; 
    }

    $.fn.getText = function() {
        var inputText = $(this).children(".cbx-show").find('input').val();
        var select = $(this).children(".cbx-hide").find(".cbx-select");
        $.each(select, function(index, element) {
            if ($(this).text() == inputText) {
                value = $(this).text();
            }
        })
        return value; 
    }

    $.fn.getData = function() {
        var dataSelect = [];
        var select = $(this).children(".cbx-hide").find(".cbx-select");
        $.each(select, function(index, element) {
            var text = $(this).text();
            var value = parseInt($(this).attr("value"));
            
            dataSelect.push(new keyValueSelect(text, value));
        })
        return dataSelect; 
    }
    function keyValueSelect(text,value) {
        this.text = text;
        this.value = value;
    }

});







// $(".cbx-icon-dropdown").click(function() {
    //     //if (.dropdown - show).style.
    //     var flag = true;
    //     if ($(this).parents(".cbx-show").siblings(".cbx-hide").css("display") != "none") {
    //         flag = false;
    //     }
    //     if (flag == true) {
    //         $(".cbx-show").removeClass("cbx-selector-active");
    //         $(".cbx-show").siblings(".cbx-hide").hide();
    //         $(".cbx-show").children(".cbx-icon-dropdown").removeClass("cbx-icon-active");
    //     }
    //     $(this).parents(".cbx-show").toggleClass("cbx-selector-active");
    //     $(this).parents(".cbx-show").siblings(".cbx-hide").toggle();
    //     $(this).parents(".cbx-show").children(".cbx-icon-dropdown").toggleClass("cbx-icon-active");



    // })
    // $(".cbx-hide .cbx-select").click(function() {
    //     var data = $(this).text();
    //     $(this).parents(".cbx-hide").siblings(".cbx-show").children("span").text(data);
    //     $(this).parents(".cbx-hide").siblings(".cbx-show").children("i").toggleClass("cbx-icon-active");
    //     $(this).parents(".cbx-hide").toggle();
    //     $(this).parents(".cbx-hide").find("i").css("opacity", "0");
    //     $(this).parents(".cbx-hide").find(".active").removeClass("active");
    //     $(this).addClass("active");
    //     $(this).find("i").css("opacity", "1");
    //     $(this).parents(".cbx-hide").siblings(".cbx-show").toggleClass("cbx-selector-active");
    // })
    // window.onclick = function(event) {
    //     console.log(event.target);
    //     $('#contextmenu').css('display', `none`);
    //     if (!event.target.matches(".cbx *")) {
    //         $(".cbx-hide").css("display", "none");
    //         $(".cbx-show i").css("transform", "none");
    //     }
    // }