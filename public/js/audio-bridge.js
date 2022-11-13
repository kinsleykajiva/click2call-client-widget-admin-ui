
// const server = 'http://13.245.79.194:8088/janus';
const server = 'https://primary-janus.xxxclick2callxxxxx.com/janus';
let janus = mixertest = mygroup = myusername = myid = webrtcUp = acodec = null;
const WIDGET_API_KEY_SET = $("#widget-key-set_75q85x73t5n2i09j875a64").text();
let ringToneAudio = new Audio('https://yootok.s3.eu-central-1.amazonaws.com/calling-dial-tone.mp3');
ringToneAudio.loop =true;
acodec = 'opus';
let MyRoomData = {};
let currntAgentId = 0;
let LastRoomData = {};
let isInACall = false;
let didIEndCall = null ; // <true|false|null> null means the call has been reset
let SESSION = {customer: null};
let ticketObj = {};
const PLUG_INS_IN_USE = {voiceCall:false , screenShare:false};

let opaqueId = (len => {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
})(12);

const UUID = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function muteCurrentPluginInView(isMuted){
        if(mixertest){
            // affect audio calls
            mixertest.send({message: {request: "configure", muted: isMuted}});
        }


}

var myroom = UUID();	// Demo room
let PLUG_INS ='audio-call' ;
let JANUS_PLUG_INS = new Map();

// http://jsfiddle.net/RkNV2/2/
function startBounce($elem){
    $($elem).data('bounce', true);
    bounce($($elem));
    $($elem).data('bounce', false)
}

//http://jsfiddle.net/RkNV2/2/
function bounce($elem) {
    $elem.effect('bounce', { times: 1, distance: 10 }, 500, function() {
        if ($(this).data('bounce')) bounce($elem);
        else $elem.stop();
    });
}

let stereo = audioenabled = false;

function startJanusInits() {
    stereo = audioenabled = false;
    keepTrackingTime = true ;
    HAS_ATTACHED_VIDEO = false ;
    Janus.init({
        debug: 'all', callback: () => {
            janus = new Janus({
                server,
                success  : () => {
                    console.log('XXXXXXInstantiationDoneXXXXX');
                    startJanusRoomSetups();

                },
                error    : error => {
                    Janus.error(error);
                    // alert('An Error Occurred')
                    console.log(error)

                },
                destroyed: () => {
                   // alert('Session has ended ');
                    console.log('Session has ended')
                   // window.location.reload();
                },
            });
        }
    });

}
const $worked = $("#callTimer_75q85x73t5n2i09j875a64");
let keepTrackingTime = true ;
function update() {
    console.log('keepTrackingTime',keepTrackingTime);
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

    $worked.html(ts[1]+":"+ts[2]);
    if(keepTrackingTime){
        setTimeout(update, 1000);
    }

}
function startCallTimer(){
    // callTimer_75q85x73t5n2i09j875a64
    keepTrackingTime = true;
    setTimeout(update, 1000);
    $("#prime1").html('<i class="prime1 zmdi zmdi-phone-end"></i>');
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

function stopTimmer() {
    console.log('stopTimmer called')
    isInACall = false;
    keepTrackingTime = false;
    const callTimeSession = $("#callTimer_75q85x73t5n2i09j875a64").text();
    if (callTimeSession !== '00:00') {

        $("#callTimer_75q85x73t5n2i09j875a64").text('00:00')
        $("#prime1").html('<i class="prime1 zmdi zmdi-phone"></i>');
        $('#chatSend_75q85x73t5n2i09j875a64').val(nowTimeStamp() + '- Call Ended ' + callTimeSession)
        $('#fab_send_75q85x73t5n2i09j875a64').trigger('click')

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
function startJanusRoomSetups() {

    console.log('starting an instance of Janus')
    if (!Janus.isWebrtcSupported()) {
        alert('Browser Errors ,please use the latest brwoser !')
        return;
    }

    if (PLUG_INS === 'screen-share') {
        console.log('Attaching Plugin attachScreenShareCallBack');
        janus.attach(attachScreenShareCallBack());
    }
    if (PLUG_INS === 'audio-call') {
        console.log('Attaching Plugin attachAudioCallBack');
        janus.attach(attachAudioCallBack());

    }
}
PLUG_INS = 'audio-call';
/*JANUS_PLUG_INS.set('audio-call', attachAudioCallBack());
JANUS_PLUG_INS.set('screen-share',attachScreenShareCallBack());*/
let TOKENS = [];

function roomJoiningTokens() {
    TOKENS = [];
    for (let i = 0; i < 6; i++) {
        TOKENS.push(UUID())
    }
}

function endCallToPlugIns(){
    /*// we will not reset the reference to janus  as we will wish to reuse the room
    if(mixertest){
        // will end Auddio call
        mixertest.send({ message:{ "request" : "leave"} });
        PLUG_INS_IN_USE.voiceCall = true;// we still wish to use the handler to this plugin

        setTimeout(() => {
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
    endResetJanus()
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




setTimeout(function () {

    startJanusInits();
}, 5_000); // seems liek the janus lib takes time to laoad from the script reference into brwoser memory




