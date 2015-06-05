var klassName = 'Select';

describe("Test Widget/"+klassName+" :", function() {

	before(function(){
        errorClass = WAF.require('waf-core/error');
    });

    it("core should be loaded",function(){
        expect(WAF).to.not.equal(undefined);
        expect(WAF.require).to.be.an('function');
    });

    it("error class should be loaded",function(){
        expect(errorClass).to.be.an('object');
    });

    var klass = WAF.require(klassName);
    var widget = new klass();

    //set basic data for property item
	widget.items.push({item:"hello", val:"the value"});
	widget.items.push({item:"hello2", val:"the value2"});

	if(widget){

		it('should return a '+klassName+' Widget', function() {
			expect(widget).to.be.a('object').and.to.be.not.undefined;
		});

		// CORE
		it('should register the widget', function() {
			expect(WAF.widgets[widget.id]).to.be.a('object').and.to.be.not.undefined;
		});

		// HTML TEST
		it('should retrieve the id', function() {
			expect(widget.id).to.be.a('string').and.equal(widget.node.id);
		});
		it('should retrieve the kind', function() {
			expect(widget.kind).to.be.a('string').and.equal(widget.node.dataset.type);
		});
		it('should generate a proper html tag', function() {
			expect(widget.kind).to.be.a('string').and.equal(widget.node.dataset.type);
		});

		// PROPERTIES TEST
		it('should disable the widget', function() {
			widget.disable();
			expect(widget._enabled).to.be.false;
		});

		it('should enable the widget', function() {
			widget.enable();
			expect(widget._enabled).to.be.true;
		});

		it('should update the widget node with multiple attribute', function() {
			widget.multiple(true);
			expect(widget.node.hasAttribute("multiple")).to.be.equal(true);
		});

		it('should update the widget node removing the multiple attribute', function() {
			widget.multiple(false);
			expect(widget.node.hasAttribute("multiple")).to.be.equal(false);
		});

		it('Should add item to the property items', function() {
			expect(widget.items()[0].item).to.be.a('string').and.equal("hello");
			expect(widget.items()[0].val).to.be.a('string').and.equal("the value");
		});

		it('Should move item to the given positions in the property items', function() {
			widget.items.move(0,1);
			expect(widget.items()[0].item).to.be.a('string').and.equal("hello2");
			expect(widget.items()[0].val).to.be.a('string').and.equal("the value2");
		});

		it('Should remove item to from the property items', function() {
			widget.items.remove(0);
			expect(widget.items()[0].item).to.be.a('string').and.equal("hello");
		});

		// CLONE
		it('should clone the widget', function() {
			var clonedWidget = widget.clone();
			expect(WAF.widgets[clonedWidget.id]).to.be.not.undefined;
		});

		// DESTROY
		it('should destroy the widget', function() {
			widget.destroy();
			expect(WAF.widgets[widget.id]).to.be.undefined;
		});

	}
});