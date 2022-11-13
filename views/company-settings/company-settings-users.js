const getPassword = (length) => {
    length =  16;
    let arg =  "~!@#$%^&*()_+-=[]{}|;:.,?><";

    function newChar(lower, upper, nums, specials) {
        let set = [lower, upper, nums, specials];
        let pick = set[Math.floor(Math.random() * set.length)];
        return pick[Math.floor(Math.random() * pick.length)]
    }

    const lowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const uppercase = lowercase.join("").toUpperCase().split("");
    const specialChars = arg.split("").filter(item => item.trim().length);
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let hasNumber = false;
    let hasUpper = false;
    let hasLower = false;
    let hasSpecial = false;

    if (Number(length)) {
        length = Number(length)
    } else {
        return console.error("Enter a valid length for the first argument.")
    }

    let password = [];
    let lastChar;
    for (let i = 0; i < length; i++) {
        let char = newChar(lowercase, uppercase, numbers, specialChars);
        if (char !== lastChar) {
            password.push(char);
            lastChar = char
            if (Number(char)) {
                hasNumber = true
            }
            if (lowercase.indexOf(char) > -1) {
                hasLower = true
            }
            if (uppercase.indexOf(char) > -1) {
                hasUpper = true
            }
            if (specialChars.indexOf(char) > -1) {
                hasSpecial = true
            }
        } else {
            i--
        }
        if (i === length - 1 && (!hasNumber || !hasUpper || !hasLower || !hasSpecial)) {
            hasNumber = false;
            hasUpper = false;
            hasLower = false;
            hasSpecial = false;
            password = [];
            i = -1;
        }
    }
    return password.join("");
    }


function txtPassGenarate(){
    $("#txtPassGen").text(getPassword(11));
    showSuccessMessage("Password re-generated")
}
function copyPassword(){

    navigator.clipboard.writeText($("#txtPassGen").text());
    showSuccessMessage('Password Copied to clip board')

}

function showReActivateUser() {
    let html = `Do want to reactivate User ?`;
    largeGlobalModalFunctionalFormPositiveCancel("User Account Reactivation Confirmation",
        html,
        "Yes,activate ",
        'Cancel',
        async () => {
            try {

                loadingScreenElement('globalModalFunctionalForm', true, "Activating User");


                let saveeResult = await axios.post('/auth/api/v1/users/activate-company-user',{
                    id :$('#selectedIdInSelection').text()
                });
                loadingScreenElement('globalModalFunctionalForm', false, "Adding User");
                saveeResult =saveeResult.data;
                console.log(56,saveeResult);
                if(saveeResult.success){
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    notifySuccess("User activated , Notice has been sent to the user",10)
                    getUsersData();
                }else{
                    showErrorMessage(saveeResult.message)
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
        }, null
    );
}
function showDeleteUser() {
    let html = `Do want to delete User ?`;
    largeGlobalModalFunctionalFormPositiveCancel("Deletion Confirmation",
        html,
        "Yes,Delete ",
        'Cancel',
        async () => {
            try {

                loadingScreenElement('globalModalFunctionalForm', true, "Deleting User");


                let saveeResult = await axios.post('/auth/api/v1/users/delete-company-user',{
                    id :$('#selectedIdInSelection').text()
                });
                loadingScreenElement('globalModalFunctionalForm', false, "Adding User");
                saveeResult =saveeResult.data;
                console.log(56,saveeResult);
                if(saveeResult.success){
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    notifySuccess("User Removed , Notice has been sent to the user",10)
                    getUsersData();
                }else{
                    showErrorMessage(saveeResult.message)
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
        }, null
    );
}
function showEditUser() {
    notifySuccess("still coming....")
}
function showAddUserToCompany() {

    const html = `
    
     <div class="">
                                       
        <div class="card-body">
            <div>
            
                <div class="mb-3">
                    
                    
                    <label class="form-label">Full Name * </label>
                    <div class="row">
                        <div class="col-md-12">
                        <input type="text" id="userInputName" class="form-control" >
                           
                        </div>

                    </div>
                    
                </div>
                <div class="mb-3">
                    
                    
                    <label class="form-label">Email*</label>
                    <div class="row">
                        <div class="col-md-12">
                        <input type="text" id="userInputEmail" class="form-control" >
                           
                        </div>

                    </div>
                    <p><br>Default Password:  <strong id="txtPassGen">${getPassword(randomNumbers(7,16))}</strong>  &nbsp;  &nbsp;  &nbsp;    <a href="#" onclick="txtPassGenarate()" >Re-Genarate</a>  &nbsp;  &nbsp;    <a href="#" onclick="copyPassword()" >Copy</a>  </p>
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
             
            </div>
        </div>
    </div>
    
    `;

    largeGlobalModalFunctionalFormPositiveCancel("Add users to Company",
        html,
        "Save",
        'Cancel',
        async () => {
            try {
                let userInputEmail = $("#userInputEmail").val();
                let selectUserType = $("#selectUserType").val();
                let userInputName = $("#userInputName").val();
                let password = $("#txtPassGen").text();


                loadingScreenElement('globalModalFunctionalForm', true, "Adding User");


                let saveeResult = await axios.post('/auth/api/v1/users/register-company-user',{
                    fullName :userInputName ,
                    email :userInputEmail ,
                    password :password ,
                    userType:selectUserType
                });
                loadingScreenElement('globalModalFunctionalForm', false, "Adding User");
                saveeResult =saveeResult.data;
                console.log(56,saveeResult);
                if(saveeResult.success){
                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    notifySuccess("User Added , Details have been sent to the user",10)
                    getUsersData();
                }else{
                    showErrorMessage(saveeResult.message)
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
        }, null
    );
}









