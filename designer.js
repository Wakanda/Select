(function(Select) {
    "use strict";

    /* globals Designer */

    Select.setWidth('200');
    Select.setHeight('25');

    Select.addLabel();

    Select.doAfter('init', function() {
        this.subscribe('datasourceBindingChange', 'value', function(event) {
            var binding = event.data;
            hideAttributes(this, binding);
        }, this);

        this.synchronize.onChange(function() {
            if(this.synchronize()) {
                this.value.oldBinding = this.value.boundDatasource();
                if(this.value.oldBinding) {
                    this.value.oldBinding = this.value.oldBinding.toString();
                }
                this.value.bindDatasource('');
            } else {
                this.value.bindDatasource(this.value.oldBinding);
                delete this.value.oldBinding;
            }
            var binding = this.value.boundDatasource();
            hideAttributes(this, binding);
        });

        /*var that = this;
        $($$(this.id)).bind('onDomUpdate', function(e, element) {
            that.init();
        });*/

    });

    Select.setPanelStyle({
        'text': true,
        'sizePosition': true
    });

    Select._studioOn('propertyPanelReady', function() {
        var binding = this.getWidget().value.boundDatasource();
        hideAttributes(this.getWidget(), binding);
    });

    Select.customizeProperty('synchronize', {title: 'Synchronize items'});
    Select.customizeProperty('allowEmpty', {title: 'Display empty value'});

    function hideAttributes(widget, binding) {
        widget.value.show();
        Designer.ui.form.property.showAttribute('data-items-attribute-value');
        Designer.ui.form.property.showAttribute('data-static-binding-items');

        if(widget.synchronize()) {
            widget.value.hide();
            Designer.ui.form.property.hideAttribute('data-items-attribute-value');
        } else if(binding && binding.datasourceName) {
            var attribute = getAttribute(binding.datasourceName, binding.attribute);
            if(attribute && attribute.kind === "relatedEntity") {
                Designer.ui.form.property.hideAttribute('data-items-attribute-value');
                Designer.ui.form.property.hideAttribute('data-static-binding-items');

                var itemsBinding = widget.items.boundDatasource();
                if(!itemsBinding || !itemsBinding.datasourceName) {
                    widget.items(attribute.path);
                }
            }
        }
    }

    function getAttribute(datasourceName, attributeName) {
        var ds = Designer.env.ds.catalog.getByName(datasourceName);
        if(!ds) {
            return null;
        }
        attributeName = attributeName.split('.');
        var first = attributeName.shift();
        var att = ds.getAttribute(first);

        if(!attributeName.length) {
            return att;
        }

        if(att.kind !== 'relatedEntity' && att.kind !== 'relatedEntities') {
            return null;
        }
        return getAttribute(att.path, attributeName.join('.'));
    }
});
