let $selectAll = $('#selectAllCheckBox');
let $table = $('.table'); // table selector

let $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body
let tdCheckboxChecked = 0; // checked checboxes


function getTickets() {


}

function actionDeleteConversations() {
    largeGlobalModalFunctionalFormPositiveCancel("Delete ?", "<h3> You want to delete the conversations , customers details as well ?  </h3>",
        'Yes Delete ', 'Cancel',
        async () => {
            let checkBoxesVals = getCheckedInputsGetValues('checkBoxSelections');

            loadingScreenElement('globalModalFunctionalForm', true, "Deleting....");
            let result = await axios.post(MESSAGE_CHAT_SERVICE_BASE_URL + '/api/v1/secured/delete-conversions', {ids: checkBoxesVals + ''});
            loadingScreenElement('globalModalFunctionalForm', false, "Deleting....");
            result = result.data;
            if (result.success) {
                showSuccessMessage("Deleted,Refreshing ");

                $("#globalModalFunctionalForm").modal({
                    backdrop: 'static',
                }).modal('hide');
                // let remove the rows
                $("#tbTixketsRow-" + checkBoxesVals).addClass('bg-danger').slideUp('slow').remove();
                checkBoxesVals.forEach(row => {
                    $("#tbTixketsRow-" + row).addClass('bg-danger').slideUp().remove();
                });
                tdCheckboxChecked = 0;
                $('.btnActions').hide();
                //

            } else {
                showErrorMessage('Failed to delete,something went wrong please try again');
            }
        },
        () => {
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        },
        null)


}

const chatUINoneLiveRow = (name, status, userId, counter) => {
    status = status || 'Offline';
    counter = counter || 0;
    let lastMsg = '';
    console.log('==', lastMessagemessagesMap.get(loggedID + 'to' + userId))
    if (lastMessagemessagesMap.get(loggedID + 'to' + userId)) {
        lastMsg = `<strong>  ${lastMessagemessagesMap.get(loggedID + 'to' + userId).content.substring(0, MAX_SIZE_CHAR_FOR_PREVIEW)} ...    </strong>`;
    }

    return `
     <a id="row-${userId}" onclick="loadChatOpenChat('${userId}')" href="#" class="list-group-item list-group-item-action border-0">
                                <div class="badge bg-success float-end" id="row_user_msg_counter_${userId}"> ${counter}  
                                    <div class="small"><span class="fas fa-circle chat-online"></span>  ${status} </div>
                                </div>
                                
                                <div class="d-flex align-items-start">
                                    <img src="img/avatars/icons8-user-32.png" class="rounded-circle me-1" alt="Vanessa Tucker" width="40" height="40">
                                    <div class="flex-grow-1 ms-3">  ${name} -  <small id="txtPreview-${userId}">${lastMsg}</small>      </div>
                                </div>
                            </a>
    <hr class="d-block d-lg-none mt-1 mb-0">
    `;
}
/**to be used for caching chats*/
let noneLiveChatMap = new Map();

async function openNoneLivechat(ticketId) {
    // get ticket details
    let resultData = await axios.get('/ticketing-service/api/v1/secured/ticket/ticket', {
        params: {ticketId}
    });
    resultData = resultData.data;
    // render to view the chat


    $('#chatUsersRowsNoneLive').html()
}
loadNoneLiveChatList();
function loadNoneLiveChatList(){

    let userId = 0 ;let lastMsg = '';



    axios.get('/ticketing-service/api/v1/secured/ticket/all').then(response => {
       // $("#loadingTableTickets").hide()
        if (response.data.success) {
            let dataArr = response.data.data.tickets;
            console.log(dataArr);
           //  renderTableTickets(dataArr)
// ${element.ticketData.chats.length > 0 ? element.ticketData.chats[0].customerFullName : 'element.id'}
            const getTickets  = [] ;
            dataArr.forEach(element=>{
                if(element.ticketData.chats.length > 0) {
                    LoadChatNoneLiveSideBar(element.id,element.ticketData.chats[0].customerFullName);
                }
            })
        } else {
            // failed to get the data to render
        }

    }).catch(error => {
        $("#loadingTableTickets").hide()
    });





}

