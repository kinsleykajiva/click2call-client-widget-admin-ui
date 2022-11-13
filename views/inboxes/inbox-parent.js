loggedID = parseInt(loggedID);
companyId = parseInt(companyId);
let ARRAY_ACCEPTED_CHAT_USER_ID = [];
let WIDGET_API_KEY = 'c6f1bd16-5eb3-4e02-b1bd-165eb3de029d';
let messageToSend = {
    method : 'SUB',
    admin  : (loggedID),
    isAdmin: true,
    session: {id: (loggedID), fullName: userFullName, companyId: (companyId), admin: loggedID},

}

let userChatInViewId = 0;/** this value will always change based on the chat selected **/
let MAX_SIZE_CHAR_FOR_PREVIEW = 20;
let IS_THERE_WIDGET_USER_ONLINE = false;
let WIDGET_USER_ONLINE_COUNTER = 0;

console.log(messageToSend)
let socket = null;

const MAX_RECONNECTION_DELAY = 8000
const MIN_RECONNECTION_DELAY = 1500
const CONNECTING_TIMEOUT = 5000
const RECONNECTION_DELAY_MULTIPLIER = 1.3
let reconnectDelay = 0

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
let currentUsersOnline = [];
let usersWidgetsUsers = [];
let MESSAGES_ARRAY = [];
let takenUsersWidgetsUsers = new Map();
let chatsTicketsReferences = new Map();
let ringToneAudio = new Audio('https://yootok.s3.eu-central-1.amazonaws.com/calling-dial-tone.mp3');
ringToneAudio.loop = true;

function resetOnConnectionEndedSockets() {
    takenUsersWidgetsUsers = new Map();
    $("#chatUsersRowsPending").html('')
    usersWidgetsUsers = [];
    WIDGET_USER_ONLINE_COUNTER = 0;
    currentUsersOnline = [];
    userChatInViewId = 0;
    IS_THERE_WIDGET_USER_ONLINE = false;
    ARRAY_ACCEPTED_CHAT_USER_ID = [];
}
window.onbeforeunload = function(e) {
    socket.onclose = function () {}; // disable onclose handler first
    socket.close();
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

let SocketConnect = () => {
    if(window.location.protocol === 'http:') {
        //localhost
        socket = new WebSocket("ws://localhost:3300");
    }else{
        socket = new WebSocket("wss://api-chat-messages.xxxclick2callxxxxx.com/access?key=" + WIDGET_API_KEY);
    }

    const connectingTimeout = setTimeout(() => {
        console.debug('connecting timeout:', CONNECTING_TIMEOUT)
        socket.close()
    }, CONNECTING_TIMEOUT)

    socket.onmessage = async event => {
        console.log("onmessage", event.data)

        let eventData = JSON.parse(event.data);
        console.log("eventData", eventData)
        let usersWidgetsUsers;
        MESSAGES_ARRAY = eventData.payload.user.messages;


        if (eventData.method === "CLOSE_EXIT") {
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

        }
        if (eventData.method === "ENDED_CALL") {
            ringToneAudio.pause();

            endCallCall(false);
        }
        if (eventData.method === "RING_RING") {
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
            $("#callTimer").text('00:00')
        }
        if (eventData.method === "SCREEN_SHARE_INVITE") {
            $('#divCallingScreen').show('slow');
            $('#btnAcceptScreenShareTicket,#btnRejectScreenShareTicket').show();
            LastRoomData = eventData.payload.user.room;
            //ringToneAudio.play();
            alert('If you Accept this invite,The callWill end to start a new Session For Screen Share !');
            $('#txtTitleCallingWidget').text(capitaliseTextFirstCaseForWords(eventData.payload.user.fullName))

        }
        if (eventData.method === "CALL_ACCEPTED") {


            ringToneAudio.pause();

            joinRoom(MyRoomData); // using my details since i am the one who started the call
        }
        if (eventData.method === "CALL_REJECTED") {
            // start ring this end
            showErrorMessage('Call has been rejected  by' +eventData.payload.user.fullName )

            ringToneAudio.pause();
           /* $('#divCallingView').slideDown('slow');
            $('#txtTitleCallingWidget').text('Widget User ' + eventData.payload.user.fullName + ' is calling from widget of the site ...')
            LastRoomData = eventData.payload.user.room;*/
        }
        if (eventData.method === "ACCEPT") {
            // this event should not fire to the admin or agent that accepted the ticket
            // we need to notify that there is another agent that has accepted the ticket so its  no longer accessible
            takenUsersWidgetsUsers.set(eventData.payload.user.takenUser, eventData.payload.user)
        }
        if (eventData.method === "SUB") {
            if (eventData.payload.currentUsersOnline) {

                usersWidgetsUsers = eventData.payload.currentUsersOnline.filter(user => loggedID !== user.id && user.companyId === companyId);
                WIDGET_USER_ONLINE_COUNTER = eventData.payload.currentUsersOnline.filter(user => loggedID !== user.id && user.companyId === companyId).length;
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

                usersWidgetsUsers = eventData.payload.currentUsersOnline.filter(user => loggedID !== user.id && user.companyId === companyId);
                //  eventData.payload.
                for (const user of usersWidgetsUsers) {
                    await renderChatsCounder(user.id)
                }
            }
        }
        if (eventData.method === "MESSAGE") {

            usersWidgetsUsers = eventData.payload.currentUsersOnline.filter(user => loggedID !== user.id && user.companyId === companyId);// only get messages for this company and  the chats that are not mine


            if(userChatInViewId !==0){
                //this means this chat is open
              await  loadChatOpenChat(userChatInViewId);
            }
            for (const user of usersWidgetsUsers) {
                await renderChatsCounder(user.id);
                if (lastMessagemessagesMap.get(loggedID + 'to' + user.id )) {
                    $("#txtPreview-" + user.id).html(`<strong>  ${lastMessagemessagesMap.get(loggedID + 'to' + user.id).content.substring(0, MAX_SIZE_CHAR_FOR_PREVIEW)} ...    </strong>`);
                }
            }

        }

    };


    socket.onerror =  ()=> {
        $("#btnOnlineStatus").hide();
        $("#btnErrorConnectionStatus").show();
        console.log('onerror');
        $('#statusMessage').text('Reload to connect')
    };

    socket.onopen =  (ev) =>{

        initReconnectDelay()
        clearTimeout(connectingTimeout)
        console.log('open:', ev)
        $('#statusMessage').text('')

        $("#btnOnlineStatus").show();
        $("#btnErrorConnectionStatus").hide();
        socket.send(JSON.stringify(messageToSend));
    };

    socket.onclose =  ()=> {
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
    };

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
    
            isAgnetInCall = false;
            let messageToSend = {
                method       : 'ENDED_CALL',
                message      : null,
                room         : MyRoomData,
                destinationId: userChatInViewId,
                admin        : loggedID,
                isAdmin      : true,
                session      : {id: loggedID, fullName: userFullName, companyId: (companyId), admin: loggedID},
            }

            console.log(messageToSend)
            socket.send(JSON.stringify(messageToSend));
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
            method       : 'RING_RING',
            message      : null,
            room         : MyRoomData,
            destinationId: userChatInViewId,
            admin        : loggedID,
            isAdmin      : true,
            session      : {id: loggedID, fullName: userFullName, companyId: (companyId), admin: loggedID},
        }

        console.log(messageToSend)
        socket.send(JSON.stringify(messageToSend));


    });



}

SocketConnect();
