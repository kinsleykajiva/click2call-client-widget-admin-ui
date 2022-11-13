let screentest = null;
let capture = null;
let role = null;

let source = null;

let attachScreenShareCallBack = () => {

    return 	{
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: pluginHandle => {
            PLUG_INS_IN_USE.screenShare = true;
            screentest = pluginHandle;
            Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
            // Prepare the username registration
            console.log('Start joining room ',LastRoomData)
            if(LastRoomData.roomId){ // this test shows that thers is a room to join this  and its from a remote user
                // we will need to test if is agent side of the screen has  is the owner of the room
                joinScreen(LastRoomData.roomId);
            }


        },
        error: error => {
            Janus.error("  -- Error attaching plugin...", error);
           // bootbox.alert("Error attaching plugin... " + error);
        },
        consentDialog: on => {
            Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
            if(on) {
                // Darken screen
                $.blockUI({
                    message: '',
                    css: {
                        border: 'none',
                        padding: '15px',
                        backgroundColor: 'transparent',
                        color: '#aaa'
                    } });
            } else {
                // Restore screen
                $.unblockUI();
            }
        },
        iceState: state => {
            Janus.log("ICE state changed to " + state);
        },
        mediaState: (medium, on) => {
            Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
        },
        webrtcState: on => {
            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
            $("#screencapture").parent().unblock();
            if(on) {
                alert("Your screen sharing session just started: pass the <b>" + room + "</b> session identifier to those who want to attend.")

            } else {
                alert("Your screen sharing session just stopped.")
                janus.destroy();
                // window.location.reload();
            }
        },
        onmessage: (msg, jsep) => {
            let display;
            let id;
            let f;
            let list;
            Janus.log(" ::: Got a message (publisher) :::", msg);
            const event = msg["videoroom"];
            Janus.log("Event: " + event);
            console.log(event)
            if(event) {
                if(event === "joined") {
                    myid = msg["id"];
                    //  $('#session').html(room);
                    //  $('#title').html(escapeXmlTags(msg["description"]));
                    Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                    initiateRemoteScreenVideo();
                   /* let messageToSend = {
                        method       : 'SCREEN_SHARE_INVITE',
                        session      : SESSION.customer,
                        message      : null,
                        room :{roomId: msg["room"],ownerId:myid} ,
                        destinationId: currntAgentId,

                    }
                    console.log(messageToSend)
                    socket.send(JSON.stringify(messageToSend));*/

                    if(role === "publisher") {
                        // This is our session, publish our stream
                        Janus.log("Negotiating WebRTC stream for our screen (capture " + capture + ")");
                        // Safari expects a user gesture to share the screen: see issue #2455

                        // Other browsers should be fine, we try to call getDisplayMedia directly
                        screentest.createOffer(
                            {
                                media: { video: capture, audioSend: false, videoRecv: false},	// Screen sharing Publishers are sendonly
                                success: jsep => {
                                    Janus.debug("Got publisher SDP!", jsep);
                                    const publish = {request: "configure", audio: false, video: true, muted: false};
                                    screentest.send({ message: publish, jsep: jsep });
                                },
                                error: error => {
                                    Janus.log("WebRTC error:", error);
                                    // bootbox.alert("WebRTC error... " + error.message);
                                }
                            });

                    } else {
                        // We're just watching a session, any feed to attach to?
                        if(msg["publishers"]) {
                            list = msg["publishers"];
                            Janus.debug("Got a list of available publishers/feeds:", list);
                            for(f in list) {
                                id = list[f]["id"];
                                display = list[f]["display"];
                                Janus.debug("  >> [" + id + "] " + display);
                                newRemoteFeed(id, display)
                            }
                        }
                    }
                } else if(event === "event") {
                    // Any feed to attach to?
                    if(role === "listener" && msg["publishers"]) {
                        list = msg["publishers"];
                        Janus.log("Got a list of available publishers/feeds:", list);
                        for(f in list) {
                            id = list[f]["id"];
                            display = list[f]["display"];
                            Janus.debug("  >> [" + id + "] " + display);
                            newRemoteFeed(id, display)
                        }
                    } else if(msg["leaving"]) {
                        // One of the publishers has gone away?
                        const leaving = msg["leaving"];
                        Janus.log("Publisher left: " + leaving);
                        if(role === "listener" && msg["leaving"] === source) {
                            alert("The screen sharing session is over, the publisher left")
                          //  window.location.reload();
                            endCallCall(false);
                            console.log('XXXX::::::User has left the screenshare access call');

                        }
                    } else if(msg["error"]) {
                        console.log('Error:::' + msg["error"])

                    }
                }
            }
            if(jsep) {
                Janus.debug("Handling SDP as well...", jsep);
                screentest.handleRemoteJsep({ jsep: jsep });
            }
        },
        onlocalstream: stream => {
            Janus.debug(" ::: Got a local stream :::", stream);
            //   $('#screenmenu').hide();
            //  $('#room').removeClass('hide').show();
            if($('#screenvideo').length === 0) {
                $('#screencapture').append('<video class="rounded centered" id="screenvideo" width="100%" height="100%" autoplay playsinline muted="muted"/>');
            }
            Janus.attachMediaStream($('#screenvideo').get(0), stream);
            if(screentest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                screentest.webrtcStuff.pc.iceConnectionState !== "connected") {
                $("#screencapture").parent().block({
                    message: '<b>Publishing...</b>',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'white'
                    }
                });
            }
        },
        onremotestream: stream => {
            // The publisher stream is sendonly, we don't expect anything here
            console.log('Remote here')
        },
        oncleanup: () => {
            Janus.log(" ::: Got a cleanup notification :::");
            $('#screencapture').empty();
            $("#screencapture").parent().unblock();
            $('#room').hide();
        }
    };



}

