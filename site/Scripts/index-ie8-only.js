(function () {    
    $(".multiply-matrix", ".controls").focusout(function (event) {
        $(event.target).css("box-shadow", "none");
    });
    
    $(".multiply-matrix", ".controls").focus(function (event) {
        $(event.target).css("box-shadow", "0 0 0 2px #5199db");
    });
    
})();