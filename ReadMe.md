This is a service part of Click to Call app .



This is where the application makes sense as its the UI part of the whole beast .
In this repository is the Admin side of the application , as this is a support center type of application , this application is where the Agents or Admin users to communicate 
with the widget users .

The widget file is found under the _**public/widgetsrc-v-1.0.0.js**_ . This file is the one the clients or widget customers to the widget get to install on the website so that they can communicate with the  Agents or admin users

In this part of UI works if you run using any php server (version 7 plus) the app will run . On the index page the widget will show up , assuming the other services are running and the websocket server is running 

In the set as you will the widget file was hosted on  a remoted publicly accessible address ,just like how files or libraries like JQuery are hosted public so that when the users or your customers can be able to to see the widget on their website.


This application is not fully 100% to what was the target but the most of the functions except ticketing ,
still requires more touch up and the UI part of the , most of the ticketing API part works but was not fully tested!




Checklist to make the demo run:

-[X] https://github.com/kinsleykajiva/click2call-main-messages-service-version-2

-[X] https://github.com/kinsleykajiva/click2call-cron-job-service 

-[X] https://github.com/kinsleykajiva/click2call-Eurekadiscovery-service

- [X] https://github.com/kinsleykajiva/click2call-gatewayproxy-service

- [X] https://github.com/kinsleykajiva/click2call-ticketing-service


**how to run the php server** ? here you can put or use any port it's up to you : `php -S localhost:8080`




You need to have an understanding of the WebRTC , Janus ,Websockets , AWS (DevOps) , Microservices at least .


For an overall understanding of the application please review the Click to Call About repository as it describes the purpose of the application as a whole, as i appreciate the above docs do not fully express the whole system as much . 


The template used for this is paid for and paid for commercial use as well  .