

<div class="container">
    <div class="main-body">

        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="main-breadcrumb">
            <ol class="breadcrumb">

                <li class="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
        </nav>
        <!-- /Breadcrumb -->
        <div id="DivLoading" class="row">
           <?php include 'inc.loading.php'; ?>
        </div>

        <div class="row gutters-sm">
            <div class="col-md-4 mb-3" style="">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex flex-column align-items-center text-center">
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" id="profilePicture" alt="Admin" class="rounded-circle" width="150">
                            <div class="mt-3">
                                <!--<h4 > User Name </h4>

                                <p class="text-muted font-size-sm">User Type</p>-->
                                <input type="file" accept="image/*" style="display: none;" id="userProfileImageEdit" >
                                <button style="display: none;" onclick="opneFileChoser()" class="btn btn-primary forEditDivs">Update Picture</button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="col-md-8">
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-3">
                                <h6 class="mb-0">Full Name</h6>
                            </div>

                            <div  id="userNameFull" class="col-sm-9 text-secondary forViewDivs">
                                --
                            </div>
                            <div style="display: none;"  class="col-sm-9 text-secondary forEditDivs">
                                <input type="text" id="userNameFullEdit" class="form-control" placeholder="Name....">
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-sm-3">
                                <h6 class="mb-0">Email</h6>
                            </div>
                            <div id="userEmail" class="col-sm-9 text-secondary forViewDivs">
                                --
                            </div>
                            <div style="display: none;"  class="col-sm-9 text-secondary forEditDivs">
                                <input type="text" id="userEmailEdit" class="form-control" placeholder="Email....">
                            </div>
                        </div>

                        <hr>
                        <div class="row">
                            <div class="col-sm-3">
                                <h6 class="mb-0">Account Verified</h6>
                            </div>
                            <div id="userAccountVerfied" class="col-sm-9 text-secondary">

                            </div>
                        </div>

                        <hr>
                        <div class="row">

                            <div class="col-sm-12">
                                <a class="btn btn-info " id="btnEditAction" onclick="onEditAction()" href="javascript:void(0)">Edit</a>
                                <a class="btn btn-default " style="display: none"  id="btnCacnelEditAction" onclick="onCacnelEditAction()" href="javascript:void(0)">Cancel</a>
                            </div>
                        </div>
                    </div>
                </div>





            </div>
        </div>

    </div>
</div>
