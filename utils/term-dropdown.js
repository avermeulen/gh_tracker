var termList = [{ name : "term1"}, { name : "term2"}, { name :"term3"}];

var termListInstance = function(){
    //create a deep clone of term objects
    return termList.map((t) => Object.assign({}, t));
}

module.exports = function(coders){

    var coderList = coders.map((coder) => {
        //
        coder.terms = termListInstance().map((term) => {
            var is_match = term.name === coder.term;
            if (is_match){
                term.selected = "selected";
            }
            else{
                term.selected = "";
            }
            return term;
        });

        return coder;
    });

    return coderList;

};
