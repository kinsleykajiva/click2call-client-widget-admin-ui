<div class="offcanvas offcanvas-bottom " tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel" style="visibility: visible;height: 70%;" aria-modal="true" role="dialog">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasScrollingLabel">.</h5>
        <div class="mb-3">


            <button onclick="getChatsConversations()" class="btn btn-success"><i class="fas fa-check"></i> Refresh</button>
            <button style="display:none;" onclick="actionCreateTicket()" class="btn btn-warning btnActions-2"> <i class="fas fa-save"></i> Create Ticket</button>
            <button  style="display:none;"  onclick="actionSaveAsCustomer()" class="btn btn-primary btnActions-1">  Save As Customer </button>
            <button  style="display:none;"  onclick="actionOpenTicketInChatView()" class="btn btn-primary btnActions"> <i class="align-middle me-2 fas fa-fw fa-external-link-alt"></i>  Open In Chat </button>

            <button  style="display:none;"  onclick="actionDeleteConversations()" class="btn btn-danger btnActions"> <i class="fas fa-trash "></i> Delete </button>




        </div>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">

        <div class="row">
            <div class="col-12 col-xl-2"> </div>

            <div class="col-12 col-xl-8">


                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Ticketing/Messages requiring your attention </h5>


                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Search for...">
                            <select id="renderType" onchange="renderTypeChange()" class="form-select">
                                <option selected value="with-no-tickets">Select</option>
                                <option  value="with-no-tickets">With No tickets</option>
                                <option value="all" >All Mixed...</option>
                                <option value="all-tickets">All Tickets</option>
                                <option value="un-unified">Un Unified</option>
                            </select>
                            <button class="btn btn-secondary" type="button">Go!</button>
                        </div>


                    </div>
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th style="width:10%;"> <input type="checkbox" name="" id="selectAllCheckBox"></th>
                            <th id="col-t-1" style="width:15%">ID</th>
                            <th id="col-t-2" style="width:25%">Subject</th>
                            <th id="col-t-3" class="d-none d-md-table-cell" style="width:15%">Status</th>
                            <th id="col-t-4" >Saved By</th>
                            <th id="col-t-5" >Date</th>

                        </tr>
                        </thead>
                       <center>
                           <div style="display: none" id="loadingTableTickets" class="spinner-border text-success me-2" role="status">
                               <span class="visually-hidden">Loading...</span>
                           </div>
                       </center>
                        <tbody id="tBody-chatsTickets">

                        <tr>
                            <td><input type="checkbox" name="all" id="all"></td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                        </tr>


                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-12 col-xl-2"> </div>
        </div>


    </div>
</div>
