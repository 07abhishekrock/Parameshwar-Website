let form_hide_styles = {
	"transform" : `translate(-50% , 50px)`
}
let add_new_subsriber_form = new MyElement('#registerModal')
.init(false).dontRender();

let NewSubscriberFormObject = new FormObject('#register-submit-btn',
[
	new NonEmptyElement('#subscriber-name-field','#subscriber-name-field+small','name',0),
	new EmailInputElement('#subscriber-email-field','#subscriber-email-field+small','email',0),
	new NonEmptyElement('#subscriber-phoneNo-field','#subscriber-phoneNo-field+small','phoneNo',0),
],'/api/v1/user/nonadmin')
.init()
.addOption('customSuccessMessage','User Registered Successfully')
.addOption('customFailureMessage','Could not register , pls try again later ...')

function openModal(){
	add_new_subsriber_form.toDefault();
}
function closeModal(){
	add_new_subsriber_form.dontRender();
}