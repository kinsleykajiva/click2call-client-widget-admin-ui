<h1 class="h3 mb-3">Company Settings</h1>


<div class="row">
    <div class="col-md-3 col-xl-2">

        <div class="card">


            <div class="list-group list-group-flush" role="tablist">
                <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account" role="tab">
                    Account
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#domains-view" role="tab">
                    Domains
                </a>

                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#users-list" role="tab">
                   Users
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#prices" role="tab">
                    Payments/Pricing
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
                    Email notifications
                </a>

                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
                    DashBoard View
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
                    Your data
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#delete-tab" role="tab">
                    Delete account
                </a>
            </div>
        </div>
    </div>

    <div class="col-md-9 col-xl-10">
        <div class="tab-content">
            <div class="tab-pane fade show active" id="account" role="tabpanel">

                <?php include 'inc.account.php' ; ?>

            </div>
            <div class="tab-pane fade" id="domains-view" role="tabpanel">

            <?php include 'inc.domains.php' ; ?>


            </div>
            <div class="tab-pane fade" id="prices" role="tabpanel"> <?php include 'inc.payments-prices.php' ; ?> </div>
            <div class="tab-pane fade" id="users-list" role="tabpanel"> <?php include 'inc.users.php' ; ?> </div>
            <div class="tab-pane fade" id="password11111" role="tabpanel">  </div>
            <div class="tab-pane fade" id="delete-tab" role="tabpanel"> <?php include 'inc.delete-tab.php' ; ?>   </div>
        </div>
    </div>
</div>
