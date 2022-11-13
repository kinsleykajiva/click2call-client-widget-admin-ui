let BASE_URL = '';
if(window.location.protocol === 'http:') {
    //localhost
     BASE_URL = 'http://localhost:8050';
}else{
     BASE_URL = 'https://api-app.xxxclick2callxxxxx.com';
}


let canProceed = true;
let emailsToInvite = new Set();
const input = document.querySelector(".chip-input");
const chips = document.querySelector(".chips");

// erTy%468677$
async function submitStepCompanyDetails() {
    let txtFullName = $("#txtFullName").val();
    let txtCompanyName = $("#txtCompanyName").val();
    let txtEmailAddress = $("#txtEmailAddress").val();
    let txtPassword = $("#txtPassword").val();


    let txtWidgetName = $("#txtWidgetName").val();
    let txtTopbarMessage = $("#txtTopbarMessage").val();
    let txtThemeColor = $("#txtThemeColor").val();


    let payload = {
        fullName     : txtFullName,
        companyName  : txtCompanyName,
        emailAddress : txtEmailAddress,
        password     : txtPassword,
        widgetName   : txtWidgetName,
        topbarMessage: txtTopbarMessage,
        themeColor   : txtThemeColor
    }
    // payload = { ...obj, };

    let res = await axios.post(BASE_URL + '/auth/api/v1/users/register-company', payload);

    let data = res.data;
    console.log(data)
    return data
}


// erTy%468677$
async function login() {

    try {

        let inputEmail = $("#inputEmail").val();
        let inputPassword = $("#inputPassword").val();

        if (inputEmail === '') {

            $("#inputresponseMessage").html(" <p style='color:red;'> Email is required </p> ")
            return;
        }
        if (inputPassword === '') {

            $("#inputresponseMessage").html(" <p style='color:red;'> Password is required </p> ")
            return;
        }
        $("#inputresponseMessage").html(" <p style='color:red;'> </p> ");

        let payload = {
            password: inputPassword,
            email   : inputEmail,

        }
        loadingScreen(true, "Signing in ...");

        let res = await axios.post(BASE_URL + '/auth/api/v1/users/login', payload);
        loadingScreen(false, "Signing in ...");
        let data = res.data;
        if (!data.success) {
            $("#inputresponseMessage").html(` <p style='color:red;'> ${data.message} </p> `);
            return;
        }
        data = data.data;
        const expiresAftersDays = 7;
        Cookies.set('apiToken', data.token, {expires: expiresAftersDays});
        Cookies.set('userId', data.userId, {expires: expiresAftersDays});
        Cookies.set('role', data.role, {expires: expiresAftersDays});
        Cookies.set('email', data.email, {expires: expiresAftersDays});
        Cookies.set('userProfileImageUrl', data.profileImage, {expires: expiresAftersDays});
        Cookies.set('fullName', data.fullName, {expires: expiresAftersDays});
        Cookies.set('companyId', data.companyId, {expires: expiresAftersDays});
        Cookies.set('WIDGET_API_KEY', data.WIDGET_API_KEY, {expires: expiresAftersDays});
        window.location.href = "view-home";

    } catch (e) {
        loadingScreen(false, "Signing in ...");
        $("#inputresponseMessage").html(` <p style='color:red;'>An Error Occurred </p> `);
    }
}

