async function addCart(product) {
    var user = window.localStorage.getItem("user");
    user = JSON.parse(user);
   var quantity = document.getElementById("inputslcart").value;
   if(quantity > product.Stock){
        toastr.error("Sản phẩm chỉ còn "+product.Stock);
        return;
   }
    var cart = {
       "ProductID":product.ProductID,
       "Quantity":quantity,
    }
    const response = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(cart)
    });
   if(response.status > 300){
       var text = await response.text();
       toastr.error(text);
   }
   else{
       toastr.success("Thêm giỏ hàng thành công");
   }
}


async function loadAllCart() {
    const response = await fetch('http://localhost:3000/cart', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status > 300){
        var text = await response.text();
        var main = `<tr><td colspan="4">${text}</td></tr>`
        document.getElementById("listcartDes").innerHTML = main
        return;
    }
    var result = await response.json();
    var list = result.items
    console.log(list)
    var main = ''
    var total = 0;
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>
                        <a href="detail?id=${list[i].ProductID}"><img class="imgprocart" src="${list[i].ImageURL}"></a>
                        <div class="divnamecart">
                            <a href="detail?id=${list[i].ProductID}" class="nameprocart">${list[i].Name}</a>
                        </div>
                    </td>
                    <td><p class="boldcart">${formatmoney(list[i].UnitPrice)}</p></td>
                    <td>
                        <div class="clusinp"><button onclick="upDownQuantity(${list[i].CartItemID},${Number(list[i].Quantity - 1)})" class="cartbtn"> - </button>
                        <input value="${list[i].Quantity}" class="inputslcart">
                        <button onclick="upDownQuantity(${list[i].CartItemID},${Number(list[i].Quantity + 1)})" class="cartbtn"> + </button></div>
                    </td>
                    <td>
                        <div class="tdpricecart">
                            <p class="boldcart">${formatmoney(list[i].TotalPrice)}</p>
                            <p onclick="remove(${list[i].CartItemID})" class="delcart"><i class="fa fa-trash-o facartde"></i></p>
                        </div>
                    </td>
                </tr>`
        total += Number(list[i].TotalPrice)
    }
    document.getElementById("listcartDes").innerHTML = main
    document.getElementById("slcart").innerHTML = list.length
    document.getElementById("tonggiatien").innerHTML = formatmoney(total)
}

async function remove(id) {
    var con = confirm("Xác nhận xóa sản phẩm khỏi giỏ hàng?");
    if(con == false) return;
    var url = 'http://localhost:3000/cart/'+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var text = await response.text();
    if(response.status < 300){
        toastr.success(text);
        loadAllCart();
    }
    else{
        toastr.error(text);
    }
    loadAllCart();
}

async function upDownQuantity(id, quantity) {
    var url = 'http://localhost:3000/cart/'+id;
    var obj = {
        "Quantity": quantity
    }
    const response = await fetch(url, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(obj)
    });
    var text = await response.text();
    if(response.status < 300){
        toastr.success(text);
        loadAllCart();
    }
    else{
        toastr.error(text);
    }
}

async function checkout(){
    var con = confirm("Xác nhận đặt hàng?");
    if(con == false) return;
    var vouchercode = document.getElementById("vouchercode").value;
    var obj = {
        "VoucherCode":vouchercode==""?null:vouchercode
    }
    var url = 'http://localhost:3000/cart/checkout';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(obj)
    });
    if(response.status < 300){
        swal({
            title: "Thông báo",
            text: "Đặt hàng thành công, hãy tiếp tục mua sắm nhé!",
            type: "success"
        }, function() {
            window.location.href = '/'
        });
    }
    else{
        var text = await response.text();
        toastr.error(text);
    }
}