function actionOpenTicketInChatView() {

    if (tdCheckboxChecked !== 1) {
        showErrorMessage('Please select only one ticket to view at a time ');
        return;
    }
    $("#btnShowBottomView").trigger('click');
    showSuccessMessage('Loading Ticket')
    showSuccessMessage('Loading Ticket')


    let checkBoxesVals = getCheckedInputsGetValues('checkBoxSelections');
    console.log('SELECTED - ID::::::::::', checkBoxesVals)
    LoadChatNoneLiveSideBar(checkBoxesVals+'')

}

MAP_TICKET_CONVERSIONS_NONE_LIVE = new Map();
async function LoadChatNoneLiveSideBar(ticketId) {

    const customerFullName = arguments[1] || null;

    loadingScreen(true, 'Loading ...');
    try {

        let ticketObjectData = await axios.get('/ticketing-service/api/v1/secured/ticket/ticket', {
            params: {ticketId}
        });
        ticketObjectData = ticketObjectData.data.data;
        console.log('ticketObjectData', ticketObjectData);
        if(!ticketObjectData){
            return;
        }
        ticketObjectData =ticketObjectData.tickets[0];

        MAP_TICKET_CONVERSIONS_NONE_LIVE.set(ticketId,ticketObjectData);// we use the id as an identifier to this object of chats


        let listingHtml = `
    
    <a href="#" id="noneChatListingRow-${ticketId}" onclick="LoadTicketChatData('${ticketId}' , '${customerFullName}')" class="list-group-item list-group-item-action border-0">
<!--         <div class="badge bg-success float-end">5</div>-->
         <div class="d-flex align-items-start">
             <img src="img/avatars/icons8-user-32.png" class="rounded-circle me-1" alt="Fiona Green" width="40" height="40">
             <div class="flex-grow-1 ms-3">
                 ${ ticketObjectData.customer ?  ticketObjectData.customer.fullName : customerFullName ? customerFullName : '--' } 
                 
             </div>
         </div>
     </a>
    `;

        $('#chatUsersRowsNoneLive').append(listingHtml)
        $('#collapseTwo').collapse({
            toggle: false
        }); // this will show the section
        loadingScreen(false, 'Loading ...');
    } catch (e) {
        console.error(e)
        loadingScreen(false, 'Loading ...');
    }
}
let NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW = {};
const getTicketData = async ticketId => {
    try{

    let ticketObjectData = await axios.get('/ticketing-service/api/v1/secured/ticket/ticket', {
        params: {ticketId}
    });
    ticketObjectData = ticketObjectData.data.data;
    ticketObjectData = ticketObjectData.tickets[0];
    console.log('ticketObjectData23', ticketObjectData);

    MAP_TICKET_CONVERSIONS_NONE_LIVE.set(ticketId, ticketObjectData);
    return ticketObjectData;

    }catch (e){
       console.error(e);
    }
    return null;
}
async function LoadTicketChatData(ticketId, n) {

    const fullName = arguments[1] || null;
    $("#conversationDiv").html('');


    try {
        ticketId = parseInt(ticketId);
        $("#btnAudioCall").hide();
        await getTicketData(ticketId);
        console.log('Map', MAP_TICKET_CONVERSIONS_NONE_LIVE.get(ticketId))
        $("#chat-Title").text(fullName ? fullName : MAP_TICKET_CONVERSIONS_NONE_LIVE.get(ticketId).customer.fullName)
        let row = '';

        MAP_TICKET_CONVERSIONS_NONE_LIVE.get(ticketId).chats.forEach(chat => {
            if (chat.isAgent) {
                row += rightChat({timeStamp: chat.dateCreated, message: chat.content,});
            } else {
                row += leftChat({timeStamp: chat.dateCreated, message: chat.content,});
            }

        });
        $("#conversationDiv").html(row);
        $("#chatDivInputBox").slideUp('slow');

        loadCustomerProfile({referenceId: MAP_TICKET_CONVERSIONS_NONE_LIVE.get(ticketId).customer.id})
        $("#btnSaveNoneLiveClientCustomerOption").show()
        $("#btnSaveClientCustomerOption").hide()
        NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW = MAP_TICKET_CONVERSIONS_NONE_LIVE.get(ticketId);
        console.log('NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW', NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW)
        if (NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.statusTitle === 'Open') {
            $('#divTicketBar1111').show();
        } else {
            $('#divTicketBar1111').hide();
        }

        if (NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer.isCustomer) {
            $('#btnSaveNoneLiveClientCustomerOption').hide();
        } else {
            $('#divTicketBar1111').show();
        }
        userChatInViewId = parseInt(NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer.id);

        $("#btnTicketNumber").text('Ticket#'+ NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.ticketId);
        $("#selectTicketStatus").val(NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.statusId);
        getTicketsInViewTags(NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.ticketId);


    } catch (e) {
        console.error(e)
    }

}


