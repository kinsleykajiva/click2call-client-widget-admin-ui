
<main class="d-flex w-100 h-100">
    <div class="container d-flex flex-column">
        <div class="row vh-100">
            <div class="col-sm-8 col-md-8 col-lg-8 mx-auto d-table h-100">


                <div class="d-table-cell align-middle">

                    <div class="text-center mt-4">
                        <h1 class="h2"> Sign up. <span id="stageParent" style="display: none;">  (Step <span style="display: none;" id="currentStage"> 1</span>/ <span style="display: none;"
                                                                                                                                                                       id="outOfStage"> 4</span>) </span></h1>
                        <p class="lead" id="responseMessage">

                        </p>
                    </div>

                    <div class="card">
                        <div class="card-body">
                            <div class="m-sm-4">

                                <form onsubmit="return false;" id="step1">
                                    <div class="mb-3">
                                        <label class="form-label">Full name</label>
                                        <input class="form-control form-control-lg" id="txtFullName" type="text" name="name" placeholder="Enter your name"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Company</label>
                                        <input class="form-control form-control-lg" id="txtCompanyName" type="text" name="company" placeholder="Enter your company name"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input class="form-control form-control-lg" id="txtEmailAddress" type="email" name="email" placeholder="Enter your email"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password ( <small> At least one uppercase letter ,At least one lowercase letter ,At least one digit ,At least one special symbol ,should be more than 4
                                                character</small> )</label>
                                        <input class="form-control form-control-lg" id="txtPassword" type="password" name="password" placeholder="Enter password"/>
                                    </div>
                                    <div>
                                        <label class="form-check">

                                            <span class="form-check-label">
													<small>
                                            <a href="javascript:void(0)" onclick="showLoginView()" class="">Already have an Account? / Sign in</a>

                                        </small>
												</span>
                                        </label>
                                    </div>
                                    <div class="text-center mt-3">
                                        <!--                                        <a href="" class="btn btn-lg btn-primary">Sign up</a>-->
                                        <button type="submit" onclick="gotoStage('2')" class="btn btn-lg btn-primary">Sign up</button>
                                    </div>
                                </form>

                                <form onsubmit="return false;" style="display: none;" id="step2">
                                    <center><img src="img/chat-widget.png" style="    width: 180px;  height: 300px;"></center>
                                    <br>
                                    <div class="mb-3">
                                        <label class="form-label">Name your widget</label>
                                        <input class="form-control form-control-lg" type="text" id="txtWidgetName" name="name" placeholder="Name of your widget"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Name the top bar message</label>
                                        <input class="form-control form-control-lg" type="text" id="txtTopbarMessage" name="company" placeholder="Chat with us"/>
                                    </div>

                                    <div class="mb-3">
                                        <label for="exampleColorInput" class="form-label">Widget Color Theme</label>
                                        <input type="color" class="form-control form-control-color" id="txtThemeColor" value="#8C00FF" title="Choose your color theme">
                                    </div>
                                    <div class="text-right mt-3">
                                        <!--                                        <a href="" class="btn btn-lg btn-primary">Sign up</a>-->
                                        <button type="submit" onclick="gotoStage('1')" class="btn btn-lg btn-primary">Prev</button>
                                        <button type="submit" onclick="gotoStage('3')" class="btn btn-lg btn-primary">Next</button>
                                    </div>

                                </form>

                                <form onsubmit="return false;" style="display: none;" id="step3">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="card-title">Install YOOTOK widget on your website</h5>
                                            <br>
                                            <h6 class="card-subtitle text-muted">Copy and paste this code before the the <strong> &lt;/body&gt; </strong> tag on every page of your website </h6>
                                            <br>
                                            <br>

                                            <pre id="codeCpy"> &lt;script&gt;  window.__yk = window.__lc || {}; window.__yk.license = 12765036;(function(n,t,c){function I(n){return e._h?  <br>    {function I(n){return e._h?{function I(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_qr    <br>  (function(n,t,c){function I(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_qr <br>
                                                    (function(n,t,c){function I(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_qr &lt;/script&gt;
                                            </pre>


                                        </div>
                                        <div class="card-body">
                                            <div class="mb-2">
                                                <a href="javascript:void(0)" onclick="showCopiedMessage()" class="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                         class="feather feather-copy align-middle me-2">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                    </svg>
                                                    <span class="align-middle">Copy</span>
                                                </a>
                                            </div>

                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Or send these instructions to your developer(s) Comma Separate if morethan one email</label>
                                        <div class="row">
                                            <div class="col-md-10">
                                                <input class="form-control form-control-lg" id="sendCodeToDeveloperInput" type="text" name="company" placeholder="example@email.com"/>
                                            </div>
                                            <div class="col-md-2">
                                                <button type="submit" onclick="sendDeveloperInstruction()" class="btn btn-lg btn-primary">Send</button>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="text-right mt-3">

                                        <button onclick="gotoStage('2')" type="submit" class="btn btn-lg btn-primary">Prev</button>
                                        <button onclick="gotoStage('4')" type="submit" class="btn btn-lg btn-primary">Next</button>
                                    </div>
                                </form>

                                <form onsubmit="return false;" style="display: none;" id="step4">

                                    <div class="mb-3">
                                        <label class=" text-center form-label"><h2>Add members to your team for free</h2></label> <br>
                                        <label>Add users email address. Separate with commas</label>
                                        <div class="form-field">
                                            <div class="chips"></div>
                                            <input placeholder="Enter something here" autofocus autocomplete="off" class="chip-input"/>

                                        </div>
                                        <p><br> <strong>Just type in the valid email address.</strong></p>

                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Select role</label>
                                        <div class="row">
                                            <div class="col-md-10">
                                                <select id="selectUserType" class="form-select">
                                                    <option selected value="null">Select...</option>
                                                    <option value="1">SuperAdmin</option>
                                                    <option value="2">Admin</option>
                                                    <option value="3">User</option>
                                                </select>
                                            </div>
                                            <div class="col-md-2">
                                                <button onclick="sendInviteToUser()" type="submit" class="btn btn-lg btn-primary">Send Invite</button>
                                            </div>
                                        </div>

                                    </div>


                                    <div class="text-right mt-3">
                                        <button onclick="gotoStage('4')" type="submit" class="btn btn-lg btn-primary">Prev</button>
                                        <button type="submit" onclick="gotoStage('5')" class="btn btn-lg btn-primary">Next</button>
                                    </div>
                                </form>

                                <form onsubmit="return false;" style="display: none;" id="step5">
                                    <center><h2>Congrats! You will now have live chat on your website.</h2></center>
                                    <br>
                                    <br>
                                    <center><img src="img/phone-icon.png"</center>
                                    <br>
                                    <center><h4> You will now receive messages from your customers </h4></center>

                                    <div class="mb-3">

                                        <label class=" text-center form-label">


                                        </label> <br>

                                        <!-- <div class="form-field">
                                             <div class="chips">   </div>
                                             <input placeholder="Enter something here" autofocus autocomplete="off" class="chip-input"/>

                                         </div>
                                         <p> <br> <strong>Just type in the valid email address.</strong></p>-->

                                    </div>


                                    <div class="text-right mt-3">
                                        <a href="auth?type=login" class="btn btn-lg btn-primary">Log In Now</a>
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

