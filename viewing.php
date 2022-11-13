<?php include_once 'configs/ViewsUtils.php';
$page = handle();
if($page === null){ob_start();header('Location: error');ob_end_flush(); die();}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">



    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="shortcut icon" href="img/icons/icon-48x48.png" />

    <title>Click to call </title>

    <link class="js-stylesheet" href="css/light.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="js/iziToast/iziToast.min.css">
    <link rel="stylesheet" href="js/izModalModal/iziModal.min.css">
    <?php   print $page['contentCSSFile'] ;?>
    <script src="js/settings.js"></script>
    <style>
        body {
            opacity: 0;
        }
    </style>
</head>

<body>
<div class="wrapper">
    <?php include 'includes/left-nav.php';?>

    <div class="main">
        <?php include 'includes/top-nav.php';?>

        <main class="content">
            <div class="container-fluid p-0">

                <?php  include_once  $page['contentFile']; ?>

                <div id="globalTopModals"></div>

            </div>
        </main>



        <?php include 'includes/footer.php';?>

    </div>
</div>

<?php include 'includes/shared-js.php';  print $page['contentJSFile'] ; ?>

</body>

</html>
