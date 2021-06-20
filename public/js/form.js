class FormObject{
    constructor(submit_btn_query_string , form_children , form_url , navigatorObject){
        this.form_children = form_children;
        this.form_submit_btn = document.querySelector(submit_btn_query_string);
        this.form_submit_url = form_url;
        this.formPageNavigator = navigatorObject;
        this.containsFile = form_children.filter((child)=>child.type === 'file').length > 0;
        this.finalFormData = this.containsFile ? new FormData() : {};
    }
    addOption = (optionName, value) => {
        if(optionName === 'redirectOnSuccess'){
            this.redirectOnSuccess = value;
        }
        else if(optionName === 'customSuccessMessage'){
            this.customSuccessMessage = value;
        }
        return this;
    }
    clearForm = ()=>{
        for(let form_child of this.form_children){
            if(form_child.type === 'file'){
                form_child.output_field.setTextValue('');
            }
            else{
                form_child.field.setTextValue('');
            }
        }
        if(!this.formPageNavigator) return;
        this.formPageNavigator.setPageIndex(0);
    }
    formIsValid = ()=>{
        let no_error_flag = 1;
        for(let form_child of this.form_children){
            let [isValid , status_object] = form_child.returnValidityObject();
            if(!isValid){
                if(this.formPageNavigator){
                    this.formPageNavigator.setPageIndex(form_child.pageIndex);
                }
                form_child.throwFieldError(status_object);
                no_error_flag = 0;
                break;
            }
            else{
                form_child.viewFooterError('',-1);
            }

        }

        if(no_error_flag){
            return true;
        }
        return false;

    }

    AddUserToServer = async ()=>{
        let response = await axios.post(this.form_submit_url,this.finalFormData).catch((e)=>console.error(e));
        console.log(response);
        return new Promise((resolve, reject)=>{
            if(!response.data.status || response.data.status === 'failure'){
                if(this.customFailureMessage){
                    resolve({error : this.customFailureMessage})
                }
                else resolve({error : response.data.error});
            }
            else if(response.data.status === 'success'){
                resolve('success');
            }
                // resolve(response.data.status);
        })
    }

    submitForm = async ()=>{
        if(this.formIsValid()){
            for(let form_child of this.form_children){
                if(form_child.key){
                    if(this.containsFile){
                        if(form_child.type === 'file'){
                            this.finalFormData.append(form_child.key,form_child.fileValue);
                        }
                        else{
                            this.finalFormData.append(form_child.key , form_child.field.getValue());
                        }
                    }
                    else{
                        this.finalFormData[form_child.key] = form_child.field.getValue();
                    }

                }
            }

            try{
                let form_status = await this.AddUserToServer();
                if(form_status === 'success'){
                    this.customSuccessMessage ? alert(this.customSuccessMessage) : alert('Successfully uploaded');
                    this.clearForm();
                    if(this.redirectOnSuccess){
                        location.assign(this.redirectOnSuccess);
                    }
                }
                else{
                    alert(form_status.error);
                }
            }
            catch(e){
                console.error(e);
                alert(e);
            }


        }
    }

    init = ()=>{
        this.form_submit_btn.addEventListener('click',()=>{
            this.submitForm();
        })
        return this;
    }

}

class FieldWithErrorFunction{

    constructor(field_query_string , error_footer_label_string ,key , pageIndex){
        this.field = new MyElement(field_query_string).init(true);
        this.error_footer = new MyElement(error_footer_label_string).init();
        this.key = key;
        this.pageIndex = pageIndex;
    }

    throwFieldError = (status_object)=>{
        let {error_index : error_index , error_string : error_string} = status_object;
        this.viewFooterError(error_string , error_index);
    }

    viewFooterError = (error_string , error_status)=>{

        this.error_footer.toDefault();

        switch(error_status){
            //invalid field error
            case -1 :
            this.error_footer.hide();
            break;

            case 0 : 
            this.error_footer.toDefault();
            this.error_footer.addClass('error');
            this.error_footer.setTextValue(error_string);
            break;

            case 1 : 
            this.error_footer.toDefault();
            this.error_footer.addClass('info');
            this.error_footer.setTextValue(error_string);
            break;
            
            default : 
            break;
        }
    }

}

class EmailInputElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , key, pageIndex){
        super(field_query_string , error_footer_label_string , key, pageIndex);
        this.type = 'text';
    }

    returnValidityObject = ()=>{
        //not implemented for non-input elements may do it if required in later versions.
        if(this.field.checkInputValidity()){
            return [true , {
                error_index : -1,
                error_string : 'no error found'
            }];
        }
        else{
            return [false , {
                error_index : 0,
                error_string : 'Invalid or Empty Email'
            }]
        }
    }
}

class PasswordInputElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , key , pageIndex){
        super(field_query_string , error_footer_label_string, key, pageIndex);
        this.length_constraint = 8;
        this.type = 'text';
    }
    returnValidityObject = ()=>{
    //not implemented for non-input elements
        if(this.field.checkInputValidity() && this.field.getValue().length >= this.length_constraint){
            return [true , {
                error_index : -1,
                error_string : 'no error found'
            }]
        }
        else{
            return [false, {
                error_index : 0,
                error_string : 'Password must be atleast 8 characters long.'
            }] 
        }
    }

    matches = (string_to_be_compared) => this.field.getValue() === string_to_be_compared;
}

class ConfirmPasswordElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , ReferencePasswordElement , key, pageIndex){
        super(field_query_string , error_footer_label_string  , key , pageIndex);
        this.ReferencePasswordElement = ReferencePasswordElement;
        this.type = 'text';
    }
    returnValidityObject = ()=>{
        if(this.ReferencePasswordElement.matches(this.field.getValue())){
            return [true , {
                error_index : -1, 
                error_string : 'no error found'
            }]
        }
        else{
            return [false, {
                error_index : 0,
                error_string : 'Passwords do not match.'
            }]
        }
    }
}

class NonEmptyElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , key, pageIndex){
        super(field_query_string , error_footer_label_string , key, pageIndex);
        this.type = 'text';
        this.options = {};
    }
    checkLength = ()=>{
        if(!this.limit) return true;
        if(this.field.getValue().length === this.limit){
            return true;
        }
        return false;
    }
    returnValidityObject = ()=>{
        if(this.field.checkInputValidity() && this.checkLength()){
            return [true , {
                error_index : -1, 
                error_string : 'no error found'
            }]
        }
        else{
            return [false, {
                error_index : 0,
                error_string : 'Empty or Invalid Field Value.'
            }]
        }
    }
    addLimit = (limit)=>{
        this.limit = limit;
        return this;
    }
}


class FileInputElement extends FieldWithErrorFunction{
    constructor(field_query_string , trigger_btn , output_field , error_footer_label_string , key , pageIndex){
        super(field_query_string , error_footer_label_string, key  , pageIndex);
        this.trigger_btn = new MyElement(trigger_btn);
        this.output_field = new MyElement(output_field);
        this.fileValue = undefined;
        this.type = 'file';

        this.trigger_btn.bindEvent(()=>{
            this.field.synthetic_click();
        },'click');
        this.field.bindEvent(()=>{
            let file = (this.field.DOMRef.files[0]),
            type = file.type,
            name = file.name;

            if(type && type.split('/')[0]==='image'){
                this.output_field.setTextValue(name.slice(0,15) + '...'); 
                this.fileValue = file;
            }
        },'change');
    }


    returnValidityObject = ()=>{
        if(this.field.checkInputValidity() && this.fileValue && this.fileValue.type)
        {
            return [true , {
                    error_index : -1 , 
                    error_string : "no error found"
                }];
        }
        else{
            return [false , {
                    error_index: 0,
                    error_string : 'Empty or invalid file type'
            }]
        }
    }
}

class InPageNavigator{
    constructor(buttons=[] , pageWrapper){

        this.pageWrapper = pageWrapper;
        this.buttons = buttons;
        this.pageIndex = 0;

    }

    init = ()=>{
        buttons.forEach((button)=>{
            if(!button.index == 0){
                console.log(button.index);
                button.element.hide();
            }
            button.element.bindEvent(()=>{
                this.setPageIndex(button.target_index);
            }, 'click')
        })

        return this;
    }

