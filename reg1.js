const myDict = {
    "Capture Group": "()", "Start With": "^", "End With": "$", "Or": "|", "Word": "\\b", "Not Word": "\\B",
    "Digit": "\\d", "Not Digit": "\\D", "Word Character": "\\w", "Not Word Character": "\\W", "Whitespace Character": "\\s",
    "Not Whitespace Character": "\\S", "Horizontal Whitespace": "\\h", "Vertical Whitespace": "\\v",
    "Tab": "\\t", "Form Feed": "\\f", "New Line": "(\\r\\n|\\r|\\n)", "One-of Group": "[]"
}
var types = document.querySelectorAll(".dropdown-item");
var ok = document.querySelector("#ok");
var nextInsertPos = 0;
var fl = []; // list of frags, is result of parse
var f = new Frag(); // there is always a current frag that we are building

prep();

function prep() {
    ok.addEventListener('click', () => { insertText(getInput().value); getInput().value = "" });
    types.forEach(type => {
        type.addEventListener('click', () => {
            if (type.textContent == "Number(inclusive)") {
                getInput().value = "{}"; return;
            }
            insertText(myDict[type.textContent]);
        })
    });
    document.querySelector("#JS").addEventListener('click', e => {
        var ele = document.querySelector("#JS")
        var endPosition = ele.selectionEnd;
        nextInsertPos = endPosition;
    });
}

function insertText(str) {
    var currOut = getJS();
    // console.log(nextInsertPos);
    var pre = currOut.value.substring(0, nextInsertPos);
    var post = currOut.value.substring(nextInsertPos);
    // console.log(pre);
    // console.log(post);
    currOut.value = pre + str + post;
    nextInsertPos += str.length;
    js();
};
function getInput() { return document.querySelector("#in") };
function getJS() { return document.querySelector("#JS") };
function getType() { return document.querySelector(".dropdown-toggle").textContent }
function inject(loc, val) { document.getElementById(loc).innerHTML = val; }
function get(loc) { return document.getElementById(loc).value; }
function set(loc, val) { document.getElementById(loc).value = val; }

// ----- button onclick functions to allow editing of code ----
// function javaToJs(j){return j.replace(/\\(.)/g, '$1');}
function jsToJava(js) { return js.replace(/\\/g, '\\\\'); }

// function java(){set('JS', javaToJs(get('JAVA'))); inject('COL', jsToColor(get('JS')));}
function js() { set('JAVA', jsToJava(get('JS'))); inject('COL', jsToColor(get('JS'))); }

function regexParse(str) {
    var esc = false, cc = false, bb = false;
    fl = [], f = new Frag();
    var SM = '^$*+?.|', SA = 'bBdDfnrsStvwW'; // SA for escaped char class
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        var isMeta = SM.indexOf(c) >= 0; var isSA = SA.indexOf(c) >= 0;
        if (!esc) {
            if (c == '\\') { esc = true; f.addE(c); continue; }
            if (!cc && c == '{') { bb = true; f.addB(c); continue; }
            if (bb) { f.addB(c); if (c == '}') { bb = false; }; continue; }
            if (!cc && c == '[') { cc = true; f.addC(c); continue; }
            if (cc && c == ']') { cc = false; f.addC(c); continue; }
            if (!cc && (isMeta || c == '(' || c == ')')) { f.addM(c); continue; }
        }
        if (cc) { f.addC(c); esc = false; continue; } // escaped chars go in as literals to cc
        if (esc) {
            esc = false; // for next pass 
            if (isSA) { f.type = 'A'; f.str += c; continue; } // escaped Char class
        }
        f.addL(c);  // I think that the only thing left is literals
        esc = false;
    } // results sitting in fl - the frag list
}

function Frag() { this.type = '', this.str = ''; fl.push(this); f = this; }
Frag.prototype.setType = function (c) {
    if (this.type != '' && this.type != c) { new Frag(); }
    f.type = c;
}
Frag.prototype.addL = function (c) { this.setType('L'); f.str += c; }
Frag.prototype.addE = function (c) { this.setType('E'); f.str = '\\'; }
Frag.prototype.addB = function (c) { this.setType('B'); f.str += c; }
Frag.prototype.addC = function (c) { this.setType('C'); f.str += c; }
Frag.prototype.addM = function (c) { this.setType('M'); f.str += c; }

var preDef = {
    d: 'digit', D: '!digit', w: 'word', W: '!word', b: '\b',
    B: '\B', f: 'line-feed', n: 'new-line', r: 'return', s: 'ws', S: '!whiteSpace',
    t: 'tab', v: '\B'
};

function jsToColor(js) {
    regexParse(js);
    var res = '<span style="font-size:35px;">';
    for (var i = 0; i < fl.length; i++) {
        var type = fl[i].type;
        var s = fl[i].str;
        //var s = (type == 'A')? preDef[type] : fl[i].str;
        res += '<span class="' + type + '">' + s + '</span>';
    }
    //alert(res);
    return res + '</span>';
}