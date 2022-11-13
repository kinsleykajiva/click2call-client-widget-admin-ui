let USER_IDS = new Set();
let EXITED_USER_IDS = new Set();

const chatUIRow = (name, status, userId, counter,chatroomId,lockedChatData) => {
    /// this is when the UI has to remember data after refresh of page
    let isLockedByMe = false;
    if( lockedChatData && lockedChatData.lockedByAgentId &&  lockedChatData.lockedByAgentId === loggedID ){
        isLockedByMe = true;
        console.log('**||***',lockedChatData)
    }
    console.log('*****',lockedChatData)
    status = status || 'Offline';
    counter = counter || 0;
    //chatroomId = chatroomId || 0;
    let lockTag = chatroomId ? `<div class="badge bg-success float-end" id="row_user_msg_availability_${chatroomId}"> locked - ${isLockedByMe}</div> ` : ' ';
   let notiTag = `   <div class="badge bg-success float-end"  id="chatNotificationMessage-${userId}">.</div>`
   const lockTagByAgent = lockedChatData && !isLockedByMe ? `   <div class="badge bg-success float-end"  id="lockedBy-${lockedChatData.lockedByAgentId}">Taken By ${lockedChatData.lockedByAgentName} </div>` : '';

    if (isLockedByMe) {
        if (!ARRAY_ACCEPTED_CHAT_USER_ID.includes(userId)) {
            console.log(666666)
            ARRAY_ACCEPTED_CHAT_USER_ID.push(userId);
            ARRAY_ACCEPTED_CHAT_USER_ID = [...new Set(ARRAY_ACCEPTED_CHAT_USER_ID)]; // remove duplicates


            let messageToSend = {
                method            : 'ACCEPT',
                targetUser        : userId,
                withSocketChatRoom: chatroomId,
                admin             : loggedID,
                isAdmin           : true,
                ticketObj         : null,
                session           : {
                    id            : loggedID,
                    fullName      : userFullName,
                    companyId     : companyId,
                    profilePicture: userProfileImageUrl,
                    admin         : loggedID
                },

            }
            console.log('chatUIRow()::messageToSend',messageToSend)
            socket.emit('ACCEPT' ,(messageToSend));

        }
        console.log(99999)
    }
    //if(chatroomId ||isLockedByMe )
    let lastMsg = '';
    console.log('==' ,lastMessagemessagesMap.get(loggedID + 'to' + userId))
    if (lastMessagemessagesMap.get(loggedID + 'to' + userId)) {
        lastMsg = `<strong>  ${lastMessagemessagesMap.get(loggedID + 'to' + userId).content.substring(0, MAX_SIZE_CHAR_FOR_PREVIEW)} ...    </strong>`;
    }
    USER_IDS.add(userId);
    return `
     <a id="row-${userId}" onclick="loadChatOpenChat('${userId}')" href="#" class="list-group-item list-group-item-action border-0">
        ${lockTagByAgent}
        ${notiTag}
            <div style="display:none;" class="badge bg-success float-end" id="row_user_msg_counter_${userId}">  
                <div class="small"><span class="fas fa-circle chat-online"></span>  ${status} </div>
                
            </div>
            
            <div class="d-flex align-items-start">
                <img src="img/avatars/icons8-user-32.png" class="rounded-circle me-1" alt="Vanessa Tucker" width="40" height="40">
                <div class="flex-grow-1 ms-3">  ${name} - 
                    <small id="txtPreview-${userId}">${lastMsg}</small>  
                </div>
            </div>
     </a>
    <hr id="hr-row-${userId}" class="d-block d-lg-none mt-1 mb-0">
    `;
}
// $(`#row-525`).html();
function newMessageChatNotification(userId, isSettingValue) {
    if (userId === userChatInViewId) {
        return;
    }
    if (isSettingValue) {
        if ($(`#row-${userId}`).length > 0) {
            // Exists.

            // make a copy
            let aTag  = $(`#row-${userId}`).clone();
            let hrTag = $(`#hr-row-${userId}`).clone();
            // remove
            $(`#row-${userId}`).remove();
            $(`#hr-row-${userId}`).remove();

            // put back
            $('#chatUsersRowsPending').prepend(hrTag);//1. order is important here
            $('#chatUsersRowsPending').prepend(aTag);//2. order is important here
            $("#chatNotificationMessage-" + userId).text('UnRead ' + MAP_NEW_MESSAGE_NOTIFICATION.get(userId));
        }
    }else{
        // this is remove the notification on the view
        if(MAP_NEW_MESSAGE_NOTIFICATION.get(userId)) {
            MAP_NEW_MESSAGE_NOTIFICATION.set(userId, 0);
            $("#chatNotificationMessage-" + userId).text('UnRead ' + MAP_NEW_MESSAGE_NOTIFICATION.get(userId));
        }
    }

}


