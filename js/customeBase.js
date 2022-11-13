/**
 * Use this file only when the user is logged in
 * */

let API_BASE_URL = '',MESSAGE_CHAT_SERVICE_BASE_URL = '';
if(window.location.protocol === 'http:'){
    //localhost
 API_BASE_URL = 'http://localhost:8050';
 MESSAGE_CHAT_SERVICE_BASE_URL = 'http://localhost:3300' ;
}else{
     API_BASE_URL = 'https://api-app.xxxclick2callxxxxx.com';
     MESSAGE_CHAT_SERVICE_BASE_URL = 'https://api-chat-messages.xxxclick2callxxxxx.com';
}
//const  JANUS_URL = 'http://13.245.79.194:8088/janus';
const  JANUS_URL = 'https://primary-janus.xxxclick2callxxxxx.com/janus';
if (!Cookies.get ('apiToken')) { window.location.href = "auth?access=auth-expired";}
let loggedID = Cookies.get('userId') || null;
let companyId = Cookies.get('companyId') || null;
let userFullName = Cookies.get('fullName') || null;
let userProfileImageUrl = Cookies.get('userProfileImageUrl') || 'https://yootok.s3.eu-central-1.amazonaws.com/customer-service-agent.png';
const TOKEN = Cookies.get('apiToken') ;
let SYSTEM_CURRENCY = 'R' ;
let SYSTEM_CURRENCY_CODE = 'R' ;
const WIDGET_API_KEY = Cookies.get('WIDGET_API_KEY') || null;// 'c6f1bd16-5eb3-4e02-b1bd-165eb3de029d';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 1000 * 400;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse( TOKEN ).accessToken;

$("#loggedUserName").text(userFullName)
$("#loggedUserProfilePicture").attr( 'src' ,userProfileImageUrl)


accounting.settings = {
    currency: {
        symbol: '$',   // default currency symbol is '$'
        format: "%s %v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal: ".",  // decimal point separator
        thousand: ",",  // thousands separator
        precision: 2   // decimal places
    },
    number: {
        precision: 0,  // default precision on numbers is 0
        thousand: ",",
        decimal: "."
    }
};

const pageInAction = getEverythingAfterLastOccurrenceOfCharacter(window.location.pathname ,'/');
function checkAccess () {

    if (!Cookies.get ('apiToken')) {
        window.location.href = "auth?access=auth-expired";
        return;
    }
    axios.interceptors.response.use(res => {
        checkAuth(res.data);
        return res;
    }, error => Promise.reject(error));
    loggedID = parseInt(loggedID)
    companyId = parseInt(companyId)
}
 checkAccess ();

/*********************************************************************************************/
/**
 * this is for moment only*/
function convertToLocalTime(timeData){
    let gmtDateTime = moment.utc(timeData, "YYYY-MM-DD HH:mm:ss")
   return  gmtDateTime.local().format('YYYY-MM-DD HH:mm:ss');
}
/*********************************************************************************************/

function checkAuth(jdata){
console.log('Auth Checker',jdata)
    if(jdata.hasOwnProperty('access') /*use this approach as the checker if the property exists*/){
        if(!jdata.access){
            console.log('Logg out the user since api access has been rejected.');
            window.location.href = "auth";
        }
    }


}

/*********************************************************************************************/
String.prototype.replaceAll = function(f,r){return this.split(f).join(r);}
/*********************************************************************************************/
function allowTextInputOnly($objectInput) {
    $("#"+$objectInput).bind('keyup blur',function(){
        let node = $(this);
        node.val(node.val().replace(/[^a-z]/g,'') ); }
    );
}
/*********************************************************************************************/



if(pageInAction === 'view-home'){
    $("#navViewHome").addClass("active")
}

if(pageInAction === 'view-messages'){
    $("#navViewMessages").addClass("active")
}
if(pageInAction === 'view-settings'){
    $("#navViewSettings").addClass("active")
}
/*********************************************************************************************/
/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variabl
 es/
 * @param {String} url The URL
 * @return {Object}
 The URL parameters
 */
