$(document).ready(function () {
    new ComboBox();
});
$.fn.getValue = function () {
    console.log("hahaha");
    var inputText = $(this).children(".cbx-show").find('input').val();
    console.log(inputText);
    var select = $(this).children(".cbx-hide").find(".cbx-select");
    console.log(select);
    $.each(select, function (index, element) {
        console.log($(element).text());
        if ($(element).text() == inputText) {
            value = ($(element).attr("value"));
        }
    })
    // return value;
}
$.fn.getText = function () {
    var value = null;
    var inputText = $(this).children(".cbx-show").find('input').val();
    var select = $(this).children(".cbx-hide").find(".cbx-select");
    $.each(select, function (index, element) {
        if ($(this).text() == inputText) {
            value = $(this).text();
        }
    })
    return value;
}

$.fn.getData = function () {
    var dataSelect = [];
    var select = $(this).children(".cbx-hide").find(".cbx-select");
    $.each(select, function (index, element) {
        var text = $(this).text();
        var value = ($(this).attr("value"));

        dataSelect.push(new keyValueSelect(text, value));
    })
    return dataSelect;
}
function keyValueSelect(text, value) {
    this.text = text;
    this.value = value;
}
class ComboBox {
    constructor() {
        this.initEvent();
    }
    initEvent() {
        var me = this;
        var statusHide = false;
        var sumSuggest = null;
        var suggestIndex = null;
        // Xét sự kiện click vào icon-dropdown
        $(".cbx-icon-dropdown").on("click", function () {
            
            // Hiện các div bị ẩn thì hiện nó ra và thêm border focus
            if (statusHide == false) {
                $(this).parent(".cbx-show").siblings(".cbx-hide").find(".cbx-select").show();
                // $(this).css("border-color", "#01B075");
                $(this).parent(".cbx-show").removeClass("border-red-combobox");
                $(this).parent(".cbx-show").addClass("border-focus");
                statusHide = true;
            } else {
                // mà trước đó đã hiện ra thì ẩn nó đi và bỏ border-focus
                $(this).parent(".cbx-show").siblings(".cbx-hide").find(".cbx-select").hide();
                // $(this).css("border-color", "#bbbbbb");
                $(this).parent(".cbx-show").removeClass("border-focus");
                statusHide = false;
            }
        })
        $(".cbx-hide ").on("click", ".cbx-select", function () {
            // Lấy dữ liệu tại select
            var data = $(this).text();
            $(this).parents(".cbx-hide").siblings(".cbx-show").children("input").val(data);
            $(this).parents(".cbx-hide").find(".cbx-select").hide();
            // cho tất cả thẻ i display none hết và bro hết active của cá select
            $(this).parents(".cbx-hide").find("i").css("opacity", "0");
            $(this).parents(".cbx-hide").find(".active").removeClass("active");
            $(this).addClass("active");
            $(this).find("i").css("opacity", "1");
            validateCombobox($(this).parents(".cbx-hide").siblings(".cbx-show").children("input"));
            statusHide = false;

        })
        $(".cbx-show input").on("focus", function () {
            $(this).parent(".cbx-show").removeClass("border-red-combobox");
            $(this).parent(".cbx-show").addClass("border-focus");
        })


        // gợi ý khi nhập liệu cho focus bằng vị trí đầu tiền luôn

        $(".cbx-show input").on("input", function () {
            
            // $(this).parent(".cbx-show").removeClass("border-red-combobox");
            // $(this).parent(".cbx-show").addClass("border-focus");
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
        $(".cbx-show input").on("keydown", function (e) {
            // nếu bằng 0 
            if (suggestIndex == 0) {
                if (e.which == 38) {
                    changeSelectForcus(suggestIndex, sumSuggest - 1, this);
                }
                if (e.which == 40) {
                    changeSelectForcus(suggestIndex, suggestIndex + 1, this);
                }
            }
            // nếu bằng length - 1
            else if (suggestIndex == sumSuggest - 1) {
                if (e.which == 38) {
                    changeSelectForcus(suggestIndex, suggestIndex - 1, this);
                }
                if (e.which == 40) {
                    changeSelectForcus(suggestIndex, 0, this);
                }
            }
            // nếu bình thường
            else {
                if (e.which == 38) {
                    changeSelectForcus(suggestIndex, suggestIndex - 1, this);
                }
                if (e.which == 40) {
                    changeSelectForcus(suggestIndex, suggestIndex + 1, this);
                }
            }
            if (e.which == 13) {
                chooseSelectForcus(suggestIndex, this);
                validateCombobox(this);
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

        $(".cbx-show input").blur(function() {
            console.log(this);
            validateCombobox(this);
        });
        function validateCombobox(input) {
            console.log("input");
            // console.log("heheheh");
            var value = $(input).val();
            console.log(input);
            console.log(value);
            $(input).parent(".cbx-show").siblings(".cbx-hide").find(".cbx-select").hide();
            // console.log($(this).parent(".cbx-show").parent(".cbx").getText());
            // console.log(value);
    
            if (value == "") {    
                $(input).parent(".cbx-show").addClass("border-red-combobox");
                $(input).parent(".cbx-show").attr('title', 'Trường này không được phép bỏ trống');
                $(input).attr("validate", false);
            } else {
                if ($(input).parent(".cbx-show").parent(".cbx").getText() == null) {
                    $(input).parent(".cbx-show").addClass("border-red-combobox");
                    $(input).parent(".cbx-show").attr('title', 'Không đúng ');
                    $(input).attr("validate", false);
                } else {
                    debugger;
                    console.log("chuan");
                    $(input).parent(".cbx-show").removeClass("border-red-combobox");
                    $(input).parent(".cbx-show").removeClass("border-focus");
                    $(input).parent(".cbx-show").attr('title', ' ');
                    $(input).attr("validate", true);
                }
            }
    
        }


    }
    
}





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