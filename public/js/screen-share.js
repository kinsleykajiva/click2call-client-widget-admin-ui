let screentest = null;
let capture = null;
let role = null;
let passedSoket = null;
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
           // joinScreen();

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
            //    alert("Your screen sharing session just started: pass the <b>" + room + "</b> session identifier to those who want to attend.")
                console.log("Screeen sharing has start event is here::::::")

            } else {
                alert("Your screen sharing session just stopped.")
                janus.destroy();
              //  window.location.reload();
            }
        },
        onmessage: (msg, jsep) => {

            let list;
            let id;
            let f;
            console.log('::: Got a message (publisher) :::", msg',msg)
            Janus.log(" ::: Got a message (publisher) :::", msg);
            const event = msg["videoroom"];
            Janus.log("Event: " + event);
            if(event) {
                if(event === "joined") {
                    myid = msg["id"];
                  //  $('#session').html(room);
                  //  $('#title').html(escapeXmlTags(msg["description"]));
                    Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);


                    let messageToSend = {
                        method       : 'SCREEN_SHARE_INVITE',
                        session      : SESSION.customer,
                        message      : null,
                        room :{roomId: msg["room"],ownerId: msg["id"]} ,
                        destinationId: currntAgentId,

                    }
                    // ringToneAudio.play();
                    console.log(messageToSend);
                    if(passedSoket){
                        passedSoket.emit('SCREEN_SHARE_INVITE' ,messageToSend);
                    }


                    if(role === "publisher") {
                        // This is our session, publish our stream
                        Janus.log("Negotiating WebRTC stream for our screen (capture " + capture + ")");
                        // Safari expects a user gesture to share the screen: see issue #2455

                            // Other browsers should be fine, we try to call getDisplayMedia directly
                            screentest.createOffer(
                                {
                                    media: { video: capture, audioSend: true, videoRecv: false},	// Screen sharing Publishers are sendonly
                                    success: jsep => {
                                        Janus.debug("Got publisher SDP!", jsep);
                                        const publish = {request: "configure", audio: true, video: true,muted:true};
                                        screentest.send({ message: publish, jsep: jsep });
                                    },
                                    error: function(error) {
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
                                const display = list[f]["display"];
                                Janus.debug("  >> [" + id + "] " + display);
                                newRemoteFeed(id, display)
                            }
                        }
                    }
                } else if(event === "event") {
                    // Any feed to attach to?
                    if(role === "listener" && msg["publishers"]) {
                        list = msg["publishers"];
                        Janus.debug("Got a list of available publishers/feeds:", list);
                        for(f in list) {
                            id = list[f]["id"];
                            let display = list[f]["display"];
                            Janus.debug("  >> [" + id + "] " + display);
                            newRemoteFeed(id, display)
                        }
                    } else if(msg["leaving"]) {
                        // One of the publishers has gone away?
                        const leaving = msg["leaving"];
                        Janus.log("Publisher left: " + leaving);
                        if(role === "listener" && msg["leaving"] === source) {
                            alert("The screen sharing session is over, the publisher left")
                           // window.location.reload();
                            console.log("::: reload the page::::")

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
        },
        oncleanup: () => {
            Janus.log(" ::: Got a cleanup notification :::");
            $('#screencapture').empty();
            $("#screencapture").parent().unblock();
            $('#room').hide();
            stopTimmer();
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
            success: pluginHandle => {
                remoteFeed = pluginHandle;
                Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
                Janus.log("  -- This is a subscriber");
                // We wait for the plugin to send us an offer
                const listen = {
                    request: "join",
                    room   : room,
                    ptype  : "listener",
                    feed   : id
                };
                remoteFeed.send({ message: listen });
            },
            error: error => {
                Janus.error("  -- Error attaching plugin...", error);
               // bootbox.alert("Error attaching plugin... " + error);
            },
            onmessage: (msg, jsep) => {
                Janus.debug(" ::: Got a message (listener) :::", msg);
                const event = msg["videoroom"];
                Janus.debug("Event: " + event);
                if(event) {
                    if(event === "attached") {
                        // Subscriber created and attached
                        if(!spinner) {
                            const target = document.getElementById('#screencapture');
                            spinner = new Spinner({top:100}).spin(target);
                        } else {
                            spinner.spin();
                        }
                        Janus.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg["room"]);
                        $('#screenmenu').hide();
                        $('#room').removeClass('hide').show();
                    } else {
                        // What has just happened?
                    }
                }
                if(jsep) {
                    Janus.log("Handling SDP as well...", jsep);
                    // Answer and attach
                    remoteFeed.createAnswer(
                        {
                            jsep: jsep,
                            media: { audioSend: false, videoSend: false },	// We want recvonly audio/video
                            success: jsep => {
                                Janus.debug("Got SDP!", jsep);
                                var body = { request: "start", room: room };
                                remoteFeed.send({ message: body, jsep: jsep });
                            },
                            error: error => {
                                Janus.error("WebRTC error:", error);
                                bootbox.alert("WebRTC error... " + error.message);
                            }
                        });
                }
            },
            onlocalstream: stream => {
                // The subscriber stream is recvonly, we don't expect anything here
            },
            onremotestream: stream => {
                if($('#screenvideo').length === 0) {
                    // No remote video yet
                    $('#screencapture').append('<video class="rounded centered" id="waitingvideo" width="100%" height="100%" />');
                    $('#screencapture').append('<video class="rounded centered hide" id="screenvideo" width="100%" height="100%" playsinline/>');
                    $('#screenvideo').get(0).volume = 10;
                    // Show the video, hide the spinner and show the resolution when we get a playing event
                    $("#screenvideo").bind("playing", function () {
                        $('#waitingvideo').remove();
                        $('#screenvideo').removeClass('hide');
                        if(spinner)
                            spinner.stop();
                        spinner = null;
                    });
                }
                Janus.attachMediaStream($('#screenvideo').get(0), stream);
                $("#screenvideo").get(0).play();
                $("#screenvideo").get(0).volume = 1;
            },
            oncleanup: () => {
                Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
                $('#waitingvideo').remove();
                if(spinner)
                    spinner.stop();
                spinner = null;
            }
        });
}


function preShareScreen(Socket) {
    passedSoket = Socket;
    capture = "screen";
    if(navigator.mozGetUserMedia) {
        // Firefox needs a different constraint for screen and window sharing
       /* bootbox.dialog({
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
            }
        });*/
        capture = "screen";
        shareScreen();
    } else {
        shareScreen();
    }
}
function shareScreen() {
    // Create a new room
    const desc = "desciption";
    role = "publisher";
    let create = {
        request: "create",
        description: desc,
        bitrate: 500000,
        publishers: 1
    };
    screentest.send({ message: create, success: result => {
            const event = result["videoroom"];
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

function joinScreen() {
    // Join an existing screen sharing session

    room = parseInt("12352");
    role = "listener";
    myusername = 'name-11';
    var register = {
        request: "join",
        room: room,
        ptype: "publisher",
        display: myusername
    };
    screentest.send({ message: register });
}