let getParams =  url=> {
    let params = {};
    let parser = document.createElement('a');
    parser.href = url;
    const query = parser.search.substring(1);
    const vars = query.split('&');
    if(vars.length < 1 || vars[0]===''){
        return null;
    }
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if(decodeURIComponent(pair[1]).trim() === ''){
            return null;
        }
        if(decodeURIComponent(pair[1]) === "undefined"){
            return null;
        }
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};
console.log("getParams",getParams())
/*********************************************************************************************/
function emptyInputs ( arrInput_ids , arrSelect_ids ) {
    arrInput_ids = arrInput_ids || [];
    arrSelect_ids = arrSelect_ids || [];
    for(let i = 0 ; i < arrInput_ids.length ; i ++){
        let id = arrInput_ids[i];
        $("#"+id).val('');
    }
    for(let i = 0 ; i < arrSelect_ids.length ; i ++){
        let id = arrSelect_ids[i];
        $("#"+id).val('null');
    }

}



/*********************************************************************************************/
function error_perInput(inputElement, errorMessage) {
    if (errorMessage === '') {
        $(inputElement).css(
            {
                "border-color":"black"
            }
        );
        //$(inputElement).text("");
    } else {
        $(inputElement).text(errorMessage);
        $(inputElement).css({
            "border-color": "red"
        });
        showErrorMessage(errorMessage, 5.5);
    }
}
/*********************************************************************************************/
function error_input_element(isTrue , elementId) {
    if(isTrue){
        $('#'+elementId).css({
            "border": "1px solid red",
            "background": "#ff4e44"
        });

    }else{
        $('#'+elementId).css({
            "border": "",
            "background": ""
        });
    }

}
/*********************************************************************************************/
/*********************************************************************************************/
function getcurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd ;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return mm + '/' + dd + '/' + yyyy;
}
/*********************************************************************************************/
function isEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
/*********************************************************************************************/
function simpleAcronymExpression(text) {
    return text
        .split(/\s/)
        .reduce((accumulator, word) =>{
            word  = word === '&' ? '' : word;
            word  = word === 'and' ||  word === 'with' ||  word === 'is' ? '' : word;
            word  = word === 'to' || word === 'tO' || word === 'To' || word === 'TO' ? '' : word;
            word = word.replaceAll(',' , ' ');
            return accumulator + word.charAt(0).toUpperCase();
        }, '');
}
/*********************************************************************************************/
function removeLoadingOn(element_id_String){
    $('#' + element_id_String).unblock();

}

/*********************************************************************************************/
function getEverythingAfterLastOccurrenceOfCharacter(str , char) {
    return str.split(char).pop();
}

/*********************************************************************************************/
function removeEverythingAfterLastOccurrenceOfCharacter(str , char) {
    return str.substring(0, str.lastIndexOf(char) + 1);
}
/*********************************************************************************************/
function randString(x) {
    var s = "";
    while (s.length < x && x > 0) {
        var r = Math.random();
        s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
    }
    return s;
}
/*********************************************************************************************/
/**
 * Gets the random integer between min and max (both included)
 *
 * @param      {number}  min     The minimum
 * @param      {number}  max     The maximum
 * @return     {<type>}  The random integer.
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*********************************************************************************************/
/**
 * Creates a random receipt Number between min and max (both included)
 * @return     {<String>}  random receipt Number.
 */
function receiptNumber() {
    let ret = "";
    ret = getcurrentDate(); //  dd + '/' + mm + '/' + yyyy;
    let dd = ret.split('/')[0];
    let mm = ret.split('/')[1];
    let yyyy = ret.split('/')[2];
    let ranS = randString(getRndInteger(5, 8)).toUpperCase();
    ret = dd + ranS.substring(2, 4) + ranS.charAt(getRndInteger(1, 2)) + '-' + mm + '-' + ranS.charAt(getRndInteger(1, 4)) + yyyy;
    return ret;
}
/*********************************************************************************************/
/**
 * Converts a Turkish Z-Date format to  date form MM/DD/YYYY
 * @param      {String} zDate   The date to be converted
 * @return     {String}  Date String.
 */
function dateConvertor(zDate) {
    return new Date(zDate).toDateString();
}
/*********************************************************************************************/
/**
 * Converts a Turkish Z-Date format to  date form MM/DD/YYYY
 * @param      {String} zDate   The date to be converted
 * @return     {String}  Date String.
 */