function newRemoteFeed(id, display) {
    // A new feed has been published, create a new plugin handle and attach to it as a listener
    source = id;
    let remoteFeed = null;
    janus.attach(
        {
            plugin: "janus.plugin.videoroom",
            opaqueId: opaqueId,
            success: function(pluginHandle) {
                remoteFeed = pluginHandle;
                Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
                Janus.log("  -- This is a subscriber");
                // We wait for the plugin to send us an offer
                const listen = {
                    request: "join",
                    room   : LastRoomData.roomId,
                    ptype  : "subscriber",
                    feed   : id
                };
                remoteFeed.send({ message: listen });
                ringToneAudio.pause();
            },
            error: function(error) {
                Janus.error("  -- Error attaching plugin...", error);
              //  bootbox.alert("Error attaching plugin... " + error);
            },
            onmessage: function(msg, jsep) {
                Janus.debug(" ::: Got a message (listener) :::", msg);
                const event = msg["videoroom"];
                Janus.log("XXXXX-----Event: " + event);
                if(event) {
                    if(event === "attached") {
                        // Subscriber created and attached
                        /*if(!spinner) {
                            var target = document.getElementById('#screencapture');
                            spinner = new Spinner({top:100}).spin(target);
                        } else {
                            spinner.spin();
                        }*/
                        Janus.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg["room"]);
                      //  $('#screenmenu').hide();
                      //  $('#room').removeClass('hide').show();
                    } else {
                        // What has just happened?
                    }
                }
                if(jsep) {
                    Janus.debug("Handling SDP as well...", jsep);
                    // Answer and attach
                    remoteFeed.createAnswer(
                        {
                            jsep: jsep,
                            media: { audioSend: false, videoSend: false },	// We want recvonly audio/video
                            success: jsep => {
                                Janus.log("HHHHH-Got SDP!", jsep);
                                const body = {request: "start", room: LastRoomData.roomId};
                                remoteFeed.send({ message: body, jsep: jsep });
                            },
                            error: error => {
                                Janus.error("WebRTC error:", error);
                             //   bootbox.alert("WebRTC error... " + error.message);
                            }
                        });
                }
            },

            onlocalstream: stream => {
                // The subscriber stream is recvonly, we don't expect anything here
            },
            onremotestream: stream => {
                console.log('XXXXX-remote stream coming in ....')
                initiateRemoteScreenVideo();
                $("#remoteVideoStream").bind('playing',()=>{
                    console.log('start showing screen visualls ')

                    $("#remoteVideoStream").parent().unblock();
                })
                Janus.attachMediaStream($('#remoteVideoStream').get(0), stream);
                $("#remoteVideoStream").get(0) .load()
                let playPromise =    $("#remoteVideoStream").get(0).play();

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        $("#remoteVideoStream").get(0).volume = 1;
                    })
                        .catch(error => {
                            // Auto-play was prevented
                            // Show paused UI.
                            console.error('XXXXX-Error ....',error)
                        });
                }


               console.log('XXXXX-remote stream coming in ....')
            },
            oncleanup: () => {
                Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
                initiateRemoteScreenVideo();
            }
        });
}


