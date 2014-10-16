function init(select){
    var documentSelectArray = [].slice.call(arguments, 0);
    console.log(documentSelectArray);
    for (var i = 0; i < documentSelectArray[0].length; i++) {
        new createCustomSelect(documentSelectArray[0][i]);
    };
    console.log("success");
}