function actionSaveAsCustomer() {


}

function renderTypeChange() {
    let renderType = $("#renderType").val();

    getChatsConversations();
    $('.btnActions').hide();
}

function saveTicket() {


}


function actionCreateTicket() {
    const htmlV = `
  
       
        <div class="card-body">
          <form onsubmit="return false">
            <div class="mb-3">
              <label class="form-label">Subject/Title</label>
              <input type="text" id="inputTicketInput" class="form-control" placeholder="Subject or title of the ticket">
            </div>            
            
            <div class="mb-3">
              <label class="form-check m-0">
                
                <span class="form-check-label"> If you checked More than one then those will be bundled with same ticket number</span>
              </label>
            </div>
           
          </form>
        </div>
     
    
    `;
    largeGlobalModalFunctionalFormPositiveCancel('Convert to Ticket', htmlV, 'Save', 'Cancel',
        async () => {
            try {

                let title = $('#inputTicketInput').val();
                if (title === '') {
                    showSuccessMessage('Please put subject or title ')
                    return
                }
                loadingScreenElement('globalModalFunctionalForm', true, "Converting....");

                let checkBoxesVals = getCheckedInputsGetValues('checkBoxSelections');
                console.log(56, checkBoxesVals)


                let result = await axios.post(MESSAGE_CHAT_SERVICE_BASE_URL + '/api/v1/secured/conversations-to-tickets', {title: title, ids: checkBoxesVals + ''});
                result = result.data;
                console.log('result', result)
                loadingScreenElement('globalModalFunctionalForm', false, "Deleting....");

                $("#globalModalFunctionalForm").modal({
                    backdrop: 'static',
                }).modal('hide');
                getChatsConversations();
                tdCheckboxChecked = 0;
                $('.btnActions').hide();
                showSuccessMessage('tickets Created Successfully')

            } catch (e) {
                showErrorMessage('Failed to complete action please reload page')
            }

        },
        () => {
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
        },
        null);

}

let ARRAY_CONVERSIONS_REVIEW = [];

/***
 * This function does not need to be synchronous or async it should not stop events .Remeber this page will be rendering alot of data
 * */
function getChatsConversations() {
    $("#loadingTableTickets").show()
    showSuccessMessage("Refreshing data");
    let renderType = $("#renderType").val();
    console.log(55, renderType);

    switch (renderType) {
        case 'with-no-tickets':
            axios.get(MESSAGE_CHAT_SERVICE_BASE_URL + '/api/v1/secured/conversions', {
                params: {
                    userId       : loggedID,
                    companyId    : companyId,
                    isWithTickets: 0
                }
            }).then(response => {
                $("#loadingTableTickets").hide()
                if (response.data.success) {
                    let dataArr = response.data.data.chats;
                    ARRAY_CONVERSIONS_REVIEW = dataArr;
                    renderTableTickets(dataArr)
                } else {
                    // failed to get the data to render
                }

            }).catch(error => {
                $("#loadingTableTickets").hide()
            });
            break;
        case 'all':
            $("#loadingTableTickets").hide()
            break;
        case 'all-tickets':
            axios.get('/ticketing-service/api/v1/secured/ticket/all').then(response => {
                $("#loadingTableTickets").hide()
                if (response.data.success) {
                    let dataArr = response.data.data.tickets;
                    renderTableTickets(dataArr)
                } else {
                    // failed to get the data to render
                }

            }).catch(error => {
                $("#loadingTableTickets").hide()
            });
            break;
        case 'un-unified':
            $("#loadingTableTickets").hide()
            break;

    }


}

function ticketStatusChange() {
    let selectTicketStatus = $('#selectTicketStatus').val();

    if (selectTicketStatus === '3') {
        showMergeDialog()
    }
}

let tdCheckboxCheckedMergeTicket = 0;
let $selectAllCheckBoxMerge;

