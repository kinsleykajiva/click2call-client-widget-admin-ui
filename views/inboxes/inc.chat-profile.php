<div class="card">
    <div class="card-header">
        <div class="card-actions float-end">
            <div class="dropdown position-relative">
                <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal align-middle"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                </a>

                <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" id="btnSaveClientCustomerOption"  onclick="saveCustomerCclient()" href="javascript:void(0)">Save As Customer/Client</a>
                    <a class="dropdown-item" style="display: none;" id="btnSaveNoneLiveClientCustomerOption"  onclick="saveCustomerClientNoneLiveChat()" href="javascript:void(0)">Save As Customer/Client</a>
                   <!-- <a class="dropdown-item" href="#">Another action</a>
                    <a class="dropdown-item" href="#">Something else here</a>-->
                </div>
            </div>
        </div>
        <h5 class="card-title mb-0">User information</h5>

        <div>
            <h5 class="mb-0">Tags</h5>
            <ul id="tagsList"></ul>
            <input
                    type="text"
                    id="tagsInput"
                    spellcheck="false"
            />
        </div>

        <!--<form >
        <input id="choices-1" type="text" value="" placeholder="Enter Add Tag"/>
            <button style="display: none;" id="btnReset"type="reset">Reset</button>
        </form>-->
        <div style="display: none;" id="loadingDivProffile" class="spinner-border text-success me-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="card-body" id="profileDivBody" style="display: none;">


        <table class="table table-sm mt-2 mb-4">
            <tbody>
            <tr>
                <th><i class="align-middle me-2 fas fa-fw fa-address-card"></i></th>
                <td id="txtUserCardAddress">Pretoria, South Africa</td>
            </tr>
            <tr>
                <th> <i class="align-middle me-2 fas fa-fw fa-envelope"></i> </th>
                <td  id="txtUserCardEmail">janedoe@email.com</td>
            </tr>

            <tr>
                <th><i class="align-middle me-2 fas fa-fw fa-phone"></i></th>
                <td id="txtUserCardPhone"> +1 517 9086 523 6 </td>
            </tr>
            <tr>
                <th><i class="align-middle me-2 fas fa-fw fa-tags"></i></th>
                <td id="txtUserCardPhone">
                    <div
                            id="simple-tag"
                            class="simple-tags"
                            data-simple-tags="Article, Blog, Page, Post, Category, Updates" >
                    </div>
<!--                    <div id="myTags" class="simple-tags"></div>-->
                </td>
            </tr>

           <!-- <tr>
                <th>Status</th>
                <td><span class="badge bg-success">Active</span></td>
            </tr>-->
            </tbody>
        </table>

        <strong>Tickets Activity</strong>

        <ul class="timeline mt-2 mb-0" id="ulTicketsHostory">
            <li class="timeline-item">
                <strong>Signed out</strong>
                <span class="float-end text-muted text-sm">30m ago</span>
                <p>Nam pretium turpis et arcu. Duis arcu tortor, suscipit...</p>
            </li>

            <li class="timeline-item">
                <strong>Created invoice #1204</strong>
                <span class="float-end text-muted text-sm">2h ago</span>
                <p>Sed aliquam ultrices mauris. Integer ante arcu...</p>
            </li>
            <li class="timeline-item">
                <strong>Discarded invoice #1147</strong>
                <span class="float-end text-muted text-sm">3h ago</span>
                <p>Nam pretium turpis et arcu. Duis arcu tortor, suscipit...</p>
            </li>
            <li class="timeline-item">
                <strong>Signed in</strong>
                <span class="float-end text-muted text-sm">3h ago</span>
                <p>Curabitur ligula sapien, tincidunt non, euismod vitae...</p>
            </li>
            <li class="timeline-item">
                <strong>Signed up</strong>
                <span class="float-end text-muted text-sm">2d ago</span>
                <p>Sed aliquam ultrices mauris. Integer ante arcu...</p>
            </li>
        </ul>

    </div>
</div>
