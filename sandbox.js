var tmp;
var words = new Set();
for (var i = 0; i < localStorage.length; i ++){
    tmp = localStorage.getItem(i);
    if(tmp){words.add(tmp)}
}
console.log(words);
