var list = document.querySelectorAll(".literal")
var res = new Set();
for (var i = 0; i < list.length; i ++){
    localStorage.setItem(i, list[i].textContent)
}
window.document.location= './mysql.html'
