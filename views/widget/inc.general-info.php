<div class="row">
    <div class="col-12 col-xl-4">
        <div class="card">
            <small style="display: none" id="widgetRecordId"> </small>

            <div class="card-body">
                <form _lpchecked="1" onsubmit="return false">
                    <div class="mb-3">
                        <label class="form-label">Name your widget</label>
                        <input type="text" id="inputWidgetName" class="form-control" placeholder="Widget name" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=&quot;); cursor: auto;">
                        <small class="form-text text-muted" >This name won’t be visible to customers</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Welcome message</label>
                        <input type="text" id="inputWidgetWelcomeMessage"  class="form-control" placeholder="Hello! Welcome to Company Name chat!" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=&quot;); cursor: auto;">
                    </div>


                    <div class="mb-3">
                        <label class="form-label w-100">Color</label>
                        <input  id="inputWidgetColor"   type="color">

                    </div>

                    <div class="mb-3">
                        <label class="form-label w-100">Language</label>

                            <select disabled class="form-select flex-grow-1">
                                <option selected > English </option>
                                <option value="fr">French</option>

                            </select>

                    </div>

                    <div class="mb-3">
                        <label class="form-label w-100">Business Hours</label>
                        <small class="form-text text-muted" >Monday to Friday: 9am - 5pm</small>

                    </div>

                    <button type="submit" onclick="saveUpdateWidget()"  class="btn btn-primary btn-pill">Update</button>
                </form>
            </div>
        </div>
    </div>
    <div class="col-12 col-xl-8">
        <div class="card">
            <div class="card-header">



                <form class="row  align-items-center" onsubmit="return false">
                    <div class="col-6">
                        <h5 class="card-title">Current Widget</h5>


                    </div>

                    <div class="col-2">
                        <div class="form-check form-switch">

                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked="">
                            <label class="form-check-label" id="isActive" for="flexSwitchCheckChecked"> Activate</label>
                        </div>


                    </div>

                    <div class="col-4">
                        <div class="form-check mb-1 me-sm-2">

                            <button onclick="onRemoveWidget()" class="form-check-label btn btn-primary" for="customControlInline">Remove Widget</button>
                        </div>
                    </div>


                </form>
            </div>
            <div class="card-body">
                preview coming soon ...
            </div>
        </div>




<!--        start-->

        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Install YOOTOK widget on your website</h5>
            </div>
            <div class="card-body">
                <p class="card-text">
                <p>
                    Copy and paste this code before the <strong> &lt;/body&gt; </strong> tag on every page of your website
                </p>
                </p>
                <pre id="codeCpy">   </pre>

                <div class="card-body">
                    <div class="mb-2">
                        <a href="javascript:void(0)" onclick="showCopiedMessage()" class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 class="feather feather-copy align-middle me-2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span class="align-middle">Copy Script Tag Code</span>
                        </a>
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

            </div>
        </div>

<!--        end-->
    </div>



</div>