function getDateConvertion(zdate) {
    let date = new Date(zdate);
    return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
}
/*********************************************************************************************/
function getCurrentTimeLong(){
    return new Date().getTime();
}
/*********************************************************************************************/
/**
 * Creates a random String based on the chars input <br>
 * example of usage: randomString(5); or randomString(5,
 * 'PICKCHARSFROMTHISSET');
 * <br>
 * @param {integer} length - size of the output .
 * @param {string} chars - can be ignored ,but the the characters to use in
 *         creating the output.
 * @returns {String} Random string of size @param lenSize
 */
function randomIDString(lenSize, chars) {
    let charSet = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = "";
    for (let i = 0; i < lenSize; i++) {
        let position = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(position, position + 1);
    }
    return randomString;
}
function randomNumbers ( min , max ) {
    return (Math.floor(Math.random() * max) + min);
}
/*********************************************************************************************/
/**
 * Create a random String of alphabet and numbers
 * @returns {string} Random String
 */
function randomStringID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
/*********************************************************************************************/
/**This will reset the form*/
function resteForm(formIdObject) {
    formIdObject[0].reset();
}
/*********************************************************************************************/
function idleTimer() {
    let t;
    //window.onload = resetTimer;
    window.onmousemove = resetTimer; // catches mouse movements
    window.onmousedown = resetTimer; // catches mouse movements
    window.onclick = resetTimer; // catches mouse clicks
    window.onscroll = resetTimer; // catches scrolling
    window.onkeypress = resetTimer; //catches keyboard actions
    function logout() {
        window.location.href = '/action/logout'; //Adapt to actual logout script
    }

    function reload() {
        window.location = self.location.href; //Reloads the current page
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(logout, 1800000); // time is in milliseconds (1000 is 1 second)
        t = setTimeout(reload, 300000); // time is in milliseconds (1000 is 1 second)
    }
}
/*********************************************************************************************/
/*********************************************************************************************/
function removeLoadingScreen () {
    $.unblockUI({
        fadeOut: 100
    });
}
/*********************************************************************************************/
function loadingScreenElement(elementID, show, message) {
    if (show) {
        $('#' + elementID).block({
            message: message === '' ? `<img src="js/busy.gif" /> <br> <h3 style="color:white;">  Processing.Please Wait...</h3>` : `<img src="js/busy.gif"/><br> <h3 style="color:white;">  ` + message + `</h3>`,
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: 0.5,
                color: '#fff'
            }
        });
    } else {
        $('#' + elementID).unblock();
    }
}
/**
 * This will show a UI blocking loading Screen*/
function loadingScreen(sho, message) {
    if (sho) {
        $.blockUI({
            message: message === '' ? `<h3 style="color:white;"> <img src="js/busy.gif" /> Processing.Please Wait...</h3>` : `<h3 style="color:white;"> <img src="js/busy.gif"/> ` + message + `</h3>`,
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: 'rgba(173,173,173,0.98)',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: 0.5,
                color: '#fff'
            }
        });
    } else {
        $.unblockUI({
            fadeOut: 100
        });
    }
}
/*********************************************************************************************/
function showLoadingOn(element_id_String){
    $('#' + element_id_String).block({
        message: '<i class="fas fa-spin fa-sync text-white"></i>',
        overlayCSS: {
            backgroundColor: '#000',
            opacity: 0.5,
            cursor: 'wait'
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: 'transparent'
        }
    });
}
/*********************************************************************************************/
function __(elementId) {
    return document.getElementById(elementId);
}
/*********************************************************************************************/
function isNumeric(num){
    return !isNaN(num);
}

/*********************************************************************************************/


// example filter function
function exampleFilter(el) {
    return elem.nodeName.toLowerCase() == 'a';
}
/*********************************************************************************************/

// usage
//el = document.querySelector('div');
// get all siblings of el
//var sibs = getSiblings(el);
// get only anchor element siblings of el
//var sibs_a = getSiblings(el, exampleFilter);
/*********************************************************************************************/
/**
 * This will convert a M/D/Y date format to dddd MMMM D YYYY
 * */
function convertDateToReadable(date_M_slash_D_slash_Y){
    // 02/12/2013
    let longDateStr = moment(date_M_slash_D_slash_Y, 'M/D/Y').format('dddd MMMM D YYYY');
    return (longDateStr);
}

/*********************************************************************************************/
/**
 * This will convert a M/D/Y date format to dddd MMMM D YYYY
 * */
