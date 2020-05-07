var list = document.querySelectorAll(".literal")
var res = new Set();
list.forEach((ele)=>{
    res.add(ele.textContent);
})
console.log(res);