async function resetPassword() {
    let inputResetEmail = $("#inputResetEmail").val();
    let inputResetOtp = $("#inputResetOtp").val();
    let inputResetPassword = $("#inputResetPassword").val();
    if(inputResetEmail === '' || inputResetOtp === '' || inputResetPassword === ''){
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br> Missing Fields"  ,
            duration   : 4_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        return
    }
    if(! isEmail(inputResetEmail) ){
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br>Valid Email still Required"  ,
            duration   : 4_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        return
    }

    loadingScreen(true, "Resetting Code");

    let res = await axios.post(BASE_URL + '/auth/api/v1/users/reset-account-password', {email:inputResetEmail,otp:inputResetOtp , newPassword:inputResetPassword});
    loadingScreen(false, ". Code");
    res = res.data;

    if(res.success){

        window.notyf.open({
            type       : 'Success',
            message    : " <strong>Awesome! </strong>  Password Reset,Please Lo gin !" ,
            duration   : 5_000,
            ripple     : true,
            background : '#5F63D3',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        $("#btnResetPassCode").show()
        $("#btnResetPassWord").hide()
        $("#DivOtp").hide()
        $("#DivNewPassword").hide()


        $("#incResetPasswordDiv").hide()
        $("#incLoginDiv").show()

    }else{
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br> " + res.message,
            duration   : 10_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
    }

}
async function SendPasswordCode() {
    let inputResetEmail = $("#inputResetEmail").val();

    if(inputResetEmail === ''){
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br> Email Required"  ,
            duration   : 10_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        return
    }
    if(! isEmail(inputResetEmail) ){
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br>Valid Email Required"  ,
            duration   : 10_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        return
    }
    loadingScreen(true, "Sending Code");

    let res = await axios.post(BASE_URL + '/auth/api/v1/users/request-reset-account-password-user', {email:inputResetEmail});
    loadingScreen(false, "Sending Code");
    res = res.data;
    if(res.success){

        window.notyf.open({
            type       : 'Success',
            message    : " <strong>Awesome! </strong>  Reset Code Sent !" ,
            duration   : 5_000,
            ripple     : true,
            background : '#5F63D3',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        $("#btnResetPassCode").hide()
        $("#btnResetPassWord").show()
        $("#DivOtp").show()
        $("#DivNewPassword").show()
    }else{
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br> " + res.message,
            duration   : 10_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
    }


}

function showResetPasswordView() {


    $("#incResetPasswordDiv").show()
    $("#incLoginDiv").hide()

}
function showRegisterView() {


    $("#incRegisterDiv").show()
    $("#incLoginDiv").hide()

}

function showLoginView() {


    $("#incRegisterDiv").hide()
    $("#incLoginDiv").show()

}


function checkTypeOfLogin() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    return params;
}

let ccompanyObject = {urlRefer:null ,addedByUser:null,companyName:null};

// "/auth?type=referral&owner-name=Name oo&owner-email=my@gmail.com&owner-id=14&company=Vakureke&company-id=15&toemail=rty@gmail.com";

async function sendInviteToUser() {
    let selectUserType = $("#selectUserType").val();
    if (selectUserType === 'null') {
        window.notyf.open({
            type       : 'danger',
            message    : " <strong>Error! </strong> <br> Please select user type .",
            duration   : 10_000,
            ripple     : true,
            background : '#c40808',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        return;
    }
    loadingScreen(true,"Sending invites .....")
    for (const email of emailsToInvite) {
        let link = ccompanyObject.urlRefer + email + "&userType=" + selectUserType;
//
        let res = await axios.post(BASE_URL + '/notifications-service/users/asked-new-user-to-join', {
            email,
            addedByUser:ccompanyObject.addedByUser,
            companyName:ccompanyObject. companyName,
            activateLink:link
        });

        console.log(res)
    }
    loadingScreen(false,"Sending invites .....")
    window.notyf.open({
        type       : 'Success',
        message    : " <strong>Awesome! </strong>  Invites have been sent !" ,
        duration   : 10_000,
        ripple     : true,
        background : '#5F63D3',
        dismissible: true,
        position   : {
            x: 'center',
            y: 'top'
        }
    });

}
async function showNecessaryLogin() {
    let url = checkTypeOfLogin();

    if (url['type'] === 'login') {

        $("#incRegisterDiv").hide()
        $("#incLoginDiv").show()


    }
    if (url['type'] === 'login-activation-attempted') {

        $("#incRegisterDiv").hide()
        $("#incLoginDiv").show()
        let res = await axios.post(BASE_URL + '/auth/api/v1/users/activate-account',{key:url['key']});

        if(res.data.success){
            $("#activatedAccount").show();
            $("#inputEmail").val(res.data.data.email);
        }else{

        }



    }

    if (url['type'] === 'referral') {

        $("#ownerName").text(url['owner-name'])
        $("#ownerCompany").text(url['company'])
        $("#inputrefereEmail").val(url['toemail'])
        $("#incLoginDiv").hide()
        $("#incRegisterDiv").hide()
        $("#incRegisterReferalDiv").show()
    }
    console.log(999, url['owner-email'])

}
// erTy%468677$
showNecessaryLogin();

function showLoginViewFromRefere() {
    $("#incRegisterReferalDiv").hide('fast');
    $("#incLoginDiv").show();
}
// erTy%468677$
async function registerReferal() {
    let inputrefereEmail = $("#inputrefereEmail").val();
    let inputrefereFullName = $("#inputrefereFullName").val();


    if (inputrefereFullName === '') {
        $("#inputresponseRefMessage").html(" <p style='color:red;'> Name is Required </p> ")
        return;
    }
    if (inputrefereEmail === '' || !isEmail(inputrefereEmail)) {
        $("#inputresponseRefMessage").html(" <p style='color:red;'> Email or valid email is Required </p> ")
        return;
    }
    let inputreferePassword = $("#inputreferePassword").val();
// erTy%468677$

    if (inputreferePassword === '' || !validatePassword(inputreferePassword)) {
        $("#inputresponseRefMessage").html(" <p style='color:red;'> Password or valid Password is Required </p> ")
        return;
    }
    let url
    try {
        url = checkTypeOfLogin();
    } catch (e) {
        $("#inputresponseRefMessage").html(" <p style='color:red;'> Something Went Please review the link or use it again </p> ")
    }
    $("#inputresponseRefMessage").html(" <p style='color:red;'>  </p> ");

    if (url && url['owner-id'] && url['company-id']) {
        let payload = {
            email    : inputrefereEmail,
            fullName : inputrefereFullName,
            password : inputreferePassword,
            userId   : url['owner-id'],
            companyId: url['company-id'],
        }

        try{

        loadingScreen(true, "Signing up ...");

        let res = await axios.post(BASE_URL + '/auth/api/v1/users/refered-register', payload);
        console.log(res)
        loadingScreen(false, "Signing in ...");

        if(res.data.success){
            window.notyf.open({
                type       : 'Success',
                message    : " <strong>Awesome! </strong> <br>" +res.data.message,
                duration   : 10_000,
                ripple     : true,
                background : '#5F63D3',
                dismissible: true,
                position   : {
                    x: 'center',
                    y: 'top'
                }
            });
            $("#inputresponseRefMessage").html(" <p style='color:green;'> <a href='auth' > Please Login </a>  </p> ");
        }else{
            window.notyf.open({
                type       : 'danger',
                message    : " <strong>Error! </strong> <br>" +res.data.message,
                duration   : 10_000,
                ripple     : true,
                background : '#c40808',
                dismissible: true,
                position   : {
                    x: 'center',
                    y: 'top'
                }
            });
        }


        }catch (e) {
            $("#inputresponseRefMessage").html(" <p style='color:red;'> Something went wrong Please reuse the link </p> ");
        }

    } else {
        $("#inputresponseRefMessage").html(" <p style='color:red;'> Something went wrong Please reuse the link </p> ");
    }


}
// erTy%468677$
function validatePassword(pw) {

    return /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /[0-9]/.test(pw) &&
        /[^A-Za-z0-9]/.test(pw) &&
        pw.length > 4;

}

// erTy%468677$
function isEmail(email) {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
let SRC_CODE = '' ;


async function sendDeveloperInstruction() {
    let sendCodeToDeveloperInput = $('#sendCodeToDeveloperInput').val();


    if (sendCodeToDeveloperInput === '' ) {
        window.notyf.open({
            type       : 'Danger',
            message    : "Email/Valid Email Required to send Code",
            duration   : 10_000,
            ripple     : true,
            background : '#FF5F57',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });
        return;
    }
let canSend = true ;
    if (sendCodeToDeveloperInput.indexOf(',') > -1) {
        let EmailsArr = sendCodeToDeveloperInput.split(',') ;

        for (let i = 0; i < EmailsArr.length; i++){
            const email = EmailsArr[i];
            if ( !isEmail(email)) {
                canSend = false;
            }else{

                let res;
                try {
                    loadingScreen(true, 'Sending Instructions');
                    res = await axios.post(BASE_URL + '/notifications-service/users/widget-instructions', {
                        email:email ,
                        name:null ,
                        activattionLink:SRC_CODE ,
                    });
                    loadingScreen(false, '');
                    if(res.data.success){
                        window.notyf.open({
                            type       : 'Success',
                            message    : "Instructions sent successfully,yey ",
                            duration   : 10_000,
                            ripple     : true,
                            background : '#27C940',
                            dismissible: true,
                            position   : {
                                x: 'center',
                                y: 'top'
                            }
                        });
                    }
                } catch (e) {
                    loadingScreen(false, '')
                    window.notyf.open({
                        type       : 'Danger',
                        message    : "Failed to send e,ail, please check your internet ",
                        duration   : 10_000,
                        ripple     : true,
                        background : '#FF5F57',
                        dismissible: true,
                        position   : {
                            x: 'center',
                            y: 'top'
                        }
                    });
                }
            }
        }

        if(!canSend){
            window.notyf.open({
                type       : 'Danger',
                message    : "Email/Valid Email Required to send Code - " ,
                duration   : 10_000,
                ripple     : true,
                background : '#FF5F57',
                dismissible: true,
                position   : {
                    x: 'center',
                    y: 'top'
                }
            });

            return;
        }
    }else{
        // its one email !

        let res;
        try {
            loadingScreen(true, 'Sending Instructions');
            res = await axios.post(BASE_URL + '/notifications-service/users/widget-instructions', {
                email:sendCodeToDeveloperInput ,
                name:null ,
                activattionLink:SRC_CODE ,
            });
            loadingScreen(false, '');
            if(res.data.success){
                window.notyf.open({
                    type       : 'Success',
                    message    : "Instructions sent successfully,yey ",
                    duration   : 10_000,
                    ripple     : true,
                    background : '#27C940',
                    dismissible: true,
                    position   : {
                        x: 'center',
                        y: 'top'
                    }
                });
            }
        } catch (e) {
            loadingScreen(false, '')
            window.notyf.open({
                type       : 'Danger',
                message    : "Failed to send e,ail, please check your internet ",
                duration   : 10_000,
                ripple     : true,
                background : '#FF5F57',
                dismissible: true,
                position   : {
                    x: 'center',
                    y: 'top'
                }
            });
        }
    }





}
async function gotoStage(stage) {
    if (!canProceed) {

        return;
    }
    if (stage === '6') {

        alert('here stop')
    } else {
        if (stage === '2') {
            // test if previous has ben set details
            let txtFullName = $("#txtFullName").val();
            let txtCompanyName = $("#txtCompanyName").val();
            let txtEmailAddress = $("#txtEmailAddress").val();
            let txtPassword = $("#txtPassword").val();


            if (txtFullName === '') {

                $("#responseMessage").html(" <p style='color:red;'> Full Name is required </p> ")
                return;
            }
            if (txtCompanyName === '') {

                $("#responseMessage").html(" <p style='color:red;'> Company Name is required </p> ")
                return;
            }

            if (txtEmailAddress === '') {

                $("#responseMessage").html(" <p style='color:red;'> Email Address is required </p> ")
                return;
            }


            if (!isEmail(txtEmailAddress)) {

                $("#responseMessage").html(" <p style='color:red;'> Valid Email Address is required </p> ")
                return;
            }

            if (!validatePassword(txtPassword) || txtPassword === '') {

                $("#responseMessage").html(" <p style='color:red;'> Valid Password  is required </p> ")
                return;
            }
            $("#responseMessage").html("  ")
        }
        if (stage === '3') {
            let txtWidgetName = $("#txtWidgetName").val();
            let txtTopbarMessage = $("#txtTopbarMessage").val();
            let txtThemeColor = $("#txtThemeColor").val();

            if (txtWidgetName === '') {

                $("#responseMessage").html(" <p style='color:red;'> Widget Name is required </p> ")
                return;
            }

            if (txtTopbarMessage === '') {
                $("#responseMessage").html(" <p style='color:red;'> Topbar Message is required </p> ")
                return;
            }
            if (txtThemeColor === '') {

                $("#responseMessage").html(" <p style='color:red;'> txt Theme Color is required </p> ")
                return;
            }
            loadingScreen(true, "Saving User Details...");
            let result = await submitStepCompanyDetails();
            loadingScreen(false, "");
            console.log(result)
            if (!result.success) {
                canProceed = false;
                $("#responseMessage").html(` <p style='color:red;'> ${result.message} </p> `)
            } else {


                SRC_CODE = result.scriptSrc;
                ccompanyObject.urlRefer = result.urlRefer;
                ccompanyObject.companyName = result.company;
                ccompanyObject.addedByUser = result.userFullName;
                ccompanyObject.org = result.org;
                result = result.data;
                canProceed = true;
                $("#codeCpy").html(` &lt;script src="https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/js/widgetsrc-v-1.0.0.js?access=${result.scriptSrc}" &gt;  &lt;/script&gt;  `);
            }

        }
// erTy%468677$
        let postion = parseInt(stage);
        if (postion > 1) {
            $("#currentStage").text(stage);
            $("#currentStage,#outOfStage,#stageParent").show();
        } else {
            $("#currentStage,#outOfStage,#stageParent").hide();
        }
        console.log('postion::', postion)

        for (let i = 7; i !== 0; i--) {
            $("#step" + (i)).hide();
            console.log(i, 'postion---::', postion)
        }
        $("#step" + postion).show();

    }
}

function loadingScreen(sho, message) {
    if (sho) {
        $.blockUI({
            message: message == '' ? `<h3> <img src="js/busy.gif" /> Processing.Please Wait...</h3>` : `<h3> <img src="js/busy.gif"/> ` + message + `</h3>`,
            css    : {
                border                 : 'none',
                padding                : '15px',
                backgroundColor        : 'rgba(173,173,173,0.98)',
                '-webkit-border-radius': '10px',
                '-moz-border-radius'   : '10px',
                opacity                : 0.5,
                color                  : '#fff'
            }
        });
    } else {
        $.unblockUI({
            fadeOut: 100
        });
    }
}

// erTy%468677$

function showCopiedMessage() {
    window.notyf.open({
        type       : 'Success',
        message    : " <strong>Awesome! Code copied</strong> <br>" + "Remember to copy and paste this code before the &lt;/body&gt; tag on every page of your website.",
        duration   : 10_000,
        ripple     : true,
        background : '#5F63D3',
        dismissible: true,
        position   : {
            x: 'center',
            y: 'top'
        }
    });

    navigator.clipboard.writeText($("#codeCpy").text());
}


document.querySelector(".form-field")
    .addEventListener('click', () => {
        input.style.display = 'block';
        input.focus();
    });

input.addEventListener('blur', () => {
    //input.style.display = 'none';
});



input.addEventListener('keypress', function (event) {
    if (event.which === 13) {

        let emailTextInput = input.value;
        if (!isEmail(emailTextInput)) {

            window.notyf.open({
                type       : 'danger',
                message    : " Valid email address Required.",
                duration   : 10_000,
                ripple     : true,
                background : '#d0393e',
                dismissible: true,
                position   : {
                    x: 'center',
                    y: 'top'
                }
            });
            return;
        }

        emailsToInvite.add(emailTextInput);


        chips.appendChild(function () {
            let _chip = document.createElement('div');

            _chip.classList.add('chip');
            _chip.addEventListener('click', chipClickHandler);

            _chip.append(
                (function () {
                    var _chip_text = document.createElement('span');
                    _chip_text.classList.add('chip--text');
                    _chip_text.innerHTML = input.value;

                    return _chip_text;
                })(),
                (function () {
                    var _chip_button = document.createElement('span');
                    _chip_button.classList.add('chip--button');
                    _chip_button.innerHTML = 'x';

                    return _chip_button;
                })()
            );

            return _chip;
        }());
        input.value = '';
    }
});

function chipClickHandler(event) {
    chips.removeChild(event.currentTarget);
}