async function renderChatsCounder(targetId) {

    let chatHistory = await axios.get(MESSAGE_CHAT_SERVICE_BASE_URL + '/users/chats/pending/messages', {
        params: {
            customerId: targetId
        }
    });
    console.log(chatHistory);

    if (chatHistory) {
        let data = chatHistory.data;

        $("#row_user_msg_counter_" + targetId).text(data.data.count)
    }

}

let conversations = new Map();
/**remember keep this format of data as this is used everywhere else in the app*/
let rightChat = (object) => {
    console.log("objectHHH", object)

    return `   
    
    
    <div class="message my-message">
        <img alt="" class="img-circle medium-image" src="img/avatars/icons8-user-64.png">

        <div class="message-body">
            <div class="message-body-inner">
                <div class="message-info">
                    <h4> You </h4>
                    <h5> <i class="fa fa-clock-o"></i> ${moment(convertToLocalTime(object.timeStamp), 'YYYY-MM-DD HH:mm:ss').fromNow()} </h5>
                </div>
                <hr>
                <div class="message-text">
                    ${object.message}
                </div>
            </div>
        </div>
        
    </div>
    <br>
    
    `;
}
/**remember keep this format of data as this is used everywhere else in the app*/
let leftChat = (object) => {
    console.log('userChatInViewIdXXXXXX', object)
    userChatInViewId = object.userId;
    if(object.exiting){
        showSuccessMessage("User Just left chat");
        $("#divTicketBar1111,#chatDivInputBox,#btnAudioCall").hide();
    }

    console.log('userChatInViewIdXXXXXX', userChatInViewId)
    // console.log(object.senderId)
    // console.log(currentUsersOnline)
    // console.log(currentUsersOnline.filter(x => x.id === object.content));
    //let fullName = currentUsersOnline.filter(x => x.id === object.senderId)[0].fullName;
    //$("#chat-Title").text(fullName);
    return `    
    
    <div class="message info">
        <img alt="" class="img-circle medium-image" src="img/avatars/icons8-user-32.png">

        <div class="message-body">
            <div class="message-info">
                <h4> Widget User </h4>
                <h5> <i class="fa fa-clock-o"></i> ${moment(convertToLocalTime(object.timeStamp), 'YYYY-MM-DD HH:mm:ss').fromNow()} </h5>
            </div>
            <hr>
            <div class="message-text">
                ${object.message}
            </div>
        </div>
       
    </div>
     <br>
    `;
}

function onRemoveChatFromView(){
   const currentInChat = $("#currentInChat").text();
    $('#row-'+currentInChat).remove();


    resetChatTitleBar();
}

function resetChatTitleBar(){
    $('#conversationDiv').html('');
    $('#divTicketBar1111').hide();
    $("#chat-Title").text("");
    $("#btnCloseChat").hide();
    $('#btnAudioCall').attr('disabled', true);
    $('#loadingDivProffile').hide();

    $("#txtUserCardAddress").text( '--');
    $("#txtUserCardEmail").text( '--');
    $("#txtUserCardPhone").text( '--' );
    $("#ulTicketsHostory").html('')

    $("#profileDivBody").hide() ; // will hide the whole side view


    $('#chatDivInputBox').hide();
}

