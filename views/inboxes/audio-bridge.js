/**
 *
 * This script should be the last to load in a page as it has nothing to do with  the load of data
 * */



let PLUG_INS ='audio-call' ;// default value
let JANUS_PLUG_INS = new Map();
let LastRoomData = {};
let MyRoomData = {};
let didIEndCall = null ; // <true|false|null> null means the call has been reset
// const server = 'https://app.access.janus.api.xxxclick2callxxxxx.com/janus';
const server = JANUS_URL;
let janus = mixertest = mygroup = myusername = myid = webrtcUp = acodec = null;
const WIDGET_API_KEY_SET = $("#widget-key-set").text();

acodec = 'opus';

const $worked = $("#callTimer");
let keepTrackingTime = true;
let isMakingOutGoingCall = false;
const PLUG_INS_IN_USE = {voiceCall:false , screenShare:false};

let randomString = (len) => {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString
}
let opaqueId = "widget-" + WIDGET_API_KEY_SET + '-' + randomString(12);
function update() {
    $worked.show();
    const myTime = $worked.html();
    const ss = myTime.split(":");
    const dt = new Date();
    dt.setHours(0);
    dt.setMinutes(ss[0]);
    dt.setSeconds(ss[1]);

    const dt2 = new Date(dt.valueOf() + 1000);
    const temp = dt2.toTimeString().split(" ");
    const ts = temp[0].split(":");

    $worked.html(ts[1] + ":" + ts[2]);
    if (keepTrackingTime) {
        setTimeout(update, 1000);
    }

}

function startCallTimer() {
    $('#callGloePhoneIcon').hide();
    $('#callTimer').show();
    // callTimer
    keepTrackingTime = true;
    setTimeout(update, 1000);

}

function stopTimmer() {

    keepTrackingTime = false;
    $('#callGloePhoneIcon').show();
    $('#callTimer').hide();
}

const UUID = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


let stereo = audioenabled = false;

function startJanusInits() {

    Janus.init({
        debug: 'all', callback: () => startJanusRoomSetups()
    });
    if (!Janus.isWebrtcSupported()) {
        alert('Browser Errors ,please use the latest brwoser !')
        return;
    }

}

function initAudioCallfunctions(){
    if(PLUG_INS !== 'audio-call'){
        PLUG_INS = 'audio-call';
        startJanusRoomSetups()
    }

}
function initVideoCallfunctions(){
    if(PLUG_INS !== 'screen-share') {
        PLUG_INS = 'screen-share';
        startJanusRoomSetups();
        HAS_ATTACHED_VIDEO = true;
    }
}
let HAS_ATTACHED_VIDEO = false ;


function endCallToPlugIns(){
   /* // we will not reset the reference to janus  as we will wish to reuse the room
    if(mixertest){
        // will end Auddio call
        mixertest.send({ message:{ "request" : "leave"} });
        PLUG_INS_IN_USE.voiceCall = true; // we still wish to use the handler to this plugin

        setTimeout(function () {
            mixertest.hangup(true)
        }, 3_000);
    }

    if(screentest){
        // will end screen sharing call
        screentest.send({ message:{ "request" : "leave"} });
        PLUG_INS_IN_USE.screenShare = false;
        setTimeout(() => {
            screentest.hangup(true);
            setTimeout(() => screentest.detach(), 3_000);
        }, 3_000);
    }*/
    endResetJanus();
}

/** this is a has way of reseting control*/
function endResetJanus(){
    ringToneAudio.pause();
    // we will not reset the reference to janus  as we will wish to reuse the room
    if(mixertest){
        // will end Auddio call
        mixertest.send({ message:{ "request" : "leave"} });
        PLUG_INS_IN_USE.voiceCall = true;// we still wish to use the handler to this plugin
        mixertest.hangup(true)

    }

    if(screentest){
        // will end screen sharing call
        screentest.send({ message:{ "request" : "leave"} });
        PLUG_INS_IN_USE.screenShare = false;
        screentest.hangup(true);
        setTimeout(() => screentest.detach(), 1_300);

    }
    setTimeout(() => startJanusInits(), 4_000);
}



function startJanusRoomSetups() {


    console.log('starting an instance of Janus')
    if (!Janus.isWebrtcSupported()) {
        alert('Browser Errors ,please use the latest brwoser !')
        return;
    }

    if(janus) {
        console.log('Attaching Plugin attachScreenShareCallBack');
        janus.attach( attachScreenShareCallBack());

    }else {
        janus = new Janus({
            server,
            success  : () => {
                console.log('Attaching Plugin attachAudioCallBack');
                janus.attach( attachAudioCallBack());
            },
            error    : error => {
                Janus.error(error);
             //   alert('An Error Occurred')
                console.log(error)
            },
            destroyed: () => {
                alert('Session has ended ')
               // window.location.reload();
            },
        });
    }
}

let TOKENS = [];
/*JANUS_PLUG_INS.set('audio-call', attachAudioCallBack());
JANUS_PLUG_INS.set('screen-share',attachScreenShareCallBack());*/

function roomJoiningTokens() {
    TOKENS = [];
    for (let i = 0; i < 6; i++) {
        TOKENS.push(UUID())
    }
}



function setUpRoom() {

    roomJoiningTokens();

    LastRoomData = {
        request  : "create",
        room     : Math.floor(Date.now() / 1000),
        permanent: false,

        secret    : UUID(),
        pin       : '214874u8',
        is_private: false
    };
    MyRoomData = LastRoomData;
    mixertest.send({
        message: LastRoomData
    });


    /* let  register = { request: "join", room: 1234, display: '1222' };
     register.codec = 'opus';
     mixertest.send({ message: register });*/
    console.log(' Please Join')

}

function joinRoom(object) {
    object = object || LastRoomData; // to be safe
    mixertest.send({
        message: {
            request: "join",
            room   : object.room,
            group  : 'customer service group',
            pin    : object.pin,
            display: userFullName,
            codec  : 'opus',


        }
    });
    console.log('done joining eyyyy Please ')
}

setTimeout(function () {

    startJanusInits();
}, 3_000); // seems liek the janus lib takes time to laoad from the script reference into brwoser memory









