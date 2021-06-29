let admin_nav_list = new MyElement('ul.admin-nav-list').init(true);
let admin_nav_grp = admin_nav_list.createElementGroupFromChildren(options={
	specialClass : ['selected',0]
});

let form_hide_styles = {
	"transform" : `translate(-50% , 50px)`
}
let upload_video_form = new MyElement('#upload-video-form',
{
	hide_styles:form_hide_styles
})
.init(true).addClass('current_view');

let uploadVideoFormObject = new FormObject('#upload-video-btn',[
	new NonEmptyElement('#videoName','#videoName+i','name',0),
	new RadioButton('#videoCategory','#videoCategory+i','category',0),
	new NonEmptyElement('#videoSubCategory','#videoSubCategory+i','subcategory',0),
	new NonEmptyElement('#videoDescription','#videoDescription+i','description',1),
	new NonEmptyElement('#videoCode','#videoCode+i','snippet',1),
	new FileInputElement('#video-thumb-file','#video-input-styled span:nth-child(2)','#video-input-styled span:first-child','#video-input-styled+i','photo',1)
],'/api/v1/videos', new InPageNavigator(buttons = [
	{
		element:new MyElement('#video-prev'),
		index:1,
		target_index:0,
	},
	{
		element:new MyElement('#video-next'),
		index:0,
		target_index:1,
	},
	{
		element:new MyElement('#upload-video-btn'),
		index:1,
		target_index:1,
	}
] , new MyElement('#video-forms-wrapper')).init()).init()




let change_password_form = new MyElement('#change-password-form',
{
	hide_styles:form_hide_styles
})
.init(false).hide();

let password_element = new PasswordInputElement('#new-password','#new-password+i','password',0)
let changePasswordFormObject = new FormObject('#change-password-btn',
[
	new NonEmptyElement('#current-password','#current-password+i','passwordCurrent',0),
	password_element,
	new ConfirmPasswordElement('#confirm-password','#confirm-password+i',password_element,'',0)
],'/api/v1/user/changePassword')
.init()
.addOption('customSuccessMessage','Password Changed Successfully')
.addOption('customFailureMessage','Could Not Change Password')



let upload_banner_form = new MyElement('#banner-upload-form',
{
	hide_styles:form_hide_styles
})
.init(false).hide();

let upload_banner_object = new FormObject('#banner-upload-btn',[
	new NonEmptyElement('#banner-title','#banner-title+i','title',0),
	new FileInputElement('#banner-file','#banner-input-styled span:nth-child(2)','#banner-input-styled span:first-child','#banner-input-styled+i','photo',0)
],'/api/v1/banners').init();


let site_stats_div = new MyElement('#site-stats-div',
{
	hide_styles:form_hide_styles
})
.init(false).hide();

let create_new_user_form = new MyElement('#create-new-user-form',
{
	hide_styles:form_hide_styles
}).init(false).hide();

let new_user_password_field = new PasswordInputElement('#new-user-password-field','#new-user-password-field+i','password',0);
let create_new_user_formObject = new FormObject('#create-new-user-btn',[
	new NonEmptyElement('#new-user-name-field','#new-user-name-field+i','name',0),
	new NonEmptyElement('#new-user-username-field','#new-user-username-field+i','username',0),
	new_user_password_field,
	new ConfirmPasswordElement('#new-user-conf-password-field','#new-user-conf-password-field+i',new_user_password_field,'',0)
],'/api/v1/user/signup').init()
.addOption('customSuccessMessage','Added New User')
.addOption('customFailureMessage','Could not add a new user, pls try again later');


let all_forms_group = new ElementGroup([
	upload_video_form,
	upload_banner_form,
	site_stats_div,
	change_password_form,
	create_new_user_form
],options={
	specialClass : ['current_view',0]
});


function showForm(form_index){
	all_forms_group.setSpecialClassIndex(form_index , hidePreviousIndex=true);
	admin_nav_grp.setSpecialClassIndex(form_index);
}


let logout_button = new MyElement('#logout-btn');
BindRequestThenRedirect('/login','/api/v1/user/logout',logout_button)

let modalElement = new MyElement('div.modal-wrapper').init(false);
let modal_list = new MyElement('div.modal>ul').init(true);
let modal_div = new MyElement('div.modal').init(true);
let modal_heading = new MyElement('div.modal>h2').init(true);
let load_more_users_button = new MyElement('#load-more-users').init(true).dontRender();
let load_more_queries_button = new MyElement('#load-more-queries').init(true).dontRender();
let load_more_videos_button = new MyElement('#load-more-videos').init(true).dontRender();


