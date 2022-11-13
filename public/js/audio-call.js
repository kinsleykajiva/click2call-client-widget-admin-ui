let attachAudioCallBack = () => {
    return {
        plugin        : "janus.plugin.audiobridge",
        opaqueId,
        success       : pluginHandle => {
            mixertest = pluginHandle;
            Janus.log("Plugin attached! (" + mixertest.getPlugin() + ", id=" + mixertest.getId() + ")");
            PLUG_INS_IN_USE.voiceCall = true;
            setTimeout(function () {
                setUpRoom();
            }, 2000);
        },
        error         : error => {
            Janus.error("  -- Error attaching plugin...", error);
            alert("Error setting up plugin, reload the page !")
        },
        consentDialog : on => {
            if (on) {
                // Darken screen and show hint
                $.blockUI({
                    message: '<div><img src="https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/up_arrow.png"/></div>',
                    css    : {
                        border         : 'none',
                        padding        : '15px',
                        backgroundColor: 'transparent',
                        color          : '#aaa',
                        top            : '10px',
                        left           : (navigator.mozGetUserMedia ? '-100px' : '300px')
                    }
                });
            } else {
                // Restore screen
                $.unblockUI();
            }
        },
        iceState      : state => {
            Janus.log("ICE state changed to " + state);
        },
        mediaState    : function (medium, on) {
            Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
        },
        webrtcState   : function (on) {

            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
        },
        onmessage     : (msg, jsep) => {
            Janus.debug(" ::: Janus Got a message :::", msg);
            const event = msg["audiobridge"];
            Janus.debug("Event: " + event);
            if (event) {
                if(msg["leaving"]) {
                    console.log('XXXX::::::User has left the call')

                    // in this event we can't really say who left

                    if(didIEndCall === true){
                        // its me that has ended
                        didIEndCall = null;

                        stopTimmer();
                        console.log(7777)

                        $("#chat_fullscreen_75q85x73t5n2i09j875a64,#divTextMessage").show("slide",()=>{
                            $("#btnAnswerCallInComingCall,#prime1,#prime3").show();
                            $("#btnEndCallOrRejectCall").hide();
                            $("#callingScreenIcon").removeClass('bounce');
                            $("#callingFormScreen_75q85x73t5n2i09j875a64").hide('slide');
                        });


                        endCallToPlugIns();

                    }else{

                        $("#btnEndCallOrRejectCall").trigger('click');

                        didIEndCall = false ;
                    }
                }

                if (event === "destroyed") {
                    Janus.warn("The room has been destroyed!");
                    alert('Room is ggone or destroyed')
                    stopTimmer();
                    console.log(22222)
                }


                if (event === "joined") {
                    if (msg["id"]) {
                        myid = msg["id"];
                        Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                        if (!webrtcUp) {
                            webrtcUp = true;
                            mixertest.createOffer({
                                media       : {video: false},// This is an audio only room
                                customizeSdp: jsep => {
                                    if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                                        // Make sure that our offer contains stereo too
                                        jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                                    }
                                },
                                success     : (jsep) => {
                                    Janus.log("Got SDP!", jsep);
                                    let publish = {request: "configure", muted: false};
                                    mixertest.send({message: publish, jsep: jsep});

                                    if (ringToneAudio) {
                                        ringToneAudio.pause();
                                        startCallTimer();

                                    }
                                    isInACall = true;
                                },
                                error       : error => {
                                    Janus.error("WebRTC error:", error);
                                    alert('WebRTC error')
                                }
                            });

                        }
                    }
                }
            }
            if(jsep) {
                Janus.log("Handling SDP as well...", jsep);
                mixertest.handleRemoteJsep({ jsep: jsep });
            }
        },
        onlocalstream : stream => {
            Janus.debug(" ::: Got a local stream :::", stream);
        },
        onremotestream: stream => {
            console.log('XXXXX-Adding audio')
            $('#mixedaudio').append('<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>');
            Janus.attachMediaStream($('#roomaudio').get(0), stream);

            mixertest.send({message: {request: "configure", muted: false}});
        },
        oncleanup     : () => {
            if(isInACall){
                console.log('onclin up ',isInACall)
                stopTimmer();
                console.log(6666)
            }


            isInACall = false;
            webrtcUp = false;
            Janus.log(" ::: Got a cleanup notification :::");

        },
    }

};

function setUpRoom() {

    roomJoiningTokens();
    LastRoomData = {
        request    : "create",
        room       : Math.floor(Date.now() / 1000),
        permanent  : false,
        description: "customer service room",
        secret     : UUID(),
        pin        : '214',
        is_private : false
    };
    MyRoomData = LastRoomData;
    mixertest.send({
        message: LastRoomData
    });
    console.log('DoneCrating Please Join')
}

function joinRoom(object) {

    object = object || LastRoomData; // to be safe

    mixertest.send({
        message: {
            request: "join",
            room   : object.room,
            group  : 'customer service group',
            pin    : object.pin,
            display: $('#WidgetChatyourName').val().trim(),
            codec  : 'opus',


        }
    });
    console.log('done joining eyyyy Please ')
}