function yesJoinToListen(){
    let messageToSend = {
        method            : 'LISTEN',
        targetUser        : userChatInViewId,
        withSocketChatRoom: userChatInViewObject.withSocketChatRoom,
        admin             : loggedID,
        isAdmin           : true,
        ticketObj         : null,
        session           : {id: loggedID, fullName: userFullName, companyId, admin: loggedID},

    }
    console.log('messageToSend',messageToSend)
    socket.emit('LISTEN' ,(messageToSend));
    LISTENING_TO_CHATS_SET.add(userChatInViewId);
    $("#chat-listenTo").hide()  ;
}

async function loadChatOpenChat(userId) {
    $("#chat-listenTo").hide();
    $("#currentInChat").text(userId);

    $(`#row-${userId}`).addClass('chat_active');
    USER_IDS.forEach(id => {
        if(userId != id){
            $(`#row-${id}`).removeClass('chat_active');
        }
    })

    userId = parseInt(userId);
    newMessageChatNotification(userId, false);// remove the notification on the chat listing

    if(EXITED_USER_IDS.has(userId)){
        $("#btnCloseChat").show();
    }else{
        $("#btnCloseChat").hide();

    }
    userChatInViewId = userId;

    userChatInViewObject = usersWidgetsUsers.filter( x=>x.id=== userChatInViewId);
    if(userChatInViewObject){
        userChatInViewObject = userChatInViewObject[0] ;
    }

    let tempObj = currentUsersOnline.filter(x => x.id === userId)[0];
    console.log('userChatInViewId , userChatInViewId', userChatInViewId)
    console.log(currentUsersOnline)

    console.log(tempObj)

    if (tempObj) {
        let fullName = tempObj.fullName;
        $("#chat-Title").text(fullName);



    }
    console.log('HH-DDDD', MESSAGES_ARRAY);
    MESSAGES_ARRAY = MESSAGES_ARRAY.flat();
    console.log('HH-MESSAGES_ARRAY', MESSAGES_ARRAY)
    //load from
    let thisChatArr = MESSAGES_ARRAY.filter(x => (x.userId === userId && x.destinationId === 0) || (x.userId === userId && x.destinationId === loggedID ) || (x.destinationId === userId && x.userId === loggedID ));
    const timeStamps = thisChatArr.map(o => o.timeStamp)
    console.log('thisChatArr', thisChatArr)
    thisChatArr = thisChatArr.filter(({timeStamp}, index) => !timeStamps.includes(timeStamp, index + 1)); // remove duplicates

    // $("#btnAudioCall").attr('disabled', true);
    if (takenUsersWidgetsUsers.get(userChatInViewId)) {
        // means has been taken
        $("#btnAcceptTicket").show('slow').attr('disabled', true).text('Ticket Taken');
        $("#btnAudioCall").hide();
    }



    let row = '';
    console.log('HH', thisChatArr)
    thisChatArr.forEach(chat => {

        // console.log('QQQQQQQQQ' ,chat);
        //console.log('@@@@@@' ,chat.userId ,loggedID , '==' , chat.userId == loggedID);
        if (chat.userId === loggedID) {
            console.log('loggedID', loggedID);
            row += rightChat(chat);
        } else {
            row += leftChat(chat);
        }
        let messageObj;
        if (chat.userId === loggedID) {
            // let lastObj = lastMessagemessagesMap.get(userChatInViewId);
            messageObj = {senderId: chat.userId, content: chat.message, dateCreated: chat.timeStamp};
            lastMessagemessagesMap.set(userChatInViewId, messageObj);// order of this is critical
        } else {
            messageObj = {senderId: loggedID, content: chat.message, dateCreated: chat.timeStamp};
            lastMessagemessagesMap.set(loggedID + 'to' + userChatInViewId, messageObj);

        }


    })
    $("#conversationDiv").html(row);
    if (!ARRAY_ACCEPTED_CHAT_USER_ID.includes(userChatInViewId)) {
        $("#btnAcceptTicket").show('slow').attr('disabled', false).text('Accept Ticket');
        $('#chatDivInputBox').hide();
        $('#divTicketBar1111').hide();
        console.log('to be Accept Ticket - || ')
    }else { // this my chat i have accepted
        $("#btnAcceptTicket").hide('slow').attr('disabled', false).text('Accept Ticket');
        $('#chatDivInputBox').show();
        // set tticket detals
        for (let i = 0; i < thisChatArr.length; i++) {
            const chatow = thisChatArr[i];
            if(chatow.ticket) {
                if(chatow.ticket.ticketId) {
                    $("#btnTicketNumber").text( 'Ticket#' + chatow.ticket.ticketId).show();
                    break;
                }
            }

        }
    }
    $("#conversationDiv").scrollTop($("#conversationDiv")[0].scrollHeight);
// s nisi ut aliquip
    if (lastMessagemessagesMap.get(loggedID + 'to' + userId )) {
        $("#txtPreview-" + userId ).html(`<strong>  ${lastMessagemessagesMap.get(loggedID + 'to' + userId).content.substring(0, MAX_SIZE_CHAR_FOR_PREVIEW)} ...    </strong>`);
    }
    loadCustomerProfile()

    $("#btnSaveNoneLiveClientCustomerOption").hide()
    $("#btnSaveClientCustomerOption").show();

    if(tempObj.lockedChatData && tempObj.lockedChatData.lockedByAgentId !== loggedID){
        //this means it's locked by other Agents not me soI should not act on this chat but to see messages only.
        console.log('lockedChatData', tempObj.lockedChatData)
        $("#btnAcceptTicket").show('slow').attr('disabled', true).text('Ticket Taken');
        $("#btnAudioCall").hide();
        console.log('LISTENING_TO_CHATS_SET',LISTENING_TO_CHATS_SET)
        if( LISTENING_TO_CHATS_SET.has(userChatInViewId)) {
            $("#chat-listenTo").hide();
        }else{
            $("#chat-listenTo").show();
        }

    } else {
        $("#chat-listenTo").hide();
    }
    lockedChatRoomsMap.forEach((value, key) => {
        if(tempObj.withSocketChatRoom   && key === tempObj.withSocketChatRoom) {
            if(value.eventData.lockedByAgentId !== loggedID){
                $("#btnAcceptTicket").show('slow').attr('disabled', true).text('Ticket Taken');
                $("#btnAudioCall").hide();
                console.log('LISTENING_TO_CHATS_SET',LISTENING_TO_CHATS_SET)
                if( LISTENING_TO_CHATS_SET.has(userChatInViewId)) {
                    $("#chat-listenTo").hide();
                }else{
                    $("#chat-listenTo").show();
                }
            }else{
                $("#chat-listenTo").hide();
            }
        }
    });


    /*if( tempObj.lockedChatData && tempObj.lockedChatData.lockedByAgentId === loggedID){ // here we are just remembering this chat details
        $("#btnAcceptTicket").show('slow').attr('disabled', true).text('Ticket Taken');
        $("#btnAudioCall,#btnAcceptTicket").hide();
        $("#chatDivInputBox").show('slow');
        $("#divTicketBar1111").show();



        $('#btnAudioCall').attr('disabled', false);
        ARRAY_ACCEPTED_CHAT_USER_ID.push(userChatInViewId);
        ARRAY_ACCEPTED_CHAT_USER_ID = [...new Set(ARRAY_ACCEPTED_CHAT_USER_ID)] ; // remove duplicates

        // let ticketObj = response.data.data.ticket;
        // let ticketHandlingObj = response.data.data.ticketHandling;
        console.log(55555,tempObj.lockedChatData)
        console.log(888888,tempObj.lockedChatData.ticket.id)

        let ticketId = tempObj.lockedChatData.ticket.ticketId === undefined ?
                       tempObj.lockedChatData.ticket.id :  tempObj.lockedChatData.ticket.ticketId;
        if( tempObj.lockedChatData.ticket){
            //ticket.ticket.id
            console.log(3333, 'Ticket#' + ticketId);
            $("#btnTicketNumber").text( 'Ticket#' + ticketId);
            $("#selectTicketStatus").val('1');// this is a default set value
            chatsTicketsReferences.set(loggedID + 'to' + userChatInViewId ,{ticketObj:tempObj.lockedChatData.ticket} );
        }
    }*/
}

