(function(){
   this.onload=function(){
    var selects = document.querySelectorAll('select');
    console.log(selects);
    new init(selects);
}
})();