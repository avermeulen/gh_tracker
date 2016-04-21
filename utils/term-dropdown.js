var termList = [{ name : "term1"}, { name : "term2"}, { name :"term3"}];

var termListInstance = function(termList){
    //create a deep clone of term objects
    return termList.map((t) => Object.assign({}, t));
}

module.exports = function(coders, stages){

    stages = stages.map((stage) => {
        return { id : stage.id,
            name : stage.stage_name
        };
    } );

    var coderList = coders.map((coder) => {
        //
        coder.terms = termListInstance(stages).map((term) => {
            var is_match = term.id === coder.stage_id;
            term.selected = is_match ? "selected" : "";
            return term;
        });
        return coder;
    });

    return coderList;

};