function convertDateToReadableFormat(date_yyy_mm_dd){
    let longDateStr = moment(date_yyy_mm_dd, 'YYYY-MM-DD').format('dddd MMMM D YYYY');
    // alert(new Date("2018-07-27").toUTCString().split(" "))
    return (longDateStr);
}
/*********************************************************************************************/
/*********************************************************************************************/

function capitaliseTextFristLetter ( string ) {

    return !string ?string: string.charAt(0).toUpperCase() + string.slice(1);
}

/*********************************************************************************************/
function capitaliseTextFirstCaseForWords(text) {
    if(!text){
        return text;
    }
    let firstLtr = 0;
    for (let i = 0; i < text.length; i++){
        if (i === 0 &&/[a-zA-Z]/.test(text.charAt(i)))
            firstLtr = 2;
        if (firstLtr === 0 &&/[a-zA-Z]/.test(text.charAt(i)))
            firstLtr = 2;
        if (firstLtr === 1 &&/[^a-zA-Z]/.test(text.charAt(i))){
            if (text.charAt(i) == "'"){
                if (i + 2 === text.length &&/[a-zA-Z]/.test(text.charAt(i + 1))) firstLtr = 3;
                else if (i + 2 < text.length &&/[^a-zA-Z]/.test(text.charAt(i + 2))) firstLtr = 3;
            }
            if (firstLtr === 3) firstLtr = 1;
            else firstLtr = 0;
        }
        if (firstLtr === 2){
            firstLtr = 1;
            text = text.substr(0, i) + text.charAt(i).toUpperCase() + text.substr(i + 1);
        }
        else {
            text = text.substr(0, i) + text.charAt(i).toLowerCase() + text.substr(i + 1);
        }
    }
    return text;
}

/*********************************************************************************************/
function scrollToElementID(elementIDOnly) {
    document.querySelector('#'+elementIDOnly).scrollIntoView({
        behavior: 'smooth'
    });
}
/*********************************************************************************************/
function chunkArrayGrouped(myArray, chunk_size){
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];
    let i = 1 ;
    for (index = 0; index < arrayLength; index += chunk_size) {

        const myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        let objGroup = {[i]:myChunk};
        tempArray.push(objGroup);
        i++;
    }

    return tempArray;
}
// result
/*[[object Object] {
 1: [1, 2, 3]
 }, [object Object] {
 2: [4, 5, 6]
 }, [object Object] {
 3: [7, 8]
 }]*/
/*********************************************************************************************/
/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunk_size){
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}
// Split in group of 3 items
// var result = chunkArray([1,2,3,4,5,6,7,8], 3);
// Outputs : [ [1,2,3] , [4,5,6] ,[7,8] ]
// console.log(result);
/*********************************************************************************************/
/**can be applied to any table*/
function noDataRow ( numberOfColumns , noDataMessage ) {
    let td = ``;
    for ( let i = 0 ; i < numberOfColumns ; i ++ ) {
        td += `
              <td style='color:red;'> ${ noDataMessage } </td>
            `;
    }
    return `<tr> ${ td } </tr>`;
}
/*********************************************************************************************/
/**can be applied to any table*/
function noDataRowDFlex ( numberOfColumns , noDataMessage ) {
    let td = ``;
    let isEven =   numberOfColumns % 2 === 0 ;
    let col = isEven ? 12 / numberOfColumns  : 12 / (numberOfColumns + 1);
    col = 'col-' + col ;
    for ( let i = 0 ; i < numberOfColumns ; i ++ ) {
        td += `
              <td class="${col}" style='color:red;'> ${ noDataMessage } </td>
            `;
    }
    return `<tr class="d-flex"> ${ td } </tr>`;
}

/*********************************************************************************************/

function isPasswordValid(str)
{
    // at least one number, one lowercase and one uppercase letter
    // at least six characters that are letters, numbers or the underscore
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    return re.test(str);
}



function showGeneralMessage (messageText,time) {
    iziToast.info({
        title: 'Information',
        message: messageText,
    });
    //__notify(messageText , 'top','right' , 'fa fa-check','inverse','animated fadeInRight','animated fadeOutRight',time , '');
}
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function showErrorMessage (messageText,time) {
    //__notify(messageText , 'top','right' , 'fa fa-check','danger','animated fadeInRight','animated fadeOutRight',time,'');
    iziToast.error({
        title: 'Error',
        message: messageText,
    });
}