async function renderPending(arr, isAppend) {
    isAppend = isAppend || false;
    let rows = '';
    console.log("arr",arr);

    for (const row of arr) {
        let isMyLock = false;
        console.log('Rooowww',row)
        if(row.lockedChatData){

            rows += chatUIRow(row.fullName, 'Online', row.id,null ,row.withSocketChatRoom || row,row.lockedChatData);
        }else if(row.withSocketChatRoom){
            // when the Ui is notified from other agents with out page reload
            rows += chatUIRow(row.fullName, 'Online', row.id,null ,row.withSocketChatRoom || row,null);
        }else{
            rows += chatUIRow(row.fullName, 'Online', row.id,null ,row.withSocketChatRoom || row,null);
        }
        //    let obj = currentUsersOnline.filter(x=>x.id === row.userId)[0];

    }

    if (!isAppend) {
        $("#chatUsersRowsPending").html(rows)
    } else {
        $("#chatUsersRowsPending").append(rows);
    }


}


function showChatType() {
    let ChatType = $('#ChatType').val();


    if (ChatType === '1') {
        $("#chatUsersRowsAssingedToMe").show();

        $("#chatUsersRowsResolved ,#chatUsersRowsArchived,#chatUsersRowsPending").hide();

    }
    if (ChatType === '4') {
        $("#chatUsersRowsArchived").show();
        $("#chatUsersRowsResolved ,#chatUsersRowsAssingedToMe,#chatUsersRowsPending").hide();
    }
    if (ChatType === '3') {
        $("#chatUsersRowsResolved").show();
        $("#chatUsersRowsAssingedToMe,#chatUsersRowsArchived,#chatUsersRowsPending").hide();
    }
    if (ChatType === '2') {
        $("#chatUsersRowsPending").show();
        $("#chatUsersRowsResolved ,#chatUsersRowsAssingedToMe,#chatUsersRowsArchived").hide();
    }
}


