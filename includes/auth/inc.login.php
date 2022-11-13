<main class="d-flex w-100 h-100">
    <div class="container d-flex flex-column">
        <div class="row vh-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">

                    <div class="text-center mt-4">
                        <h1 class="h2">Welcome back </h1>
                        <p class="lead">
                            Sign in to your <small id="activatedAccount" style="display:none; color:green;"> ACTIVATED</small> account
                        </p>


                    </div>

                    <div class="card">
                        <div class="card-body">
                            <p class="lead" id="inputresponseMessage">

                            </p>
                            <div class="m-sm-4">
                                <div class="text-center">
                                    <img src="img/icons/icon-48x48.png" alt="Charles Hall" class="img-fluid rounded-circle" width="132" height="132">
                                </div>
                                <form onsubmit="return false;">
                                    <div class="mb-3">

                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <label class="form-label">Email</label>
                                            </div>
                                            <div>
                                                <a href="javascript:void(0)" onclick="showResetPasswordView()" class="">Forgot Password</a>
                                            </div>
                                        </div>

                                        <input class="form-control form-control-lg" type="email" id="inputEmail" name="email" placeholder="Enter your email">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input class="form-control form-control-lg" id="inputPassword" type="password" name="password" placeholder="Enter your password">

                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <a href="javascript:void(0)" onclick="showRegisterView()" class=""> Sign Up</a>
                                        </div>
                                        <div>
                                            .
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                    <div class="text-center mt-3">


                                        <button type="submit" onclick="login()" class="btn btn-lg btn-primary">Sign in</button>



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
