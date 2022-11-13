function onGenarateDNS() {
    let txtDomain = $('#txtDomain').val();
    if (txtDomain === '') {
        showErrorMessage("Please put domain");
        error_input_element(true, 'txtDomain');
        return
    }
    error_input_element(false, 'txtDomain');
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(txtDomain)) {
        showErrorMessage("Please put valid domain");
        error_input_element(true, 'txtDomain');
        return
    }
    error_input_element(false, 'txtDomain');
    let dns = 'click2callDns=' + txtDomain.split('.')[0] + 'veri0' + randomStringID() + randomIDString(16);
    $("#txtDNS").val(dns);

    $("#btnVerify").show('slow');
    $("#btnGen").hide('slow');
}


function copyDNS() {
    let copyText = document.getElementById("txtDNS");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
    showSuccessMessage('Record Copied successfully');

}

async function verifyRecord(id) {
    loadingScreen(true, "Testing ....");
    let result = await axios.post('/auth/secured/api/v1/companies/verify-domain', {recordId: id});
    loadingScreen(false, "Testing ....");
    result = result.data;
    if (result.success) {
        getDomains();
    } else {
        showErrorMessage('Failed to verify check your configs')
    }
}


function CopyDnsRow(id) {
    let copyText = $("#domainDNS-" + id);
    console.log(copyText.text())
    copyText.mark(copyText.text()); // will mark the selection

    /* Select the text field */
    copyText.select();
    navigator.clipboard.writeText(copyText.text());
    showSuccessMessage('Record Copied successfully');
}

