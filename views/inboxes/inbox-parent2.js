loggedID = parseInt(loggedID);
companyId = parseInt(companyId);
let ARRAY_ACCEPTED_CHAT_USER_ID  = [];
let OTHER_AGENTS_ARRAY           = [];
let LISTENING_TO_CHATS_SET       = new Set();
let MAP_NEW_MESSAGE_NOTIFICATION = new Map();  // widgetUserId  = true or false

let messageToSend = {
    method : 'SUB',
    admin  : loggedID,
    isAdmin: true,
    remembering : false,
    WIDGET_API_KEY,
    session: {
        id: loggedID,
        profilePicture: userProfileImageUrl,
        fullName: userFullName,
        companyId: companyId,
        admin: loggedID
    },

}

let userChatInViewId            = 0;      /** this value will always change based on the chat selected **/
let userChatInViewObject        = null;
let isAgnetInCall               = false;
let MAX_SIZE_CHAR_FOR_PREVIEW   = 20;
let IS_THERE_WIDGET_USER_ONLINE = false;
let WIDGET_USER_ONLINE_COUNTER  = 0;

console.log(messageToSend)
let socket = null;

const MAX_RECONNECTION_DELAY        = 8000
const MIN_RECONNECTION_DELAY        = 1500
const CONNECTING_TIMEOUT            = 5000
const RECONNECTION_DELAY_MULTIPLIER = 1.3
let   reconnectDelay                = 0

let  initReconnectDelay = () => {
    reconnectDelay = MIN_RECONNECTION_DELAY + Math.random() * MIN_RECONNECTION_DELAY
    console.debug('init reconnect delay:', reconnectDelay)
}


let  updateReconnectionDelay = () => {
    reconnectDelay *= RECONNECTION_DELAY_MULTIPLIER
    if (reconnectDelay > MAX_RECONNECTION_DELAY) {
        reconnectDelay = MAX_RECONNECTION_DELAY
    }
    console.debug('update reconnect delay:', reconnectDelay)
}


let lastMessagemessagesMap = new Map();
let currentUsersOnline     = [];
let usersWidgetsUsers      = [];
let MESSAGES_ARRAY         = [];
let lockedChatRoomsMap     = new Map();
let takenUsersWidgetsUsers = new Map();
let chatsTicketsReferences = new Map();
let ringToneAudio          = new Audio('https://yootok.s3.eu-central-1.amazonaws.com/calling-dial-tone.mp3');

ringToneAudio.loop     = true;

function resetOnConnectionEndedSockets() {
    takenUsersWidgetsUsers = new Map();
    $("#chatUsersRowsPending").html('')
    usersWidgetsUsers           = [];
    WIDGET_USER_ONLINE_COUNTER  = 0;
    currentUsersOnline          = [];
    userChatInViewId            = 0;
    IS_THERE_WIDGET_USER_ONLINE = false;
    ARRAY_ACCEPTED_CHAT_USER_ID = [];
}
window.onbeforeunload = function(e) {
   /* socket.onclose = function () {}; // disable onclose handler first
    socket.close();*/
    return 'You will loss your data if yu reload or close this tab';
};

