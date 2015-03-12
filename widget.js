WAF.define('Select', ['waf-core/widget'], function(widget) {
    "use strict";

    /* @todo allow multi selection using the proterty multiple currently disabled */

    var select = widget.create('Select', {
        tagName: 'select',
        selectItem: widget.property({ type: 'boolean', bindable: false }),
        value: widget.property(),
        items: widget.property({
            type: 'datasource',
            attributes: [{
                name: 'value'
            }, {
                name: 'label'
            }],
            pageSize: 40
        }),
        limit: widget.property({ type: 'integer', defaultValue: 40, bindable: false }),
        allowEmpty: widget.property({ type: 'boolean', bindable: false }),
        /*multiple: widget.property({
            type: 'boolean',
            description: "For select controls with the multiple attribute, multiple options are shown by default.",
            defaultValue: false,
            bindable: false
        }),*/
        render: function(elements) {

            if(!this.items()) {
                this.node.innerHTML = '';
                return;
            }
            var s = '';
            var position = 0;
            var that = this;

            if (this.items())
                position = this.items().getPosition();

            if(this.allowEmpty()) {
                s += '<option></option>';
            }
            s += elements.map(function(i, index) {
                return that._getMarkup(i, position, index);
            }).join('');
            this.node.innerHTML = s;
            this._valueChangeHandler();
        },
        _valueChangeHandler: function() {
            var value = this.value();
            var opt = $('[value=' + (value || '') + ']', this.node).get(0);
            if(opt) {
                opt.selected = true;
            } else {
                this.fire('errorNotFound');
            }
        },
        _getRelatedDataClass: function() {
            var bound = this.value.boundDatasource();
            if(!bound || !bound.valid) {
                return null;
            }
            var attribute = bound.datasource.getAttribute(bound.attribute);
            if(attribute.kind === 'relatedEntity' && WAF.ds.getDataClass(attribute.type)) {
                return attribute.type;
            }
            return null;
        },
        _initBinding: function() {
            var dataClass = this._getRelatedDataClass();

            // force value attribute to the key
            if(this.selectItem() || dataClass) {
                if(this.items()) {
                    dataClass = this.items().getDataClass();
                }
                var map = this.items.mapping();
                if(dataClass instanceof WAF.DataClass) {
                    map.value = dataClass._private.primaryKey;
                } else {
                    for(var k in dataClass) {
                        if(dataClass[k].isKey) {
                            map.value = k;
                        }
                    }
                }
                this.items.mapping(map);
            }

            if(!dataClass) {
                return;
            }

            if(this.items() && this.items().getDataClass() === dataClass) {
                return;
            }
            // create a datasource
            var datasource = WAF.dataSource.create({ binding: dataClass });
            this.items(datasource);
            datasource.all();
            // FIXME: destroy the created datasource
        },
        init: function() {
            if (this.multiple)
                this.multiple.onChange(function(){ this._setMultiple(); });
            this._subscriber = this.value.onChange(this._valueChangeHandler);
            this._initBinding();
            this.subscribe('datasourceBindingChange', 'value', this._initBinding, this);

            this.items.onPageChange(this.render);

            this.items.fetch({ pageSize: this.limit() });
            this.limit.onChange(function() {
                this.items.fetch({ pageSize: this.limit() });
            });

            $(this.node).on('change', function(event, wakEvent) {
                if(wakEvent) { return; }
                var position = this.getSelectedIndex();
                this._setValueByPosition(position);
            }.bind(this));

            if(this.selectItem()) {
                this._selectSubscriber = this.items.subscribe('currentElementChange', function() {
                    var position = this.items().getPosition();
                    this.node.selectedIndex = position + (this.allowEmpty() ? 1 : 0);
                    this._setValueByPosition(position);
                }, this);
            }
        },
        _setValueByPosition: function(position) {
            this._subscriber.pause();
            // FIXME: to simplify when setAttributeValue accept KEY for relatedEntity
            if(this._getRelatedDataClass()) {
                var bound = this.value.boundDatasource();
                if(position < 0) {
                    this.value(null);
                    bound.datasource[bound.attribute].set(null);
                } else {
                    this.items().getEntityCollection().getEntity(position, function(event) {
                        bound.datasource[bound.attribute].set(event.entity);
                    }.bind(this));
                }
            } else {
                if(position < 0) {
                    this.value(null);
                } else {
                    this.items().getElement(position, function(event) {
                        var element = this.items.mapElement(event.element);
                        this.value(element.value);
                    }.bind(this));
                }
            }
            this._subscriber.resume();

            if(this.selectItem()) {
                this._selectSubscriber.pause();
                this.items().select(position);
                this._selectSubscriber.resume();
            }
        },
        _setMultiple: function() {

            if (this.node.hasAttribute("multiple")) {
                this.node.removeAttribute("multiple");
            } else {
                this.node.setAttribute("multiple", true);
            }
        },
        _getMarkup: function(o, position, index) {
            return '<option value="' + o.value + '"' + (position === index ? ' selected' : '') + '>' + o.label + '</option>';
        },
        getSelectedIndex: function() {
            var position = this.node.selectedIndex;
            if(this.allowEmpty()) {
                return position - 1;
            }
            return position;
        }
    });

    select.addClass("form-control");

    return select;

});
