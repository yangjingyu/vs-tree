function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function n(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}function a(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function s(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function r(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?s(Object(i),!0).forEach((function(t){a(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function o(e){return function(e){if(Array.isArray(e))return h(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return h(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);"Object"===i&&e.constructor&&(i=e.constructor.name);if("Map"===i||"Set"===i)return Array.from(e);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return h(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function d(e,t){var i=function(e){for(var t=e,i=0,n=0;t&&!isNaN(t.offsetLeft)&&!isNaN(t.offsetTop);)i+=t.offsetLeft-t.scrollLeft,n+=t.offsetTop-t.scrollTop,t=t.offsetParent;return{top:n,left:i}}(t.dom).top,n=t.dom.offsetHeight,a=e.pageY;return a>i+n-5?1:a<i+2?-1:0}var c,l=0,u=function(){function i(n){var a=this;if(t(this,i),this.id=l++,this.checked=!1,this.expanded=!1,this.indeterminate=!1,this.visbile=!1,this.disabled=!1,this.loaded=!1,this.isLeaf=!1,this.level=0,this.childNodes=[],this.store=n.store,this.parent=n.parent,this.data=n.data,"function"==typeof this.store.format&&!n.data._vsroot){var s=this.store.format(Object.assign({},n.data),this);if("object"!==e(s))throw new Error("format must return object! \nformat: function(data) {\n  return {id, name, children, isLeaf}\n}");["id","name","children","isLeaf","icon","extra"].forEach((function(e){Object.prototype.hasOwnProperty.call(s,e)&&(a.data[e]=s[e])}))}this.store.expandKeys.includes(this.data.id)&&(this.expanded=!0),this.store.disabledKeys.includes(this.data.id)&&(this.disabled=!0),this.parent&&(this.level=this.parent.level+1),this.data&&this.setData(this.data),this.initData()}return n(i,[{key:"initData",value:function(){var e;!(this.level>this.store.expandLevel&&-1!==this.store.expandLevel)||null!==(e=this.parent)&&void 0!==e&&e.expanded?this.visbile=!0:this.visbile=!1}},{key:"createNode",value:function(){var e=this;if(this.dom)return this.checkboxNode&&(this.checkboxNode.checked=this.checked),this.radioNode&&(this.radioNode.checked=this.checked),this.dom;var t=document.createElement("div");return t.className="vs-tree-node",t.setAttribute("vs-index",this.id),!this.isLeaf&&this.childNodes.length&&t.setAttribute("vs-child",!0),t.appendChild(this.createInner()),this.store.renderContent&&t.appendChild(this.createContent()),t.addEventListener("click",(function(i){i.stopPropagation(),e.store.highlightCurrent&&(e.store.selectedCurrent&&e.store.selectedCurrent.dom.classList.remove("selected"),t.classList.add("selected")),e.store.checkOnClickNode&&!e.disabled&&e.handleCheckChange({target:{checked:!e.checked}}),e.store.selectedCurrent=e,e.store.click(i,e)}),{passive:!1}),t.addEventListener("contextmenu",(function(t){e.store.contextmenu&&"function"==typeof e.store.contextmenu&&(t.stopPropagation(),t.preventDefault(),e.store.contextmenu(t,e))})),this.store.draggable&&this.createDragable(t),this.dom=t,t}},{key:"createInner",value:function(){var e=document.createElement("div");e.className="vs-tree-inner";var t,i,n=this.store.hideRoot?-1:0;if(this.store.showLine)for(var a=0;a<this.level+n;a++){var s=document.createElement("span");s.className="vs-indent-unit",e.appendChild(s)}else e.style.paddingLeft=(this.level+n)*this.store.indent+"px";this.store.strictLeaf?t=this.isLeaf?this.createExpandEmpty():this.createExpand():t=(null!==(i=this.childNodes)&&void 0!==i&&i.length||this.store.lazy)&&!this.isLeaf?this.createExpand():this.createExpandEmpty();return e.appendChild(t),(this.store.showCheckbox||this.store.showRadio)&&(this.store.nocheckParent&&this.childNodes.length||e.appendChild(this.createCheckbox())),this.store.showIcon&&(this.store.onlyShowLeafIcon&&this.childNodes.length&&!this.isLeaf||e.appendChild(this.createIcon())),e.appendChild(this.createText()),e}},{key:"cusmtomNode",value:function(e,t){var i=this,n=document.createElement(e);return t.text&&(n.innerText=t.text),t.className&&(n.className=t.className),t.children&&t.children.forEach((function(e){n.appendChild(e)})),"function"==typeof t.click&&n.addEventListener("click",(function(e){e.stopPropagation(),t.click(e,i)}),{passive:!1}),n}},{key:"createContent",value:function(){var e=this.store.renderContent(this.cusmtomNode.bind(this),this);return e?(e.addEventListener("click",(function(e){e.stopPropagation()}),{passive:!1}),e):document.createElement("span")}},{key:"createExpandEmpty",value:function(){var e=document.createElement("span");return e.className="expand-empty "+this.store.expandClass,e}},{key:"createExpand",value:function(){var e=this,t=document.createElement("span");return t.className="expand "+this.store.expandClass,(this.level<this.store.expandLevel||-1===this.store.expandLevel||this.expanded)&&(t.classList.add("expanded"),this.expanded=!0),t.addEventListener("click",(function(i){if(i.stopPropagation(),!e.loading){var n=!t.classList.contains("expanded");e.setExpand(n)}}),{passive:!1}),this.expandEl=t,t}},{key:"createCheckbox",value:function(){var e=this,t="checkbox";this.store.showRadio&&(t="radio");var i=document.createElement("label");i.className="vs-".concat(t);var n=document.createElement("span");n.className="vs-".concat(t,"__inner");var a=document.createElement("input");return a.type=t,a.checked=this.checked,a.disabled=this.disabled,a.className="vs-".concat(t,"__original"),a.name="radio"===t?"vs-radio"+(this.store.radioParentoOnly?this.parent.id:""):"vs-checkbox","radio"===t?(a.name="vs-radio"+(this.store.radioParentoOnly?this.parent.id:""),this.radioNode=a):(a.name="vs-checkbox",this.checkboxNode=a),i.appendChild(a),i.appendChild(n),i.addEventListener("click",(function(e){e.stopPropagation()}),{passive:!1}),a.addEventListener("click",(function(t){e.store.check(t,e)}),{passive:!1}),a.addEventListener("change",(function(t){t.stopPropagation(),e.handleCheckChange(t)})),this.checkboxEl=a,i}},{key:"handleCheckChange",value:function(e){var t=e.target.checked;if("function"!=typeof this.store.beforeCheck||this.store.beforeCheck(this)){if(t&&this.store.checkMaxNodes(this))return this.store.limitAlert(),void(e.target.checked=!1);this.store.showRadio?this.updateRadioChecked(t):(this.updateChecked(t),this.updateCheckedParent(t)),this.store.change(this)}else e.target.checked=!t}},{key:"createText",value:function(){var e=document.createElement("span");return e.innerText=this.data.name,e.className="vs-tree-text",e}},{key:"createIcon",value:function(){var e=document.createElement("span");return e.className=this.isLeaf||!this.childNodes.length?"vs-icon-leaf":"vs-icon-parent",this.data.icon&&(this.data.icon instanceof HTMLElement?(e.style.backgroundImage="none",e.appendChild(this.data.icon)):e.classList.add(this.data.icon)),e}},{key:"setData",value:function(e){var t;this.store.dataMap.set(e.id,this),this.store.nodeMap.set(this.id,this),this.data=e,this.childNodes=[],"boolean"==typeof e.isLeaf?this.isLeaf=e.isLeaf:e.children||this.store.lazy||(this.isLeaf=!0),(t=0===this.level&&this.data instanceof i?this.data:this.data.children||[]).length&&(this.loaded=!0);for(var n=0,a=t.length;n<a;n++)this.insertChild({data:t[n]})}},{key:"insertChild",value:function(e){return e instanceof i||(Object.assign(e,{parent:this,store:this.store}),e=new i(e)),e.level=this.level+1,this.childNodes.push(e),e}},{key:"updateExpand",value:function(e){var t=this;this.childNodes.length&&this.childNodes.forEach((function(i){e&&t.expanded?i.visbile=!0:i.visbile=!1,i.updateExpand(e)}))}},{key:"updateChecked",value:function(e){this.disabled||(this.checked=e,this.sortId=Date.now(),this.checkboxNode&&(this.checkboxNode.checked=e),this.parent&&(this.parent.indeterminate=!1),this.dom&&this.dom.classList.remove("is-indeterminate"),this.childNodes.length&&this.childNodes.forEach((function(t){t.updateChecked(e)})))}},{key:"updateCheckedParent",value:function(){if(this.parent&&!this.store.nocheckParent){var e=this.parent.childNodes.every((function(e){return e.checked})),t=this.parent.childNodes.some((function(e){return e.checked||e.indeterminate}));e?(this.parent.checked=!0,this.parent.indeterminate=!1,this.parent.checkboxNode&&(this.parent.checkboxNode.checked=!0),this.parent.dom&&this.parent.dom.classList.remove("is-indeterminate")):t?(this.parent.checked=!1,this.parent.indeterminate=!0,this.parent.checkboxNode&&(this.parent.checkboxNode.checked=!1),this.parent.dom&&this.parent.dom.classList.add("is-indeterminate")):(this.parent.checked=!1,this.parent.indeterminate=!1,this.parent.checkboxNode&&(this.parent.checkboxNode.checked=!1),this.parent.dom&&this.parent.dom.classList.remove("is-indeterminate")),this.parent.updateCheckedParent()}}},{key:"updateRadioChecked",value:function(e){this.store.radioParentoOnly?(this.store.radioMap[this.parent.id]&&(this.store.radioMap[this.parent.id].checked=!1),this.store.radioMap[this.parent.id]=this):(this.store.radioNode&&(this.store.radioNode=!1),this.store.radioNode=this),this.checked=e,this.radioNode&&(this.radioNode.checked=e)}},{key:"setChecked",value:function(e,t){!t&&this.disabled||(this.store.showRadio?this.updateRadioChecked(e):this.store.showCheckbox&&(this.updateChecked(e),this.updateCheckedParent(e)))}},{key:"setDisabled",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.disabled=e,this.checkboxEl&&(this.checkboxEl.disabled=e)}},{key:"setExpand",value:function(e,t){var i=this;this.expanded=e,this.updateExpand(this.expanded),this.setAccordion(e),this.expandEl&&(e?this.expandEl.classList.add("expanded"):this.expandEl.classList.remove("expanded")),this.store.lazy&&!this.loaded?this.loadData((function(e){e&&!t&&i.storeUpdate()})):!t&&this.storeUpdate()}},{key:"storeUpdate",value:function(){this.store.animation?this.createAnimation():this.store.update()}},{key:"createAnimation",value:function(){var e=this;this.transitionNode&&this.transitionNode.parentNode&&this.transitionNode.parentNode.removeChild(this.transitionNode);var t,i,n,a=document.createElement("div");if(a.className="vs-transition",this.childNodes.length>this.store.showCount)for(var s=0;s<this.store.showCount-1;s++){var r=this.childNodes[s];a.appendChild(r.dom||r.createNode())}else this.childNodes.forEach((function(e){a.appendChild(e.dom||e.createNode())}));t=a,i=this.dom,(n=i.parentNode).lastChild===i?n.appendChild(t):n.insertBefore(t,i.nextSibling);var o=(this.childNodes.length>this.store.showCount?this.store.showCount:this.childNodes.length)*this.store.itemHeight+"px";this.expanded?setTimeout((function(){a.style.height=o}),0):(a.style.height=o,setTimeout((function(){a.style.height=0}),0));a.addEventListener("transitionend",(function t(){a.removeEventListener("transitionend",t),a.parentNode&&a.parentNode.removeChild(a),a.removeEventListener("transitionend",t),e.store.update()})),this.transitionNode=a}},{key:"createDragable",value:function(e){var t=this;e.draggable=!0,e.addEventListener("dragstart",(function(e){console.log(e)})),e.addEventListener("dragenter",(function(i){i.stopPropagation();var n=i.target.getAttribute("vs-index");if(n){var a=d(i,t);e===i.target&&0===a||(console.log(t.store.nodeMap),console.log(t.store.nodeMap.get(Number(n))),i.target.classList.add("vs-drag-enter"),-1===a&&(i.target.classList.remove("vs-drag-over-gap-bottom"),i.target.classList.add("vs-drag-over-gap-top")),1===a&&(i.target.classList.remove("vs-drag-over-gap-top"),i.target.classList.add("vs-drag-over-gap-bottom")))}})),e.addEventListener("dragleave",(function(e){e.target.classList.remove("vs-drag-enter"),e.target.classList.remove("vs-drag-over-gap-bottom"),e.target.classList.remove("vs-drag-over-gap-top")}))}},{key:"setAccordion",value:function(e){if(this.store.accordion&&this.parent&&e){var t=this.store.expandMap[this.parent.id];if(t===this)return;t&&t.setExpand(!1),this.store.expandMap[this.parent.id]=this}}},{key:"loadData",value:function(e){var t=this;if(!this.loading){this.loading=!0,this.expandEl&&this.expandEl.classList.add("is-loading");this.store.load(this,(function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];t.loaded=!0,t.loading=!1,t.expandEl&&t.expandEl.classList.remove("is-loading"),i.length&&(i.forEach((function(e){t.insertChild({data:e,store:t.store})})),t.childNodes[0].updateCheckedParent(),t.store.updateNodes()),e&&e.call(t,i)}))}}},{key:"remove",value:function(){var e=this,t=this.parent;if(t){var i=t.childNodes||[],n=i.findIndex((function(t){return t.id===e.id}));n>-1&&i.splice(n,1),this.store.updateNodes()}}},{key:"append",value:function(t){if(t&&"object"===e(t)){var i=this.dom;0!==this.childNodes.length&&(i=null);var n=this.insertChild({data:t,store:this.store});i&&(delete this.dom,i.parentNode.replaceChild(this.createNode(),i)),n.updateCheckedParent(),this.store.updateNodes()}}}]),i}(),f=function(){function e(i){for(var n in t(this,e),i)Object.prototype.hasOwnProperty.call(i,n)&&(this[n]=i[n]);this.nodes=[],this.dataMap=new Map,this.nodeMap=new Map,this.radioMap={},this.expandMap={},this.root=new u({data:this.data,store:this})}return n(e,[{key:"setData",value:function(e){this.root.setData(e),this.updateNodes()}},{key:"updateNodes",value:function(){this.nodes=this.flattenTreeData(),this.nodesChange(this.nodes)}},{key:"flattenTreeData",value:function(){var e=[];return function t(i){e.push(i),i.childNodes&&i.childNodes.length&&i.childNodes.forEach((function(e){t(e)}))}(this.root),e}},{key:"getNodeById",value:function(e){return this.dataMap.get(e)}},{key:"getCheckedNodes",value:function(){var e=this,t=this.nodes.filter((function(t){return t.checked&&!t.data._vsroot&&e._checkVerify(t)&&(!e.nocheckParent||!t.childNodes.length)}));return this.sort?t.sort((function(e,t){return e.sortId-t.sortId})).map((function(e){return e.data})):t.map((function(e){return e.data}))}},{key:"setDefaultChecked",value:function(){var e=this;this.checkedKeys.forEach((function(t){var i=e.getNodeById(t);i?i.setChecked(!0,!0):console.warn("not found node by "+t)}))}},{key:"checkMaxNodes",value:function(e){if(!this.max)return!1;if(!e.checked&&e.hasChildCount>this.max)return!0;var t=this.getCheckedNodes().length;return!e.checked&&t+(e.isLeaf?1:this.getUnCheckLeafsCount(e))>this.max}},{key:"getUnCheckLeafsCount",value:function(e){var t=this,i=this._checkVerify(e)&&!e.checked?1:0;return e.childNodes.forEach((function(e){i+=t.getUnCheckLeafsCount(e)})),i}},{key:"_checkVerify",value:function(e){return"function"==typeof this.checkFilter?this.checkFilter(e):!this.checkFilterLeaf||e.isLeaf}}]),e}(),p="FRONT",v="BEHIND",g="INIT",m="FIXED",k="DYNAMIC",y=function(){function e(i,n){t(this,e),this.init(i,n)}return n(e,[{key:"init",value:function(e,t){this.param=e,this.callUpdate=t,this.sizes=new Map,this.firstRangeTotalSize=0,this.firstRangeAverageSize=0,this.lastCalcIndex=0,this.fixedSizeValue=0,this.calcType=g,this.offset=0,this.direction="",this.range=Object.create(null),e&&this.checkRange(0,e.keeps-1)}},{key:"destroy",value:function(){this.init(null,null)}},{key:"getRange",value:function(){var e=Object.create(null);return e.start=this.range.start,e.end=this.range.end,e.padFront=this.range.padFront,e.padBehind=this.range.padBehind,e}},{key:"isBehind",value:function(){return this.direction===v}},{key:"isFront",value:function(){return this.direction===p}},{key:"getOffset",value:function(e){return(e<1?0:this.getIndexOffset(e))+this.param.slotHeaderSize}},{key:"updateParam",value:function(e,t){var i=this;this.param&&e in this.param&&("uniqueIds"===e&&this.sizes.forEach((function(e,n){t.includes(n)||i.sizes.delete(n)})),this.param[e]=t)}},{key:"saveSize",value:function(e,t){this.sizes.set(e,t),this.calcType===g?(this.fixedSizeValue=t,this.calcType=m):this.calcType===m&&this.fixedSizeValue!==t&&(this.calcType=k,delete this.fixedSizeValue),this.calcType!==m&&void 0!==this.firstRangeTotalSize&&(this.sizes.size<Math.min(this.param.keeps,this.param.uniqueIds.length)?(this.firstRangeTotalSize=o(this.sizes.values()).reduce((function(e,t){return e+t}),0),this.firstRangeAverageSize=Math.round(this.firstRangeTotalSize/this.sizes.size)):delete this.firstRangeTotalSize)}},{key:"handleDataSourcesChange",value:function(){var e=this.range.start;this.isFront()?e-=2:this.isBehind()&&(e+=2),e=Math.max(e,0),this.updateRange(this.range.start,this.getEndByStart(e))}},{key:"handleSlotSizeChange",value:function(){this.handleDataSourcesChange()}},{key:"handleScroll",value:function(e){this.direction=e<this.offset?p:v,this.offset=e,this.param&&(this.direction===p?this.handleFront():this.direction===v&&this.handleBehind())}},{key:"handleFront",value:function(){var e=this.getScrollOvers();if(!(e>this.range.start)){var t=Math.max(e-this.param.buffer,0);this.checkRange(t,this.getEndByStart(t))}}},{key:"handleBehind",value:function(){var e=this.getScrollOvers();e<this.range.start+this.param.buffer||this.checkRange(e,this.getEndByStart(e))}},{key:"getScrollOvers",value:function(){var e=this.offset-this.param.slotHeaderSize;if(e<=0)return 0;if(this.isFixedType())return Math.floor(e/this.fixedSizeValue);for(var t=0,i=0,n=0,a=this.param.uniqueIds.length;t<=a;){if(i=t+Math.floor((a-t)/2),(n=this.getIndexOffset(i))===e)return i;n<e?t=i+1:n>e&&(a=i-1)}return t>0?--t:0}},{key:"getIndexOffset",value:function(e){if(!e)return 0;for(var t=0,i=0,n=0;n<e;n++)t+="number"==typeof(i=this.sizes.get(this.param.uniqueIds[n]))?i:this.getEstimateSize();return this.lastCalcIndex=Math.max(this.lastCalcIndex,e-1),this.lastCalcIndex=Math.min(this.lastCalcIndex,this.getLastIndex()),t}},{key:"isFixedType",value:function(){return this.calcType===m}},{key:"getLastIndex",value:function(){return this.param.uniqueIds.length-1}},{key:"checkRange",value:function(e,t){var i=this.param.keeps;this.param.uniqueIds.length<=i?(e=0,t=this.getLastIndex()):t-e<i-1&&(e=t-i+1),this.range.start!==e&&this.updateRange(e,t)}},{key:"updateRange",value:function(e,t){this.range.start=e,this.range.end=t,this.range.padFront=this.getPadFront(),this.range.padBehind=this.getPadBehind(),this.callUpdate(this.getRange())}},{key:"getEndByStart",value:function(e){var t=e+this.param.keeps-1;return Math.min(t,this.getLastIndex())}},{key:"getPadFront",value:function(){return this.isFixedType()?this.fixedSizeValue*this.range.start:this.getIndexOffset(this.range.start)}},{key:"getPadBehind",value:function(){var e=this.range.end,t=this.getLastIndex();return this.isFixedType()?(t-e)*this.fixedSizeValue:this.lastCalcIndex===t?this.getIndexOffset(t)-this.getIndexOffset(e):(t-e)*this.getEstimateSize()}},{key:"getEstimateSize",value:function(){return this.isFixedType()?this.fixedSizeValue:this.firstRangeAverageSize||this.param.estimateSize}}]),e}(),x=function(){function e(i){t(this,e),this.range=null,this.$el=i.root,this.$el.style.maxHeight=i.maxHeight||"400px",this.$el.style.overflowY="auto",this.dataSources=i.data,this.wrapper=document.createElement("div"),this.wrapper.className="vs-virtual-list",this.$el.appendChild(this.wrapper),this.$el.addEventListener("scroll",this.onScroll.bind(this),{passive:!1}),this.keeps=i.keeps||20,this.estimateSize=i.estimateSize||26,this.dataKey="id",this.installVirtual()}return n(e,[{key:"getOffset",value:function(){var e=this.$el;return e?Math.ceil(e.scrollTop):0}},{key:"getClientSize",value:function(){var e=this.$el;return e?Math.ceil(e.clientHeight):0}},{key:"getScrollSize",value:function(){var e=this.$el;return e?Math.ceil(e.scrollHeight):0}},{key:"installVirtual",value:function(){this.virtual=new y({slotHeaderSize:0,slotFooterSize:0,keeps:this.keeps,estimateSize:this.estimateSize,buffer:Math.round(this.keeps/3),uniqueIds:this.getUniqueIdFromDataSources()},this.onRangeChanged.bind(this)),this.range=this.virtual.getRange(),this.render()}},{key:"getUniqueIdFromDataSources",value:function(){var e=this.dataKey;return this.dataSources.map((function(t){return"function"==typeof e?e(t):t[e]}))}},{key:"onRangeChanged",value:function(e){this.range=e,this.render()}},{key:"onScroll",value:function(){var e=this.getOffset(),t=this.getClientSize(),i=this.getScrollSize();e<0||e+t>i+1||!i||this.virtual.handleScroll(e)}},{key:"getRenderSlots",value:function(){var e=this.range,t=e.start,i=e.end,n=this.dataSources,a=this.dataKey;this.wrapper.innerHTML="";for(var s=t;s<=i;s++){var r=n[s];if(r){var o="function"==typeof a?a(r):r[a];if("string"==typeof o||"number"==typeof o){var h=r.createNode();if(r.store.onlySearchLeaf?h.classList.add("vs-search-only-leaf"):h.classList.remove("vs-search-only-leaf"),r.store.isSearch&&r.store.searchRender){var d=r.store.searchRender(r,h.cloneNode(!0));if(!(d instanceof HTMLElement))throw Error("searchRender must return HTMLElement");this.wrapper.appendChild(d)}else this.wrapper.appendChild(h)}else console.warn("Cannot get the data-key '".concat(a,"' from data-sources."))}else console.warn("Cannot get the index '".concat(s,"' from data-sources."))}}},{key:"update",value:function(e){this.dataSources=e,this.wrapper.innerHTML="",this.virtual.updateParam("uniqueIds",this.getUniqueIdFromDataSources()),this.virtual.handleDataSourcesChange()}},{key:"render",value:function(){var e=this.range,t=e.padFront,i=e.padBehind,n="".concat(t,"px 0px ").concat(i,"px");this.wrapper.style.padding=n,this.getRenderSlots()}}]),e}(),b=function(){},C=function(){function i(n,a){var s=this;t(this,i);var r=new Proxy(a,{get:function(e,t,i){return console.log("getting ".concat(t,"!")),Reflect.get(e,t,i)},set:function(e,t,i,n){return console.log("setting ".concat(t,"!")),Reflect.set(e,t,i,n)}});if(this.$options=r,this.$el="string"==typeof n?document.querySelector(n):n,!(this.$el instanceof HTMLElement))throw Error("请为组件提供根节点");if(this.$el.classList.add("vs-tree"),a.theme&&this.$el.classList.add("vs-theme-"+a.theme),Array.isArray(a.data))this._data={_vsroot:!0,name:a.rootName||"---",children:a.data},a.rootName||(a.hideRoot=!0);else{if("object"!==e(a.data))throw Error("参数data仅支持对象或数组！");this._data=a.data}this.itemHeight=a.itemHeight||26,this.showCount=a.showCount||20,this.maxHeight=a.maxHeight||"400px",this.dataKey=a.dataKey||"id",this.data=[],this.keyword="",this.searchFilter=a.searchFilter,this.store=new f({data:this._data,max:a.max,strictLeaf:a.strictLeaf||!1,showCount:this.showCount,itemHeight:this.itemHeight,hideRoot:a.hideRoot||!1,animation:a.animation||!1,expandLevel:"number"==typeof a.expandLevel?a.expandLevel:1,beforeCheck:a.beforeCheck||null,showLine:a.showLine||!1,showIcon:a.showIcon||!1,onlyShowLeafIcon:a.onlyShowLeafIcon||!1,showCheckbox:a.showCheckbox||!1,showRadio:a.showRadio||!1,highlightCurrent:a.highlightCurrent||!1,checkFilterLeaf:a.checkFilterLeaf||!1,checkFilter:a.checkFilter||null,accordion:a.accordion||!1,draggable:a.draggable||!1,lazy:a.lazy||!1,sort:a.sort||!1,indent:a.indent||10,checkedKeys:a.checkedKeys||[],expandKeys:a.expandKeys||[],disabledKeys:a.disabledKeys||[],limitAlert:a.limitAlert||b,click:a.click||b,check:a.check||b,change:a.change||b,load:a.load||b,contextmenu:a.contextmenu||null,radioParentoOnly:a.radioParentoOnly||!1,renderContent:a.renderContent||null,nocheckParent:a.nocheckParent||!1,checkOnClickNode:a.checkOnClickNode||!1,format:a.format||null,searchRender:a.searchRender||null,searchDisabledChecked:a.searchDisabledChecked||!1,expandClass:a.expandClass||"vs-expand-icon",update:function(){s.render()},nodesChange:function(e){s.nodes=e,s.vlist&&s.render()}}),this.store.setData(this._data),this.store.hideRoot&&this.store.root.createNode(),this.init(),this.store.setDefaultChecked()}return n(i,[{key:"init",value:function(){this.vlist=new x({root:this.$el,data:[],maxHeight:this.maxHeight,estimateSize:this.itemHeight,keeps:this.showCount}),this.render()}},{key:"render",value:function(){var e=this,t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.data=this.nodes.filter((function(t){return e.hasKeyword(t)&&t.visbile&&!(e.store.hideRoot&&0===t.level)})),t&&this.vlist.update(this.data)}},{key:"hasKeyword",value:function(e){var t=this;if(!this.keyword)return!0;var i=this.checkFilter(e);return i?e.parent&&(e.parent.requireExpand=!0):e.childNodes.forEach((function(e){i||(i=t.hasKeyword(e))})),i}},{key:"checkFilter",value:function(e){if(this.keyword)return"function"==typeof this.searchFilter?this.searchFilter(this.keyword,e,e.data):e.data.name&&e.data.name.includes(this.keyword)}},{key:"filter",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1?arguments[1]:void 0;if(this.keyword=t,this.store.onlySearchLeaf=i&&!!t,this.store.isSearch=!!t,this.store.onlySearchLeaf){var n=this.nodes.filter((function(t){return!t.childNodes.length&&e.checkFilter(t)&&!(e.store.hideRoot&&0===t.level)}));return this.vlist.update(n),n}return this.render(!1),this.data.forEach((function(e){e.requireExpand&&(e.requireExpand=!1,e.setExpand(!0,!0))})),this.render(),this.data}},{key:"getNodeById",value:function(e){return this.store.getNodeById(e)}},{key:"getCheckedNodes",value:function(){return this.store.getCheckedNodes()}},{key:"setMaxValue",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.store.max=e}}]),i}(),N="2.0.0",L=(c=C,function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.component("vs-tree",{props:{data:Array|Object,options:Object,animation:Boolean,draggable:Boolean,hideRoot:Boolean,showCheckbox:Boolean,showRadio:Boolean,radioParentoOnly:Boolean,showLine:Boolean,showIcon:Boolean,onlyShowLeafIcon:Boolean,highlightCurrent:Boolean,accordion:Boolean,nocheckParent:Boolean,sort:Boolean,checkOnClickNode:Boolean,checkFilterLeaf:Boolean,strictLeaf:Boolean,rootName:String,max:Number,lazy:Boolean,load:Function,format:Function,disabledKeys:Array,checkedKeys:Array,expandKeys:Array,keyword:String,expandClass:String,theme:String,expandLevel:{type:Number,default:1},indent:{type:Number,default:10},showCount:{type:Number,default:20},itemHeight:{type:Number,default:26},beforeCheck:Function,renderContent:Function,checkFilter:Function,searchFilter:Function,searchRender:Function},data:function(){return{tree:{}}},watch:{max:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.setMaxValue(e)},keyword:function(e){this.filter(e)}},mounted:function(){var e=this;this.$nextTick((function(){e._vsinit()}))},methods:{_vsinit:function(){var e=this;console.time("render:tree"),this.tree.tree=new c(this.$refs.tree,Object.assign({},t,this.$props,r(r({},this.options),{},{data:this.data,click:function(t,i){e.$emit("click",t,i)},check:function(t,i){e.$emit("check",t,i)},change:function(t){e.$emit("change",t)},contextmenu:function(t,i){e.$emit("node-contextmenu",t,i)},limitAlert:function(){e.$emit("limit-alert")}}))),console.timeEnd("render:tree")},getNodeById:function(e){return this.tree.tree.getNodeById(e)},getCheckedNodes:function(){return this.tree.tree.getCheckedNodes()},filter:function(e){return this.tree.tree.filter(e)},setMaxValue:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.tree.tree.setMaxValue(e)}},render:function(e){return e("div",{ref:"tree"})}})});export default C;export{L as install,N as version};
