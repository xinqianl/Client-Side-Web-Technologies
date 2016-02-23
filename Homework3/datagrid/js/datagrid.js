/**
 * Created by ali on 2/18/16.
 */
function DataGrid(input){

    this.data = input.data;
    this.rootElement = input.rootElement;
    this.columns = input.columns;
    this.sortBy = this.columns[0].dataName;
    this.pageSize = input.pageSize;
    this.onRender = input.onRender;

    //var this = this;
    this.currentPage = 1;
    if(this.pageSize === undefined){
        this.pageSize = this.data.length;
        this.lastPage = 1;
    }else{
        this.lastPage =  Math.ceil(this.data.length/this.pageSize);
    }
    this.Sort(this.columns[0].dataName);
    this.createTable();

}
DataGrid.prototype.destroy = function destroy(){
    var tables = document.getElementsByTagName("table");
    for(var i = 0; i < tables.length; i++){
        tables[i].parentElement.removeChild(tables[i]);
    }
}
DataGrid.prototype.Sort = function(input){
    this.sortBy = input;
    var that = this;
    this.data.sort(function (a, b) {
        if (a[that.sortBy] < b[that.sortBy])
            return -1;
        else if (a[that.sortBy] > b[that.sortBy])
            return 1;
        else
            return 0;
    });
}

DataGrid.prototype.createTable = function () {


    if(this.onRender!=undefined){
        this.onRender();
    }
    var div = document.getElementById(this.rootElement.id);
    div.innerHTML = "";
    div.innerHTML += "<table id=\""+"myTable "+div.id+"\"> </table>"
    var table = document.getElementById("myTable "+div.id);
    var that = this;
    var createPage= function (that){
        var caption = document.createElement("caption");
        caption.style.textAlign = "right";

        var preButton = document.createElement("button");
        preButton.innerHTML = "< Previous";
        var preHandler = function(){
            return function () {
                that.currentPage -= 1;
                that.createTable();
            };
        };
        if(that.currentPage==1){
            preButton.disabled = true;
        }else {
            preButton.disabled = false;
            preButton.style.color="blue";
            preButton.onclick = preHandler();
        }
        preButton.style.fontSize = "1em";
        caption.appendChild(preButton);

        var text = document.createElement("b");
        text.innerHTML = " "+that.currentPage+" of "+that.lastPage+" ";
        text.style.fontSize="1em";
        text.style.fontWeight="normal";
        caption.appendChild(text);

        var nextButton = document.createElement("button");
        nextButton.style.fontSize = "1em";
        nextButton.innerHTML = "Next >";
        var nextHandler = function(){
            return function (){
                that.currentPage+=1;
                that.createTable();
            };
        };
        if(that.currentPage==that.lastPage){
            nextButton.disabled = true;
        }else {
            nextButton.disabled = false;
            nextButton.style.color="blue";
            nextButton.onclick = nextHandler(this);
        }
        caption.appendChild(nextButton);
        table.appendChild(caption);
    }
    if(!(this.pageSize===undefined || this.data.length<=this.pageSize)){
        createPage(that);
    }

    var header = table.createTHead();
    var row = table.insertRow(0);


    for (var j = 0; j < this.data.length; j++) {
        if(j<(this.currentPage-1)*this.pageSize || j>= (this.currentPage*this.pageSize)){
            continue;
        }
        var row = table.insertRow(-1);
        for (var k = 0; k < this.columns.length; k++) {
            var cell = document.createElement('td');
            if(this.columns[k].dataName == this.sortBy){
                cell.id='sortedCol';
            }
            cell.innerHTML = this.data[j][this.columns[k].dataName];
            cell.style.textAlign =this.columns[k].align;
            cell.style.width = this.columns[k].width+"px";
            row.appendChild(cell);
        }
    }

    row = header.insertRow(0);
    for (var i = 0; i < this.columns.length; i++) {
        var th = document.createElement('th');
        th.innerHTML = this.columns[i].name;
        th.style.textAlign =this.columns[i].align;
        th.style.width = this.columns[i].width+"px";


        this.createClickHandler = function(name, that)
        {
            return function() {
                if(that.sortBy!=name) {
                    that.Sort(name);
                    that.createTable();
                }else{
                    that.data = that.data.reverse();
                    that.createTable();
                }
            };
        };
        var that = this;
        th.onclick = this.createClickHandler(this.columns[i].dataName,that);
        th.title = "Sort by "+this.columns[i].name;
        row.appendChild(th);

    }
};