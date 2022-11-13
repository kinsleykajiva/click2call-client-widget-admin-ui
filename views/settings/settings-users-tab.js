let MAP_ADD_USERS_TEMP = new Map();
function showAddUserDialog(orgId) {
    MAP_ADD_USERS_TEMP = new Map();// reset
    let html = `
     <div class="card">
                                       
        <div class="card-body">
            <div>
                <div class="mb-3">
                    
                    <label>Add users email address. Separate by pressing Enter Key</label>
                    <div class="form-field">
                        <div class="chips"></div>
                        <input placeholder="Enter something here" autofocus autocomplete="off" class="chip-input"/>

                    </div>
                    <p><br> <strong>Just type in the valid email address.</strong></p>
                </div>

                <div class="mb-3">
                    <label class="form-label">Select role</label>
                    <div class="row">
                        <div class="col-md-12">
                            <select id="selectUserType" class="form-select">
                               
                                <option selected value="1">Super-Admin</option>
                                <option value="2">Admin</option>
                                <option value="3">User</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Add to team</label>
                    <div class="row">
                        <div class="col-md-12">
                            <select id="selectTeam" class="form-select">
                                <option value="null"  selected="selected">Select team...</option>
                            </select>
                        </div>

                    </div>
                </div>
             
            </div>
        </div>
    </div>
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel("Add users",
        html,
        "Send invite",
        'Cancel',
        async () => {
            try {
                let selectTeam = $("#selectTeam").val();
                const strMapToObj = strMap => {
                    let obj = Object.create(null);
                    for (let [k,v] of strMap) {
                        // We don’t escape the key '__proto__'
                        // which can cause problems on older engines
                        obj[k] = v;
                    }
                    return obj;
                };

                if (MAP_ADD_USERS_TEMP.size === 0) {
                    showErrorMessage("Please put email Address");
                    return
                }
                if (selectTeam === 'null') {
                    showErrorMessage("Select A Team");
                    return
                }
                loadingScreenElement('globalModalFunctionalForm', true, "Adding User");
               let object =strMapToObj(MAP_ADD_USERS_TEMP);

                let saveeResult = await axios.post('/auth/secured/api/v1/teams/add-team-member',{
                    teamId :selectTeam ,
                    users:JSON.stringify(object)
                });
                loadingScreenElement('globalModalFunctionalForm', false, "Adding User");
                saveeResult =saveeResult.data;
                console.log(34,saveeResult);
                if(saveeResult.success){
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    notifySuccess("User Added ,if the user was not part of the company they will need to register first from the link,the user will not show in that case",10)
                }else{
                    showErrorMessage('Failed to add users by email adddresses , try again later')
                }

            } catch (e) {
                console.error(e)
                showErrorMessage('Something went wrong here ....')
                loadingScreenElement('globalModalFunctionalForm', false, "Adding User");
            }

        },
        () => {
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        }, chipPArent
    );

}

function showAddTeamsDialog(orgId,isInEditMode,rowId) {
    orgId = parseInt(orgId)
    isInEditMode = isInEditMode || false ;
    rowId = rowId || 0 ;
    rowId = parseInt(rowId);
    let html = `
     <div class="card11">
        
        <div class="card-body">

            <div class="mb-3">
                <label class="form-label" for="notyf-message">Team name</label>
                <input id="inputTeamName" name="" type="text" class="form-control" placeholder="E.g. Support">
            </div>

            <div class="mb-3">
                <label class="form-label" for="notyf-message">Group description (optional)</label>
                <input id="inputTeamDescription" name="" type="text" class="form-control" placeholder="E.g. Everything to do with customer support.">
            </div>

            <div>
                <label for="reset-multiple"  class="form-label">Add users</label>
                <select class="form-control"
                        name="reset-multiple"
                        id="reset-multiple"
                        multiple  >
                    <option value="Choice 1" selected>Choice 1</option>

                </select>

            </div>

        </div>
    </div>
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel(isInEditMode?  "Edit team" :"Add team",
        html,
        "Save",
        'Cancel',
        async () => {
            const inputTeamName = $(`#inputTeamName`).val();
            if (inputTeamName === '') {
                showErrorMessage("Name is required");
                return
            }
            const inputTeamDescription = $(`#inputTeamDescription`).val();
            const reset_multiple = $(`#reset-multiple`).val();
            orgId =orgId || 0;// this request will fail if its set to zero
            let payload = {
                organisationId       : orgId,
                teamName       : inputTeamName,
                teamDescription: inputTeamDescription,
                usersIds       : reset_multiple + '',
            }
            if(isInEditMode){
                payload.recordId = rowId;
            }
            console.log(payload)
            loadingScreenElement('globalModalFunctionalForm', true, "Saving")
            try {
                let saveeResult = await axios.post(isInEditMode ? '/auth/secured/api/v1/teams/edit-team':'/auth/secured/api/v1/teams/save-new-team'
                    , payload);
                loadingScreenElement('globalModalFunctionalForm', false, "Saving");

                console.log(payload)
                if (saveeResult.data.success) {
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    showSuccessMessage("Saved Team details");

                    mainEntry(); // this is not the best way o refresh this page it has alot of ebrowser related reload or resets , so this call needs to be reviewed
                   /* ARRAY_TEAMS_MEMBERS_LIST = response.data.data.teamsNamesList;
                    renderTeamsUI();*/
                    // getTeamGroupsDataCaller(saveeResult.data.data.newlyCreatedTeam.id);
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
        }, ()=> {
            if(isInEditMode) {
                loadingScreenElement('globalModalFunctionalForm', true, 'Loading Users ....')
                let ORGANIZATION_object = ARRAY_ORGANISATIONS_LIST_V2.filter(x => x.id === orgId);
                ORGANIZATION_object = ORGANIZATION_object[0];
                let teamObject = ORGANIZATION_object.teamsList.filter(x => x.id === rowId);
                teamObject = teamObject[0];
                console.log('teamObject', teamObject)
                let teamUsers = teamObject.teamGroups;
                let userIds = teamUsers
                    .filter(x => x.userId != loggedID)
                    .map(x => {
                        return {value: x.userId + "", label: x.user.fullName}
                    }) // convert the ids to string at the same time ,also we dont need to show the logged user
                console.log('userIds', userIds)
                $("#inputTeamName").val(teamObject.title);
                $("#inputTeamDescription").val(teamObject.description);

                renderUsersUI(isInEditMode, userIds)
                loadingScreenElement('globalModalFunctionalForm', false, 'Loading Users ....')
            }else{
                renderUsersUI(isInEditMode, null)
            }
        }
    );

}
// /s3.af-south-1.amazonaws.com
// https://remotelocation.bucket.s3.af-south-1.amazonaws.com/profiles/c810ef2c-6a65-4a4a-aa22-a4bb24ecaa5f/Screenshot2021-09-03184017.png
// https://s3.af-south-1.amazonaws.com/clicktocallbucket/profiles/clicktocallbucket/profiles/c810ef2c-6a65-4a4a-aa22-a4bb24ecaa5f/Screenshot2021-09-03184017.png
// {id: 38, userId: 12, teamId: 31, dateCreated: "2022-01-31 22:00:00"}
// {id: 4, title: "Team 1", description: "-", createdByUserId: 12, companyId: 15, organisationId: 2,…}
async function getTeamGroupsDataCaller(teamId) {
   // await getTeamsData();
    /*getTeamGroupsData(teamId).then(response => {
        if (response.data.data) {
            ARRAY_TEAMS_MEMBERS_LIST = response.data.data.teamsNamesList;
        }
    });*/

}

function renderUsersUI(isInEditMode,existingUsersIdsArr) {

  let opt = `<option value= 'null' selected> Select User </option>`;
    ARRAY_USERS_NAMES_LIST.forEach(element => {
        if (loggedID != element.id) {
            opt += `<option value= '${element.id}'> ${element.fullName} </option>`;
        }
    });
    $('#reset-multiple').html(opt);

  //  new Choices($(`#reset-multiple`));
    console.log(12, `#reset-multiple`)


    if(isInEditMode){
        //https://github.com/Choices-js/Choices#setchoicebyvaluevalue
        let choices = new Choices(document.querySelector('#reset-multiple'),{
            choices: existingUsersIdsArr,

        });
        console.log('hhhh' ,existingUsersIdsArr )
        console.log('qqq' ,existingUsersIdsArr .map(x=> x.value ))
        choices.setChoiceByValue(existingUsersIdsArr .map(x=> x.value ));
    }else{
        new Choices(document.querySelector('#reset-multiple'));
    }
    console.log(opt)
}
function editUserOption(userId) {
showSuccessMessage('Coming soon but need more definations')
}

function deleteUserOption(userId,OrgId) {
    let html = `
    
                                       
        
            <div>
                <div class="mb-3">
                    
                    <label>Are you sure you want to remove  user from this Organisation , the user will no longer be part of the teams in this Organisation   ?</label>
                    
                </div>
            </div>
        
    
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel("Remove User From Organisation",
        html,
        "Yes,Remove !",
        'Cancel',
        async () => {
            let payload = {
                userId ,orgId:OrgId,
            }

            loadingScreenElement('globalModalFunctionalForm', true, "Removing....");

            try {
                let saveeResult = await axios.post('/auth/secured/api/v1/organisations/remove-user', payload);
                loadingScreenElement('globalModalFunctionalForm', false, "-");
                saveeResult = saveeResult.data;
                console.log(payload)
                if (saveeResult.success) {
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    showSuccessMessage("User Removed from Organisation");
                    $("#rowUserTable-"+ userId ).slideUp('slow').remove()
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

function renderUsersTab() {
    ARRAY_ORGANISATIONS_LIST.forEach((element, index) => {
        const orgId = element.id;
        let ORGANIZATION_object = ARRAY_ORGANISATIONS_LIST_V2.filter(x=>x.id ===orgId)
        ORGANIZATION_object = ORGANIZATION_object[0];
        if(!ORGANIZATION_object){
            return
        }
        console.log('ORGANIZATION_object' ,ORGANIZATION_object)
        console.log(111111,ARRAY_USERS_IN_COMPANY_LIST)
        let row = ``;
        console.log(67,ORGANIZATION_object.users)
        ORGANIZATION_object.users.forEach(element_ => {
            let teamsCounter  = 0 ;
            ORGANIZATION_object. teamsList.forEach((elnt_) => {
                let tempArr = elnt_.teamGroups.filter(x => x.userId === element_.id);
                teamsCounter =teamsCounter + tempArr.length;
            });
            row += `
                     <tr id="rowUserTable-${element_.id}">
                        <td>  <strong> ${element_.fullName} </strong> <br>  <a href="mailto:${element_.email}">${element_.email}  </a>  </td>
                        <td> ${element_.role.title} </td>
                        <td class="d-none d-md-table-cell">In  ${teamsCounter } teams</td>
                        <td class="d-none d-md-table-cell"> - </td>
                        <td class="table-action">
                            <a href="javascript:void(0)" onclick="editUserOption('${element_.id}')" ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 align-middle"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a>
                            <a href="javascript:void(0)" onclick="deleteUserOption('${element_.id}','${orgId}')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                        </td>
                    </tr> `;
        })



        /*ARRAY_USERS_IN_COMPANY_LIST.forEach(element_=>{
            console.log(11, element_.teamGroups)
            const teamsCounter=  element_.teamGroups.length > 0 ? element_.teamGroups[0].teams[0].usersCounter : '0'
            console.log(888, teamsCounter)

            }
        );*/
       /* ARRAY_USERS_IN_COMPANY_LIST.forEach(element_ => {
            console.log('QW', element_)
            console.log(11, element_.teamGroups)
            console.log(22, element_.teamGroups[0])
            /!*console.log(33, element_.teamGroups[0].teams )
            console.log(33, element_.teamGroups[0].teams[0] )
            console.log(33, element_.teamGroups[0].teams[0].usersCounter )*!/
           const teamsCounter=  element_.teamGroups.length > 0 ? element_.teamGroups[0].teams[0].usersCounter : '0'
            row += `
                     <tr id="rowUserTable-${element_.id}">
                        <td>  <strong> ${element_.fullName} </strong> <br>  <a href="mailto:${element_.email}">${element_.email}  </a>  </td>
                        <td> ${element_.roles[0].title} </td>
                        <td class="d-none d-md-table-cell"> <!--This number is not accurate if we only consider for organisation only as this refelect the overall count in the company--> ${teamsCounter } teams</td>
                        <td class="d-none d-md-table-cell"> - </td>
                        <td class="table-action">
                            <a href="javascript:void(0)" onclick="editUserOption('${element_.id}')" ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 align-middle"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a>
                            <a href="javascript:void(0)" onclick="deleteUserOption('${element_.id}','${orgId}')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                        </td>
                    </tr> `;
        });*/
        $('#tbodyUserSettings-' + orgId).html(row);

    });

}





