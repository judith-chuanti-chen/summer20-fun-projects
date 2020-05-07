$.ajax({
    url: "https://dev.mysql.com/doc/refman/8.0/en/keywords.html",
    dataType: 'jsonp',
    success: function(data){
      console.log( data );
    }
});
var list = document.querySelectorAll(".literal")
var res = new Set();
list.forEach((ele)=>{
    res.add(ele.textContent);
})
console.log(res);