<?php
declare(strict_types=1);
$contentFile = "";
$contentCSSFile = "";
$contentJSFile = "";
$getView = '';
function handle(): ?array{
    $getView = $_GET['fetch'] ;
    switch ($getView) {

        case 'home'  :
            $contentJSFile = '<script src="views/home/home.js" type="text/javascript"> </script>';
            $contentFile = 'views/home/home.php';
            $contentCSSFile = '';
            break;

        case 'customers'  :
            $contentJSFile = '<script src="views/customers/customers.js" type="text/javascript"> </script>';
            $contentFile = 'views/customers/customers.php';
            $contentCSSFile = '';
            break;

        case 'company-settings'  :
            $contentJSFile = '<script src="views/company-settings/company-settings.js" type="text/javascript"> </script> 
                                <script src="views/company-settings/company-settings-users.js" type="text/javascript"> </script>
                                ';
            $contentFile = 'views/company-settings/company-settings.php';
            $contentCSSFile = '';
            break;
        case 'profile'  :
            $contentJSFile = '<script src="views/profile/profile.js" type="text/javascript"> </script>';
            $contentFile = 'views/profile/profile.php';
            $contentCSSFile = '';
            break;
        case 'settings'  :
            $contentJSFile = '
           <script src="views/settings/settings-parent.js" type="text/javascript"> </script>
           <script src="views/settings/settings-organisations.js" type="text/javascript"> </script>
           <script src="views/settings/settings-users-tab.js" type="text/javascript"> </script>
           
';
            $contentFile = 'views/settings/settings-parent.php';
            $contentCSSFile = '  <link href="css/auth-page.css" rel="stylesheet"> ';
            break;
        case 'widget-settings'  :
            $contentJSFile = '<script src="views/widget/widget.js" type="text/javascript"> </script>';
            $contentFile = 'views/widget/widget-parent.php';
            //$contentCSSFile = '  <link href="public/js/chatwidget.css" rel="stylesheet"> ';;
            $contentCSSFile = '  ';;
            break;

        case 'tests'  :
            $contentJSFile = '
                <script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.0/adapter.min.js" ></script>
              
                  <script src="public/js/janus.js" ></script>
                 <script src="views/testings/test.js" type="text/javascript"> </script>
               
                               
                            ';
            $contentFile = 'views/testings/test.php';
            $contentCSSFile = '   ';
            break;

        case 'messages'  :
            $contentJSFile = '
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js" ></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.0/adapter.min.js" ></script>
                <script src="public/js/janus.js" ></script>
               <script src="https://cdn.jsdelivr.net/gh/rk4bir/simple-tags-input@latest/src/simple-tag-input.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js" integrity="sha512-MgkNs0gNdrnOM7k+0L+wgiRc5aLgl74sJQKbIWegVIMvVGPc1+gc1L2oK9Wf/D9pq58eqIJAxOonYPVE5UwUFA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                 <script src="views/inboxes/inbox-parent2.js" type="text/javascript"> </script>
                 <script src="views/inboxes/inbox-chats.js" type="text/javascript"> </script>
                 <script src="views/inboxes/about-chats-users.js" type="text/javascript"> </script>
                 <script src="views/inboxes/audio-call.js" type="text/javascript"> </script>
                 <script src="views/inboxes/screen-share.js" type="text/javascript"> </script>
                 <script src="views/inboxes/audio-bridge.js" type="text/javascript"> </script>
                 <script src="views/inboxes/inbox-chats-tickets.js" type="text/javascript"> </script>
                               
                            ';
            $contentFile = 'views/inboxes/inbox-parent.php';
            $contentCSSFile = ' 
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rk4bir/simple-tags-input@latest/src/simple-tag-input.min.css">
                                 <link href="views/inboxes/ring.css" rel="stylesheet"> 
                               
                              ';
            break;

        default:
            return null;


    }
    return [
        'contentFile'=>$contentFile,
        'contentJSFile'=>$contentJSFile,
        'contentCSSFile'=>$contentCSSFile,
        ];

}
