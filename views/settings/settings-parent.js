let ARRAY_TEAMS_NAME_LIST = [];
let ARRAY_USERS_NAMES_LIST = [];
let ARRAY_USERS_IN_COMPANY_LIST = [];
let ARRAY_TEAMS_MEMBERS_LIST = [];
let ARRAY_ORGANISATIONS_LIST = [];
let ARRAY_ORGANISATIONS_LIST_V2 = [];

function getAllUsers() {
    return axios.get('/auth/secured/api/v1/teams/users');
}

function getTeamsData() {
    return axios.get('/auth/secured/api/v1/teams/all');
}

function getUsersForTeams() {
    return axios.get('/auth/secured/api/v1/teams/available-users');
}

function getOrganizations() {
    return axios.get('/auth/secured/api/v1/organisations/all');
}


function getOrganizationsV2() {
    return axios.get('/auth/secured/api/v1/organisations/organisations');
}


function getTeamGroupsData(teamId) {
    return axios.get('/auth/secured/api/v1/teams/groups/all', {
        params: {
            teamId: teamId
        }
    });
}


function mainEntry() {
    Promise.all([getTeamsData(),getUsersForTeams() , getOrganizations(), getAllUsers(),getOrganizationsV2()])
        .then(result => {


            if (result[4]) { // THIS IS A MUCH BETTER RETURNS OF DATA TO KNOW ALL USERS , TEAMS , USERS IN TEAMS WITH ALL DETAILS , ALL ORGS IN AN COMPANY
                if (result[2].status === 200) {
                    console.log(result[4]);
                    if (result[1].data.data) {
                        console.log(result[4].data.data.orgs);
                        ARRAY_ORGANISATIONS_LIST_V2 = result[4].data.data.orgs;
                    }
                }
            }

            if (result[2]) { // orgs . It makes sense for this to render first or to gets its data loaded first
                if (result[2].status === 200) {
                    console.log(result[2]);
                    if (result[1].data.data) {
                        console.log(result[2].data.data.orgs);
                        ARRAY_ORGANISATIONS_LIST = result[2].data.data.orgs;


                    }
                }
            }




            // we need to load the variables with data as mmost views will be dynamic
            if (result[0]) {
                if (result[0].status === 200) {
                    console.log(result[0]);
                    if (result[0].data.data) {
                        ARRAY_TEAMS_NAME_LIST = result[0].data.data.teamsNamesList;


                    }
                }
            }


            if (result[1]) {
                if (result[1].status === 200) {
                    console.log(result[1]);
                    if (result[1].data.data) {
                        console.log(result[1].data.data.usersList);
                        ARRAY_USERS_NAMES_LIST = result[1].data.data.usersList;

                      //  renderUsersUI();
                    }
                }
            }

            if(result[3]){
                ARRAY_USERS_IN_COMPANY_LIST = result[3].data.data.usersInCompany;
            }


            renderOrgsUI();
            renderTeamsUI();
            renderUsersTab();



        });
}

mainEntry();

