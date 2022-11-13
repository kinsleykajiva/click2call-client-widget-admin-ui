async function getConfigDetails() {

    let data = await axios.get('/auth/api/v1/widget/configs');
    if (!data.data.success) {
        showErrorMessage(data.data.message);
        showErrorMessage(data.data.message);
    } else {
        data = data.data;
        console.log(data)
        renderMainUIData(data.data);
    }

}
let SRC_CODE = '';

async function sendDeveloperInstruction() {
    let sendCodeToDeveloperInput = $('#sendCodeToDeveloperInput').val();


    if (sendCodeToDeveloperInput === '') {
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
    let canSend = true;
    if (sendCodeToDeveloperInput.indexOf(',') > -1) {
        let EmailsArr = sendCodeToDeveloperInput.split(',');

        for (let i = 0; i < EmailsArr.length; i++) {
            const email = EmailsArr[i];
            console.log(22, email)
            if (!isEmail(email)) {
                canSend = false;
            } else {

                let res;
                try {
                    loadingScreen(true, 'Sending Instructions');
                    res = await axios.post('/notifications-service/users/widget-instructions', {
                        email          : email,
                        name           : null,
                        activattionLink: SRC_CODE,
                    });
                    loadingScreen(false, '');
                    if (res.data.success) {
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

        if (!canSend) {
            window.notyf.open({
                type       : 'Danger',
                message    : "Email/Valid Email Required to send Code - ",
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
    } else {
        // its one email !

        let res;
        try {
            loadingScreen(true, 'Sending Instructions');
            res = await axios.post('/notifications-service/users/widget-instructions', {
                email          : sendCodeToDeveloperInput,
                name           : null,
                activattionLink: SRC_CODE,
            });
            loadingScreen(false, '');
            if (res.data.success) {
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
                message    : "Failed to send email, please check your internet ",
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

    $('#sendCodeToDeveloperInput').val('');


}

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
getAccountDetails();
async function getAccountDetails() {
    // txtCompanyName
    let result = await axios.get('/auth/secured/api/v1/companies/company');
    console.log(result)
    result = result.data;
    if (result.success) {
        let scriptSrc = result.data.basics.apiWidgetAccessToken.replaceAll('api-', '');
        SRC_CODE = scriptSrc;
        $("#codeCpy").html(` &lt;script  src="https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/js/widgetsrc-v-1.0.0.js?access=${scriptSrc}" &gt;  &lt;/script&gt;  `);
       // $("#txtCompanyName").text(result.data.basics.title)
    } else {
        showErrorMessage('Failed to load the Company Details');
        $("#txtCompanyName").html('<span style="color:red;"> Failed to load the Company Details,Reload Page    </span>')
    }
}

function onRemoveWidget() {
    for (let i = 0; i < 10; i++) {
        showGeneralMessage('Yes we are still hard at work , Remove Widget Action');
    }


}


function renderMainUIData(object) {
    console.log(object)
    $("#widgetRecordId").text(object.id);
    $("#inputWidgetName").val(object.nameShown);
    $("#inputWidgetWelcomeMessage").val(object.topBarMessage);
    $("#inputWidgetColor").val(object.backgroundHexColorCode);
    $("#flexSwitchCheckChecked").prop("checked", object.isActive !== 0);

}

async function saveUpdateWidget() {
    let inputWidgetName = $("#inputWidgetName").val();
    let inputWidgetWelcomeMessage = $("#inputWidgetWelcomeMessage").val();
    let inputWidgetColor = $("#inputWidgetColor").val();
    let isActive = $('#flexSwitchCheckChecked').is(':checked') ? 1:0;
    if (inputWidgetName === '') {
        showErrorMessage("Name is required");
        error_input_element(true, 'inputWidgetName');
        return;
    }
    error_input_element(false, 'inputWidgetName');
    if (inputWidgetWelcomeMessage === '') {
        showErrorMessage("Welcome Message is required");
        error_input_element(true, 'inputWidgetWelcomeMessage');
        return;
    }
    error_input_element(false, 'inputWidgetWelcomeMessage');

    let payload = {
        recordId: $("#widgetRecordId").text(),
        WidgetName:inputWidgetName ,
        WidgetWelcomeMessage:inputWidgetWelcomeMessage ,
        WidgetColor:inputWidgetColor ,
        isActive:isActive ,
    };
    loadingScreen(true , 'Updating');
    let result = await axios.post('/auth/api/v1/widget/update' ,payload);
    loadingScreen(false , 'Updating');
    if(!result.data.success){
        showErrorMessage('Err:' + result.data.message);
    }else{
        showSuccessMessage('Update Widget acrosss pages')
    }
}


getConfigDetails();
