function getBreeds () {

    function onchange (){

        var dropdown = document.getElementById("mySelect");
        document.getElementById("breedName").innerHTML = dropdown.options[dropdown.selectedIndex].value;
        display(dropdown.options[dropdown.selectedIndex].id);
    };
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

        if(xhr.readyState === XMLHttpRequest.DONE) {

            if( ( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304 ) {

                var data = JSON.parse(xhr.responseText);
                var select = document.getElementById("mySelect");
                select.innerHTML = "";

                data.forEach(
                    function(val, index, array) {
                        var option = document.createElement("option");
                        option.id = val.id;
                        option.innerHTML = val.name;
                        select.appendChild(option);
                    }
                );
                document.getElementById("mySelect").addEventListener("change",onchange,false);
                onchange();
            } else {
                alert("Error: " + xhr.status);
            }
            xhr = null;
        }
    };

    xhr.open("get", "http://csw08724.appspot.com/breeds.ajax", true);
    xhr.send(null);
}

function display(id){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if( ( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304 ) {
                var data = JSON.parse(xhr.responseText);

                //console.log(id);
                //console.log(data);
                var section = document.getElementById("description");
                section.innerHTML = "";
                var p = document.createElement("p");
                p.innerHTML = "Description";
                section.appendChild(p);
                var div = document.createElement("div");
                div.innerHTML = data.description;
                section.appendChild(div);

                var section = document.getElementById("origins");
                section.innerHTML = "";
                var p = document.createElement("p");
                p.innerHTML = "Origins";
                section.appendChild(p);
                var div = document.createElement("div");
                div.innerHTML = data.origins;
                section.appendChild(div);

                var section = document.getElementById("rightforyou");
                section.innerHTML = "";
                var p = document.createElement("p");
                p.innerHTML = "Right for you?";
                section.appendChild(p);
                var div = document.createElement("div");
                div.innerHTML = data.rightForYou;
                section.appendChild(div);

                var slideshow = document.getElementById("slideshow");
                slideshow.innerHTML="";
                var div1 = document.createElement("div");
                var img = document.createElement("img");
                img.src="http://csw08724.appspot.com/"+data.imageUrl;
                div1.appendChild(img);
                slideshow.appendChild(div1);

                for(var i=0; i<data.extraImageUrls.length;i++){
                    var div1 = document.createElement("div");
                    var img = document.createElement("img");
                    img.src="http://csw08724.appspot.com/"+data.extraImageUrls[i];
                    div1.appendChild(img);
                    slideshow.appendChild(div1);
                }
                $(function(){
                    $("#slideshow > div:gt(0)").hide();

                    setInterval(function() {
                        $('#slideshow > div:first')
                            .fadeOut(1000)
                            .next()
                            .fadeIn(2000)
                            .end()
                            .appendTo('#slideshow');
                    },  5000);

                });

            } else {
                alert("Error: " + xhr.status);
            }
            xhr = null;
        }
    };

    xhr.open("get", "http://csw08724.appspot.com/breed.ajax"+"?id="+id, true);
    xhr.send(null);

}


getBreeds();