function preShareScreen() {

    capture = "screen";
    if(navigator.mozGetUserMedia) {
        // Firefox needs a different constraint for screen and window sharing
        bootbox.dialog({
            title: "Share whole screen or a window?",
            message: "Firefox handles screensharing in a different way: are you going to share the whole screen, or would you rather pick a single window/application to share instead?",
            buttons: {
                screen: {
                    label: "Share screen",
                    className: "btn-primary",
                    callback: function() {
                        capture = "screen";
                        shareScreen();
                    }
                },
                window: {
                    label: "Pick a window",
                    className: "btn-success",
                    callback: function() {
                        capture = "window";
                        shareScreen();
                    }
                }
            },
            onEscape: function() {
                console.log("on Escape .")
                /* $('#desc').removeAttr('disabled', true);
                 $('#create').removeAttr('disabled', true).click(preShareScreen);
                 $('#roomid').removeAttr('disabled', true);
                 $('#join').removeAttr('disabled', true).click(joinScreen);*/
            }
        });
    } else {
        shareScreen();
    }
}
function shareScreen() {
    // Create a new room
    var desc = "desciption";
    role = "publisher";
    const create = {
        request    : "create",
        description: desc,
        bitrate    : 500000,
        publishers : 1
    };
    screentest.send({ message: create, success: result => {
            var event = result["videoroom"];
            Janus.log("Event: " + event);
            if(event) {
                // Our own screen sharing session has been created, join it
                room = result["room"];
                Janus.log("Screen sharing session created: " + room);
                myusername = "randomString(12)";
                const register = {
                    request: "join",
                    room   : room,
                    ptype  : "publisher",
                    display: myusername
                };
                screentest.send({ message: register });
            }
        }
    });
}

function acceptScreenShareAction() {

    PLUG_INS = 'screen-share';
    console.log('converting to screen')
    // janus.destroy();

    startJanusRoomSetups();
    initiateRemoteScreenVideo();
    //joinScreen(LastRoomData.roomId);
    // notify the  inviter that you have accpeted invite

    let messageToSend = {
        method       : 'SCREEN_SHARE_ACCEPTED',
        message      : null,
        room         : null,
        destinationId: userChatInViewId,
        admin        : loggedID,
        isAdmin      : true,
        session      : {id: loggedID, fullName: userFullName, companyId: (companyId), admin: loggedID},
    }
    console.log(messageToSend)
    socket.send(JSON.stringify(messageToSend));
    // re-init janus call backs


}

function rejectScreenShareAction() {
   /* initiateRemoteScreenVideo();
    joinScreen();*/
    // notify the  inviter that you have accepted invite

    let messageToSend = {
        method       : 'SCREEN_SHARE_REJECTED',
        message      : null,
        room         : null,
        destinationId: userChatInViewId,
        admin        : loggedID,
        isAdmin      : true,
        session      : {id: loggedID, fullName: userFullName, companyId: (companyId), admin: loggedID},
    }

    console.log(messageToSend)
    socket.send(JSON.stringify(messageToSend));
    $('#btnAcceptScreenShareTicket,#btnRejectScreenShareTicket').hide()
}

function joinScreen(targetSharedRoom) {
    $("#btnDivRejectall").show();
    // Join an existing screen sharing session
console.log('Join an existing screen sharing session')
    targetSharedRoom = parseInt(targetSharedRoom);
    role = "listener";
    myusername = 'name-11';
    const register = {
        request: "join",
        room   : targetSharedRoom,
        ptype: "publisher",
        display: 'my random name'
    };
    screentest.send({ message: register });
}
