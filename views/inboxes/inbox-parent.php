<style>
    .chat_active{
        background-color:#e9ecef;
        color:#495057;

        background-color: #b4ddd5;

        text-decoration: none;
        z-index: 1
    }

    .list-group-item-action:focus,
    .list-group-item-action:hover {
        background-color: #b4ddd5;
        color: #495057;
        text-decoration: none;
        z-index: 1
    }
</style>
<div class="row">
    <div class="col-md-2"><h1 class="h3 mb-3">Inbox </h1></div>
    <div class="col-md-9 text-center" id="statusMessage"> Reload to connect</div>
    <div class="col-md-1">
        <div class="mb-3">
            <button id="btnOnlineStatus" class="btn btn-success btn-sm"><i class="fas fa-check"></i> Online</button>
            <button id="btnErrorConnectionStatus" style="display: none;" class="btn btn-danger btn-sm"><i class="fas fa-times"></i> Connection Off</button>

        </div>
    </div>
    <span id="currentInChat" style="display: none"></span>
</div>


<div class="row" style="">

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="row g-0">
                    <div id="leftDivSection" class="col-12 col-lg-3 col-xl-3 border-end">
                        <div class="px-4 d-none d-md-block">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="mb-3">


                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="divParentSelctesViewTypes">
                            <div class="px-4 d-none d-md-block" id="divSelctesViewTypes">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <div class="mb-3">
                                            <select id='ChatType' onchange="showChatType()" class="form-select">
                                                <option value="1">Assigned to me</option>
                                                <option selected value="2">All pending</option>
                                                <option value="3">Resolved</option>
                                                <option value="4">Archived</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--  <div class="px-4 d-none d-md-block" style="background-color:#F5F5F5;">
                              <div class="d-flex align-items-center">
                                  <h4 style="margin-top:10px;" class="form-label">Live</h4>
                              </div>
                          </div>-->

                        <div class="accordion" id="accordionExample">


                            <div class="card-header" id="headingOne" style="background-color:#F5F5F5;">
                                <h3 class="card-title my-2">
                                    <a href="#" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                                       aria-controls="collapseOne">
                                        Live
                                    </a>
                                </h3>
                            </div>
                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                               <!-- <div class="px-4 d-none d-md-block">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <input type="text" class="form-control my-3" placeholder="Search...">
                                        </div>
                                    </div>
                                </div>-->

                                <div style="display: none" id="chatUsersRowsResolved"> No chat</div>
                                <div style="display: none" id="chatUsersRowsAssingedToMe"> No chat</div>
                                <div style="display: none" id="chatUsersRowsArchived"> No chat</div>
                                <div id="chatUsersRowsPending">
                                    <!-- <a href="#" class="list-group-item list-group-item-action border-0">
                                         <div class="badge bg-success float-end">5</div>
                                         <div class="d-flex align-items-start">
                                             <img src="img/avatars/avatar-5.jpg" class="rounded-circle me-1" alt="Vanessa Tucker" width="40" height="40">
                                             <div class="flex-grow-1 ms-3">
                                                 Vanessa Tucker
                                                 <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>
                                             </div>
                                         </div>
                                     </a>-->

                                    <hr class="d-block d-lg-none mt-1 mb-0">
                                </div>

                            </div>

                            <div class="card-header" id="headingTwo" style="background-color:#F5F5F5;">
                                <h3 class="card-title my-2">
                                    <a href="#" id="NoneLiveAccordion" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true"
                                       aria-controls="collapseTwo">
                                        Non-live
                                    </a>
                                </h3>
                            </div>

                            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div id="chatUsersRowsNoneLive">  </div>
                                <!--<div class="px-4 d-none d-md-block">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <input type="text" class="form-control my-3" placeholder="Search...">
                                        </div>
                                    </div>
                                </div>-->
                                <!-- <a href="#" class="list-group-item list-group-item-action border-0">
                                     <div class="badge bg-success float-end">5</div>
                                     <div class="d-flex align-items-start">
                                         <img src="img/avatars/avatar-5.jpg" class="rounded-circle me-1" alt="Fiona Green" width="40" height="40">
                                         <div class="flex-grow-1 ms-3">
                                             Fiona Green
                                             <div class="small"><span class="fas fa-circle chat-offline"></span> Offline</div>
                                         </div>
                                     </div>
                                 </a>
                                -->
                                <hr class="d-block d-lg-none mt-1 mb-0">
                            </div>


                        </div>
                        <div class=" text-center " id="divCallingScreen" style="display:none;">
                            <div class="row justify-content-center " id="divCallingView" style="padding-top:20px;">
                                <div class="col-12  col-md-4"></div>
                                <div class="col-12 col-md-4">
                                    <div class="pulse d-flex card-img-top img-fluid rounded-circle mb-2 bounce">

                                        <svg id="callGloePhoneIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round"
                                             stroke-linejoin="round" class="feather feather-phone-incoming align-middle me-2">
                                            <polyline points="16 2 16 8 22 8"></polyline>
                                            <line x1="23" y1="1" x2="16" y2="8"></line>
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">

                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <div class=" col-12 col-md-4"></div>
                            </div>
                            <div class="" id="divVisualCall" style="background-color:#292929;padding: 5px; display: none">

                                <img class="card-img-top img-fluid rounded-circle mb-2 remoteAudioStream" id="remoteAudioStream" style="width:30%;" width="108" height="108" src="img/avatars/Account-circle.svg"
                                     alt="Unsplash">
                                <video class="card-img-top remoteVideoStream" id="remoteVideoStream" style="display:none" playsinline>

                                </video>
                            </div>
                            <hr>
                            <h5 class="card-title mb-0" id="txtTitleCallingWidget">Calling Persons Name      </h5>
                            <hr>
                            <div style="display: none;" id="callTimer">00:00</div>

                            <!--                        <div class="text-muted mb-2">Lead Developer</div>-->

                            <hr>
                            <div class="row" style="margin-bottom:20px;">
                                <div  id="btnDivMaxScreenCall"  class="col-12 col-md-4 ">
                                    <button class="btn btn-primary btn-lg me-1 px-3" onclick="onMaximizeScreen()">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize-2 align-middle me-2">
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <polyline points="9 21 3 21 3 15"></polyline>
                                            <line x1="21" y1="3" x2="14" y2="10"></line>
                                            <line x1="3" y1="21" x2="10" y2="14"></line>
                                        </svg>

                                    </button>

                                </div>

                                <div id="btnDivAccptCall" class="col-12 col-md-4">
                                    <button id="btnAccpetCall" class="btn btn-success btn-lg me-1 px-3" onclick="acceptCall()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                             class="feather feather-phone-incoming align-middle me-2">
                                            <polyline points="16 2 16 8 22 8"></polyline>
                                            <line x1="23" y1="1" x2="16" y2="8"></line>
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">

                                            </path>
                                        </svg> Accept
                                    </button>
                                </div>
                                <div  id="btnDivOnMuteCall" style="display: none" class="col-12 col-md-4">
                                    <button class="btn btn-primary btn-lg me-1 px-3" onclick="onMuteScreen()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic-off align-middle me-2">
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6">

                                            </path>
                                            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                            <line x1="12" y1="19" x2="12" y2="23"></line>
                                            <line x1="8" y1="23" x2="16" y2="23"></line>
                                        </svg>
                                    </button>
                                </div>

                                <div  id="btnDivRejectall" style="display: none" class="col-12 col-md-4 ">
                                    <button class="btn btn-danger btn-lg me-1 px-3" onclick="rejectCall()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                             class="feather feather-phone-missed align-middle me-2">
                                            <line x1="23" y1="1" x2="17" y2="7"></line>
                                            <line x1="17" y1="1" x2="23" y2="7"></line>
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">

                                            </path>
                                        </svg> Reject
                                    </button>
                                </div>

                                <div  id="btnDivEndCallCall" style="display: none" class="col-12 col-md-4 ">
                                    <button class="btn btn-primary btn-lg me-1 px-3" onclick="endCallCall(true)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF3434"
                                             stroke="#FF3434" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                             class="feather feather-phone-off align-middle me-2">
                                            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91">

                                            </path>
                                            <line x1="23" y1="1" x2="1" y2="23"></line>

                                        </svg> End Call
                                    </button>
                                </div>


                            </div>


                        </div>

                    </div>
                    <div id="rightDivSection" class="col-12 col-lg-4 col-xl-6">
                        <div class="py-2 px-4 border-bottom d-none d-lg-block">
                            <div class="d-flex align-items-center py-1">
                                <div class="position-relative">
                                    <img src="img/avatars/icons8-user-32.png" class="rounded-circle me-1" alt="Sharon Lessman" width="20" height="20">
                                </div>
                                <div class="flex-grow-1 ps-3">
                                    <strong id="chat-Title"> -- </strong>
                                    <strong style="display: none;" id="chat-listenTo"> <a href="javascript:void(0)" onclick="yesJoinToListen()"> EvesDrop </a> </strong>
                                    <button style="display: none;" onclick="onRemoveChatFromView()" class="btn btn-secondary" id="btnCloseChat" type="button"> Close  </button>
