
var assert = require('assert');

var termDropdown = require('../utils/term-dropdown');


describe("Coder dropdown utility", function(){
    it("should select correct value in list", function(){

        var coderData = [{
            term : "term2"
        }, {
            term : "term1"
        }];

        var coders = termDropdown(coderData);
        console.log(JSON.stringify(coders));

        var coderOne = coders[0];
        assert.equal("", coderOne.terms[0].selected);
        assert.equal("selected", coderOne.terms[1].selected);
        assert.equal("", coderOne.terms[2].selected);

        /*
        var coderTwo = coders[1];
        assert.equal("", coderTwo.terms[0].selected);
        assert.equal("selected", coderTwo.terms[1].selected);
        assert.equal("", coderTwo.terms[2].selected);
        */

        //console.log(JSON.stringify(coders));
    })
});
