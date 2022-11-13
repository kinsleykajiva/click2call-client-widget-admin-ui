


<div class="row" id="domainsForm" style="display: none">

    <div class="col-12 col-xl-8">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Add domain To verify</h5>
                <h6 class="card-subtitle text-muted">Add the TXT dns record generated </h6>
            </div>
            <div class="card-body">
                <form onsubmit="return false;" >
                    <div class="mb-3 row">
                        <label class="col-form-label col-sm-2 text-sm-end">Domain</label>
                        <div class="col-sm-10">
                            <input  type="text"  id="txtDomain" class="form-control" placeholder="domain.com , example.com ,example.org ">
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <label class="col-form-label col-sm-2 text-sm-end"> <a onclick="copyDNS()" href="javascript:void(0)">Copy TXT dns </a> </label>
                        <div class="col-sm-10">

                            <input type="text" id="txtDNS" readonly class="form-control" value="dns-example"> <br>

                            Need help ?
                            <a href="https://www.google.com/search?sxsrf=AOaemvLjfuPJz7MqFUUYSX01hVYN0JHJFA:1642014372203&q=How+to+add+DNS+TXT+record+for+domain+verification&sa=X&ved=2ahUKEwiMyPua9Kz1AhXSX8AKHfmDA-QQ1QJ6BAgVEAE&biw=1496&bih=916&dpr=1">Ask Google</a>

                        </div>
                    </div>


                    <div class="mb-3 row">
                        <div class="col-sm-10 ms-sm-auto">
                            <button  onclick="onGenarateDNS()" id="btnGen" class="btn btn-primary">Generate Record</button>
                            <button id="btnVerify" onclick="actionSaveTXT()" style="display: none"  class="btn btn-primary">Save</button>
                            <button   onclick="actionCancelTXT()" style="display: none"  class="btn btn-default">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</div>
<div class="row" id="domainsTable">
    <div class="col-12 col-xl-8">
        <div class="card">
            <div class="card-header">
                <div class="row" >
                    <div class="col-md-10" >
                        <h5 class="card-title">Verified Domains</h5>
                        <h6 class="card-subtitle text-muted"> Verification done by TXT dns records   </h6>

                    </div>
                    <div class="col-md-2"  >  <button  onclick="addNewDomain()" class="btn btn-primary"> <i class="align-middle me-2 fas fa-fw fa-plus"></i>   Domain </button> </div>
                </div>
            </div>
            <table id="domainsTableView" class="table">
                <thead>
                <tr>
                    <th style="width:25%;">Domain</th>
                    <th style="width:40%">TXT DNS</th>
                    <th class="d-none d-md-table-cell" style="width:5%">Status</th>
                    <th style="width:10%;">  </th>
                    <th style="width:10%;">  </th>
                </tr>
                </thead>
                <tbody id="tbodyDomains">
                <tr>
                    <td>Vanessa Tucker</td>
                    <td>864-348-0485</td>
                    <td class="d-none d-md-table-cell">  <i style="color:green" class="align-middle me-2 fas fa-fw fa-check-circle"></i>  <i style="color:red" class="align-middle me-2 fas fa-fw fa-times-circle"></i></td>

                    <td class="table-action"> <a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="Verify">
                            <i class="align-middle me-2 fas fa-fw fa-redo"></i>
                        </a>
                    </td>

                    <td class="table-action">


                        <a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="Copy Record">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 class="feather feather-copy align-middle me-2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </a>

                        <a href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete Domain">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash align-middle">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </a>
                    </td>

                </tr>


                </tbody>
            </table>
        </div>
    </div>
</div>