async function acceptAction() {

    $("#chatDivInputBox").show('slow');

    $('#btnAcceptTicket').hide('slow');

    $('#btnAudioCall').attr('disabled', false);


    if(!chatsTicketsReferences.get((loggedID + 'to' + userChatInViewId))){
        // dont create ticket for a user that already has a ticket
       const ticketObj = await createTicketForCurrentChat();
       console.log('result - ticketObj',ticketObj);
    ARRAY_ACCEPTED_CHAT_USER_ID.push(userChatInViewId);
    ARRAY_ACCEPTED_CHAT_USER_ID = [...new Set(ARRAY_ACCEPTED_CHAT_USER_ID)]
    let messageToSend = {
        method    : 'ACCEPT',
        targetUser: userChatInViewId,
        withSocketChatRoom: userChatInViewObject.withSocketChatRoom,
        admin     : loggedID,
        isAdmin   : true,
        ticketObj,
        session   : {
            id: loggedID,
            fullName: userFullName,
            profilePicture: userProfileImageUrl,
            companyId,
            admin: loggedID
        },

    }
    console.log('messageToSend',messageToSend)
    socket.emit('ACCEPT' ,(messageToSend));
        $("#chatDivInputBox").show('slow');

        $('#btnAcceptTicket').hide('slow');

        $('#btnAudioCall').attr('disabled', false);

    }

    // axios.post('http://localhost:3300/users/chats/conversion')
    /* loadingScreen(true,'Loading Chats');
     await openChat(userChatInViewId);
     loadingScreen(false,'Loading Chats');*/

}
async function loadCustomerProfile(objecT) {
    setTicketsInViewTags([]);
    try{
        const getParamsObj =objecT ? {customerId: objecT.referenceId,}: {customerId: userChatInViewId,}

    $('#loadingDivProffile').show();

    let result = await axios.get(MESSAGE_CHAT_SERVICE_BASE_URL + '/api/v1/secured/widget/get-customer', {params:getParamsObj});
    $('#loadingDivProffile').hide();
    result = result.data ;
    console.log('loadCustomerProfile',result)
    if(result.success){
        $("#txtUserCardAddress").text(result.data.customer.address ? result.data.customer.address : 'Not Set');
        $("#txtUserCardEmail").text(result.data.customer.email ? result.data.customer.email : 'Not Set');
        $("#txtUserCardPhone").text(result.data.customer.phoneNumber  ? result.data.customer.phoneNumber : 'Not Set' );

        $("#ulTicketsHostory").html('')
        $("#profileDivBody").show()

    }
    else{

        $("#txtUserCardAddress").text( '--');
        $("#txtUserCardEmail").text( '--');
        $("#txtUserCardPhone").text( '--' );
    }


    }catch (e) {
        console.error(e)
        $('#loadingDivProffile').hide();
    }

}

