<div class="row">
    <div class="col-xl-8">
        <div class="card">
            <div class="card-header pb-0">
                <div class="card-actions float-end">
                    <div class="dropdown position-relative">
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal align-middle"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </a>

                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" onclick="showAddUserToCompany()" href="#">Add User To Company</a>
                            <!--<a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>-->
                        </div>
                    </div>
                </div>
                <h5 class="card-title mb-0">Users In The Company</h5>
            </div>
            <div class="card-body">
                <table class="table table-striped" style="width:100%">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody id="tbody-users">
                    <tr>
                        <td><img src="img/avatars/avatar.jpg" width="32" height="32" class="rounded-circle my-n1" alt="Avatar"></td>
                        <td>Loading..</td>
                        <td>Loading..</td>

                        <td>Loading..</td>
                        <td>Loading..</td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="col-xl-4" style="display: none;" id="userProfileDiv">
        <span style="display: none;" id="selectedIdInSelection"></span>
        <div class="card">
            <div class="card-header">
                <div class="card-actions float-end">
                    <div class="dropdown position-relative">
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal align-middle"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </a>

                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" onclick="showEditUser()" href="#">Edit User</a>
                            <a id="btnDeleteUserPreview" class="dropdown-item" onclick="showDeleteUser()" href="#">Delete User</a>
                            <a id="btnReactivateUserPreview" style="display: none" class="dropdown-item" onclick="showReActivateUser()" href="#">Re-Activate User</a>

                        </div>
                    </div>
                </div>
                <h5 class="card-title mb-0">User Profile</h5>
            </div>
            <div class="card-body">

                <table class="table table-sm mt-2 mb-4">
                    <tbody id="tBodyUserProfile">
                    <tr>
                        <th>Name</th>
                        <td>---</td>
                    </tr>
                    <tr>
                        <th>Date Joined</th>
                        <td>--</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>---</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>---</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td><span class="badge bg-success">Active</span></td>
                    </tr>
                    </tbody>
                </table>

                <strong>Teams Included</strong>

                <ul class="timeline mt-2 mb-0" id="usersTeamsIncludedList">
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
    </div>
</div>
