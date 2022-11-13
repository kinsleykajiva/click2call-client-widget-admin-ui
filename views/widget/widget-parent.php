



<h1 class="h3 mb-3">Widget Settings</h1>

<div class="row">
    <div class="col-md-3 col-xl-2">

        <div class="card">
            <!--<div class="card-header">
                <h5 class="card-title mb-0">Widget Settings</h5>
            </div>-->

            <div class="list-group list-group-flush" role="tablist">
                <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account" role="tab" aria-selected="false">
                    General information
                </a>
                <a class="list-group-item list-group-item-action " data-bs-toggle="list" href="#password" role="tab" aria-selected="true">
                    Icon
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
                    Position
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
                    Social Media
                </a>
                <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#analitics" role="tab">
                    Analytics
                </a>

            </div>
        </div>
    </div>

    <div class="col-md-9 col-xl-10">
        <div class="tab-content">
            <div class="tab-pane fade active show" id="account" role="tabpanel">

                <?php include 'inc.general-info.php' ; ?>

            </div>

            <div class="tab-pane fade " id="password" role="tabpanel">

            </div>

            <div class="tab-pane fade " id="analitics" role="tabpanel">
                <?php include 'inc.analytics.php' ; ?>
            </div>
        </div>
    </div>
</div>
