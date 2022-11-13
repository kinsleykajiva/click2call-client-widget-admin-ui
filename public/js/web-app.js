
let PLUG_INS ='audio-call' ;
let JANUS_PLUG_INS = new Map();
JANUS_PLUG_INS.set('audio-call',"janus.plugin.audiobridge");
JANUS_PLUG_INS.set('screen-share',"janus.plugin.videoroom");



let janus = new Janus({
    server,
    success  : () => {
        console.log('Attaching Plugin');
        janus.attach(attachAudioCallBack)
    },
    error    : error => {
        Janus.error(error);
        // alert('An Error Occurred')
        console.log(error)
    },
    destroyed: () => {
       // alert('Session has ended ,we are reloading the window');
        console.log('Session has ended ,we are reloading the window')
      //  window.location.reload();
    },
});
