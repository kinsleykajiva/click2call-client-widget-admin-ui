<main class="d-flex w-100 h-100">
    <div class="container d-flex flex-column">
        <div class="row vh-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">

                    <div class="text-center mt-4">
                        <h1 class="h2">Reset password</h1>
                        <p class="lead">
                            Enter your email to reset your password.
                        </p>
                    </div>

                    <div class="card">
                        <div class="card-body">
                            <div class="m-sm-4">
                                <form onsubmit="return false;">

                                    <div id="DivOtp" style="display: none;" class="mb-3">
                                        <label class="form-label">Opt Reset Code</label>
                                        <input class="form-control form-control-lg" id="inputResetOtp" type="text"  placeholder="Enter your OTP">
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input class="form-control form-control-lg" id="inputResetEmail" type="email"  placeholder="Enter your email">
                                    </div>
                                    <div  id="DivNewPassword" style="display: none;"  class="mb-3">
                                        <label class="form-label">New Password</label>
                                        <input class="form-control form-control-lg" id="inputResetPassword" type="password"  placeholder="Enter your password">
                                    </div>

                                    <div class="text-center mt-3">
                                        <a id="btnResetPassCode" href="javascript:void(0)" onclick="SendPasswordCode()" class="btn btn-lg btn-primary">Reset password</a>
                                        <a id="btnResetPassWord" style="display: none;" href="javascript:void(0)" onclick="resetPassword()" class="btn btn-lg btn-primary">Reset password</a>
                                        <br>
                                        <br>
                                        <a href="auth?type=login" class="">Log In</a>
                                        <!-- <button type="submit" class="btn btn-lg btn-primary">Reset password</button> -->
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
