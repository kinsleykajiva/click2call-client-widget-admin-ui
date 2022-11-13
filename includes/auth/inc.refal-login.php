<main class="d-flex w-100 h-100">
    <div class="container d-flex flex-column">
        <div class="row vh-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">

                    <div class="text-center mt-4">
                        <h1 class="h2">Welcome ,  <u> <span id="ownerName" > </span> </u>  has asked you to be part of the  <u> <span id="ownerCompany" > </span> </u>  Company</h1>
                        <p class="lead">
                            Sign Up to join . (If you ever want to register again please use the same link that took here)
                        </p>


                    </div>

                    <div class="card">
                        <div class="card-body">
                            <p class="lead" id="inputresponseRefMessage">

                            </p>
                            <div class="m-sm-4">
                                <div class="text-center">
                                    <img src="img/icons/icon-48x48.png" alt="Charles Hall" class="img-fluid rounded-circle" width="132" height="132">
                                </div>
                                <form onsubmit="return false;">

                                    <div class="mb-3">
                                        <label class="form-label">Full Name</label>
                                        <input class="form-control form-control-lg" type="text" id="inputrefereFullName" name="email" placeholder="Enter your full name">
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input class="form-control form-control-lg" type="email" id="inputrefereEmail" name="email" placeholder="Enter your email">
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input class="form-control form-control-lg" id="inputreferePassword" type="password" name="password" placeholder="Enter your password">

                                    </div>
                                    <div>
                                        <label class="form-check">

                                            <span class="form-check-label">
													<small>
                                            <a href="javascript:void(0)" onclick="showLoginViewFromRefere()" class="">Sign In</a>

                                        </small>
												</span>
                                        </label>
                                    </div>
                                    <div class="text-center mt-3">


                                        <button type="submit" onclick="registerReferal()" class="btn btn-lg btn-primary">Sign Up</button>



                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</main>
