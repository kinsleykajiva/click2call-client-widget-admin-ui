/*!
 * JavaScript Library v1.12.1
 * KinsleyKajiva
 * Keep this file loaded locally or from a remote access point
 *
 *
 * Date: 2022-01-02T17:08Z
 */

(function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        if(document.getElementById("mixedaudio") )document.getElementById("mixedaudio").remove();
        if(document.getElementById("mixedaudio")) document.getElementById("mixedaudio").outerHTML = "";
        console.error("Mobile Access Will have issues")
      //  alert("Mobile Access Will have issues")
        //

       // throw new Error("Mobile Access Rejected .");
    }

    console.log("Widget has started making process")
    const thisScript = document.currentScript;
    console.log('src', thisScript.src.split('?access='))
    if (thisScript.src.split('?access=').length !== 2) {
        alert("Widget Access Rejected")
        throw new Error("Something went badly wrong!Please check the installation manual .");

    }
    const WIDGET_API_KEY = thisScript.src.split('?access=')[1];

    let BASE_URL ,SS_BASE_URL ,MESSAGE_BASE_URL;
    if(window.location.protocol === 'http:') {
        //localhost
        BASE_URL = 'http://localhost:8050';
        SS_BASE_URL = 'ws://localhost:3312' + '/'+WIDGET_API_KEY;
        MESSAGE_BASE_URL = 'http://localhost:3300';
        console.log("you are accessing us via "
            +  "an insecure protocol (HTTP). "
            + "Redirecting you to HTTPS.");


          //    window.location.href = window.location.href.replace( 'http:', 'https:');
    }else{
        BASE_URL = 'https://api-app.xxxclick2callxxxxx.com';
        SS_BASE_URL = 'wss://api-socket-chat.xxxclick2callxxxxx.com' + '/'+WIDGET_API_KEY;
        MESSAGE_BASE_URL = 'https://api-chat-messages.xxxclick2callxxxxx.com';

        console.log("you are accessing us via" + " our secure HTTPS protocol.");
    }




    let isInComingCall = false;


    let toStop = false;
    let socket;

    let lastConfig = {
        "id"                        : 12,
        "companyId"                 : 15,
        "nameShown"                 : "Cahtyy",
        "topBarMessage"             : "welcom",
        "backgroundHexColorCode"    : "#8C00FF",
        "linkedInUrl"               : null,
        "whatsAppUrl"               : null,
        "messengerUrl"              : null,
        "iconUrl"                   : null,
        "enableSocialMediaBarOption": 0

    }
    let isThereAgentOnline = false;

    function loadStyle(href, callback){
        // avoid duplicates
        for(let i = 0; i < document.styleSheets.length; i++){
            if(document.styleSheets[i].href == href){
                return;
            }
        }
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        if (callback) { link.onload = function() { callback() } }
        head.appendChild(link);
    }
    loadStyle('https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,cyrillic');
    loadStyle('https://zavoloklom.github.io/material-design-iconic-font/css/docs.md-iconic-font.min.css');
    if(window.location.protocol === 'http:') {
        //localhost
        loadStyle('public/js/chatwidget.css');
    }else{
        const HOST = 'https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/js/'
        loadStyle(HOST+'chatwidget.css');
    }


    function startRinging() {


        ringToneAudio.play();
        isInACall = true ;
        // ringToneAudio
        let messageToSend = {
            method       : 'RING_RING',
            session      : SESSION.customer,
            message      : null,
            room         : LastRoomData,
            destinationId: currntAgentId,
            config       : lastConfig
        }
        console.log(messageToSend)
        socket.emit('RING_RING',(messageToSend));
    }
    window.onbeforeunload = function() {
        let messageToSend = {
            method       : 'CLOSE_EXIT',
            destinationId: currntAgentId,
            session: SESSION.customer,

        }; // we will trigger ths event here because  we cant {SESSION} object in the on join event call back in the other audio bridge file
        console.log(messageToSend)
        socket.emit('CLOSE_EXIT',(messageToSend));// new incoming details of the call
        socket.onclose = function () {}; // disable onclose handler first
        socket.close();
    };
    const MAX_RECONNECTION_DELAY = 8000
    const MIN_RECONNECTION_DELAY = 1500
    const CONNECTING_TIMEOUT = 5000
    const RECONNECTION_DELAY_MULTIPLIER = 1.3
    let reconnectDelay = 0
    window. initReconnectDelay = () => {
        reconnectDelay = MIN_RECONNECTION_DELAY + Math.random() * MIN_RECONNECTION_DELAY
        console.debug('init reconnect delay:', reconnectDelay)
    }
    window. CACHE_CHAT_HTML_ARRYA = [];

    window. updateReconnectionDelay = () => {
        reconnectDelay *= RECONNECTION_DELAY_MULTIPLIER
        if (reconnectDelay > MAX_RECONNECTION_DELAY) {
            reconnectDelay = MAX_RECONNECTION_DELAY
        }
        console.debug('update reconnect delay:', reconnectDelay)
    }

    window.SocketConnect = () => {
        socket =  io(SS_BASE_URL /* +'/access'*/ ,{query: {domain:window.location.origin,isWidget: 1, key: WIDGET_API_KEY}}) //  new WebSocket(SS_BASE_URL + "/access?key=" + WIDGET_API_KEY);
        // socket =  io('localhost:3312');
        /* const connectingTimeout = setTimeout(() => {
         console.debug('connecting timeout:', CONNECTING_TIMEOUT)
         socket.close()
         }, CONNECTING_TIMEOUT)*/
        socket.on('message', function(event){
            console.log('Event-message:: ' ,event);



        });

        socket.on('CALL_ACCEPTED', function(eventData){
            console.log('Event-CALL_ACCEPTED:: ' ,eventData);

            $("#callTimer_75q85x73t5n2i09j875a64").text('00:00')
            joinRoom();
            ringToneAudio.pause();
            $('#txtCallStatus').text('InCall with Agent')
            $("#callingScreenIcon").removeClass('bounce');

            $("#prime3").show();

        });

        socket.on('SCREEN_SHARE_ACCEPTED', function(eventData){
            console.log('Event-SCREEN_SHARE_ACCEPTED:: ' ,eventData);
            ringToneAudio.pause();


        });

        socket.on('REMEMBER', function(eventData){
            // this will get the chats from 
            console.log('Event-REMEMBER:: ' ,eventData);
           


        });


        socket.on('SCREEN_SHARE_REJECTED', function(eventData){
            console.log('Event-SCREEN_SHARE_REJECTED:: ' ,eventData);


            alert('User Rejected Screen Share Invite')
            ringToneAudio.pause();



        });


        socket.on('ENDED_CALL', function(eventData){
            console.log('Event-ENDED_CALL:: ' ,eventData);

            ringToneAudio.pause();
         //   endTheCall(false);
            isInACall = false;
            stopTimmer();

            if (PLUG_INS === 'audio-call') {
                mixertest.send({message: {request: 'hangup'}});
            }
            if (PLUG_INS === 'screen-share') {
                screentest.send({message: {request: 'hangup'}});
            }

            $("#chat_fullscreen_75q85x73t5n2i09j875a64,#divTextMessage").show("slide",()=>{
                $("#btnAnswerCallInComingCall,#prime1,#prime3").show();
                $("#btnEndCallOrRejectCall").hide();
                $("#callingScreenIcon").removeClass('bounce');
                $("#callingFormScreen_75q85x73t5n2i09j875a64").hide('slide');
            });
            endCallToPlugIns();


        });

        socket.on('MESSAGE', function(eventData){
            console.log('Event-MESSAGE:: ' ,eventData);
            if(eventData.ticket){
                ticketObj =  eventData.ticket ;
            }

            if(eventData.payload.user.messages){
                let mssArr = eventData.payload.user.messages.filter(x=>x.userId ===  eventData.payload.user.userId );

                console.log("mssArr", mssArr);

                let mssg = mssArr [mssArr.length - 1];

                console.log("mssg", mssg);
                let row = remoteCustmerSupport(mssg.message);
                if(currntAgentId !== 0 && mssg.destinationId){
                    console.log( '+++',currntAgentId , mssg.destinationId )
                    if(currntAgentId !== mssg.destinationId){
                         row = remoteCustmerSupport(mssg.message);
                    }else{
                         row = userTextHtml(mssg.message);
                    }
                    /*$("#chat_fullscreen_75q85x73t5n2i09j875a64").append(row);
                    $("#chat_fullscreen_75q85x73t5n2i09j875a64").scrollTop($("#chat_fullscreen_75q85x73t5n2i09j875a64")[0].scrollHeight);*/
                }
                $("#chat_fullscreen_75q85x73t5n2i09j875a64").append(row);
                WAS_IN_VALID_SESSION = true;
                // Cookies.set('CACHE_CHAT_HTML_ARRYA', JSON.stringify( CACHE_CHAT_HTML_ARRYA ), { sameSite: 'strict' ,expires: 3});

                let messageToSend = {
                    method       : 'MESSAGE',
                    session      : SESSION.customer,
                    ticket      : ticketObj,
                    message      : null,
                    destinationId: currntAgentId,
                    config       : lastConfig
                }
                Cookies.set('ticketObj', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: inExpiresInMinutes * 32});
                console.log("MESSAGE-AGENT_SESSION", messageToSend);
                Cookies.set('AGENT_SESSION', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: inExpiresInMinutes * 32});

            }




        });


        socket.on('RING_RING', function(eventData){
            console.log('Event-RING_RING:: ' ,eventData);


            // this is incoming call from the agent
            $("#prime1").removeClass('bounce').addClass('bounce');
            ringToneAudio.loop = true;
            ringToneAudio.play();
            isInComingCall = true ;
            isInACall = true;
            console.log('ringinginingnxxxxxxxxxx')
            // $('#divCallingView').slideDown('slow');
            // $('#txtTitleCallingWidget').text('Widget User ' + eventData.payload.user.fullName + ' is calling from widget of the site ...')
            LastRoomData = eventData.payload.user.room;
            // $("#prime1").show();

            /*$("#chat_fullscreen_75q85x73t5n2i09j875a64,#divTextMessage").hide("slide",()=>{
             $("#btnAnswerCallInComingCall,#prime1,#prime3").hide();
             $("#btnEndCallOrRejectCall").show();
             $("#callingScreenIcon").addClass('bounce');
             $("#callingFormScreen_75q85x73t5n2i09j875a64").show('slide');
             });*/


        });
        socket.on('ACCEPT', function(eventData){
            console.log('Event-ACCEPT:: ' ,eventData);


            // there is an agent that  is there now .
            currntAgentId = eventData.payload.user.destinationId;
            currntAgentId = parseInt(currntAgentId);
            const AgentName = eventData.payload.user.fullName;
            const AgentProfilePicture = eventData.payload.user.profilePicture || 'https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png';
            ticketObj = eventData.payload.user.ticket;
            onACCEPTEvent(AgentName);

            Cookies.set('AGENT', AgentName, { sameSite: 'strict' ,expires: 3});
            Cookies.set('AGENT_PROFILE_PICTURE', AgentProfilePicture, { sameSite: 'strict' ,expires: 3});
            Cookies.set('currntAgentId', currntAgentId, { sameSite: 'strict' ,expires: 3});
            // Cookies.set('AGENT_SESSION', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: 3});
            $('#chatSend_75q85x73t5n2i09j875a64').val('. . .');
            $('#fab_send_75q85x73t5n2i09j875a64').trigger('click');
    
            $('#agnetProfileer_75q85x73t5n2i09j875a64').attr("src",(Cookies.get('AGENT_PROFILE_PICTURE')) );


        });

        window. onACCEPTEvent= (AgentName)=>{
            $("#chatAgentText_75q85x73t5n2i09j875a64").text("Agent Online")
            $("#chat_head_75q85x73t5n2i09j875a64").show("slow").text(AgentName);

            $('#prime1').show();
            $('#prime3').show();
            $('#prime5').show();
        }

        socket.on('SUB', function(eventData){
            console.log('Event-SUB:: ' ,eventData);

            //filter data
            if (eventData.payload.currentUsersOnline) {
                eventData.payload.currentUsersOnline.forEach(user => {
                    console.log("TE1:::", SESSION.customer, user.id);
                    //console.log("TE@:::" , user.companyId, SESSION.customer.companyId);
                    if (SESSION.customer && SESSION.customer !== user.id && user.companyId === SESSION.customer.companyId) {
                        if (user.admin) { // this is user agent or admin
                            isThereAgentOnline = true;
                            console.log("notify that there is an agent online_75q85x73t5n2i09j875a64 but may have not accept to handle the widget yet !")

                        }
                    }
                });
            }
            if(Cookies){
                if(!Cookies.get('WidgetChatyourName')){
                    if (isThereAgentOnline) {
                        $("#chat_head_75q85x73t5n2i09j875a64").hide("slow")
                        $("#chatAgentText_75q85x73t5n2i09j875a64").text("Agents Available")
                    } else {
                        $("#chat_head_75q85x73t5n2i09j875a64").hide("slow")
                        $("#chatAgentText_75q85x73t5n2i09j875a64").text("No Agent available")
                    }
                }
            }else{
                if (isThereAgentOnline) {
                    $("#chat_head_75q85x73t5n2i09j875a64").hide("slow")
                    $("#chatAgentText_75q85x73t5n2i09j875a64").text("Agents Available")
                } else {
                    $("#chat_head_75q85x73t5n2i09j875a64").hide("slow")
                    $("#chatAgentText_75q85x73t5n2i09j875a64").text("No Agent available")
                }
            }


        });
        passedSoket = socket; // this was an evil that needs to be reviewed abit later
    }


    window.saveCustomerProfile = async (name, emailPhoneNumber,) => {
        const data = {name, emailPhoneNumber, companyId: lastConfig.companyId};
        const response = await fetch(MESSAGE_BASE_URL + '/users/widget/save-session-customer', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body   : JSON.stringify(data),
        });
        //   console.log(response)
        return response.json();
    };


    window.getWgetConfigsConfigs = async () => {
        try {
            await fetch(BASE_URL + "/auth/api/v1/widget/detail?integrity=" + WIDGET_API_KEY)
                .then(response => response.json())
                .then(data => {
                     //console.log('Success:', data);
                    if (!data.success) {
                        toStop = true;
                        $('.fabs_75q85x73t5n2i09j875a64').hide().remove();
                        $('#widget-attach').hide().remove();
                        alert("[Debug Mode: ]Widget Access Rejected")
                    } else if (data.data.isActive === 0) {
                        toStop = true;
                        $('.fabs_75q85x73t5n2i09j875a64').hide().remove();
                        $('#widget-attach').hide().remove();
                        alert("[Debug Mode: ]Widget Access Removed,Sorry Please check Subscriptions")
                    } else {
                        // build the UI
                        const config = data.data;
                        lastConfig = config;
                        lastConfig.apiKey = WIDGET_API_KEY;
                        $("#chatAgentText_75q85x73t5n2i09j875a64").text(config.topBarMessage)
                        if (isThereAgentOnline && currntAgentId === 0) {

                            $("#chat_head_75q85x73t5n2i09j875a64").text(config.nameShown)
                        }
                        const listClass = ['fab1_75q85x73t5n2i09j875a64', 'fab_75q85x73t5n2i09j875a64', 'chat_header_75q85x73t5n2i09j875a64', 'chat_msg_item_user_75q85x73t5n2i09j875a64','callingFormScreen_75q85x73t5n2i09j875a64' ];
                        listClass.forEach(element => {
                            const cols = document.getElementsByClassName(element);
                            for (let i = 0; i < cols.length; i++) {
                                cols[i].style.backgroundColor = config.backgroundHexColorCode;
                            }
                        })


                    }
                });
        } catch (err) {
            toStop = true;
            console.log("Loading Defaults")
            console.log("toStop:::" + toStop)
            console.error('Error:', err);
            $('.fabs_75q85x73t5n2i09j875a64').hide();
            alert("Widget Access Rejected")
            throw new Error("Something went badly wrong!Please check the installation manual .");
        } finally {
            if (!toStop) {
                setTimeout(getWgetConfigsConfigs, 5_000);
            }


        }

    }


    const htmlView = `
 <div  id="mixedaudio"></div>
  <div class="fabs_75q85x73t5n2i09j875a64">
  <span id="widget-key-set_75q85x73t5n2i09j875a64" style="display: none;"> </span>

  <div class="chat_75q85x73t5n2i09j875a64">
    <div class="chat_header_75q85x73t5n2i09j875a64">
      <div class="chat_option_75q85x73t5n2i09j875a64">
      <div class="header_img_75q85x73t5n2i09j875a64">
        <img style='visibility: hidden; ' id="agnetProfileer_75q85x73t5n2i09j875a64" src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
        </div>
        <span style='display: none' id="chat_head_75q85x73t5n2i09j875a64"> * </span>  <span class="agent_75q85x73t5n2i09j875a64"> . </span>
        <br>
         <span class="online_75q85x73t5n2i09j875a64" id='chatAgentText_75q85x73t5n2i09j875a64' style='color:white'> (Get in touch with us)</span> 
       <span id="chat_fullscreen_loader_75q85x73t5n2i09j875a64" class="chat_fullscreen_loader_75q85x73t5n2i09j875a64"><i class="fullscreen_75q85x73t5n2i09j875a64 zmdi zmdi-window-maximize"></i></span>

      </div>

    </div>
    <div class="chat_body_75q85x73t5n2i09j875a64 chat_login_75q85x73t5n2i09j875a64">
    
        <p>We make it simple and seamless for businesses and people to talk to each other. Ask us anything</p>
        <a id="chat_first_screen_75q85x73t5n2i09j875a64" class="fab_75q85x73t5n2i09j875a64"><i class="zmdi zmdi-arrow-right"></i></a>
        <p>  </p>
    </div>
        
  <div style="background: #5DB88E 0% 0% no-repeat padding-box;border-radius: 34px; display: none;" id="callingFormScreen_75q85x73t5n2i09j875a64" class="callingFormScreen_75q85x73t5n2i09j875a64 chat_converse_75q85x73t5n2i09j875a64 chat_form_75q85x73t5n2i09j875a64">
    <span class=" chat_msg_item_admin_75q85x73t5n2i09j875a64">
      <center> <h5 style="color: white" id="txtCallStatus">Calling agent... </h5> </center>
    <div>
      <form class="" onsubmit="return false;">
        <a id="callingScreenIcon" style=" display: block; font-size:35px; width: 46px; height: 46px; border-radius: 50%;text-align: center; color: #f0f0f0; margin: 5px auto 0;
                cursor: pointer; -webkit-transition: all .1s ease-out; transition: all .1s ease-out; position: relative; z-index: 998; overflow: hidden; "
           class=""><i class="zmdi zmdi-phone"></i></a>

      </form>

    </div>
    <center> <h5 style="color: white"> <div style="display: none;" id="callTimer_75q85x73t5n2i09j875a64">00:00</div> </h5> </center>
   

     <a id="btnEndCallOrRejectCall" style="background: #FF0000 0% 0% no-repeat padding-box;" class="fab_75q85x73t5n2i09j875a64"><i
             class="zmdi zmdi-phone-end"></i></a>
     <a id="btnAnswerCallInComingCall" style="" class="fab_75q85x73t5n2i09j875a64"><i class="zmdi zmdi-phone"></i></a>

        
    </span>

  </div>
        
    <div id="chat_form_75q85x73t5n2i09j875a64" class="chat_converse_75q85x73t5n2i09j875a64 chat_form_75q85x73t5n2i09j875a64">

      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_admin_75q85x73t5n2i09j875a64">
        
        <center> <h5 style="margin: 10px 0 20px;"  >Tell us About you . </h5> </center>
        <div>
          <form class="message_form_75q85x73t5n2i09j875a64" onsubmit="return false;">
            <label id='txtWidgetNameRequired' style='display:none;color:red;'>Name Is Required</label>
            <input id="WidgetChatyourName" placeholder="Your Name" />
            <label id='txtWidgetContactRequired' style='display:none;color:red;'>Contact Is Required</label>
            <input id='WidgetChatyourContacts' placeholder="Email or Phone Number" />
           
          </form>

        </div>
        <a id="chat_fourth_screen" class="fab_75q85x73t5n2i09j875a64"><i class="zmdi zmdi-arrow-right"></i></a>
      </span>
      
    </div>



      <div id="chat_fullscreen_75q85x73t5n2i09j875a64" class="chat_conversion_75q85x73t5n2i09j875a64 chat_converse_75q85x73t5n2i09j875a64">
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_admin_75q85x73t5n2i09j875a64">
            <div class="chat_avatar_75q85x73t5n2i09j875a64">
               <img src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
            </div>Hey there! Any question?</span>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_user_75q85x73t5n2i09j875a64">
            Hello!</span>
            <div class="status_75q85x73t5n2i09j875a64">20m ago</div>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_admin_75q85x73t5n2i09j875a64">
            <div class="chat_avatar_75q85x73t5n2i09j875a64">
               <img src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
            </div>Hey! Would you like to talk sales, support, or anyone?</span>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_user_75q85x73t5n2i09j875a64">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_admin_75q85x73t5n2i09j875a64">
            <div class="chat_avatar_75q85x73t5n2i09j875a64">
               <img src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
             </div>Lor
              book.</span>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_user_75q85x73t5n2i09j875a64">
            Where can I get some?</span>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_admin_75q85x73t5n2i09j875a64">
            <div class="chat_avatar_75q85x73t5n2i09j875a64">
               <img src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
             </div>The standard chuck...</span>
      <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_user_75q85x73t5n2i09j875a64">
            There are many variations of passages of Lorem Ipsum available</span>
            <div class="status2_75q85x73t5n2i09j875a64">Just now, Not seen yet</div>
     
    </div>
    <div class="fab_field_75q85x73t5n2i09j875a64" style="display: none;" id="divTextMessage">
   
      <a id="fab_camera_75q85x73t5n2i09j875a64" class="fab_diffrent_75q85x73t5n2i09j875a64"><i class="zmdi zmdi-camera"></i></a>
      <a id="fab_send_75q85x73t5n2i09j875a64" class="fab_diffrent_75q85x73t5n2i09j875a64"><i class="zmdi zmdi-mail-send"></i></a>
      <textarea id="chatSend_75q85x73t5n2i09j875a64" name="chat_message_75q85x73t5n2i09j875a64" placeholder="Enter your message here" class="chat_field_75q85x73t5n2i09j875a64 chat_message_75q85x73t5n2i09j875a64"></textarea>
    </div>
  </div>
  

  
  <a id="prime5"  style="display: none"  class="fab1_75q85x73t5n2i09j875a64">
   
    <i class="prime5 zmdi zmdi-close-circle"></i> 
  </a>
  <a id="prime4" style="display: none"  class="fab1_75q85x73t5n2i09j875a64">
   
    <i class="prime4 zmdi zmdi-mic-off"></i>
  </a>
  
  <a id="prime3" style="display: none"  class="fab1_75q85x73t5n2i09j875a64">
   
    <i class="prime3 zmdi zmdi-square-right"></i>
  </a>

  <a id="prime2" style="display: none"class="fab1_75q85x73t5n2i09j875a64">
   
    <i class="prime2 zmdi zmdi-videocam"></i>
  </a>

  <a id="prime1" style="display: none"class="fab1_75q85x73t5n2i09j875a64">
   
    <i class="prime1 zmdi zmdi-phone"></i>
  </a>

    <a id="prime" class="fab_75q85x73t5n2i09j875a64">
     
      <i class="prime zmdi zmdi-comment-outline"></i>
    </a>
</div>
    
    `;

    window.inExpiresInMinutes = new Date(new Date().getTime() + 1 * 60 * 1000);