function saveCustomerCclient(){

    const htmlV = `
  
       
        <div class="card-body">
          <form onsubmit="return false">
          
            <div class="mb-3">
            
              <label class="form-label">Customer Name *</label>
              <input type="text" id="inputTicketInputCustomer" class="form-control" placeholder="Name to reference ">
            </div> 
              
            <div class="mb-3">
            
              <label class="form-label">Email *</label>
              <input type="text" id="inputTicketInputCustomerEmail" class="form-control" placeholder="one email address ">
            </div> 
            
            <div class="mb-3">
            
              <label class="form-label">Phone</label>
              <input type="text" id="inputTicketInputCustomerPhone" class="form-control" placeholder="one mobile phone number">
            </div>   
            <div class="mb-3">
            
              <label class="form-label">Address</label>
              <input type="text" id="inputTicketInputCustomerAddress" class="form-control" placeholder="Addresses">
            </div>            
            
            <div class="mb-3">
              <label class="form-check m-0">
                
<!--                <span class="form-check-label"> If you checked More than one then those will be bundled with same ticket number</span>-->
              </label>
            </div>
           
          </form>
        </div>
     
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel('Save Customer As' , htmlV ,'Save' ,'Cancel',
        async () => {
            try{

                let inputTicketInputCustomer = $('#inputTicketInputCustomer').val();
                if (inputTicketInputCustomer === '') {
                    showErrorMessage('Please put Name ')
                    return
                }

                let inputTicketInputCustomerEmail = $('#inputTicketInputCustomerEmail').val();

                if (inputTicketInputCustomerEmail === '') {
                    showErrorMessage('Please put Email address ')
                    return
                }

                let postParamsObj = {customerId: userChatInViewId,}

                postParamsObj.fullName = inputTicketInputCustomer;
                postParamsObj.phoneNumber = $('#inputTicketInputCustomerPhone').val();
                postParamsObj.email = inputTicketInputCustomerEmail;
                postParamsObj.address = $('#inputTicketInputCustomerAddress').val();

                loadingScreenElement('globalModalFunctionalForm', true, "Saving Customer....");


                let result = await axios.post(MESSAGE_CHAT_SERVICE_BASE_URL + '/users/api/v1/secured/update-customer-details', postParamsObj);
                result = result.data;
                console.log('result', result)
                loadingScreenElement('globalModalFunctionalForm', false, " ....");


                $("#globalModalFunctionalForm").modal({
                    backdrop: 'static',
                }).modal('hide');
                getChatsConversations();
                tdCheckboxChecked = 0;
                $('.btnActions').hide();
                showSuccessMessage('tickets Created Successfully')

            }catch (e) {
                loadingScreenElement('globalModalFunctionalForm', false, " ....");
                showErrorMessage('Failed to complete action please reload page')
            }

        },
        ()=>{
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        } ,
        null);
}

function saveCustomerClientNoneLiveChat(){
   const objecT = NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW;
   console.log('objecT::::',objecT)
    const htmlV = `
  
       
        <div class="card-body">
          <form onsubmit="return false">
          
            <div class="mb-3">
            
              <label class="form-label">Customer Name *</label>
              <input type="text" id="inputTicketInputCustomer" value="${objecT.customer.fullName}" class="form-control" placeholder="Name to reference ">
            </div> 
              
            <div class="mb-3">
            
              <label class="form-label">Email *</label>
              <input type="text" id="inputTicketInputCustomerEmail" value="${objecT.customer.email  || ''}" class="form-control" placeholder="one email address ">
            </div> 
            
            <div class="mb-3">
            
              <label class="form-label">Phone</label>
              <input type="text" id="inputTicketInputCustomerPhone" value="${objecT.customer.phoneNumber  || ''}" class="form-control" placeholder="one mobile phone number">
            </div>   
            <div class="mb-3">
            
              <label class="form-label">Address</label>
              <input type="text" id="inputTicketInputCustomerAddress" value="${objecT.customer.address  || ''}" class="form-control" placeholder="Addresses">
            </div>            
            
            <div class="mb-3">
              <label class="form-check m-0">
                
<!--                <span class="form-check-label"> If you checked More than one then those will be bundled with same ticket number</span>-->
              </label>
            </div>
           
          </form>
        </div>
     
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel('Save Customer Details' , htmlV ,'Save' ,'Cancel',
        async () => {
            try{

                let inputTicketInputCustomer = $('#inputTicketInputCustomer').val();
                if (inputTicketInputCustomer === '') {
                    showErrorMessage('Please put Name ')
                    return
                }

                let inputTicketInputCustomerEmail = $('#inputTicketInputCustomerEmail').val();

                if (inputTicketInputCustomerEmail === '') {
                    showErrorMessage('Please put Email address ')
                    return
                }

                let postParamsObj =  {customerId: objecT.customer.id, id: objecT.customer.id}

                postParamsObj.fullName = inputTicketInputCustomer;
                postParamsObj.phoneNumber = $('#inputTicketInputCustomerPhone').val();
                postParamsObj.email = inputTicketInputCustomerEmail;
                postParamsObj.address = $('#inputTicketInputCustomerAddress').val();

                loadingScreenElement('globalModalFunctionalForm', true, "Saving Customer....");


                let result = await axios.post(MESSAGE_CHAT_SERVICE_BASE_URL + '/users/api/v1/secured/update-customer-details', postParamsObj);
                result = result.data;
                console.log('result', result)
                loadingScreenElement('globalModalFunctionalForm', false, " ....");

                if (result.success) {
                    loadCustomerProfile({referenceId: objecT.customer.id});
                    NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer.email = postParamsObj.email;
                    NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer.phoneNumber = postParamsObj.phoneNumber;
                    NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer.address = postParamsObj.address;
                    NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer.fullName = postParamsObj.fullName;
                    MAP_TICKET_CONVERSIONS_NONE_LIVE.set(objecT.ticketId + '', NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW)

                    $("#globalModalFunctionalForm").modal({
                        backdrop: 'static',
                    }).modal('hide');
                    getChatsConversations();
                    tdCheckboxChecked = 0;
                    $('.btnActions').hide();
                    showSuccessMessage('Details Updated')
                } else {
                    showErrorMessage('Failed to update Details')
                }

            }catch (e) {
                loadingScreenElement('globalModalFunctionalForm', false, " ....");
                showErrorMessage('Failed to complete action please reload page')
            }

        },
        ()=>{
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        } ,
        null);
}


