var tmp;
var words = new Set();
for (var i = 0; i < localStorage.length; i ++){
    tmp = localStorage.getItem(i);
    if(tmp){words.add(tmp)}
}
//console.log(words);


function inject(loc,val){document.getElementById(loc).innerHTML = val;}
function join(list, obj){obj.ndx = list.length; list.push(obj);}


function repaint(){inject('HTM', DB.htm()); inject('MSQ', DB.msq());}
window.onload = function(){repaint();}

//------------------Editable Strings---------------------

var HUH = '<span class="HUH">?</span>';
var ES = []; // all the editable strings
var editNdx = -1; // which ES is currently a text box
function kup(ndx){var t = document.getElementById('ES').value;
  if(ES[ndx].str != t){ES[ndx].str = t;}else{editNdx = -1; repaint();}
}
function edit(ndx){editNdx = ndx; repaint();}
function Es(prompt){this.str = ''; join(ES, this); this.pr = prompt;}
Es.prototype.name = function(){
  if (this.str=='') {
    return HUH;
  }
  var ipt = this.str;
  var iptUpper = ipt.toUpperCase();
  if (words.has(iptUpper)) {
    alert('Your input is a reserved word. Choose another one!');
    this.str = "";
    return HUH;
  }
  return this.str;
}
Es.prototype.hName = function(){
  var res= '<span onclick="edit('+this.ndx+');">'+this.name()+'</span>';
  //alert(res);
  return res;
}
Es.prototype.box = function(){
  return this.pr + ': <input id="ES" value="'+this.str +
      '" onkeyup="kup('+this.ndx+');"/>'
}
Es.prototype.htm = function(){return (editNdx==this.ndx)?this.box():this.hName();}

//------------------------Database------------------------------

var DB = new Db('');

function Db(){this.es = new Es('enter name'); this.tables = [];}
Db.prototype.hName = function(){
  return '<h2><span class="PR">database: </span>'+this.es.htm()+'</h2>';}
Db.prototype.htm = function(){
  return this.hName() + this.hTables() + Db.addTabBtn;
}
Db.addTabBtn = '<br/><span class="HUH" onclick="addTab();" >Add Table</span>';
Db.prototype.hTables = function(){
  var res = '', t=this.tables;
  for(var i=0;i<t.length;i++){res+=t[i].htm();}
  return res;
}
Db.prototype.hAddNewTab = function(){
  return ;
}

Db.prototype.msq = function(){
  return this.msqUse() + this.msqCTs(); + this.msqTVs();
}
Db.prototype.msqUse = function(){
  return 'DROP DATABASE ' + DB.es.name() + ' IF EXISTS;<br/>' +
         'CREATE DATABASE ' + DB.es.name() + ';<br/>'  +
         'USE ' + DB.es.name() + ';<br/>'
}
Db.prototype.msqCTs = function(){
  var res = '';
  for(var i = 0; i<this.tables.length; i++){
    res += this.tables[i].mCT();
  }
  return res;
}
Db.prototype.msqTVs = function(){return '';}

//----------------------Tables -------------------------
function addTab(){var t = new Table();repaint();}
function Table(){
  this.es = new Es('enter name'); join(DB.tables, this); this.fields=[];
  this.data = [];
  new Field(this.ndx);
}
Table.prototype.htm = function(){
  return this.hName() + '<table border="1">'+this.th()+this.td()+'</table>';
}
Table.prototype.hName = function(){
  return '<br/><span class="PR">Table: </span>' + this.es.htm() + ' ' +this.addFBtn()+ ' ' + this.addDBtn();
}
Table.prototype.addFBtn = function(){
  return '<span class="HUH" onclick="addField(' + this.ndx +
    ');" title="add new Field">+F</span>';
}
Table.prototype.addDBtn = function(){
  return '<span class="HUH" onclick="addData(' + this.ndx +
    ');" title="add new Data Row">+D</span>';
}
Table.prototype.td = function(){
  var res = '', sep, a = '<tr><td>x</td><td>x</td></tr>'.split('x');
  for(var ir = 0; ir<this.data.length; ir++){
    var r = this.data[ir];
    res += a[0]; sep = '';
    for(var i=0; i<r.length; i++){res += sep+r[i].val(); sep = a[1];}
    res += a[2];
  }
  return res;
}
Table.prototype.th = function(){
  var a = '<tr><th>x</th><th>x</th></tr>'.split('x'), sep = '', res = a[0];
  for(var i = 0; i<this.fields.length; i++){
    res += sep+this.fields[i].hName(); sep = a[1];
  }
  return res+a[2];
}

var br2 = '<br/>&nbsp;&nbsp;';

Table.prototype.mCT = function(){
  var res = '<br/>CREATE TABLE ' + this.es.name() + '(';
  var sep = '';
  for(var i=0; i<this.fields.length; i++){
    res += sep + br2 + this.fields[i].mCT(); sep = ','
  }
  return res + '<br/>);<br/>';
}
function addData(ndx){
  var t = DB.tables[ndx], res = [];
  for(var i = 0; i<t.fields.length; i++){res.push(new Data(t.fields[i]));}
  t.data.push(res);
  repaint();
}


//---------------------- Fields ------------------------
function addField(ndx){new Field(ndx); repaint();}
function Field(tabNdx){
  this.table = DB.tables[tabNdx];
  this.es = new Es('');
  join(this.table.fields, this);
  this.type = 'INT';
  for(var i=0; i<this.table.data.length; i++){ // extend existing data
    this.table.data[i].push(new Data(this));
  }
}
Field.prototype.hName = function(){return this.es.htm();}

var PK = ' NOT NULL AUTO_INCREMENT, PRIMARY KEY (';
Field.prototype.mCT = function(){
  var fn = this.es.name();
  var ty = 'INT' +
    ((fn.length >=2 && fn.charAt(0)=='p' && fn.charAt(1)=='k')? PK + fn + ')' : '');

  return this.es.name() + ' ' + ty;
}
//---------------------- Data ---------------------------
function Data(field){this.field = field; this.es = new Es('val');}
Data.prototype.val = function(){return this.es.htm();}
