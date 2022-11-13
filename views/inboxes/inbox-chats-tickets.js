//// this script will  hold all the otherr tickets modules
let tagsArr = [] ;




let options = {
};
let tagsInputWithSearch //= new simpleTagsInput(options);

const input = document.getElementById('tagsInput');
input.addEventListener('keydown', function(e) {
    //console.log(e.key);
    if( e.key == 'Enter' ) {
   // alert('Enter input')
      let  tag = $("#simple-tag").val();
      console.log('Enter input',tag);
        createNewTag(tag);
    }
});



function setTicketsInViewTags(tagsArr){
    console.log('setTicketsInViewTags',tagsArr)
    if(tagsArr.length === 0){
        let lastTagsArr = tagsInputWithSearch.getTags();
        console.log('lastTagsArrXXXX',lastTagsArr)
        if(lastTagsArr && lastTagsArr.length > 0){
            lastTagsArr.forEach(ele=>{
                tagsInputWithSearch.removeTag(ele);
            });
        }
    }
    tagsArr.forEach(function(tag){
        tagsInputWithSearch.addTag(tag.label);
    })
}
function getTicketTags() {
    axios.get('/ticketing-service/api/v1/secured/ticket/tags/all')
        .then(res=>{
            console.log('xxxxxxx',res.data);
            tagsArr = []; // empty the cache

                 res.data.data.forEach((ele)=>{
                     tagsArr.push({
                          value: ele.id, label:ele.title
                 } )
                });
            const options = {
                inputEl: "tagsInput",
                listEl: "tagsList",
                autocompleteSearchList: tagsArr.map(x=>x.label)
            };
             tagsInputWithSearch = new simpleTagsInput(options);
        })
        .catch(function(err) {
            console.error(err);
        })

}
function getTicketsInViewTags(ticketId) {
    setTicketsInViewTags([]);
    $('#btnAcceptTicket').hide();

    axios.get('/ticketing-service/api/v1/secured/ticket/tags/get-ticket-tags?ticket_id='+ticketId)
        .then(res=>{
            console.log('getTicketsInViewTagsxxxxxxx:res.data.success::: ',res.data.success);
            console.log('getTicketsInViewTagsxxxxxxx:: ',res.data);
            if(res.data.success){
                console.log('res.data.data:', res.data.data)
                console.log('res.data.data.tags:', res.data.data.tags)
               let tags = []; // empty the cache
                res.data.data.tags.forEach((ele)=>{
                    tags.push({
                        value: ele.tagId, label:ele.tag
                    })
                });
                console.log('tags:', tags)
                setTicketsInViewTags(tags);
            }
        })
        .catch(function(err) {
            console.error(err);
        })
}

function  simpleTagsInputRemoveTag(a){
    console.log('tags:', a)
    // console.log('tags:', document.querySelectorAll(`[data-target='5r9f7i91cfra1658057421775eopj8rhhm5h']`))
    let eventName = a.getAttribute("data-target");
    let value = a.getAttribute("data-value");
    let options = { "type": "removeTag", "tagValue": value, element: a };
    $(a).parent().remove()
    console.log('options:', options)
    console.log('filtered:', tagsArr.filter(x=>x.label === value))
    removeTag(tagsArr.filter(x=>x.label === value)[0].value)
}

function simpleTagsInputAddTag (e) {
    /*
    * Takes simpleTagsInput list element as argument
    * Fires event to communicate with the plugin,
    * in order to add tag.
    */
    let eventName = e.getAttribute("data-target");
    let value = e.getAttribute("data-value");
    let options = { "type": "addTag", "tagValue": value, element: e };
    console.log('simpleTagsInputAddTag:options:', options)
    tagsInputWithSearch.addTag(value);
    createNewTag(value);
  //  simpleTagsInputCreateEvent(eventName, options);
}
function removeTag(id){
    axios.post('/ticketing-service/api/v1/secured/ticket/tags/delete',{
        tag_id :id
    }).then(res=>{
        res= res.data;
        console.log('deleted new tag' , res);
        if(res.success){
            tagsArr = tagsArr.filter(x=>x.id !== id);
        }else{
            console.log(res.message);
        }

    }).catch(function(err) {
        console.error(err);
    });
}
function createNewTag(title){
    if(title === ''){
        return;
    }
    if(tagsArr .filter(x=>x.label === title).length > 0){
        addTagToTicket( tagsArr .filter(x=>x.label === title)[0].id , title)
        return;
    }
    axios.post('/ticketing-service/api/v1/secured/ticket/tags/create',{
        title :title
    }).then(res=>{
        res= res.data;
        console.log('added new tag' , res);
        if(res.success){
            res= res.data;
            tagsArr.push({
                value: res.tag.id, label:title
            });
            addTagToTicket( res.tag.id , title)
        }else{
            console.log(res.message);
        }

    }).catch(function(err) {
        console.error(err);
    });
}
function addTagToTicket(tagId ,tagTitle){
    axios.post('/ticketing-service/api/v1/secured/ticket/tags/set-tag-to-ticket',{
        tagId :tagId,
        tagTitle :tagTitle,
        ticketId :NONE_LIVE_CUSTOMER_REFERENCE_CHAT_IN_VIEW.ticketId
    }).then(res=>{

    })
}
getTicketTags();