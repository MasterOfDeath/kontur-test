(function () {
    var $content = $(".content"),
        $matrixResult = $(".matrix-result", $content),
        $matrixA = $(".matrix-a", $content),
        $matrixB = $(".matrix-b", $content),
        $controls = $(".controls"),
        $errorLabel = $(".error-msg", $controls),
        minCols = 2, maxCols = 10, minRows = 2, maxRows = 10,
        maxValue = 10,
        valueBeforeEdit = "";
    
    $(".add-row", $controls).click(clickAddRowBtn);
    $(".remove-row", $controls).click(clickRemoveRowBtn);
    $(".add-col", $controls).click(clickAddColBtn);
    $(".remove-col", $controls).click(clickRemoveColBtn);
    $(".clean-matrix", $controls).click(clickCleanMatrixBtn);
    $(".multiply-matrix", $controls).click(clickMultiplyMatrixBtn);
    $(".exchange-matrix", $controls).click(clickExchangeMatrixBtn);
    $(".matrix").on("keyup", ":text", inputMartix);
    $(".matrix").on("focus", ":text", focusMatrix);
    $(".multiply-matrix", $controls).on("selectstart", false);
    
    $(document).ready(function () {
        if (detectIE()) {
           $("html").addClass("IE");
           $(":text", ".content").placeholderEnhanced();
        }
    });
    
    function clickAddRowBtn(event) {
        addRow(getCheckedMatrix());
        refreshResultMatrix();
    }
    
    function clickRemoveRowBtn(event) {
        removeRow(getCheckedMatrix());
        refreshResultMatrix();
    }
    
    function clickAddColBtn(event) {
        addCol(getCheckedMatrix());
        refreshResultMatrix();
    }
    
    function clickRemoveColBtn(event) {
        removeCol(getCheckedMatrix());
        refreshResultMatrix();
    }
    
    function clickCleanMatrixBtn(event) {
        $(".matrix", $content).each(function (index, el) {
            $(el).cleanMatrix();
        });
        
        setNormalMode();
    }
    
    function clickMultiplyMatrixBtn(event) {
        var arrayA = $matrixA.getMatrixArray(),
            arrayB = $matrixB.getMatrixArray(),
            arrayC = [],
            arr = [],
            temp = 0,
            i = 0,
            rowC = 0, colC = 0;
            
        if (arrayA === null || arrayB === null) {
            setErrorMode("Матрицы содержат пустые или не допустимые значения");
            return;
        }
        
        if (arrayA[0].length !== arrayB.length) {
            setErrorMode("Количество столбцов матрицы А должно соответствовать количеству строк матрицы В");
            return;    
        }
        else {
            for(rowC = 0; rowC < arrayA.length; rowC++) {
                arr = [];
                for (colC = 0; colC < arrayB[0].length; colC++) {
                    temp = 0;
                    for(i = 0; i < arrayA[0].length; i++) {
                        temp = temp + arrayA[rowC][i] * arrayB[i][colC];
                    }
                    arr[colC] = temp;                                        
                }
                arrayC.push(arr);
            }
            
            $matrixResult.setMatrixArray(arrayC);
            setNormalMode();
        }
        
    }
    
    function focusMatrix(event) {
        valueBeforeEdit = $(event.target).val();
    }
    
    function inputMartix(event) {
        var $thisInput = $(event.target);
        
        $thisInput.val($thisInput.val().replace(/\D/g,""));
        
        if ($thisInput.val() !== "") {
            $thisInput.val(parseInt($thisInput.val()));
        }
        
        if (+$thisInput.val() > maxValue) {
            $thisInput.val(maxValue);
        }
        
        if (valueBeforeEdit !== $thisInput.val()) {
            setEditMode();
        }
    }
    
    function clickExchangeMatrixBtn(event) {
        $matrixA.swapMatrix($matrixB);
    }
    
    function addRow($matrix) {
        var $newRow = $(".matrix-row", $matrix).last().clone(),
            newId = parseInt($newRow.attr("data-row-id")) + 1;
            
        if (newId == undefined || +newId < 1) {
            setErrorMode("Не известная ошибка");
            return;
        }
        
        if ($(".matrix-row", $matrix).length < maxRows) {
            $newRow.appendTo($(".matrix-box", $matrix));
            $(".matrix-row", $matrix).last().attr("data-row-id", newId);
            $(".matrix-row", $matrix).last().cleanMatrixRow();
            setEditMode();
        }
    }
    
    function removeRow($matrix) {
        var $matrixRows = $(".matrix-row", $matrix);
        
        if ($matrixRows.length > minRows) {
            $matrixRows.last().remove();
            setEditMode();
        }
    }
    
    function addCol($matrix) {
        var $matrixRows = $(".matrix-row", $matrix);
        
        if ($matrixRows.first().children(":text").length < maxCols) {
            $matrixRows.each(function (index, el) {
                $(el).children(":text").last().clone().appendTo($(el)).cleanMatrixRowElement();
            });
            setEditMode();
        }
    }
    
    function removeCol($matrix) {
        var $matrixRows = $(".matrix-row", $matrix);
        
        if ($matrixRows.first().children(":text").length > minCols) {
            $matrixRows.each(function (index, el) {
                $(el).children(":text").last().remove();
            });
            setEditMode();
        }
    }
    
    function getCheckedMatrix() {
        return $(".radio-a", $controls).prop( "checked") ? $matrixA : $matrixB;
    }
    
    $.fn.cleanMatrix = function() {
        $(".matrix-row", this).each(function (index1, el1) {
            if (index1 > minRows - 1){
                $(el1).remove();
            }
            else {
                $(el1).children(":text").each(function (index2, el2) {
                    if (index2 > minCols - 1) {
                        $(el2).remove();
                    }
                    else {
                        $(el2).cleanMatrixRowElement();
                    }
                });
            }
        });
    }
    
    $.fn.cleanMatrixRow = function() {
        this.children(":text").each(function (index, el) {
            $(el).cleanMatrixRowElement();
        });
        
        return this;
    };
    
    $.fn.cleanMatrixRowElement = function() {
        var $parentRow = this.closest(".matrix-row"),
            rowId = $parentRow.attr("data-row-id"),
            colId = parseInt($parentRow.children(":text").index(this)) + 1,
            matrixType = $parentRow.attr("data-matrix-type");
            
        this.val("").attr("placeholder", matrixType + rowId + "." + colId);
        this.placeholderEnhanced();
    }
    
    $.fn.getRowsCount = function() {
        return $(".matrix-row", this).length;
    }
    
    $.fn.getColsCount = function() {
        return $(".matrix-row", this).first().children(":text").length;
    }
    
    $.fn.getMatrixArray = function() {
        var $matrixRow,
            arr = [],
            result = [],
            rowsCount = this.getRowsCount(),
            colsCount = this.getColsCount(),
            value = 0,
            i = 0, j = 0;
            
            
        for (i = 0; i < rowsCount; i++) {
            arr = [];
            $matrixRow = $(".matrix-row", this).eq(i);
            for(j = 0; j < colsCount; j++) {
                value = $(":text", $matrixRow).eq(j).val();
                if (isValidValue(value)) {
                    arr[j] = value;
                }
                else {
                    return null;
                }
            }
            result.push(arr);
        }
        
        return result;
    }
    
    $.fn.setMatrixArray = function(array) {
        var rowsCount = this.getRowsCount(),
            colsCount = this.getColsCount();
        
        if (rowsCount !== array.length || colsCount !== array[0].length) {
            setErrorMode("Не возможно отобразить результат");
        }
        else {
            $(".matrix-row", this).each(function (index1, el1) {
                $(":text", $(el1)).each(function (index2, el2) {
                    $(el2).val(array[index1][index2]);
                });
            });
        }
    }
    
    $.fn.swapMatrix = function($to) {
        var $copy_to = $to.clone(true),
            $copy_from = this.clone(true);
        
        $to.replaceWith($copy_from);
        this.replaceWith($copy_to);
        
        $matrixA = $(".matrix-a", $content);
        $matrixB = $(".matrix-b", $content);
        
        $(".matrix-a + span", $content).text("A");
        $(".matrix-b + span", $content).text("B");
    };
    
    function isValidValue(value) {
        if ((value + "") === "" || +value < 0 || +value > maxValue) {
            return false;
        }
        
        return true;
    }
    
    function refreshResultMatrix() {
        var rowsCountA = $matrixA.getRowsCount(),
            colsCountA = $matrixA.getColsCount(),
            rowsCountB = $matrixB.getRowsCount(),
            colsCountB = $matrixB.getColsCount(),
            i = 0;
            
        if (colsCountA === rowsCountB) {
            $matrixResult.cleanMatrix();
            
            if (rowsCountA > $matrixResult.getRowsCount()) {
                for (i = minRows; i < rowsCountA; i++) {
                    addRow($matrixResult);
                }
            }
            
            if (colsCountB > $matrixResult.getColsCount()) {
                for (i = minCols; i < colsCountB; i++) {
                    addCol($matrixResult);
                }
            }
        }
    }
    
    function setEditMode() {
        $controls.removeClass("normal").removeClass("error").addClass("edit");
        $errorLabel.text("");
    }
    
    function setNormalMode() {
        $controls.removeClass("edit").removeClass("error").addClass("normal");
        $errorLabel.text("");
    }
    
    function setErrorMode(msg) {
        $controls.removeClass("normal").removeClass("edit").addClass("error");
        $errorLabel.text(msg);
    }
    
    function detectIE() {
        var ua = window.navigator.userAgent;
        
        if (ua.indexOf("MSIE ") > 0) {
            return true;
        }
        
        if (ua.indexOf("Trident/") > 0) {
            return true;
        }
        
        if (ua.indexOf("Edge/") > 0) {
            return true;
        }
        
        return false;
    }
    
}());