    movePageToIndex = (index)=>{
        this.pageWrapper.translate(`${-1 * 100 * index}%`)
    }

    setPageIndex = (index)=>{
        this.buttons.forEach((button)=>{
            if(button.index === index){
                button.element.toDefault();
            }
            else{
                button.element.hide();
            }
        })
        this.movePageToIndex(index);
    }

}

class Loader{
    constructor(loading_element){
        this.loading_element = loading_element;
    }
    startLoading = ()=>{
        this.loading_element.addClass('loading');
    }
    endLoading = ()=>{
        this.loading_element.removeClass('loading');
    }
}


class DynamicListComponent{
    constructor(list ,proto_element , request_url,delete_url, props_to_select){
        this.proto_element = proto_element; 
        this.request_url = request_url;
        this.props_to_select = props_to_select;
        this.list = list;
        this.pageIndex = 0;
        this.delete_url = delete_url;
    }
    addLoader = (loader_object)=>{
        this.loader = loader_object;
        return this;
    }
    addPaginationTrigger = (btn_element)=>{
        this.btn_element = btn_element;
        btn_element.bindEvent((async (e)=>{
            let items = await this.loadNextPage();
            if(items) this.list.appendHTML(items);
            if(this.pageIndex === -1){
                btn_element.setTextValue('No more Found');
            }
        }),'click');

        return this;
    }
    closeDynamicList = ()=>{
        if(this.btn_element){
            this.btn_element.dontRender();
            this.list.DOMRef.onscroll = ()=>{}
            this.list.html('');
            this.btn_element.setTextValue('Load More');
        }
    }
    openDynamicList = async ()=>{
        if(this.btn_element){
            this.list.DOMRef.onscroll = (e)=>{
                if(e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight - 50){
                    this.btn_element.toDefault();
                }
                else{
                    this.btn_element.hide();
                }
            };
            this.btn_element.toDefault();
        }
        this.pageIndex = 0;
        let data = await this.loadNextPage();
		if(this.pageIndex !== -1){
			this.list.html(data)	
		} 
    }
    getRequestData = async ()=>{
        try{
            let response = await axios.get(this.request_url + '?pageIndex=' + this.pageIndex);
            if(response.data && response.data.status === 'success'){
                return response.data.data;
            }
            else if(response.data && response.data.status === 'failure'){

                //max reached
                return {error:response.data.error};
            }
        }
        catch(e){
            console.error(e);
        }
    }
    loadNextPage = async ()=>{
        if(this.pageIndex === -1) return;

        this.loader.startLoading();

        let request_data = await this.getRequestData().catch(e=>console.error(e));
        if(request_data.error){
            this.pageIndex = -1;
            this.loader.endLoading();
            return;
        }
        let html_append_value = request_data.map((element)=>{
            let values_to_select = this.props_to_select.map((prop)=>{
                return element[prop]
            })
            return this.createHTMLfromProto(values_to_select);
        })
        this.pageIndex += 1;

        this.loader.endLoading();

        return html_append_value.join('');
    }
    createHTMLfromProto = (values)=>{
        let proto_html_nodes = this.proto_element.split('$$');
        let final_html_array = proto_html_nodes.map((node,index)=>{
            if(index === values.length){
                return node;
            }
            else 
            {
                if(values[index]){
                    return node.concat(values[index]);
                }
                else{
                    return node;
                }
            }
        })
        return final_html_array.join('');
    }

    deleteElementWithId = async (id)=>{
        let element = this.list.DOMRef.querySelector(`#${id}`);
        if(element){
            this.loader.startLoading();
            let deleted_confirm = await this.deleteFromServer(id.split('-')[2]);
            this.loader.endLoading();
            if(deleted_confirm) this.list.DOMRef.removeChild(element);
            else alert('problem deleting'); 
        }
    }

    deleteFromServer = async (id)=>{
        try{
            let response = await axios.delete(this.delete_url + id)
            console.log(response);
            if(response.data && response.data.status === 'success'){
                return true;
            }
            else{
                return false;
            }
        }
        catch(e){
            console.log(error);
            return false;
        }
    }
}