$("#divTicketBar1111").hide()
async function createTicketForCurrentChat() {
    // check if this

    let response = await axios.post('/ticketing-service/api/v1/secured/ticket/create', {title: null});
    $("#divTicketBar1111").show();

    console.log(response)
    if (response.data.success) {

        let ticketObj = response.data.data.ticket;
        let ticketHandlingObj = response.data.data.ticketHandling;
        $("#btnTicketNumber").text('Ticket#' + ticketObj.id);
        $("#selectTicketStatus").val('1');// this is a default set value
        chatsTicketsReferences.set(loggedID + 'to' + userChatInViewId, {ticketObj, ticketHandlingObj});
        $('#inputMessage').val(`Here is <strong> Ticket# ${ticketObj.id} </strong>.`)
        sendMesssageAction();
        return ticketObj;

    }
    return null;

}

$('#inputMessage').keypress(function (event) {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $('#btnSend').trigger('click')
    }
});

function sendMesssageAction() {
    let message = $('#inputMessage').val().trim();
    if (message === '') {
        showErrorMessage('Cat send empty message');
        return;
    }

    /* dateCreated: "2022-04-21 13:06:54"
     : 1
     : 268
     : null*/
    let ticketObj;
    if (chatsTicketsReferences.size > 0) {


    if (chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).ticketObj) {
        ticketObj = {
            ticketId   : chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).ticketObj.id,
            statusId   : chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).ticketObj.statusId,
            title      : chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).ticketObj.title,
            dateCreated: chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).ticketObj.dateCreated,
        }
    } else {
        ticketObj = {
            ticketId   : chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).ticketId,
            statusId   : chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).statusId,
            title      : chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).title,
            dateCreated: chatsTicketsReferences.get(loggedID + 'to' + userChatInViewId).dateCreated,
        }
    }
    console.log(99, ticketObj)
    let messageToSend = {
        method            : "MESSAGE",
        withSocketChatRoom: userChatInViewObject.withSocketChatRoom,
        message,
        destinationId     : userChatInViewId,
        ticket            : ticketObj,
        admin             : loggedID,
        isAdmin           : true,
        session           : {id: loggedID, fullName: userFullName, companyId, admin: loggedID},

    }
    console.log('messageToSend', messageToSend)
    socket.emit('MESSAGE', (messageToSend));
    MESSAGES_ARRAY.push({
        destinationId: userChatInViewId,
        message      : message, ticket: ticketObj,
        timeStamp    : moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        userId       : loggedID
    });
}
    // we are creating this object and pushing to the array of reference because we need to update the screen when the sender or this agent view , with out this the agent wont see the comment that they have just sent

   /* let mychat = rightChat({userId: loggedID, message: message, timeStamp: moment.utc().format('YYYY-MM-DD HH:mm:ss')});
    $("#conversationDiv").append(mychat);*/
    /*await*/  loadChatOpenChat(userChatInViewId);

    $("#conversationDiv").scrollTop($("#conversationDiv")[0].scrollHeight);
    $('#inputMessage').val('')

}



