<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <meta name="keywords" content="">

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="shortcut icon" href="img/icons/icon-48x48.png"/>


    <title> User Accounnt Handler </title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

    <link class="js-stylesheet" href="css/light.css" rel="stylesheet">

    <style>
        body {
            opacity: 0;
        }
    </style>
    <!-- END SETTINGS -->
</head>


<body data-theme="default" data-layout="fluid" data-sidebar-position="left" data-sidebar-layout="default">
<main class="d-flex w-100 h-100">
    <div class="container d-flex flex-column">
        <div class="row vh-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">

                    <div class="text-center">

                        <img src="img/phone-icon.png" alt="App icons" class="img-fluid rounded-circle" width="252" height="252">
                        <h3 class="display-4 font-weight-bold">Account Verification</h3>
                        <br>
                        <p class="h1" id="responseTxt">Please note that the account has been verified via email successffully</p>

                        <a href="auth" class="btn btn-primary btn-lg">Return to website</a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</main>


<script src="js/jquery.js"></script>
<script src="js/blockUI.js"></script>
<script src="js/axios.min.js"></script>
<script src="js/js.cookie.min.js"></script>

<script src="js/jquery.easing.min.js"></script>

<script>
    let BASE_URL = '';
    if(window.location.protocol === 'http:') {
        //localhost
        BASE_URL = 'http://localhost:8050';
    }else{
        BASE_URL = 'https://api-app.xxxclick2callxxxxx.com';
    }

    async function testPage() {
        let responseTxt = $('#responseTxt');
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        responseTxt.text("Verifying Please hold ....")
        if (params) {

            if (params['verify']) {
                let verify = params['verify'];
                console.log(verify)
                try {
                    let res = await axios.post(BASE_URL + '/auth/api/v1/users/activate-verify-account', {
                        verify: verify
                    });

                    res = res.data;
                    console.log(res);

                    responseTxt.text(res.message)
                } catch (e) {
                    alert('Failed to verify ,please check the connection')
                    responseTxt.text('Error: Verification failed , Reload page ')
                }


            }else{
                responseTxt.text('Error: Verification failed , Check email Link ')
            }
        }else{
            responseTxt.text('Error: Verification failed , Check email Link ')
        }
    }
    testPage();

</script>

</body>

</html>
