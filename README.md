## Select Widget for [Wakanda](http://wakanda.org)
The __Select__ widget allows you to display a drop down menu,
* to select the value of an item from a datasource
* or to assign an entity to a relatedEntity attribute
* or to select the current element of a datasource

### Properties
This widget has the following properties:

* __selectItem__: If true, the current element of the items datasource will be synced with the selected item of the widget
* __value__: The value of the curretly selected item, could be bound to an scalar attribute to save the value, or boud to a relatedEntity attribute to set the entity pointed by this attribute
* __items__: the datasource or the dataclass containing the items to show in the menu
** Attribute value: The attribute that describe the value that ill be copied in the value property when you select an item in the list
** Attribute label: The label displayed for each item
* __limit__: the maximum number of items to show in the drop down menu
* __allowEmpty__: add an empty row as the first item in the list

### Events

* __change__

### More Information
You can install a custom widget by using the [Add-ons Extension](http://doc.wakanda.org/WakandaStudio/help/Title/en/page4263.html "Add-ons Extension"). For more information, refer to the [Installing a Custom Widget](http://doc.wakanda.org/WakandaStudio/help/Title/en/page3869.html#1056003 "Installing a Custom Widget") manual.

For more information about creating a custom widget, refer to the [Widgets v2 Creating a Widget](http://doc.wakanda.org/Wakanda/help/Title/en/page3849.html "Widgets v2 Creating a Widget") manual.
