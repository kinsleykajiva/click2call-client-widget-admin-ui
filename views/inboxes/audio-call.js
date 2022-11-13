let attachAudioCallBack = () => {
    return  {
        plugin        : "janus.plugin.audiobridge",
        opaqueId,
        success       : pluginHandle => {
            mixertest = pluginHandle;
            PLUG_INS_IN_USE.voiceCall = true;
            Janus.log("Plugin attached! (" + mixertest.getPlugin() + ", id=" + mixertest.getId() + ")");
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
            $("#iconSVGCall").show();
            ringToneAudio.pause();
            $("#callingProgressBar").hide('fast');
            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
        },
        onmessage     : (msg, jsep) => {
            Janus.debug(" ::: Janus Got a message :::", msg);
            const event = msg["audiobridge"];
            console.log("::::event:::::" + event);
            Janus.debug("Event: " + event);
            if (event) {

                if(msg["leaving"]) {
                    console.log('XXXX::::::User has left the audio access call');
                    endCallCall(false);
                }

                if (event === "destroyed") {
                    Janus.warn("The room has been destroyed!");
                    alert('Room is ggone or destroyed')
                }
                if (event === "joined") {
                    if (msg["id"]) {
                        myid = msg["id"];
                        Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                        if (!webrtcUp) {
                            if (!isMakingOutGoingCall) {

                                ringToneAudio.pause();
                                let messageToSend = {
                                    method       : 'CALL_ACCEPTED',
                                    message      : null,
                                    room         : LastRoomData,
                                    withSocketChatRoom: userChatInViewObject.withSocketChatRoom,
                                    destinationId: userChatInViewId,
                                    admin        : loggedID,
                                    isAdmin      : true,
                                    session      : {id: loggedID, fullName: userFullName, companyId: (companyId), admin: loggedID},
                                }
                                console.log(messageToSend)
                                socket.emit( 'CALL_ACCEPTED',(messageToSend));
                                startCallTimer();
                                $(".incomoingCAllView").hide();
                                $("#btnEndCallPregress").show();
                                $('#btnDivRejectall').hide('slow');
                                $('#btnDivEndCallCall').show('slow');

                            }else{

                            }

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
                                },
                                error       : function (error) {
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
            Janus.log(" ::: Got a local stream :::", stream);
        },
        onremotestream: stream => {
            console.log('XXXXX-Adding audio')
            $('#mixedaudio').append('<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>');
            Janus.attachMediaStream($('#roomaudio').get(0), stream);

            mixertest.send({message: {request: "configure", muted: false}});
        },
        oncleanup     : () => {
            webrtcUp = false;
            showErrorMessage('Call has ended')
            Janus.log(" ::: Got a cleanup notification :::");

            $('#divCallingScreen').hide('slow');
            $('#btnAccpetCall').show('slow');

            $("#divCallingView").slideDown();
            $("#divVisualCall").slideUp();


            $(".incomoingCAllView").show();
            $("#btnEndCallPregress").hide();

            stopTimmer();
        },
    };
}
