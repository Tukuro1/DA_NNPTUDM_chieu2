async function loadMyInvoice() {
    var url = 'http://localhost:3000/invoices';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td onclick="loadDetailInvoice(${list[i].InvoiceID})" data-bs-toggle="modal" data-bs-target="#modaldeail"><a class="yls pointer-event">${list[i].InvoiceID}</a></td>
                    <td class="floatr">${list[i].CreatedAt}</td>
                    <td class="floatr"><span class="yls">${formatmoney(Number(list[i].TotalAmount) + Number(0))}</span></td>
                </tr>`
    }
    document.getElementById("listinvoice").innerHTML = main
    document.getElementById("sldonhang").innerHTML = list.length+' đơn hàng'
}

async function loadDetailInvoice(id) {
    var url = 'http://localhost:3000/invoices/'+id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await res.json();
    list = list.items
    var main = ''
    for(i=0; i< list.length; i++){
        main += `<tr>
                    <td>${list[i].ProductID}</td>
                    <td>${formatmoney(list[i].UnitPrice)}</td>
                    <td class="sldetailacc">${list[i].Quantity}</td>
                    <td class="pricedetailacc yls">${formatmoney(list[i].UnitPrice * list[i].Quantity)}</td>
                </tr>`
    }
    document.getElementById("listDetailinvoice").innerHTML = main
}