async function deleteDnsRecord(id) {
    loadingScreen(true, "Deleting ....");
    let result = await axios.post('/auth/secured/api/v1/companies/delete-domain', {recordId: id});
    loadingScreen(false, "Testing ....");
    result = result.data;
    if (result.success) {
        getDomains();
    } else {
        showErrorMessage('Failed to verify check your configs')
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

async function getDomains() {
    let result = await axios.get('/auth/secured/api/v1/companies/domains');
    result = result.data;
    let row = ``;
    console.log(result)
    if (result.success) {
        console.log(result)
        if (result.data.domains.length > 0) {
            $('#domainsTableView').show();
        } else {
            $('#domainsTableView').hide();
        }
        result.data.domains.forEach(rows => {
            let explain = ` Record Name: ${rows.dnsTxtRecord.split('=')[0]}  \n Value: ${rows.dnsTxtRecord.split('=')[1]}`;
            const status = rows.isVerified ? ` <i style="color:green" class="align-middle me-2 fas fa-fw fa-check-circle"></i>` : `<i style="color:red" class="align-middle me-2 fas fa-fw fa-times-circle"></i>`;
            row += `
            
            <tr>
                    <td> ${rows.domain} </td>
                    <td > <label id="domainDNS-${rows.id}"   data-bs-placement="top" title="${explain}" > ${rows.dnsTxtRecord} </label>    </td>
                   
                    <td class="d-none d-md-table-cell" >  ${status}  </td>

                    <td class="table-action"> <a href="javascript:void(0)" onclick="verifyRecord('${rows.id}')" data-bs-toggle="tooltip" data-bs-placement="left" title="Verify">
                            <i class="align-middle me-2 fas fa-fw fa-redo"></i>
                        </a>
                    </td>

                    <td class="table-action">


                        <a href="javascript:void(0)" onclick="CopyDnsRow('${rows.id}')" data-bs-toggle="tooltip" data-bs-placement="left" title="Copy Record">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 class="feather feather-copy align-middle me-2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </a>

                        <a href="javascript:void(0)" onclick="deleteDnsRecord('${rows.id}')" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete Domain">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </a>
                    </td>

                </tr>
            `
        });

        $('#tbodyDomains').html(row);
    } else {
        row = `
        <tr>
              <td colspan="5"> No domains Saved yet  </td>
        
        </tr>
        `;

    }


}


async function getAccountDetails() {
    // txtCompanyName
    let result = await axios.get('/auth/secured/api/v1/companies/company');
    console.log(result)
    result = result.data;
    if (result.success) {
        let scriptSrc = result.data.basics.apiWidgetAccessToken.replaceAll('api-', '');
        SRC_CODE = scriptSrc;
        $("#codeCpy").html(` &lt;script  src="https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/js/widgetsrc-v-1.0.0.js?access=${scriptSrc}" &gt;  &lt;/script&gt;  `);
        $("#txtCompanyName").text(result.data.basics.title)
    } else {
        showErrorMessage('Failed to load the Company Details');
        $("#txtCompanyName").html('<span style="color:red;"> Failed to load the Company Details,Reload Page    </span>')
    }
}

let ARRAY_USERS_IN_COMPANY_LIST = [];
function showProfileView(){
    let userId = arguments[0];
    let isPrimary = arguments[1] || '0' ;

    if(isPrimary === '1'){
        $('#btnDeleteUserPreview').hide()
    }else{
        $('#btnDeleteUserPreview').show()
    }

    $("#selectedIdInSelection").text(userId)
    $('#userProfileDiv').show('slow');
    userId = parseInt(userId);
    let userObj = ARRAY_USERS_IN_COMPANY_LIST.filter( x => x.id === userId ) [0];
    console.log(userObj);
    const isDeleted = userObj.isDeleted === 0 ? `<span class="badge bg-success">Active</span>` : `<span class="badge bg-danger">Deleted</span>`;
    if( userObj.isDeleted === 0){
        $("#btnReactivateUserPreview").hide()
        $("#btnDeleteUserPreview").show()
    }else{
        $("#btnDeleteUserPreview").hide()
        $("#btnReactivateUserPreview").show()
    }
    let profileHtml = `
     <tr>
        <th>Name</th>
        <td> ${userObj.fullName} </td>
    </tr>
    <tr>
        <th>Date Joined</th>
        <td> ${ convertToLocalTime(userObj.dateCreated)  } </td>
    </tr>
    <tr>   
    
        <th>Email</th>
        <td> ${userObj.email} </td>
    </tr>
    <tr>
        <th>Phone</th>
        <td> -- </td>
    </tr>
    
    <tr>
        <th>Role</th>
        <td><span class="badge bg-success"> ${userObj.role}</span></td>
    </tr>
    
    <tr>
        <th>Status</th>
        <td><span class="badge bg-success">${isDeleted}</span></td>
    </tr>
    
    
    `;

    $("#tBodyUserProfile").html(profileHtml);
    let li = '';
    console.log('XXXXXX' , userObj)
    userObj.teamGroups.forEach(group => {
        // ${moment(convertToLocalTime(group.dateCreated), 'YYYY-MM-DD HH:mm:ss').fromNow()}
        li += `
          <li class="timeline-item">
                <strong> ${group.team.title} </strong>
                <span class="float-end text-muted text-sm"> Added  ${moment(convertToLocalTime(group.dateCreated), 'YYYY-MM-DD HH:mm:ss').fromNow()} </span>
                <p>Description : ${group.team.description} <br>  With other  ${group.team.usersCounter}  users . </p>
            </li>
        `;
    });
    $('#usersTeamsIncludedList').html(li);
    if(userObj.teamGroups.length <1){
        $('#usersTeamsIncludedList').html('Not in any team');
    }
}

async function btnRqstCode() {
    loadingScreen(true, 'Sending Code to email')
    let result = await axios.post('/auth/secured/api/v1/companies/request-delete-account', {n: 2});
    loadingScreen(false, 'Sending Code to email')
    result = result.data;
    console.log('result', result)
    if (result.success) {
        showSuccessMessage('Code Sent , Check Email');
        notifySuccess("Code Sent , Check Email")
        $("#divDeletAccount").show()
    } else {
        showErrorMessage("Error ,Please try again ")
    }
}

async function btnDeleteAccount() {

    let deleteCodeTxT = $('#deleteCodeTxT').val().trim();
    if (deleteCodeTxT === '') {
        showErrorMessage('Delete Code is required');
        return;
    }

    if (!isNumeric(deleteCodeTxT)) {
        showErrorMessage('Valid Delete Code is required');
        return
    }

    loadingScreen(true, 'Deleting ....')
    let result = await axios.post('/auth/secured/api/v1/companies/delete-account', {otp: deleteCodeTxT});
    loadingScreen(false, 'Sending Code to email')
    result = result.data;
    if (result.success) {

        alert("ACCOUNT HAS BEEN DELETED ,GOOD BYE")


        Cookies.remove('apiToken');
        Cookies.remove('userId');
        Cookies.remove('role');
        Cookies.remove('email');
        Cookies.remove('profileImage');
        Cookies.remove('fullName');
        Cookies.remove('companyId');

        window.location.href = "/";

    } else {
        notifyError(result.message)
    }

}
async function getUsersData() {
    let result = await axios.get('/auth/api/v1/users/company-users');
    console.log(result)
    result = result.data;

    if (result.success) {
        ARRAY_USERS_IN_COMPANY_LIST = result.data.users;
        let row = '';
        result.data.users.forEach(user => {
            const isDeleted = user.isDeleted === 0 ? `<span class="badge bg-success">Active</span>` : `<span class="badge bg-danger">Deleted</span>`;
            const isEmailAddressVerified = user.isEmailAddressVerified === 1 ? `<span class="badge bg-success"> <i class="align-middle me-2 fas fa-fw fa-check-circle"></i>  Verified</span>` : `<span class="badge bg-danger">Not Verified</span>`;
            const isPrimary = user.isPrimary ? `<span class="badge bg-success">Primary</span>` : ``;
            const isMe = user.id === (loggedID) ? `<span class="badge bg-success">[Me]</span>` : ``;
            row += `
           <tr onclick="showProfileView('${user.id}','${user.isPrimary? 1:0}')">
                <td> ${isMe} </td>
                <td>${user.fullName}  </td>
                <td>${user.role}  </td>
                <td>${user.email} ${isPrimary}</td>
                <td>  ${isDeleted}   ${isEmailAddressVerified}    </td>
            </tr>
           `;
        });

        $("#tbody-users").html(row);
    }else {
        $("#tbody-users").html(`<strong style="color:red;"> Error , Could not find Users </strong>`);
    }
    $('#userProfileDiv').hide('slow');
}

async function getRoles() {
    let result = await axios.get('/auth/api/v1/users/roles');
    console.log(result)
    result = result.data;
    if (result.success) {

    }
}

getAccountDetails();
getDomains();
getUsersData();
getRoles();

async function actionSaveTXT() {
    let txtDomain = $('#txtDomain').val();
    let txtDNS = $('#txtDNS').val();
    loadingScreen(true, 'Saving with Verification ...');
    let result = await axios.post('/auth/secured/api/v1/companies/new-domain', {
        domain      : txtDomain,
        dnsTxtRecord: txtDNS,
    });
    loadingScreen(false, 'Saving with Verification ...');
    result = result.data;
    if (!result.success) {
        $('#txtDomain,#txtDNS').val('');
        showErrorMessage("Failed to save");
    } else {

        showSuccessMessage('Domain Saved Successfully');
        loadingScreen(true, 'Saving with Verification ...');
        await getDomains();
        loadingScreen(false, 'Saving with Verification ...');
        actionCancelTXT();
    }


}

function addNewDomain() {
    $("#domainsForm").slideDown('slow');
    $("#domainsTable").slideUp('slow');
}

function actionCancelTXT() {
    $("#domainsForm").slideUp('slow');
    $("#domainsTable").slideDown('slow');
}

