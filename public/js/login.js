let loginForm = new FormObject('#login-btn',[
	new NonEmptyElement('#login-username','#login-username+i','username',0),
	new PasswordInputElement('#login-password','#login-password+i','password',0)
],'/api/v1/user/login')
.init()
.addOption('redirectOnSuccess','/admin')
.addOption('customSuccessMessage','Logged In Successfully !!!');

