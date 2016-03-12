var set_url = function(uuid, original_url){
    var final_url = [original_url, "&widget_ref=", window.location.hostname].join("");
    var element = document.getElementById(uuid);        
    element.src = final_url.replace(/service.24media.gr/g, 'www.deltiokairou.gr');
}