function onMuteScreen() {

}

function initiateRemoteScreenVideo() {
    $("#btnAcceptScreenShareTicket").hide()
    $("#btnRejectScreenShareTicket").hide()
    $("#remoteAudioStream").slideUp();
    $("#remoteVideoStream").slideDown();

    // show view of video
    $('#divVisualCall').show('slow');
    $('#divCallingView').hide('slow');

    $('#btnDivAccptCall').hide('slow');


    $("#remoteVideoStream").parent().block({
        message: '<b>Loading Stream...</b>',
        css    : {
            border         : 'none',
            backgroundColor: 'transparent',
            color          : 'white'
        }
    });

}

let isCallScreenMaximized = false;


function onMaximizeScreen() {
    if (!isCallScreenMaximized) {
        // make the screen big
        $("#leftDivSection").removeClass('col-xl-3').addClass('col-xl-8')
        $("#rightDivSection").removeClass('col-xl-6').addClass('col-xl-4');
        $("#endrightDivSection").slideUp('slow');
        $('#accordionExample').slideUp('slow');
        $('#divSelctesViewTypes').slideUp('slow');
        $('#divParentSelctesViewTypes').slideUp('slow');
        initiateRemoteScreenVideo();

    } else {
        // return to make it small
        $("#leftDivSection").removeClass('col-xl-8').addClass('col-xl-3')
        $("#rightDivSection").removeClass('col-xl-4').addClass('col-xl-6')
        $("#endrightDivSection").slideDown('slow');
        $('#accordionExample').slideDown('slow');
        $('#divSelctesViewTypes').slideDown('slow');
        $('#divParentSelctesViewTypes').slideDown('slow');
    }
    isCallScreenMaximized = !isCallScreenMaximized;

}

