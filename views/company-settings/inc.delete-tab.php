<div class="card">
    <div class="card-header">
        <h1 class="">Delete Account ? </h1>
    </div>
    <div class="card-body">
        <p class="text-muted">
            You wish delete account ,the data will be deleted after 30 days ,but you won't be able to log in.<br>
            We will not reimburse you the funds if you so wish to do so , it's your loss .<br><br>
            Code will be sent to the Primary account Emails of the Company or Supper Admins only
        </p>
        <div class="row">
            <div class="col-md">
                <div class="mb-0">
                    <div class="input-group">
                        <div class="input-group-text">

                            Delete Code
                        </div>
                        <input id="deleteCodeTxT" type="text" class="form-control" placeholder="Delete Code">
                    </div>
                </div>
            </div>
            <div class="col-md">
                <div class="mb-0">
                    <div class="input-group">

                        <button onclick="btnRqstCode()" class="btn btn-warning" >Request Code</button>
                        <input style="visibility: hidden;" type="text" class="form-control" placeholder="Radio">

                    </div>
                </div>
            </div>
        </div>



    </div>

</div>

<div id="divDeletAccount" style="display :none;" class="card">
    <button onclick="btnDeleteAccount()" class="btn btn-danger" >Delete Account</button>
</div>