/*<tr id="tbTixketsRow-${element.id}">
 <td><input value="${element.id}" type="checkbox" className="checkBoxSelections" name="all" id="checkBox-${element.id}"></td>
 <td>#${element.id}</td>
 <td>${element.title}</td>
 <td>${element.statusTitle}</td>
 <td>${element.createdByUserDetails.fullName}</td>
 <td>${moment(convertToLocalTime(element.dateCreated), 'YYYY-MM-DD HH:mm:ss').fromNow()}</td>
 </tr>*/
async function showMergeDialog() {
    function renderMergeTickets(arr, clientCustomerName) {
        let row = ``;

        arr.forEach(element => {
            console.log(78,element)
            row += `
            
             <tr id="merge-ticket-${element.id}">
                   <td> <input type="checkbox" name="" value="${element.id}" class="selectAllCheckBoxMergeClass" id="selectAllCheckBoxMerge"></td>         
                   <td class="d-none d-md-table-cell">
                   
                   <h5>Ticket#${element.id}</h5> <br>
                  <strong> ${clientCustomerName} •</strong> ${moment(convertToLocalTime(element.dateCreated), 'YYYY-MM-DD HH:mm:ss').fromNow()}
                   <p class="text-muted">Message: ${  element.ticketData.chats.length> 0 ? element.ticketData.chats[0].content :'--'}  </p>
                   
                    </td> 
           </tr>
            `;
        })

        $("#tBody-MergeTickets").html(row);

        $selectAllCheckBoxMerge = $('#selectAllCheckBoxMerge');
        $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body

        // Select or deselect all checkboxes depending on main checkbox change
        $selectAllCheckBoxMerge.on('click', function () {
            $tdCheckbox.prop('checked', this.checked);
        });


        // Toggle main checkbox state to checked when all checkboxes inside tbody tag is checked
        $tdCheckbox.on('change', function (e) {
            tdCheckboxCheckedMergeTicket = $table.find('tbody input:checkbox:checked').length; // Get count of checkboxes that is checked
            // if all checkboxes are checked, then set property of main checkbox to "true", else set to "false"
            $selectAllCheckBoxMerge.prop('checked', (tdCheckboxCheckedMergeTicket === $tdCheckbox.length));

        })

    }

    axios.get('/ticketing-service/api/v1/secured/ticket/all').then(response => {
        if (response.data.success) {
            let dataArr = response.data.data.tickets;
            console.log(dataArr)
            renderMergeTickets(dataArr,NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer. fullName )
        } else {
            // failed to get the data to render
        }

    }).catch(error => {
        console.error(error);
    });


    const htmlV = `
        
     
     <div class="">
       <div class="">
        <div class="card-header">
         <h5 class="card-title"> <h4>${NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.customer. fullName}</h4>  <br>  <strong> Ticket#${ NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.ticketId}  </strong></h5>
         <h6 class="card-subtitle text-muted"> <h4>Messages (first 2 messages): ${NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.chats.length > 0  ?
                                                                             /*this is jus in;ining the mapping oparation to get the frist 2 chats**/     NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.chats.filter((element1,idx) => idx < 2).map(elem=> elem.content).join(',')
                                                                                                                                              : ''  } </h4> <br>  <h5> Select ticket to merge with </h5> </h6>
        </div>
        <table class="table table-striped table-hover">
         <thead>
          <tr>
           <th style="width:5%;"> <input type="checkbox" name="selectAllCheckBox" id="selectAllCheckBoxMerge"> </th>
           <th style="width:90%">-</th>
          
          
          </tr>
         </thead>
         <tbody id="tBody-MergeTickets">
         
          <tr>
                   <td> <input type="checkbox" name="" id="selectAllCheckBoxMerge"></td>         
                   <td class="d-none d-md-table-cell">
                   
                   <h5>Ticket#4567</h5> <br>
                  <strong> Peter Parker •</strong> 09:42 AM
                   <p class="text-muted">Message: Hi, please help me with billing  </p>
                   
                    </td> 
           </tr>
         
         
         </tbody>
        </table>
       </div>
      </div>
    
    `;

    /*
     *
     $("#globalModalFunctionalForm").modal({
     backdrop: 'static',
     }).modal('hide');
     *
     * */
    largeGlobalModalFunctionalFormPositiveCancel('Merge ticket', htmlV, 'Merge', 'Cancel',
        async () => {
           let ticketsIds  = getCheckedInputsGetValues('selectAllCheckBoxMergeClass');
           if(ticketsIds.length === 0){
               showErrorMessage('Please select at least one ticket to merge ');
               return;
           }
            ticketsIds = ticketsIds + '';
            try {
                loadingScreenElement('globalModalFunctionalForm', true, "Merging....");
                await axios.post('/ticketing-service/api/v1/secured/ticket/life-cycle/merge-tickets',{ticketsIds});
                loadingScreenElement('globalModalFunctionalForm', false, "Merging....");
            } catch (e) {
                console.error(e)
                loadingScreenElement('globalModalFunctionalForm', false, "Merging....");
            }

        },
        ()=> {
            $("#globalModalFunctionalForm").modal({
                backdrop: 'static',
            }).modal('hide');
            $("#selectTicketStatus").val('1');// reset the status drop down
        },
        null);
}