async function openModal(index){
	modalElement.toDefault();
	if(index === 0){
		modal_heading.setTextValue('Videos');
		VideosDynamicList.openDynamicList();	
	}
	else if(index === 1){
		modal_heading.setTextValue('Announcements');
		BannerDynamicList.openDynamicList();	
	}
	else if(index === 2){
		modal_heading.setTextValue('Users');
		UserDynamicList.openDynamicList();
	}
	else if(index === 3){
		modal_heading.setTextValue('Admin');
		AdminDynamicList.openDynamicList();
	}
	else if(index === 4){
		modal_heading.setTextValue('Queries');
		ContactUsDynamicList.openDynamicList();
	}
}

function closeModal(){
	modalElement.hide();
	VideosDynamicList.closeDynamicList();
	BannerDynamicList.closeDynamicList();
	UserDynamicList.closeDynamicList();
	AdminDynamicList.closeDynamicList();
	ContactUsDynamicList.closeDynamicList();
}

let listLoader = new Loader(modal_div);

let VideosDynamicList = new DynamicListComponent(modal_list,`<li id="list-element-$$"><div class="element-with-image"><img src="/img/$$"/><span>$$<i class="fa fa-trash" onclick="VideosDynamicList.deleteElementWithId('list-element-$$')"></i></span></div></li>`,
'/api/v1/videos/','/api/v1/videos/',
['_id','photo','name','_id']
).addLoader(listLoader).addPaginationTrigger(load_more_videos_button).addSubOptions([
	{
		optionName : 'Bhakti',
		categoryParamValue : 0
	},
	{
		optionName : 'Bhajan',
		categoryParamValue : 1
	},
	{
		optionName : 'Arti',
		categoryParamValue : 2
	},
	{
		optionName : 'Live',
		categoryParamValue : 3
	}
] , 'div.browse-tabs');

let BannerDynamicList = new DynamicListComponent(modal_list,`<li id="list-element-$$"><div class="element-with-image"><img src="/img/$$"/><span>$$<i class="fa fa-trash" onclick="BannerDynamicList.deleteElementWithId('list-element-$$')"></i></span></div></li>`,
'/api/v1/banners','/api/v1/banners/',
['_id','photo','title','_id']
).addLoader(listLoader);

let UserDynamicList = new DynamicListComponent(modal_list , `<li id="list-element-$$">
<h3>$$<i class="fas fa-trash" onclick="UserDynamicList.deleteElementWithId('list-element-$$')"></i></h3>
<span><i class="fas fa-envelope"></i>$$</span>
<span><i class="fas fa-phone"></i>$$</span>
<span><i class="fas fa-user-friends"></i>$$</span>
<span><i class="fas fa-address-card"></i>$$</span>
<span><i class="far fa-id-card"></i>$$</span>
</li>`,
'/api/v1/user','/api/v1/user/',
['_id','name','_id','email','phoneNo','fatherName','address','aadharNumber']
).addLoader(listLoader).addPaginationTrigger(load_more_users_button);

let AdminDynamicList = new DynamicListComponent(modal_list,  `<li id="list-element-$$"><h3>$$<i class="fas fa-trash" onclick="AdminDynamicList.deleteElementWithId('list-element-$$')"></i></h3></li>`,
'/api/v1/user/adminList','/api/v1/user/',
['_id','username','_id']
).addLoader(listLoader);

let ContactUsDynamicList = new DynamicListComponent(modal_list , `<li id="list-element-$$">
<h3>$$<i class="fas fa-trash" onclick="ContactUsDynamicList.deleteElementWithId('list-element-$$')"></i></h3>
<span><i class="fas fa-envelope"></i>$$</span>
<span><i class="fas fa-phone"></i>$$</span>
<span><i class="fas fa-user-friends"></i>$$</span>
<span><i class="far fa-id-card"></i>$$</span>
<span style="flex-flow:column;align-items:center"><i class="fas fa-align-right"></i>$$</span>
</li>`,
'/api/v1/contact-us-queries','/api/v1/contact-us-queries/',
['_id','name','_id','email','phoneNo','fatherName','aadharNumber','query']
).addLoader(listLoader).addPaginationTrigger(load_more_queries_button);