<!--                                    <div class="text-muted small"><em>Typing...</em></div>-->
                                </div>
                                <!--<div class=" row">
                                    <div class="col-md-3"> <button class="btn btn-secondary" id="btnTicketNumber" type="button"> Ticket#9735 </button> </div>
                                    <div class="col-md-3">
                                        <select id="selectTicketStatus" class="form-select">
                                            <option selected >Open</option>
                                            <option>Resolve</option>
                                            <option>Merge</option>
                                        </select>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="input-group">

                                        </div>
                                    </div>



                                </div>-->

                                <div id="divTicketBar1111" style="" class="row">
                                    <div class="col-12 col-md-6">
                                        <button class="btn btn-secondary" id="btnTicketNumber" type="button"> Ticket#</button>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <select id="selectTicketStatus" onchange="ticketStatusChange()" class="form-select">
                                            <option value="1" selected>Open</option>
                                            <option value="2" >Resolve </option>
                                            <option value="3" >Merge</option>
                                        </select>
                                    </div>
                                </div>
                                <div style="">


                                    <button style="display: none" id="btnAcceptScreenShareTicket" onclick="acceptScreenShareAction()" class="btn btn-success btn-lg me-1 px-3">
                                        Accept Screen Share Invite
                                    </button>
                                    <button style="display: none" id="btnRejectScreenShareTicket" onclick="rejectScreenShareAction()" class="btn btn-success btn-lg me-1 px-3">
                                        Reject Screen Share Invite
                                    </button>
                                    <button style="display: none" id="btnAcceptTicket" onclick="acceptAction()" class="btn btn-success btn-lg me-1 px-3">
                                        Accept Ticket
                                    </button>


                                    <button onclick="makeACall()" id="btnAudioCall" disabled class="btn btn-primary btn-lg me-1 px-3">
                                        <div style="display: none" id="callingProgressBar" class="spinner-border text-success me-2" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <svg id="iconSVGCall" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                             stroke-linejoin="round"
                                             class="feather feather-phone feather-lg">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </button>

                                    <!-- <button style="display:none;"  id="btnVideoCall" disabled class="btn btn-info btn-lg me-1 px-3 d-none d-md-inline-block">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                              class="feather feather-video feather-lg">
                                             <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                             <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                         </svg>
                                     </button>-->

                                </div>
                            </div>
                        </div>

                        <div class="position-relative">
                            <div class="chat-messages p-4 chat-body" style="min-height:530px; max-height:600px;" id="conversationDiv">

                                <!-- <div class="chat-message-right pb-4">
                                     <div>
                                         <img src="img/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                                         <div class="text-muted small text-nowrap mt-2">2:33 am</div>
                                     </div>
                                     <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                                         <div class="font-weight-bold mb-1">You</div>
                                         Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.
                                     </div>
                                 </div>-->


                            </div>
                        </div>

                        <div style="display: none" id="chatDivInputBox" class="flex-grow-0 py-3 px-4 border-top">
                            <div class="input-group">
                                <input type="text" class="form-control" id="inputMessage" placeholder="Type your message">

                                <button onclick="sendMesssageAction()" id="btnSend" class="btn btn-primary">Send</button>
                            </div>
                        </div>

                    </div>

                    <div id="endrightDivSection" class="col-12 col-lg-3 col-xl-3">  <?php include 'inc.chat-profile.php'; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div  id="mixedaudio"></div>
    <button style="display: none;" class="btn btn-primary my-1" type="button" id="btnShowBottomView"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">UnSigned Chats</button>
    <?php  include 'inc.customers-unsigned.php'; ?>