function notifySuccess(message,timeInSeconds){
    timeInSeconds = timeInSeconds || 5
    window.notyf.open({
        type       : 'Success',
        message    : message,
        duration   : timeInSeconds*1_000,
        ripple     : true,
        background : '#5F63D3',
        dismissible: true,
        position   : {
            x: 'center',
            y: 'top'
        }
    });
}
function notifyError(message,timeInSeconds){
    timeInSeconds = timeInSeconds || 5
    window.notyf.open({
        type       : 'Danger',
        message    : message,
        duration   : timeInSeconds*1_000,
        ripple     : true,
        background : '#be1906',
        dismissible: true,
        position   : {
            x: 'center',
            y: 'top'
        }
    });
}

function showSuccessMessage (messageText,time) {
    iziToast.success({
        title: 'Success',
        message: messageText,
    });
    //__notify(messageText , 'top','right' , 'fa fa-check','success','animated fadeInRight','animated fadeOutRight',time , '');
}

/*********************************************************************************************/
function highlight_words(word) {
    const page = document.body.innerHTML;
    document.body.innerHTML = page.replace(new RegExp(word, "gi"), (match) => `<mark>${match}</mark>`);
}

/*********************************************************************************************/

function getCheckedInputsGetValues (className) {
    let checkedValue = [];
    let inputElements = document.getElementsByClassName(className);
    for(let i=0; inputElements[i]; ++i){
        if(inputElements[i].checked){
            checkedValue.push(inputElements[i].value);
        }
    }
    return  checkedValue;
}

function uncheckCheckedInputs (className) {

    let inputElements = document.getElementsByClassName(className);
    for(let i=0; inputElements[i]; ++i){
        if(inputElements[i].checked){
            inputElements[i].checked = false;
        }
    }

}

/*********************************************************************************************/

function largeGlobalModalFunctionalFormPositiveCancel(title,messageForm,positiveButtonTitle , NegativeButtonTitle,positiveCallBackAction,negativeCallBackAction,executeafterRenderCallBack) {
   const buttonP = positiveButtonTitle.toLowerCase().includes('delete') || positiveButtonTitle.toLowerCase().includes('remove') ? 'btn-danger':'btn-success';
    const template = `
    <div class="modal" id="globalModalFunctionalForm"  tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" >
 <div class="modal-dialog modal-lg" role="document">
<div class="modal-content">
<div class="modal-header ">
<h5 id="" class="modal-title">${title}</h5>
                <span style="visibility: hidden;" id="actionType"></span>
                <span style="display: none;" id="selectedGlobaleFormId"></span>

</div>
<div class="modal-body">
<p id=""> ${messageForm} </p>
</div>
<div class="modal-footer">
<button id="positiveCallBackActionModalAction" type="button"  class="btn ${buttonP}"> ${positiveButtonTitle} </button>
<button id="cancellBackActionModalAction"   type="button" data-dismiss="modal" class="btn btn-secondary" >${NegativeButtonTitle}</button>
</div>
</div>
</div>
</div>
    ` ;
    $('#globalTopModals').html(template);
    $("#globalModalFunctionalForm").modal ( {
        backdrop : 'static' ,
    } ).modal ( 'show' );
    if(executeafterRenderCallBack){
        executeafterRenderCallBack();
    }

    $("#positiveCallBackActionModalAction").click(()=>{
        positiveCallBackAction();
    });

    $("#cancellBackActionModalAction").click(()=>{
        negativeCallBackAction();
    });

}

/*********************************************************************************************/
/***
 * This functions works  given that the modal file has been included into the
 * page only
 * @param title string  name of the heading to be shown
 * @param subtitle string sub major title to the dialog
 * @param bodyHtmlText html this will be html string that is tbe rendered
 * @returns void
 * **/
function largeModalOk ( title  , subtitle , bodyHtmlText) {
    let modal_div = $ ( '#div_largeModal' ) ;
    if ( !modal_div .length ) {
        alert ( 'Error: \nModal File Not Included' );
    }
    else {
        modal_div.modal ( 'show' );
        $ ( '#myLargeTitle' ).text ( title );
        $ ( '#largeSubtitle' ).text ( subtitle );
        $ ( '#largeBody' ).html ( bodyHtmlText );
    }
}
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/
/*********************************************************************************************/




