let form_hide_styles = {
	"transform" : `translate(-50% , 50px)`
}
let add_new_subsriber_form = new MyElement('#registerModal')
.init(false).dontRender();

let add_new_contact_form = new MyElement('#contactUsModal')
.init(false).dontRender();

let NewSubscriberFormObject = new FormObject('#register-submit-btn',
[
	new NonEmptyElement('#subscriber-name-field','#subscriber-name-field+small','name',0),
	new EmailInputElement('#subscriber-email-field','#subscriber-email-field+small','email',0),
	new NonEmptyElement('#subscriber-phoneNo-field','#subscriber-phoneNo-field+small','phoneNo',0),
	new NonEmptyElement('#subscriber-father-field','#subscriber-father-field+small','fatherName',0),
	new NonEmptyElement('#subscriber-aadhar-field','#subscriber-aadhar-field+small','aadharNumber',0).addLimit(12),
	new NonEmptyElement('#subscriber-address-field','#subscriber-address-field+small','query',0)
],'/api/v1/user/nonadmin')
.init()
.addOption('customSuccessMessage','User Registered Successfully')
.addOption('customFailureMessage','Could not register , pls try again later ...')

let NewContactFormObject = new FormObject('#contact-submit-btn',
[
	new NonEmptyElement('#contact-name-field','#contact-name-field+small','name',0),
	new EmailInputElement('#contact-email-field','#contact-email-field+small','email',0),
	new NonEmptyElement('#contact-phoneNo-field','#contact-phoneNo-field+small','phoneNo',0),
	new NonEmptyElement('#contact-father-field','#contact-father-field+small','fatherName',0),
	new NonEmptyElement('#contact-aadhar-field','#contact-aadhar-field+small','aadharNumber',0).addLimit(12),
	new NonEmptyElement('#contact-query-field','#contact-query-field+small','query',0)
],'/api/v1/addContactForm')
.init()
.addOption('customSuccessMessage','Query Registered Successfully')
.addOption('customFailureMessage','Could not register your query , pls try again later ...')


function openModal(flag){
	if(flag === 0) add_new_subsriber_form.toDefault();
	else if(flag === 1) {
		add_new_contact_form.toDefault();
	}
}
function closeModal(flag){
	if(flag === 0) add_new_subsriber_form.dontRender();
	else if(flag === 1) add_new_contact_form.dontRender();
}

