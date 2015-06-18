/* jshint ignore:start */
// this declaration should be global
var youWidgetNameKlass = WAF.require('Select');

describe('Widget/Select :', function() {
    var klass = youWidgetNameKlass,
        widget;

    before(function() {
        if (typeof WAF == "undefined") {
            console.error("WAF is not loaded!");
        } else if (typeof WAF.require == "undefined") {
            console.error("WAF.require is not available!");
        }


    });

    beforeEach(function() {
        // instantiate a new widget before each test it(...)
        widget = new klass();
        
        var data = [ {item:"hello", val:"the value"}, {item:"hello2", val:"the value2"} ];
        window.sources = window.source = {
            source: new WAF.DataSourceVar({
                "variableReference": data,
                "data-attributes": 'item:string,val:string'
            })
        };

        widget.items(source.source);
        widget.items.mapping({value: "val", label: "item"});
        widget.items().sync();

    });

    describe('Widget instantiation', function() {
        
        it('should return a widget object', function() {
            expect(widget).to.be.a('object').and.to.be.not.undefined;
        });

        it('should create a <select> node element', function() {
            expect(widget.node).to.be.not.undefined;
            expect(widget.node.tagName).to.be.equal('SELECT');
        });

        it('should provide bootstrap classes (form-control)', function() {
            // check well bootstrap class
            expect($(widget.node).hasClass('form-control')).to.be.true;
        });

    });

    describe('Widget initialization', function() {

        it('should be binded correctly', function() {
            
            expect(widget.items().val).to.be.equal('the value');

        });
 
        it('should have the right number of options', function() {
            
            var l =  widget.node.getElementsByTagName("option").length;
            expect(l).to.be.equal(2);

        });

         it('should display the right label / value', function() {
            
            var dsLabel = widget.items().item;
            var dsVal = widget.items().val;
            
            var htmlLabel = widget.node.getElementsByTagName("option")[0].innerText;
            var htmlval = widget.node.getElementsByTagName("option")[0].value;

            expect(dsLabel).to.be.equal(htmlLabel);
            expect(dsVal).to.be.equal(htmlval);
        });

    });

});