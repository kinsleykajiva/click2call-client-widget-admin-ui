async function defaultLoad() {

    try {
        let res = await axios.get('/auth/api/v1/users/user', {
            params: {
                userId: loggedID
            }
        });
        res = res.data;

        console.log(res)
        if (res.success) {
            res = res.data.userDetails;
            const isEmailAddressVerified = res.isEmailAddressVerified === 1 ?
                                           `<span class="badge bg-success"> <i class="align-middle me-2 fas fa-fw fa-check-circle"></i>  Verified</span>`
                                                                            : `<span class="badge bg-danger">Not Verified</span>`;


            $("#userEmail").text(res.email)
            $("#userEmailEdit").val(res.email)
            $("#userAccountVerfied").html(isEmailAddressVerified);
            $("#userNameFull").text(res.fullName);
            $("#userNameFullEdit").val(res.fullName);
            $("#profilePicture").attr('src' ,res.profileImageUrl );
        } else {
            showErrorMessage('Failed to get data')
        }
        $("#DivLoading").hide();
    } catch (e) {
        $("#DivLoading").hide();
        showErrorMessage('Failed to access , Please check your connection')
    }


}

function opneFileChoser(){
    $("#userProfileImageEdit").trigger('click');
}

let isInEdit = false;

function onCacnelEditAction(){
    $( '.forViewDivs' ).show( 'slow' );
    $( '.forEditDivs' ).hide( 'slow' );
    isInEdit = false;
    $("#btnCacnelEditAction").hide();
}
async function onEditAction() {
    // notifySuccess("Not Working, Require Clients Instrauction on what to do here ");
    if ( isInEdit ) {
        $( '.forViewDivs' ).show( 'slow' );
        $( '.forEditDivs' ).hide( 'slow' );
    } else {
        $( '.forViewDivs' ).hide( 'slow' );
        $( '.forEditDivs' ).show( 'slow' );
        $( "#btnEditAction" ).text( 'Update' );
        isInEdit = true;
        $("#btnCacnelEditAction").show();
        return;
    }
    
    if ( isInEdit ) {
        
        
        let userNameFullEdit= $("#userNameFullEdit").val();
        let userEmailEdit= $("#userEmailEdit").val();
        const formData = new FormData();
        const imagefile = document.querySelector( '#userProfileImageEdit' );
        formData.append("file",  imagefile.files[0] || null);
        formData.append("fullName", userNameFullEdit);
        formData.append("email", userEmailEdit);
        loadingScreen(true , 'Saving ....');
        try{
        
            let res = await axios.post( API_BASE_URL + '/auth/api/v1/users/update-user-profile', formData ,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            } );
            loadingScreen(false , '....');
            let data = res.data;
            console.log( data );
            if(data.success){
                $("#userNameFull").text(userNameFullEdit);
                $("#userEmail").text(userEmailEdit);
                $( '.forViewDivs' ).show( 'slow' );
                $( '.forEditDivs' ).hide( 'slow' );
                isInEdit = false;
                $( "#btnEditAction" ).text( 'Edit' );
                showSuccessMessage('Details updated');
                $("#profilePicture").attr('src' ,data.data.profileImageUrl );
                Cookies.set('userProfileImageUrl',data.data? data.data.profileImageUrl : data.profileImageUrl , {expires: 7});
                console.log( data.data.profileImageUrl );
            }else{
                showErrorMessage('Failed to Save Details')
            }
        }catch ( e ) {
            console.log(e)
            loadingScreen(false , '....');
            showErrorMessage('Failed to Save Details')
        }
    }
    
}

defaultLoad();
$("#profilePicture").attr('src' ,userProfileImageUrl );
