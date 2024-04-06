"use strict"
/// =======================================
///
/// InactJS
///
/// Developed by: Eric Mintz
/// Version: 1.0.0
/// Version Date: 2024/03/31
/// License: GPLv2
///
/// =======================================
///
/// InactJS is a micro-library that builds dynamic HTML. It can be
/// run right from your file system. Just reference it in your HTML
/// file ahead of your own Javascript files. Since your own Javascript
/// doesn't have to import this library, you won't encounter any
/// Cross-Origin Resource Sharing (CORS) restrictions when running it
/// directly from your file system.

class InactJS {

	// -------------------------------------
	//
	// Constructor
	//
	// -------------------------------------

	// You can supply any html element as the "parent" element for
	// InactJS' content. If you don't supply any, it defaults to
	// the body tag.
	constructor(topParent = document.body) {
		this.parents = [topParent]
	}

	// -------------------------------------
	// 
	// Internal Methods
	//
	// -------------------------------------

	/// Create a new content element or container element.
	_createElement({
		type,					// element type (div, p, span, etc) - required
		text,					// text for content elements - not required
		parent,					// parent element (defaults to last this.parents)
		attributes,				// array of attribute key/value pairs (eg., [{id:'myID'}]
		noAppendParent=false,	// don't append the new element to anything
		isContainer=false		// the new element is a container element
	}) {

		const element = document.createElement(type)

		// add text, if any, to the element
		if (text) {
			const textNode = document.createTextNode(text)
			element.appendChild(textNode)
		}

		// add any attributes if they're supplied
		if (attributes) {
			this._setAttributes(element,attributes)
		}

		// append the new element to the parent element (the default behavior)
		// unless explicitly asked not to
		if (!noAppendParent) {
			(parent || this._getParent()).appendChild(element)
		}

		// if this new element is a container element, then push it onto
		// the "parents" stack. Subsequent elements will be automatically
		// added to this new parent element (the default behavior) until
		// the parent is popped off of the parents stack.
		if (isContainer) {
			this.parents.push(element)
		}

		return element
	}

	// ...just a little syntactic sugar to get the currently openned parent
	// container.
	_getParent() {
		return this.parents[this.parents.length - 1]
	}

	// Add any attributes to the element
	_setAttributes(element,attributes) {

		// loop through the array of objects that's shaped like:
		// [
		//    {id:'myElement'},
		//    {class:'class1 class2'},
		//    {attribName1:'attribValue1'},
		//    {attribNameN:'attribValueN'}
		// ]
		attributes.forEach( attribute => {
			// convert the attribute object to an array of arrays
			// of key/value pairs. So:
			// [
			//     ["id","myElement"],
			//     ["class","class1 class2"]
			// ]
			const atts =(Object.entries(attribute))
			// then add all of the attributes
			atts.forEach(att => {
				if (att.length == 2) {
					element.setAttribute(att[0], att[1])
				}
			})
		})
	}

	// ...just a little syntactic sugar for creating container elements
	_container(args) { return this._createElement({...args,isContainer:true})}
	
	// -------------------------------------
	//
	// Public methods
	// -------------------------------------

	// Pop the current parent element off of the parents stack. Functionally,
	// it's like closing the openned container tag.
	_() {
		if (this.parents.length > 1) {
			this.parents.pop()
		}
		return this._getParent()
	}

	// -------------------------------------
	//
	// Content Elements
	//
	// -------------------------------------
	// (add more tags as needed)

	h1(text,args) { return this._createElement({...args,type:'h1',text:text})}
	h2(text,args) { return this._createElement({...args,type:'h2',text:text})}
	h3(text,args) { return this._createElement({...args,type:'h3',text:text})}
	h4(text,args) { return this._createElement({...args,type:'h4',text:text})}
	h5(text,args) { return this._createElement({...args,type:'h5',text:text})}
	h6(text,args) { return this._createElement({...args,type:'h6',text:text})}
	p(text,args) { return this._createElement({...args,type:'p',text:text})}
	li(text,args) { return this._createElement({...args,type:'li', text:text})}
	input(args) { return this._createElement({...args,type:'input'})}
	label(text,args) { return this._createElement({...args,type:'label', text:text})}
	th(text,args) { return this._createElement({...args,type:'th', text:text})}
	td(text,args) { return this._createElement({...args,type:'td', text:text})}

	// -------------------------------------
	//
	// Container Elements
	//
	// -------------------------------------
	// (add more tags as needed)

	div(args) { return this._container({...args,type:'div'})}
	span(args) { return this._container({...args,type:'span'})}
	section(args) { return this._container({...args,type:'section'})}
	article(args) { return this._container({...args,type:'article'})}
	form(args) { return this._container({...args,type:'form'})}
	ul(args) { return this._container({...args,type:'ul'})}
	ol(args) { return this._container({...args,type:'ol'})}
	table(args) { return this._container({...args,type:'table'})}
	tr(args) { return this._container({...args,type:'tr'})}

	// -------------------------------------
	//
	// Data Elements
	//
	// -------------------------------------
	// (add more tags as needed)

	thead(args) {
		const thead = this._container({...args,type:'thead',isContainer:false})
		if (args && 'headings' in args) {
			args.headings.forEach ( row => {
				this.tr({parent:thead})
					row.forEach ( cell => {
						this.th ( cell )
					})
				this._()
			})
		this._()
		}
		return thead
	}
	tbody(args) {
		const tbody = this._container({...args,type:'tbody',isContainer:false})
		if (args && 'data' in args) {
			args.data.forEach ( row => {
				this.tr({parent:tbody})
					row.forEach ( cell => {
						this.td ( cell )
					})
				this._()
			})
		this._()
		}
		return tbody
	}
	tfoot(args) {
		const tfoot = this._container({...args,type:'tfoot',isContainer:false})
		if (args && 'footer' in args) {
			args.footer.forEach ( row => {
				this.tr({parent:tfoot})
					row.forEach ( cell => {
						this.th ( cell )
					})
				this._()
			})
		this._()
		}
		return tfoot
	}
}