// // <img src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
    const remoteCustmerSupport = (txt,ignoreCache) => {
        ignoreCache = ignoreCache || false ;
        const ht = `
         <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_admin_75q85x73t5n2i09j875a64" style="margin-left: 10px;">
            <div style ="display: none;" class="chat_avatar_75q85x73t5n2i09j875a64">
               <img  src="https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png"/>
            </div> ${txt} </span>
        `;
        if(!ignoreCache){
            CACHE_CHAT_HTML_ARRYA.push({side:'remote'  ,html :ht}) ;
            let messageToSend = {
                method : 'SUB',
                session: SESSION.customer,
                config : lastConfig
            }

            Cookies.set('messageToSend', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: 3});
            Cookies.set('CACHE_CHAT_HTML_ARRYA', JSON.stringify( CACHE_CHAT_HTML_ARRYA ), { sameSite: 'strict' ,expires: 3});
        }


        return ht;
    }
    const userTextHtml = (txt,ignoreCache) => {
        ignoreCache = ignoreCache || false ;
        const ht =  `
         <span class="chat_msg_item_75q85x73t5n2i09j875a64 chat_msg_item_user_75q85x73t5n2i09j875a64"> ${txt}</span>
            <div class="status_75q85x73t5n2i09j875a64">--</div>
        `;
        if(!ignoreCache) {
            CACHE_CHAT_HTML_ARRYA.push({side: 'user', html: ht});
            let messageToSend = {
                method : 'SUB',
                session: SESSION.customer,
                config : lastConfig
            }

            Cookies.set('messageToSend', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: 3});
            Cookies.set('CACHE_CHAT_HTML_ARRYA', JSON.stringify( CACHE_CHAT_HTML_ARRYA ), { sameSite: 'strict' ,expires: 3});
        }
        return ht;
    }

    let canShowCallingIcons = false;
    window. WAS_IN_VALID_SESSION = false;


    let div = document.createElement("div");
    div.setAttribute('id', 'widget-attach');
    document.body.prepend(div);
    const EVENT_CHAT_MESSAGE = 'chat_75q85x73t5n2i09j875a64 message';
    document.getElementById('widget-attach').innerHTML = htmlView;

    document.getElementById('widget-key-set_75q85x73t5n2i09j875a64').innerText=WIDGET_API_KEY ;
    window.runCache=()=>{

    }
    function loadOtherScripts(){
        let  srcsArr= [];
        if(window.location.protocol === 'http:') {
            //localhost
            srcsArr = [
                'public/js/socket.io.js',
                'https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.0/adapter.min.js' ,
                'https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js',
                'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js',
                'public/js/janus.js',
                'public/js/audio-call.js',
                'public/js/screen-share.js',
                'public/js/audio-bridge.js'
            ];
        }else{

            // 'https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/js/widgetsrc-v-1.0.0.js?access=90eb53b2-5158-46e7-ab53-b2515856e779'
            const HOST = 'https://remotelocation.bucket.s3.af-south-1.amazonaws.com/assets/js/'
            srcsArr = [
                'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js',
                'https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.0/adapter.min.js' ,
                'https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js',
                'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js',
                HOST+'janus.js',
                HOST+'audio-call.js',
                HOST+'screen-share.js',
                HOST+'audio-bridge.js'/*this is the web app for now or the primary file to run janus*/,

                //  'public/js/web-app.js'
            ];

        }
        let srcEl ;
        srcsArr.forEach(src=>{
            srcEl = document.createElement("script");
            srcEl.src = src;
            srcEl.type = 'text/javascript';
            document.head.appendChild(srcEl);
        });
        console.log('Done Loading Scripts');
        if(srcEl){
            srcEl.addEventListener('load',()=>{
                console.log('Done Loading Scripts finally');
                setTimeout(() => {/*this is to give it a bi of time for the DOM to load*/

                    SocketConnect();
                    console.log('222::Done Loading Scripts finally');

                    if (Cookies.get('WidgetChatyourName')) {
                     $('#prime').trigger('click');
                     console.log('we are keeping the window open since the user is logged in');
                     }


                }, 2_000);



            });
        }



        /*setTimeout(() => {
         if(Cookies && Cookies.get('WidgetChatyourName')) {
         $('#prime').trigger('click');
         }
         }, 2_000);*/


    }
    function endTheCall(shouldNotify) {
        shouldNotify = shouldNotify === null  || shouldNotify === undefined ? false : shouldNotify;
        isInACall = false;
        stopTimmer();
        $("#prime3").show('slow');

        if (PLUG_INS === 'audio-call') {
            mixertest.send({message: {request: 'hangup'}});
        }
        if (PLUG_INS === 'screen-share') {
            screentest.send({message: {request: 'hangup'}});
        }

        if (shouldNotify) {

            let messageToSend = {
                method       : 'ENDED_CALL',
                session      : SESSION.customer,
                ticket       : ticketObj,
                message      : null,
                destinationId: currntAgentId,
                config       : lastConfig
            }

            console.log('ENDED_CALL',messageToSend);

            socket.emit('ENDED_CALL',messageToSend);
        }


    }
    const script = document.createElement("script");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    script.type = 'text/javascript';
    script.addEventListener('load', () => {
        console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);



        function hideChat(hide) {
            switch (hide) {
                case 0:
                    $('#chat_converse_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_body_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_form_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_login_75q85x73t5n2i09j875a64').css('display', 'block');
                    $('.chat_fullscreen_loader_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_fullscreen_75q85x73t5n2i09j875a64').css('display', 'none');
                    break;
                case 1:
                    $('#chat_converse_75q85x73t5n2i09j875a64').css('display', 'block');
                    $('#chat_body_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_form_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_login_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_fullscreen_loader_75q85x73t5n2i09j875a64').css('display', 'block');
                    break;
                case 2:
                    $('#chat_converse_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_body_75q85x73t5n2i09j875a64').css('display', 'block');
                    $('#chat_form_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_login_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_fullscreen_loader_75q85x73t5n2i09j875a64').css('display', 'block');
                    break;
                case 3:
                    $('#chat_converse_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_body_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_form_75q85x73t5n2i09j875a64').css('display', 'block');
                    $('.chat_login_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_fullscreen_loader_75q85x73t5n2i09j875a64').css('display', 'block');
                    break;
                case 4:
                    $('#chat_converse_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_body_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('#chat_form_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_login_75q85x73t5n2i09j875a64').css('display', 'none');
                    $('.chat_fullscreen_loader_75q85x73t5n2i09j875a64').css('display', 'block');
                    $('#chat_fullscreen_75q85x73t5n2i09j875a64').css('display', 'block');
                    break;
            }
        }

// WIDGET_API_KEY
        hideChat(0);

        $('#prime').click(function () {

            toggleFab();
            if (Cookies.get('WidgetChatyourName') && Cookies.get('ticketObj')  ) {
                $('#prime1,#prime3').show();


                $("#chat_fullscreen_75q85x73t5n2i09j875a64").html('');
                $('#WidgetChatyourName').val(Cookies.get('WidgetChatyourName'))
                $('#WidgetChatyourContacts').val(Cookies.get('WidgetChatyourContacts'));
                if (Cookies.get('AGENT')) {
                    console.log(Cookies.get('AGENT'))
                    console.log(34, JSON.parse(Cookies.get('AGENT_SESSION')))
                    currntAgentId = Cookies.get('currntAgentId');
                    currntAgentId = parseInt(currntAgentId);
                    $('#chat_head_75q85x73t5n2i09j875a64').text(Cookies.get('AGENT'));
                    $('#agnetProfileer_75q85x73t5n2i09j875a64').attr("src",(Cookies.get('AGENT_PROFILE_PICTURE')) );
                    
                    $("#chatAgentText_75q85x73t5n2i09j875a64").text("Agent Online");
                    ticketObj =JSON.parse (Cookies.get('ticketObj'));
                    let session = JSON.parse(Cookies.get('AGENT_SESSION'));
                    if (session) {
                        SESSION.customer = session.session
                    }
                    onACCEPTEvent(Cookies.get('AGENT'));

                }

                // $('#chat_fourth_screen').trigger('click');
              //  const messageToSend = JSON.parse(Cookies.get('messageToSend'));

                $('#prime1').toggle();
                $('#prime2').hide();
                $('#prime3').hide();

                $('#chat_head_75q85x73t5n2i09j875a64').toggle();
                $('#agnetProfileer_75q85x73t5n2i09j875a64').css('visibility', 'visible')
                $('#divTextMessage').toggle();
                hideChat(4);
                // get the previos chat from the cache
                const past = JSON.parse(Cookies.get('CACHE_CHAT_HTML_ARRYA'));


                $('#prime1').show();
                $('#prime3').show();
                $('#prime5').show();


                past.forEach(row => {
                    $("#chat_fullscreen_75q85x73t5n2i09j875a64").append((row.html));
                    /* if(row.side === 'remote'){
                     $("#chat_fullscreen_75q85x73t5n2i09j875a64").append( remoteCustmerSupport (row.html,true ));
                     }else{
                     $("#chat_fullscreen_75q85x73t5n2i09j875a64").append( userTextHtml (row.html,true ));
                     }*/

                });
                if(!SESSION.customer){
                    console.log('no session',SESSION.customer)
                    alert("Please wait for the agent to connect you,invalid data");
                }
                let messageToSend = {
                    method : 'SUB',
                    remembering : true,
                    session: SESSION.customer,
                    withSocketChatRoom:SESSION.customer.withSocketChatRoom  ,
                    WIDGET_API_KEY,
                    config : lastConfig
                }
                socket.emit('SUB', messageToSend);
                CACHE_CHAT_HTML_ARRYA = past;


            }
        });
        $('#prime3').click(function () {
            initVideoCallfunctions();/// this is or screen share
            if(triesDone === 0){
                alert('Please do not close this tab or reload the tab ,You will loose the session !')
            }

            try {
                preShareScreen(socket);
                triesDone = 0;
            }catch (e) {
                triesDone ++;
                // there is an unknown error that requires a bit more time to understand thw cuase
                console.error(e);
                //if(triesDone < 5){
                setTimeout(function () {

                    $('#prime3').trigger('click');
                }, 2_000);
                // }

                //  preShareScreen(socket);// we are calling function to since it takes to reload the plugin on the fly
            }


        });
        let triesDone = 0;
        // document.querySelector('.chat').matches('.is-visible');
//Toggle chat and links
        function toggleFab() {
            $('.prime').toggleClass('zmdi-comment-outline');
            $('.prime').toggleClass('zmdi-comment-alt');
            $('.prime').toggleClass('is-active');
            $('.prime').toggleClass('is-visible');
            $('#prime').toggleClass('is-float');
            $('.chat_75q85x73t5n2i09j875a64').toggleClass('is-visible');
            $('.fab_75q85x73t5n2i09j875a64').toggleClass('is-visible');
            $('.fab_diffrent_75q85x73t5n2i09j875a64').toggleClass('is-visible');
            if(document.querySelector('.chat_75q85x73t5n2i09j875a64').matches('.is-visible')){
                $('#prime5').show();// to alow the user to close the chat_75q85x73t5n2i09j875a64
            }else{
                $('#prime5').hide();// to alow the user to close the chat
            }
            if(  !Cookies.get('WidgetChatyourName')){
                console.log("66666666iii")
                hideChat(3);
            }
            

            if (!$('.chat_75q85x73t5n2i09j875a64').hasClass("is-visible") && $('.prime1').is(":visible")) {
                // $('#prime2').toggle();
                console.log('&&&&&&')
                $('#prime1').toggle();

                $('#divTextMessage').toggle();
            }

            if ($('.chat_75q85x73t5n2i09j875a64').hasClass("is-visible") && canShowCallingIcons) {
                // $('#prime2').toggle();
                console.log('yyyyyy')
                //$('#prime1').toggle();
               // $('#divTextMessage').toggle();
            }


        }


        let txtWidgetNameRequired = $('#txtWidgetNameRequired');
        let txtWidgetContactRequired = $('#txtWidgetContactRequired');

        $("#btnEndCallOrRejectCall").click(()=>{
            didIEndCall = true ;
            stopTimmer();

            $("#chat_fullscreen_75q85x73t5n2i09j875a64,#divTextMessage").show("slide",()=>{
                $("#btnAnswerCallInComingCall,#prime1,#prime3").show();
                $("#btnEndCallOrRejectCall").hide();
                $("#callingScreenIcon").removeClass('bounce');
                $("#callingFormScreen_75q85x73t5n2i09j875a64").hide('slide');
            });
            console.log(3445)
            console.log(67,isInACall)
           // if(isInACall){
                endTheCall(true);
         //   }

            endCallToPlugIns();
        });
        $("#btnAnswerCallInComingCall").click(()=>{
            joinRoom(LastRoomData);// new incoming details of the call

            let messageToSend = {
                method       : 'CALL_ACCEPTED',
                message      : null,
                room         : null,
                destinationId: currntAgentId,

                session: SESSION.customer,

            }; // we will trigger ths event here because  we cant {SESSION} object in the on join event call back in the other audio bridge file
            console.log(messageToSend)
            socket.emit('CALL_ACCEPTED',(messageToSend));// new incoming details of the call


            $("#btnAnswerCallInComingCall,#prime1").hide();
            $("#btnEndCallOrRejectCall").show();
            $("#callingScreenIcon").removeClass('bounce');

        });


        $('#prime1').click(e => {
            if (!isInACall) {

                //   $('#prime1').attr('disabled', true);
                $('#chatSend_75q85x73t5n2i09j875a64').val('Calling Agent');
                $('#fab_send_75q85x73t5n2i09j875a64').trigger('click');
                initAudioCallfunctions();
                startRinging();
                $("#prime3").hide('slow');
                //  $("#chat_form_75q85x73t5n2i09j875a64").hide();
                $("#chat_fullscreen_75q85x73t5n2i09j875a64,#divTextMessage").hide("slide",()=>{
                    $("#btnAnswerCallInComingCall,#prime1").hide();
                    $("#btnEndCallOrRejectCall").show();
                    $("#callingScreenIcon").addClass('bounce');
                    $("#callingFormScreen_75q85x73t5n2i09j875a64").show('slide');
                });
                $('#txtCallStatus').text('Calling agent... ')


            } else {
                if (isInComingCall) {
                    // click to answer
                    joinRoom(LastRoomData);// new incoming details of the call

                    let messageToSend = {
                        method       : 'CALL_ACCEPTED',
                        message      : null,
                        room         : null,
                        destinationId: currntAgentId,

                        session: SESSION.customer,

                    }; // we will trigger ths event here because  we cant {SESSION} object in the on join event call back in the other audio bridge file
                    console.log(messageToSend)
                    socket.emit('CALL_ACCEPTED',(messageToSend));// new incoming details of the call

                }

            }


        })

        $('#fab_send_75q85x73t5n2i09j875a64').click(function (e) {
            lastConfig.codeSnippets = null;
            // alert('sting working on it - sending')
            let inputMessage = $('#chatSend_75q85x73t5n2i09j875a64').val().trim();
            let messageToSend = {
                method       : 'MESSAGE',
                session      : SESSION.customer,
                ticket      : ticketObj,
                message      : inputMessage,
                destinationId: parseInt(currntAgentId),
                config       : lastConfig
            }

            // Cookies.set('AGENT_SESSION', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: inExpiresInMinutes});
            console.log(messageToSend)
            //socket.send(JSON.stringify(messageToSend));
            socket.emit('MESSAGE',(messageToSend));
            if(inputMessage !== '. . .'){
                $("#chat_fullscreen_75q85x73t5n2i09j875a64").append(userTextHtml(inputMessage))
            }

            $('#chatSend_75q85x73t5n2i09j875a64').val('');
        });

        $('#chatSend_75q85x73t5n2i09j875a64').keypress(function(event){
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $('#fab_send_75q85x73t5n2i09j875a64').trigger('click')
            }
        });
        /* $('#chatSend_75q85x73t5n2i09j875a64').keyCode(e=>{
         if(e.keyCode === 13){
         $('#fab_send_75q85x73t5n2i09j875a64').trigger('click')
         }
         })*/


        $('#prime5').click(function (e) {

            let messageToSend = {
                method       : 'MESSAGE',
                exiting       : 'VOLUNTARY_EXIT_CHAT',
                session      : SESSION.customer,
                ticket       : ticketObj,
                message      : "GoodBye, Client Left",
                destinationId: currntAgentId,
                config       : lastConfig
            }

            console.log('MESSAGE',messageToSend);
            if(SESSION.customer){
                socket.emit('MESSAGE',messageToSend);
            }


            Cookies.remove('AGENT_SESSION')
            Cookies.remove('messageToSend')
            Cookies.remove('CACHE_CHAT_HTML_ARRYA')
            Cookies.remove('WidgetChatyourName')
            Cookies.remove('WidgetChatyourContacts')
            Cookies.remove('currntAgentId')
            Cookies.remove('AGENT')
            Cookies.remove('ticketObj')
            //toggleFab();
            hideChat(0);// order is important
            hideChat(3);//order is important
            $('#prime1').hide();
            $('#prime5').hide();

            //$('#prime5').trigger('click');
           //  alert("Chat Session  Closed");
            $("#chat_fullscreen_75q85x73t5n2i09j875a64").html(' ');
            $("#prime1,#prime2,#prime3,#prime4,#prime5").hide();
            $('#divTextMessage').hide();
           // hideChat(3);

            SESSION.customer = null;

        });
        let isMuted=false;
        $('#prime4').click(function (e) {
            if(isMuted){
                $("#prime4").html('<i class="prime4 zmdi zmdi-mic"></i>')
            }else{
                $("#prime4").html('<i class="prime4 zmdi zmdi-mic-off"></i>')
            }
            muteCurrentPluginInView(isMuted);
            isMuted = !isMuted;
        });

        $('#prime2').click(function (e) {
            alert('sting working on it')
        });
        $('#chat_first_screen_75q85x73t5n2i09j875a64').click(function (e) {
            hideChat(3);

        });

        $('#chat_second_screen').click(function (e) {
            hideChat(2);
        });

        $('#chat_third_screen').click(function (e) {
            hideChat(3);

        });

        $('#chat_fourth_screen').click(async function (e) {
            let WidgetChatyourName = $('#WidgetChatyourName').val();
            let WidgetChatyourContacts = $('#WidgetChatyourContacts').val();

            if (WidgetChatyourName === '') {
                txtWidgetNameRequired.show();

                return;
            }
            if (WidgetChatyourContacts === '') {

                txtWidgetContactRequired.show();
                return;
            }
            txtWidgetNameRequired.hide();
            txtWidgetContactRequired.hide();


            canShowCallingIcons = true;
            try {
                txtWidgetNameRequired.show().html("Saving.... ");
                let result = await saveCustomerProfile(WidgetChatyourName, WidgetChatyourContacts);
                console.log('saveCustomer::', result)
                SESSION.customer = result.data.customer;
                if (!result.success) {
                    txtWidgetNameRequired.show().html("Failed to save ");
                    return;
                }
                txtWidgetNameRequired.hide().html("Name is required ");
                Cookies.set('WidgetChatyourName', WidgetChatyourName, { sameSite: 'strict' ,expires: 3 });
                Cookies.set('WidgetChatyourContacts', WidgetChatyourContacts, { sameSite: 'strict' ,expires: 3});


                $('#prime1').toggle();
                $('#prime2').hide();
                $('#prime3').toggle();
                $('#chat_head_75q85x73t5n2i09j875a64').toggle();
                $('#agnetProfileer_75q85x73t5n2i09j875a64').css('visibility', 'visible')
                $('#divTextMessage').toggle();
                hideChat(4);
                $("#chat_fullscreen_75q85x73t5n2i09j875a64")
                    .html(remoteCustmerSupport("Hey there,   " + SESSION.customer.fullName + " .How can we help ?"));
                // this will iniate the chat
                SESSION.customer.withSocketChatRoom = Date.now() + '___'+WIDGET_API_KEY ;

                let messageToSend = {
                    method : 'SUB',
                    session: SESSION.customer,
                    remembering : false,
                    withSocketChatRoom:SESSION.customer.withSocketChatRoom  ,
                    WIDGET_API_KEY,
                    config : lastConfig
                }
                console.log(messageToSend)
                Cookies.set('messageToSend', JSON.stringify( messageToSend ), { sameSite: 'strict' ,expires: 3});
                $('#prime1,#prime3 , #prime4').hide(); // we hide this as ot will appear when the chat has been accepted
                $('#prime5').show();
                socket.emit('SUB', messageToSend);
                //socket.send(JSON.stringify(messageToSend));



                if (!isThereAgentOnline) {
                    $("#chat_head_75q85x73t5n2i09j875a64").hide("slow")
                    $("#chatAgentText_75q85x73t5n2i09j875a64").text("No Agent available")
                }

                //   startJanusRoomSetups();
            } catch (e) {
                console.error(e)
                txtWidgetNameRequired.show().html("Failed to save ");

            }

        });

        $('#chat_fullscreen_loader_75q85x73t5n2i09j875a64').click(function (e) {
            $('.fullscreen_75q85x73t5n2i09j875a64').toggleClass('zmdi-window-maximize');
            $('.fullscreen_75q85x73t5n2i09j875a64').toggleClass('zmdi-window-restore');
            $('.chat_75q85x73t5n2i09j875a64').toggleClass('chat_fullscreen_75q85x73t5n2i09j875a64');
            $('.fab_75q85x73t5n2i09j875a64').toggleClass('is-hide_75q85x73t5n2i09j875a64');
            $('.header_img_75q85x73t5n2i09j875a64').toggleClass('change_img_75q85x73t5n2i09j875a64');
            $('.img_container').toggleClass('change_img_75q85x73t5n2i09j875a64');
            $('.chat_header_75q85x73t5n2i09j875a64').toggleClass('chat_header2_75q85x73t5n2i09j875a64');
            $('.fab_field_75q85x73t5n2i09j875a64').toggleClass('fab_field2_75q85x73t5n2i09j875a64');
            $('.chat_converse_75q85x73t5n2i09j875a64').toggleClass('chat_converse2_75q85x73t5n2i09j875a64');

        });

         getWgetConfigsConfigs();
        loadOtherScripts();


    });
    document.head.appendChild(script);

    window.addEventListener("beforeunload", function (e) {
       // $('#prime5').trigger('click')
        /* if(WAS_IN_VALID_SESSION){
         let confirmationMessage = 'Your Session will not lost,Save '
         ;

         (e || window.event).returnValue = confirmationMessage; //Gecko + IE
         return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
         console.log('confirmationMessage' , confirmationMessage)
         Cookies.set('CACHE_CHAT_HTML_ARRYA', JSON.stringify( CACHE_CHAT_HTML_ARRYA ), { sameSite: 'strict' ,expires: 3});
         }*/

    });
}());




