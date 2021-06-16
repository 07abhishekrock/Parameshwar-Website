function BindRequestThenRedirect(redirect_url , request_url , anchorElement){
    anchorElement.bindEvent(async (e)=>{
        e.preventDefault();
        let response_data = await axios.get(request_url);
        if(response_data.data && response_data.data.status === 'success'){
            location.assign(redirect_url);
        }
        else alert('problem in logging out');
    },'click')
    anchorElement.changeStyle({
        'cursor':'pointer',
        'user-select':'none'
    })
}


class MyElement{
    constructor(query_string , options={}){
        if(typeof(query_string) === 'string'){
            this.DOMRef = document.querySelector(query_string); 
        }
        else{
            this.DOMRef = query_string;
        }
        if(options){
            this.hideStyles = options.hideStyles || {};
        }
        this.isInputElement = this.DOMRef.tagName === 'INPUT' || this.DOMRef.tagName === 'TEXTAREA';
        
    }

    changeStyle(styles){
        for(let Style in styles){
            this.DOMRef.style[Style] = styles[Style];
        }
    }

    appendHTML = (html)=>{
        this.DOMRef.insertAdjacentHTML('beforeend',html);
    }

    html = (html)=>{
        this.DOMRef.innerHTML = html;
    }

    toDefault = ()=>{
        this.DOMRef.style = "";
    }

    hide = ()=>{
        this.toDefault();
        this.changeStyle({
            "opacity":0,
            "pointer-events":'none'
        })
        this.changeStyle(this.hideStyles);
        return this;
    }

    dontRender = ()=>{
        this.changeStyle({
            "display":'none'
        })
        return this;
    }

    init = (view_state = false)=>{
        if(!view_state){
            this.hide();
        }
        return this;
    }

    translate = (x='0px',y='0px',z='0px')=>{
        this.changeStyle({
            'transform':`translate3d(${x},${y},${z})`
        })
    }

    removeClass = (class_string)=>{
        this.DOMRef.classList.remove(class_string);
        return this;
    }

    addClass = (class_string)=>{
        this.DOMRef.classList.add(class_string);
        return this;
    }

    setTextValue = (string)=>{
        if(this.isInputElement) this.DOMRef.value = string;
        else this.DOMRef.innerText = string;
    }

    getValue = () => this.isInputElement ? this.DOMRef.value : this.DOMRef.innerText;

    checkInputValidity = ()=>{
        return this.DOMRef.checkValidity();
    }

    bindEvent = (handler_closure , event_name)=>{
        this.DOMRef.addEventListener(event_name , (e)=>{
            handler_closure(e);
        });
    }

    createElementGroupFromChildren = (options)=>{
        let all_children = this.DOMRef.children;
        if(all_children.length){
            return new ElementGroup(Array.from(all_children).map((child)=>{
                return new MyElement(child);
            }),options)
        }
    }

    synthetic_click = ()=>{
        this.DOMRef.click();
    }

}

class ElementGroup{
    constructor(elements , options={}){
        this.elements_array = elements;
        this.attributes = {};
        if(options.specialClass){
            if(options.specialClass.length !== 2){
                console.error('specialClass = [className, first_index_to_apply_on]');
            }
            else{
                this.addCommonAttribute('specialClassArray',options.specialClass); 
                this.setSpecialClassIndex(options.specialClass[1]);
            }
        }
    }
    addCommonAttribute(attribute_name , attribute_value){
        this.attributes[attribute_name] = attribute_value; 
    }
    getCommonAttribute(attribute_name){
        return this.attributes[attribute_name];
    }
    setSpecialClassIndex(new_index , hidePreviousIndex=false){
        if(!this.getCommonAttribute('specialClassArray')){
            return;
        }
        const [specialClass,specialIndex] = this.getCommonAttribute('specialClassArray');
        if(specialClass){
            if(hidePreviousIndex){
                this.elements_array[specialIndex].hide();
                this.elements_array[new_index].toDefault();
            }
            this.elements_array[specialIndex].removeClass(specialClass);
            this.addCommonAttribute('specialClassArray',[specialClass , new_index]);
            this.elements_array[new_index].addClass(specialClass);
        }
    }
    removeClassName = (class_string)=>{
        this.elements_array.forEach((element)=>{
            element.removeClass(class_string);
        })
    }
    hideIndex = (index)=>{
        this.elements_array[index].hide();
    }
}