function renderTableTickets(arr) {
    let renderType = $("#renderType").val();

    let row = '';

    arr.forEach((element, index) => {
        if (renderType === 'with-no-tickets') {
            $("#col-t-2").text('Widget User/Customer ')
            $("#col-t-3").text('Messages ')
            $("#col-t-4").text('-- ')
            $("#col-t-5").text('Date')

            if (element.customerId) {

                row += `       
            
                    <tr id="tbTixketsRow-${element.customerId}">
                        <td><input class="checkBoxSelections"  type="checkbox" value="${element.customerId}" name="all" id="checkBox-${element.conversationId}"></td>
                        <td> -- </td>
                        <td>${element.customerFullName}  <br> <strong > <a href="mailto:${element.customerEmail}">${element.customerEmail}</a>  </strong> </td>
                        <td>${element.conversationsCounter}</td>
                        <td> -- </td>
                        <td>
                            ${moment(convertToLocalTime(element.dateCreated), 'YYYY-MM-DD HH:mm:ss').fromNow()} <br>
                            ${convertToLocalTime(element.dateCreated)}
                        </td>
                    </tr>
                    
                    `;
            }
        } else if (renderType === 'all-tickets') {
            $("#col-t-2").text('Customer ame ')
            $("#col-t-3").text('Status ')
            $("#col-t-4").text('Saved By')
            $("#col-t-5").text('Date')
            // console.log(888,element);
            row += `        
        
                 <tr id="tbTixketsRow-${element.id}">
                    <td><input  value="${element.id}" type="checkbox" class="checkBoxSelections" name="all" id="checkBox-${element.id}"></td>
                    <td>#${element.id}</td>
                    <td>${element.ticketData.chats.length > 0 ? element.ticketData.chats[0].customerFullName : '[for Devs] No Ticket here'}</td>
                    <td>${element.statusTitle}</td>
                    <td>${element.createdByUserDetails ? element.createdByUserDetails.fullName : '--'}</td>
                    <td>${moment(convertToLocalTime(element.dateCreated), 'YYYY-MM-DD HH:mm:ss').fromNow()}</td>
                </tr>
                
                `;
            // console.log(99999,row);
        }

    });
    // console.log(7777,row);
    $("#tBody-chatsTickets").html(row);

    $selectAll = $('#selectAllCheckBox');
    $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body

    // Select or deselect all checkboxes depending on main checkbox change
    $selectAll.on('click', function () {
        $tdCheckbox.prop('checked', this.checked);
    });


    // Toggle main checkbox state to checked when all checkboxes inside tbody tag is checked
    $tdCheckbox.on('change', function (e) {
        tdCheckboxChecked = $table.find('tbody input:checkbox:checked').length; // Get count of checkboxes that is checked
        // if all checkboxes are checked, then set property of main checkbox to "true", else set to "false"
        $selectAll.prop('checked', (tdCheckboxChecked === $tdCheckbox.length));
        let renderType = $("#renderType").val();
        if (tdCheckboxChecked > 0) {
            $('.btnActions,.btnActions-2').show()
            if (renderType === 'all-tickets') {
                $('.btnActions-1').show()
                $('.btnActions-2').hide()
            }
        }
        if (tdCheckboxChecked < 1) {
            $('.btnActions,.btnActions-2').hide()
            if (renderType === 'all-tickets') {
                $('.btnActions-1').hide()
                $('.btnActions-2').hide()
            }
        }


    })

}