window.notyf.open({
    type       : 'Success',
    message    : "Do not close or reload this tab . You will lose this session data ! ",
    duration   : 30_000,
    ripple     : true,
    background : '#27C940',
    dismissible: true,
    position   : {
        x: 'center',
        y: 'top'
    }
});
// let usersWidgetsUsers;
let SocketConnect = () => {
    if (window.location.protocol === 'http:') {
        $("#btnShowBottomView").show();
        //localhost
        // socket = io("ws://localhost:3300"+ "/access?key=" + WIDGET_API_KEY  ,{ query: "key=" + WIDGET_API_KEY });
        socket = io("ws://localhost:3312" + '/' + WIDGET_API_KEY /* +'/access'*/, {query: { domain:window.location.origin, isWidget: 0, key: WIDGET_API_KEY}}) //  new WebSocket(SS_BASE_URL + "/access?key=" + WIDGET_API_KEY);
    } else {
        $("#btnShowBottomView").hide();
        socket = io("wss://api-socket-chat.xxxclick2callxxxxx.com" + '/' + WIDGET_API_KEY, {query: {domain:window.location.origin,isWidget: 0, key: WIDGET_API_KEY}});
    }

    const connectingTimeout = setTimeout(() => {
        /*console.debug('connecting timeout:', CONNECTING_TIMEOUT)
        socket.close()*/
    }, CONNECTING_TIMEOUT)


    socket.on('RING_RING', function(eventData){
        console.log('Event-RING_RING:: ' ,eventData);

        // start ring this end
        isMakingOutGoingCall  = false;

        // ringToneAudio.play();
        ringToneAudio.play();
        $('#divCallingScreen').show('slow');
        $('#btnDivRejectall').show('slow');
        $('#btnDivEndCallCall').hide('slow');
        $('#btnDivAccptCall').show('slow');

        showSuccessMessage("Incoming Call")
        $('#txtTitleCallingWidget').text('Widget Caller:  ' + eventData.payload.user.fullName )
        LastRoomData = eventData.payload.user.room;
        $("#callTimer").text('00:00');

    });
    socket.on('ENDED_CALL', function(eventData){
        console.log('Event-ENDED_CALL:: ' ,eventData);
        isAgnetInCall = false;
        ringToneAudio.pause();

        endCallCall(false);

    });
    socket.on('CALL_REJECTED', function(eventData){
        console.log('Event-CALL_REJECTED:: ' ,eventData);
        isAgnetInCall = false;
        // start ring this end
        showErrorMessage('Call has been rejected  by' +eventData.payload.user.fullName )

        ringToneAudio.pause();
        /* $('#divCallingView').slideDown('slow');
         $('#txtTitleCallingWidget').text('Widget User ' + eventData.payload.user.fullName + ' is calling from widget of the site ...')
         LastRoomData = eventData.payload.user.room;*/

    });

    socket.on('CALL_ACCEPTED', function(eventData){
        console.log('Event-CALL_ACCEPTED:: ' ,eventData);
        isAgnetInCall = true;

        ringToneAudio.pause();

        joinRoom(MyRoomData); // using my details since i am the one who started the call



    });
    socket.on('REMEMBER', function(eventData){
        console.log('Event-REMEMBER:: ' ,eventData);


        



    });


    socket.on('CLOSE_EXIT', function(eventData){
        console.log('Event-CLOSE_EXIT:: ' ,eventData);
        EXITED_USER_IDS.add(eventData.payload.user. userId);

        if(userChatInViewId == eventData.payload.user. userId){
            $("#btnCloseChat").show();
        }

        $('#row-'+eventData.payload.user. userId).remove();// remove dhat from view or live section
        ARRAY_ACCEPTED_CHAT_USER_ID = ARRAY_ACCEPTED_CHAT_USER_ID.filter(el => el !== eventData.payload.user. userId); // remove the usere from referencei n the arrays
        window.notyf.open({
            type       : 'Warning',
            message    : "User " + eventData.payload.user.fullName + " Is Gone fore ever !!!!!!!",
            duration   : 10_000,
            ripple     : true,
            background : '#27C940',
            dismissible: true,
            position   : {
                x: 'center',
                y: 'top'
            }
        });


    });



    socket.on('ACCEPT', function(eventData){
        console.log('Event-ACCEPT:: ' ,eventData);

        // this event should not fire to the admin or agent that accepted the ticket
        // we need to notify that there is another agent that has accepted the ticket so its  no longer accessible
        takenUsersWidgetsUsers.set(eventData.payload.user.takenUser, eventData.payload.user)


    });

    socket.on('LISTEN', async function (eventData) {
        // THIS IS FOR EAVESDROPPING
        console.log('Event-LISTEN:: ', eventData);
        await onMessageEvent(eventData)

    });

    socket.on('MESSAGE', async function (eventData) {
        console.log('Event-MESSAGE:: ', eventData);
        await onMessageEvent(eventData)

    });
    async function onMessageEvent(eventData){
        if (MESSAGES_ARRAY.length === 0){
            MESSAGES_ARRAY = eventData.payload.user.messages;
        }else{
            eventData.payload.user.messages.forEach(messageObj=>{
                const foundArr = MESSAGES_ARRAY.filter(x=>x.message === messageObj.message /*&& x.userId === messageObj.userId*/ );
                console.log('foundArr || ' ,foundArr);
                if(foundArr && foundArr.length  < 1){
                    console.log( 'messageObj' ,messageObj)
                    MESSAGES_ARRAY.push(messageObj);
                    // is this the user in view
                    if(userChatInViewId !== messageObj.userId){
                        if(MAP_NEW_MESSAGE_NOTIFICATION.get(messageObj.userId)){
                            MAP_NEW_MESSAGE_NOTIFICATION.set(messageObj.userId, 1 + MAP_NEW_MESSAGE_NOTIFICATION.get(messageObj.userId));
                        }else{
                            MAP_NEW_MESSAGE_NOTIFICATION.set(messageObj.userId ,1);
                        }
                        newMessageChatNotification(messageObj.userId ,true);

                    }
                }
            })
        }

        // usersWidgetsUsers = eventData.payload.currentUsersOnline.filter(user => loggedID !== user.id && user.companyId === companyId);// only get messages for this company and  the chats that are not mine


        if (userChatInViewId !== 0) {
            //this means this chat is open
            await loadChatOpenChat(userChatInViewId);
        }
        for (const user of usersWidgetsUsers) {
            await renderChatsCounder(user.id);
            if (lastMessagemessagesMap.get(loggedID + 'to' + user.id)) {
                $("#txtPreview-" + user.id).html(`<strong>  ${lastMessagemessagesMap.get(loggedID + 'to' + user.id).content.substring(0, MAX_SIZE_CHAR_FOR_PREVIEW)} ...    </strong>`);
            }
        }
    }

    // const foundUser = currentUsersOnline.find(user => user.id === 533);
    socket.on('SUB', async eventData => eventSub(eventData));
    socket.on('AGENT_SUB', async eventData => eventSub(eventData));
    socket.on('NOTIFY_OTHER_AGENTS', async eventData => {
        console.log('Event-NOTIFY_OTHER_AGENTS:: ', eventData);
        if (eventData) {
            lockedChatRoomsMap.set(eventData.lockedRoom, {eventData});
            // loop map to update the UI screens
            lockedChatRoomsMap.forEach((value, key) => {
                console.log('Event-NOTIFY_OTHER_AGENTS:: ', value, key);
                console.log('Event-NOTIFY_OTHER_AGENTS:: ',  key);
                console.log('Event-NOTIFY_OTHER_AGENTS:: ',  key.eventData);
                // key is the object with locked data
                if( currentUsersOnline.length > 0){
                    const foundUser = currentUsersOnline.find(user => user.withSocketChatRoom === key +"");
                    console.log('foundUser-Event-NOTIFY_OTHER_AGENTS:: ', foundUser);
                    if(foundUser && $('#row-' + foundUser.id).length > 0 /*checking this row exist in the DOM tree*/){
                        const lockedhtm = `<div class="badge bg-success float-end"  id="lockedBy-${value.eventData.lockedByAgentId}">Taken By ${value.eventData.lockedByAgentName} </div>`;
                        $('#row-' + foundUser.id).prepend(lockedhtm);
                        //currentUsersOnline = currentUsersOnline.filter(user => user.id !== foundUser.id);
                    }
                }
                $('#row_user_msg_availability_'+key).text('locked')
            })
        }
    });

    async function eventSub(eventData) {
        console.log('Event-SUB:: ', eventData);

        if(eventData.payload.currentUsersOnline){
           let tempMssg = [];
            eventData.payload.currentUsersOnline.forEach(user => {
                console.log('chatsTicketsReferences:: ',  user);
                if(user.lockedChatData){
                    tempMssg.push(user.lockedChatData.messagesArr) ;
                    console.log('||||||chatsTicketsReferences:: ',  user.lockedChatData);
                    if(  user.lockedChatData.ticket ){
                        chatsTicketsReferences.set(loggedID + 'to' + user.id, { ticketObj :  user.lockedChatData.ticket,
                            ticketHandlingObj:null});
                        console.log('chatsTicketsReferences:: ', chatsTicketsReferences);
                    }
                }
            });
            MESSAGES_ARRAY=tempMssg;
        }


        if (eventData.payload.currentUsersOnline) {

            usersWidgetsUsers = eventData.payload.currentUsersOnline.filter(user => !user.admin && loggedID !== user.id && user.companyId === companyId);
            OTHER_AGENTS_ARRAY = eventData.payload.currentUsersOnline.filter(user => user.admin && loggedID !== user.id && user.companyId === companyId);
            WIDGET_USER_ONLINE_COUNTER = eventData.payload.currentUsersOnline.filter(user =>  !user.admin && loggedID !== user.id && user.companyId === companyId).length;
            eventData.payload.currentUsersOnline.forEach(user => {
                if (loggedID !== user.id && user.companyId === companyId) {
                    IS_THERE_WIDGET_USER_ONLINE = true;
                }
            });
        }

        if (IS_THERE_WIDGET_USER_ONLINE) {
            currentUsersOnline = usersWidgetsUsers;
            console.log("there are users to be attended to ,amount " + WIDGET_USER_ONLINE_COUNTER);
            await renderPending(usersWidgetsUsers, false);

            usersWidgetsUsers = eventData.payload.currentUsersOnline.filter(user => loggedID !== user.id && user.companyId === companyId && !user.admin);
            //
            console.log('89-',usersWidgetsUsers)
            for (const user of usersWidgetsUsers) {
                await renderChatsCounder(user.id)
            }
        }
    }

    socket.on('SCREEN_SHARE_INVITE', async function (eventData) {
        console.log('Event-SUB:: ', eventData);

        if (eventData.method === "SCREEN_SHARE_INVITE") {
            $('#divCallingScreen').show('slow');
            $('#btnAcceptScreenShareTicket,#btnRejectScreenShareTicket').show();
            LastRoomData = eventData.payload.user.room;
            //ringToneAudio.play();
           // alert('If you Accept this invite,The callWill end to start a new Session For Screen Share !');
            $('#txtTitleCallingWidget').text(capitaliseTextFirstCaseForWords(eventData.payload.user.fullName))

        }
    });


    socket.on('SUB_AGENTS', async function (eventData) {
        // this will tell other agents that i am online , the widget user will tell other agents as well
        console.log('Event-SUB_AGENTS:: ', eventData);


    });







   /* socket.onmessage = async event => {
        console.log("onmessage", event.data)
        const eventData = JSON.parse(event.data);
        console.log("eventData", eventData)

        MESSAGES_ARRAY = eventData.payload.user.messages;







    };*/
    socket.on("disconnect", () => {
        console.log(socket.id); // undefined

        $("#btnOnlineStatus").hide();
        $("#btnErrorConnectionStatus").show();
        console.log('onerror');
        $('#statusMessage').text('Reload to connect')
    });

    socket.on("connect", () => {
        console.log('conn',socket.id); // x8WIv7-mJelg7on_ALbx

      //  initReconnectDelay()
        //clearTimeout(connectingTimeout)
        console.log('open:')
        $('#statusMessage').text('')

        $("#btnOnlineStatus").show();
        $("#btnErrorConnectionStatus").hide();

        socket.emit('SUB', messageToSend);
    });


    /*socket.onclose =  ()=> {
        console.log('onclose');
        $('#statusMessage').text('Reload to connect')
        $("#btnOnlineStatus").hide();
        $("#btnErrorConnectionStatus").show();
        resetOnConnectionEndedSockets();
        if (!reconnectDelay) {
            initReconnectDelay()
        } else {
            updateReconnectionDelay()
        }
        setTimeout(SocketConnect, reconnectDelay)
    };*/

};
function acceptCall(){
    // audio.pause();
    //   ringToneAudio.pause();
    showSuccessMessage('Call accepted') ;

    $('#btnAccpetCall').hide('slow');
    $("#divCallingView").slideUp();
    $("#divVisualCall").slideDown();

    joinRoom();
}
Number.prototype.padLeft = function(base,chr){
    const len = (String(base || 10).length - String(this).length) + 1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

/**
 * current date formatted MM/dd/yyyy HH:mm:ss
 * **/
function nowTimeStamp(){
    // MM/dd/yyyy HH:mm:ss
    const d = new Date;
    return [(d.getMonth() + 1).padLeft(),
            d.getDate().padLeft(),
            d.getFullYear()].join('/') +
        ' ' +
        [d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft()].join(':');
}

function endCallCall(shouldNotify) {
    shouldNotify= shouldNotify  || false;
    didIEndCall = true;
    // showErrorMessage('Call ended');

    endCallToPlugIns();
    if(shouldNotify) {


        let messageToSend = {
            method            : 'ENDED_CALL',
            message           : null,
            withSocketChatRoom: userChatInViewObject.withSocketChatRoom,
            room              : MyRoomData,
            destinationId     : userChatInViewId,
            admin             : loggedID,
            isAdmin           : true,
            session           : {id: loggedID, fullName: userFullName, companyId: companyId, admin: loggedID},
        }

        console.log(messageToSend)
        socket.emit('ENDED_CALL',(messageToSend));
    }
    if (isCallScreenMaximized){
        onMaximizeScreen()
    }

}
function rejectCall(){
    ringToneAudio.pause();
    showSuccessMessage('Call rejected') ;
    endCallCall(true);
}

function makeACall(){
    isMakingOutGoingCall = true;
    $("#iconSVGCall").hide('slow',null,()=>{
        $("#callingProgressBar").show('fast');
        $("#inputMessage").val(nowTimeStamp() + '| Calling ');
        sendMesssageAction();
        // setUpRoom();

        let messageToSend = {
            method            : 'RING_RING',
            message           : null,
            room              : MyRoomData,
            withSocketChatRoom: userChatInViewObject.withSocketChatRoom,
            destinationId     : userChatInViewId,
            admin             : loggedID,
            isAdmin           : true,
            session           : {id: loggedID, fullName: userFullName, companyId: companyId, admin: loggedID},
        }

        console.log(messageToSend)
        socket.emit( 'RING_RING' , (messageToSend));


    });



}

SocketConnect();
