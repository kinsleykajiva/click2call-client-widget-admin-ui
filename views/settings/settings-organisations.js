function chipPArent() {
    renderTeamsUIDialog();

    const input = document.querySelector(".chip-input");
    const chips = document.querySelector(".chips");


    function chipClickHandler(event) {
        let remvedId = event.currentTarget.getAttribute('id')
        MAP_ADD_USERS_TEMP.delete(remvedId);
        console.log('removed email' ,event.currentTarget.getAttribute('id'))
        chips.removeChild(event.currentTarget);
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
        if (event.which === 13 /*||event.which === 188*/) {

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
            const typeAccess = $('#selectUserType').val();
            const typeAccessText =$("#selectUserType").find("option:selected").text();
            MAP_ADD_USERS_TEMP.set(emailTextInput , {userTypeId:typeAccess});


            chips.appendChild(function () {
                const _chip = document.createElement('div');

                _chip.classList.add('chip');
                _chip.setAttribute('id', emailTextInput)
                _chip.addEventListener('click', chipClickHandler);

                _chip.append(
                    (function () {
                        const _chip_text = document.createElement('span');
                        _chip_text.classList.add('chip--text');
                        _chip_text.innerHTML = emailTextInput +'|'+typeAccessText ;

                        return _chip_text;
                    })(),
                    (function () {
                        const _chip_button = document.createElement('span');
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


}

function renderTeamsUIDialog() {

    let opt = `<option value= 'null'> Select Team </option>`;
    ARRAY_TEAMS_NAME_LIST.forEach(element_ => {// for each org.
        opt += `<option value= '${element_.id}'> ${element_.title} </option>`;
    });
    $("#selectTeam").html(opt);


}

function renderTeamsUI() {
    ARRAY_ORGANISATIONS_LIST.forEach((element, index) => {
        const orgId = element.id;
        let teams_name_list = ARRAY_TEAMS_NAME_LIST.filter(x => x.organisationId === orgId);
        /*
         let opt = `<option value= 'null'> Select Team </option>`;
         teams_name_list.forEach(element_ => {// for each org.
         opt += `<option value= '${element_.id}'> ${element_.title} </option>`;
         });
         $("#tbody_" + orgId).html(opt);*/
        // table
        let row = ``;
        teams_name_list.forEach(element_ => {// for each org.
            row += `
            <tr id="teamRow-${element_.id}">
                <td>${element_.title}</td>
                <td> ${element_.description} </td>
                <td class="d-none d-md-table-cell"> ${element_.usersCounter} </td>
                <td class="d-none d-md-table-cell"> -- </td>
                <td class="table-action">
                    <a href="javascript:void(0)" onclick="openEditorTeamsDia('${orgId}' , '${element_.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 align-middle"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a>
                    <a href="javascript:void(0)"   onclick="deleteEditorTeam( '${element_.id}')" ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                </td>
            </tr>
            
            `;
        });
        $("#tbody_" + orgId).html(row);
    })

}


function deleteEditorTeam(rowId) {
    let html = `
    
                                       
        
            <div>
                <div class="mb-3">
                    
                    <label>Are you sure you want to delete this team ?</label>
                    
                </div>
            </div>
        
    
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel("Delete team",
        html,
        "Delete",
        'Cancel',
        async () => {
            let payload = {
                teamId: rowId,
            }

            loadingScreenElement('globalModalFunctionalForm', true, "Deleting....");

            try {
                let saveeResult = await axios.post('/auth/secured/api/v1/teams/delete-team', payload);
                loadingScreenElement('globalModalFunctionalForm', false, "-");

                console.log(payload)
                if (saveeResult) {
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    showSuccessMessage("Delete Team details");
                    $('#teamRow-'+rowId).slideUp('slow').remove()
                   // getTeamGroupsDataCaller();
                } else {
                    showErrorMessage('Failed to Delete')
                }
            } catch (e) {
                loadingScreenElement('globalModalFunctionalForm', false, "-")
                showErrorMessage('Failed to save')
            }

        },
        () => {
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        }, () => {
        }
    );

}

function openEditorTeamsDia(ogId, rowId) {
    showAddTeamsDialog(ogId,true ,rowId)
}

function showAddOrganisationDialog() {
    let html = `
     <div class="card">
        
        <div class="card-body">

            <div class="mb-3">
                <label class="form-label" for="notyf-message">Organisation Name</label>
                <input id="inputOrg" name="" type="text" class="form-control" placeholder="E.g. any name">
            </div>         

            

        </div>
    </div>
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel("Create Organization",
        html,
        "Save",
        'Cancel',
        async () => {
            const inputOrg = $('#inputOrg').val().trim();
            if (inputOrg === '') {
                showErrorMessage("Name is required");
                return
            }

            let payload = {
                OrganisationName: inputOrg,

            }
            console.log(payload)
            loadingScreenElement('globalModalFunctionalForm', true, "Saving")
            try {
                let saveeResult = await axios.post('/auth/secured/api/v1/organisations/save-new', payload);
                loadingScreenElement('globalModalFunctionalForm', false, "Saving");

                console.log(payload)
                if (saveeResult) {
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    showSuccessMessage("Saved New Organisation details");
                    mainEntry();
                } else {
                    showErrorMessage('Failed to save')
                }
            } catch (e) {
                loadingScreenElement('globalModalFunctionalForm', false, "Saving")
                showErrorMessage('Failed to save')
            }

        },
        () => {
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        }, () => {
        }
    );

}


function renderNAVOgs() {
    let nav = ``;

    ARRAY_ORGANISATIONS_LIST.forEach((element, index) => {
        let active = index === 0 ? `active` : '';
        nav += ` 
                
     <li class="nav-item">
            <a class="nav-link ${active}" href="#vertical-icon-tab-${element.id}" data-bs-toggle="tab" role="tab"> 
           
            
           <div class="stat text-primary btn-lg">
            <span class="badge bg-primary"> ${element.title.charAt(0).toUpperCase()} </span>
             </div>

               
            </a>
        </li>


`
    });
    $("#tabNavsParens").html(nav)
}


const buildTabeTitles = () => {
    let html = ``;
    ARRAY_ORGANISATIONS_LIST.forEach((element, index) => {
        let active = index === 0 ? `active` : '';
        html += `
        
          <a class="list-group-item list-group-item-action ${active}" data-bs-toggle="list" href="#subtab-${orgId}" role="tab" aria-selected="true">
                                             <i class="align-middle me-2 fas fa-fw fa-sitemap"></i>                Org profile
                                        </a>

`;
    })


    return html;
}



function innerHTMLMaker(index) {

    const element = ARRAY_ORGANISATIONS_LIST[index];
    let orgName = element.title;
    let orgId = element.id;
    console.log('E-E',element)
    let ImgSrc = element.profileImageUrl === null || element.profileImageUrl === undefined || element.profileImageUrl === 'null' ?
                 'img/icons/brand-1.svg':  element.profileImageUrl.replace('/s3.af-south-1.amazonaws.com' ,'')

    let html = `
     <div class="row">
                            <div class="col-md-3 col-xl-2">

                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">  <div class="badge bg-success my-2">${orgName}</div> </h5>
                                    </div>

                                    <div class="list-group list-group-flush" role="tablist">
                                        <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#subtab-1-${orgId}" role="tab" aria-selected="true">
                                             <i class="align-middle me-2 fas fa-fw fa-sitemap"></i>                Org profile
                                        </a>
                                        <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#subtab-2-${orgId}" role="tab" aria-selected="false">
                                           <i class="align-middle me-2 fas fa-fw fa-users"></i>  Teams
                                        </a>
                                        <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#subtab-3-${orgId}" role="tab" aria-selected="false">
                                            <i class="align-middle me-2 fas fa-fw fa-user"></i>   Users
                                        </a>
                                        <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#subtab-4-${orgId}" role="tab" aria-selected="false">
                                             <i class="align-middle me-2 fas fa-fw fa-user-circle"></i> Profile settings
                                        </a>

                                    </div>
                                </div>
                            </div>

                            <div class="col-md-9 col-xl-10">
                                <div class="tab-content">
                                    <div class="tab-pane fade active show" id="subtab-1-${orgId}" role="tabpanel">

                                        <div class="card">
                                            <div class="card-header">

                                                <h5 class="card-title mb-0" id="orgProfile_${orgId}" >Organisation profile</h5>
                                            </div>
                                            <div class="card-body">
                                               
                                                    <div class="row">
                                                        <div class="col-md-8">
                                                            <div class="mb-3">
                                                           
                                                                <label class="form-label" for="orgName_${orgId}">Organisation name</label>
                                                                <input type="text" value="${element.title  === null ? '' : element.title}" class="form-control" value="${orgName}" id="orgName_${orgId}" placeholder="Organisation name">
                                                            </div>

                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="text-center">
                                                                <img alt="" id="imgPic_${orgId}"  src="${ImgSrc}" class="rounded-circle img-responsive mt-2" width="128" height="128">
                                                                <div class="mt-2">
                                                                    <button class="btn btn-primary" onclick="trigerFileImageOrgnisationUpload('${orgId}')" >  Change</button>
                                                                </div>
                                                                <small style="display: none;"> <input onchange="uploadProfileImage('${orgId}')" type="file" id="imgPicUpload_${orgId}" class="form-control"></small>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!--                                                <button type="submit" class="btn btn-primary">Save changes</button>-->
                                               

                                            </div>
                                        </div>

                                        <div class="card">
                                            <!--<div class="card-header">

                                                <h5 class="card-title mb-0">Private info</h5>
                                            </div>-->
                                            <div class="card-body">
                                                 
                                                    <div class="row">
                                                        <div class="mb-3 col-md-6">
                                                            <label class="form-label" for="orgUrl_${orgId}">URL</label>
                                                            <input type="text" value="${element.url  === undefined || element.url  === null || element.url === 'null' ? '' : element.url}" class="form-control" id="orgUrl" placeholder="URL">
                                                        </div>
                                                        <div class="mb-3 col-md-6">
                                                            <label class="form-label" for="orgTax_${orgId}">Company TAX ID (optional)</label> <br>
                                                            <input type="text" value="${ element.companyTax  === undefined || element.companyTax  === null || element.companyTax === 'null' ? '' : element.companyTax}" class="form-control" id="orgTax_${orgId}" placeholder="Company TAX ID (optional)">
                                                        </div>
                                                    </div>

                                               

                                            </div>
                                        </div>


                                        <div class="card">
                                            <div class="card-header">

                                                <h5 class="card-title mb-0">Company address</h5>
                                            </div>
                                            <div class="card-body">
                                               


                                                    <div class="mb-3">
                                                        <label class="form-label" for="orgCountry_${orgId}">Country</label>
                                                        <input type="text" value="${ element.country  === undefined || element.country  === null || element.country === 'null'? '' : element.country}" class="form-control" id="orgCountry_${orgId}" placeholder="Country name">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label" for="orgUnitStreet_${orgId}">Unit number and street name</label>
                                                        <input type="text" value="${ element.unitNumberStreetName  === undefined || element.unitNumberStreetName  === null  || element.unitNumberStreetName === 'null'? '' : element.unitNumberStreetName}"  class="form-control" id="orgUnitStreet_${orgId}" placeholder="123 Street name">
                                                    </div>
                                                    <div class="row">
                                                        <div class="mb-3 col-md-6">
                                                            <label class="form-label" for="orgTown_${orgId}">City/Town</label>
                                                            <input type="text" value="${ element.city  === undefined || element.city  === null  || element.city === 'null' ? '' : element.city}" class="form-control" id="orgTown_${orgId}">
                                                        </div>
                                                        <div class="mb-3 col-md-4">
                                                            <label class="form-label" for="orgState_${orgId}">State</label>
                                                            <input type="text" value="${ element.province  === undefined || element. province === null  || element.province === 'null'? '' : element.province}"  class="form-control" id="orgState_${orgId}">

                                                        </div>
                                                        <div class="mb-3 col-md-2">
                                                            <label class="form-label" for="orgPostCode_${orgId}">Post code</label>
                                                            <input type="text" value="${  element.postalCode  === undefined || element.postalCode  === null   || element.postalCode === 'null' ? '' : element.postalCode}" class="form-control" id="orgPostCode_${orgId}">
                                                        </div>
                                                    </div>
                                                    <button onclick="updateOrganisationProfile('${orgId}')" type="submit" class="btn btn-primary">Save changes</button>
                                                

                                            </div>
                                        </div>

                                    </div>

                                    <div class="tab-pane fade" id="subtab-2-${orgId}" role="tabpanel">
                                        <div class="card">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-md-10" > <h2 class="card-title">Teams</h2></div>
                                                    <div class="col-md-2" > <button   onclick="showAddTeamsDialog('${orgId}')"  type="submit" class="btn btn-primary"> <i class="fa fa-plus"></i> Add</button> </div>
                                                </div>
                                                <p>You can organize users into specific teams such as “billing”, “supprort”, etc and assign numbers to specific teams.</p>
                                                <!--start-->
                                                <div class="row">
                                                    <div class="col-12 col-xl-12">
                                                        <div class="card">

                                                            <table class="table">
                                                                <thead>
                                                                <tr>
                                                                    <th style="width:40%;">Team name</th>
                                                                    <th style="width:25%">Description</th>
                                                                    <th class="d-none d-md-table-cell" >Users</th>
                                                                    <th>Assigned numbers</th>
                                                                    <th></th>
                                                                </tr>
                                                                </thead>
                                                               <tbody id="tbody_${orgId}">
                                                                <tr>
                                                                    <td>Billing</td>
                                                                    <td>—</td>
                                                                    <td class="d-none d-md-table-cell">2 users</td>
                                                                    <td class="d-none d-md-table-cell">2 numbers</td>
                                                                    <td class="table-action">
                                                                        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 align-middle"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a>
                                                                        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                                                                    </td>
                                                                </tr>


                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end-->

                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="subtab-3-${orgId}" role="tabpanel">
                                        <div class="card">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-md-8" > <h2 class="card-title">Users</h2></div>
                                                    <div class="col-md-4" >

                                                        <div class="input-group">
                                                            <input type="text" class="form-control" placeholder="Search agents...">
                                                            <button onclick="showAddUserDialog('${orgId}')" class="btn btn-secondary" type="button"> <i class="fa fa-plus"></i> Add  </button>
                                                        </div>

                                                    </div>
                                                </div>
                                                <br>
                                                <!--                                            <p>You can organize users into specific teams such as “billing”, “supprort”, etc and assign numbers to specific teams.</p>-->
                                                <!--start-->
                                                <div class="row">
                                                    <div class="col-12 col-xl-12">
                                                        <div class="card">

                                                            <table class="table">
                                                                <thead>
                                                                <tr>
                                                                    <th style="width:40%;">User</th>
                                                                    <th style="width:25%">Role</th>
                                                                    <th class="d-none d-md-table-cell" >Teams</th>
                                                                    <th>Assigned numbers</th>
                                                                    <th></th>
                                                                </tr>
                                                                </thead>
                                                                <tbody id="tbodyUserSettings-${orgId}">
                                                                    <tr>
                                                                        <td>Jane Doe example@email.com</td>
                                                                        <td> Superadmin </td>
                                                                        <td class="d-none d-md-table-cell"> -</td>
                                                                        <td class="d-none d-md-table-cell"> - </td>
                                                                        <td class="table-action">
                                                                            <a href="#"  ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 align-middle"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a>
                                                                            <a href="#" ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                                                                        </td>
                                                                    </tr>


                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end-->

                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="subtab-4-${orgId}" role="tabpanel">
                                        This tab won't be relevant if it is to affect the overall profile of a user given that they are a single user accross hence if
                                        they wish to update their details they need to update tne user profile section only.

                                        <br>
                                       
                                        <br>



                                    </div>
                                </div>
                            </div>
                        </div>
    
    `;

    return html;
}

function renderNAVTabsOgs() {
    let nav = ``;

    ARRAY_ORGANISATIONS_LIST.forEach((element, index) => {
        let active = index === 0 ? `active` : '';


        let innerHTMLOrg = innerHTMLMaker(index);
        nav += `   <div class="tab-pane ${active}" id="vertical-icon-tab-${element.id}" role="tabpanel">   ${innerHTMLOrg} </div> `
    });

    $("#vertivalTabs").html(nav)
}


function renderOrgsUI() {
    // this is is complex UI
    // render orgs listings
    if (ARRAY_ORGANISATIONS_LIST.length < 1) {
        return;
    }
    renderNAVOgs();
    renderNAVTabsOgs();

    let UI = `
     <div class="">
        <div class="tab tab-vertical">
            <ul class="nav nav-tabs" role="tablist">

              

            </ul>
            <div class="tab-content" id="bodyOfParent">
            
          
                       
                
            </div>
        </div>
    </div>`;
    // $("#bodyUI").html(UI);

}

function trigerFileImageOrgnisationUpload(orgId) {
    $("#imgPicUpload_" + orgId).trigger('click');
}

async function updateOrganisationProfile(orgId) {
ccccccccccccc
    let orgName_ = $("#orgName_" + orgId).val();
    let orgUrl_ = $("#orgUrl_" + orgId).val();
    let orgTax_ = $("#orgTax_" + orgId).val();
    let orgCountry_ = $("#orgCountry_" + orgId).val();
    let orgUnitStreet_ = $("#orgUnitStreet_" + orgId).val();
    let orgTown_ = $("#orgTown_" + orgId).val();
    let orgState_ = $("#orgState_" + orgId).val();
    let orgPostCode_ = $("#orgPostCode_" + orgId).val();

    if (orgName_ === '') {
        error_perInput("orgName_" + orgId, "Organisation Name is required");
        return;
    }
    error_input_element(false,"orgName_" + orgId);

    let payload = {
        orgName      : orgName_,
        orgUrl       : orgUrl_,
        orgTax       : orgTax_,
        orgCountry   : orgCountry_,
        orgUnitStreet: orgUnitStreet_,
        orgTown      : orgTown_,
        orgState     : orgState_,
        orgPostCode  : orgPostCode_,
        orgId  : orgId,
    }
    loadingScreen(true, "Updating");
    try {
        const res = await axios.post('/auth/secured/api/v1/organisations/update',payload);
        loadingScreen(false, "Updating");
        if(res && res.data.data){
            showSuccessMessage('Updated organization details');
            // we may render the view but since its an update then they can wait to see the update when they reload the page, so hence not to waste browser computations
        }else{
            showErrorMessage(res.data.message);
        }
    } catch (e) {
        loadingScreen(false, "Updating");
        showErrorMessage("Failed to save");
    }

}


async function uploadProfileImage(orgId) {
    // let imgPic = $("#imgPic_"+orgId);
    const formData = new FormData();
    const element = document.getElementById("imgPicUpload_" + orgId)
    const file = element.files[0];
    if (!file) {
        return;
    }

    formData.append('file', file, file.name);
    formData.append('orgId', orgId);
    try {

        const response = await axios({
            method : 'post',
            url    : '/auth/secured/api/v1/organisations/update-profile-image',
            data   : formData,
            headers: {
                'Content-Type': `multipart/form-data`,
            },
        });
        showSuccessMessage('Image updateed')
        console.log(response);
        console.log(response.data.data.url);
        if(response.data.data.url){
            element.src =response.data.data.url;
                //$("#imgPicUpload_" + orgId).attr("src",response.data.data.url);
        }

    } catch (e) {
        showErrorMessage('Failed to update Image')
    }

}

