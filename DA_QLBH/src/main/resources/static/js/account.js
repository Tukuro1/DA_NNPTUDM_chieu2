async function login() {
    var url = 'http://localhost:3000/login'
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var user = {
        "Username": username,
        "Password": password,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    if(response.status > 300){
        var text = await response.text();
        toastr.warning(text);
        return;
    }
    var result = await response.json();
    if (response.status < 300) {
        localStorage.setItem("token", result.token);
        var url = 'http://localhost:3000/profile';
        const res = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + result.token
            })
        });
        var profile = await res.json();
        localStorage.setItem("user", JSON.stringify(profile));
        console.log(profile)
        window.location.href = '/'
    }
}

async function regis() {
    var url = 'http://localhost:3000/register'
    var user = {
        "FullName": document.getElementById("fullname").value,
        "Email": document.getElementById("email").value,
        "Username": document.getElementById("username").value,
        "Phone": document.getElementById("phone").value,
        "Address": document.getElementById("address").value,
        "Password": document.getElementById("password").value
    }
    if(user.Password !=  document.getElementById("repassword").value){
        toastr.error("Mật khẩu không trùng khớp");return;
    }
    if(user.Password !=  document.getElementById("repassword").value){
        toastr.error("Mật khẩu không trùng khớp");return;
    }
    if(validatePassword(user.Password) == false){
        return;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.text();
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "đăng ký thành công",
                type: "success"
            },
            function() {
                window.location.href = '/login'
            });
    }
    else {
        toastr.warning(result);
    }
}

function validatePassword(password) {
    // Kiểm tra nếu mật khẩu trống
    if (!password) {
        toastr.warning("Mật khẩu không được để trống.");
        return false;
    }

    // Kiểm tra mật khẩu có ít nhất 8 ký tự
    if (password.length < 8) {
        toastr.warning("Mật khẩu phải có ít nhất 8 ký tự.");
        return false;
    }

    // Kiểm tra có ít nhất 1 chữ cái
    if (!/[a-zA-Z]/.test(password)) {
        toastr.warning("Mật khẩu phải có ít nhất 1 chữ cái.");
        return false;
    }

    // Kiểm tra có ít nhất 1 chữ cái in hoa
    if (!/[A-Z]/.test(password)) {
        toastr.warning("Mật khẩu phải có ít nhất 1 chữ cái in hoa.");
        return false;
    }

    // Kiểm tra có ít nhất 1 ký tự đặc biệt
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        toastr.warning("Mật khẩu phải có ít nhất 1 ký tự đặc biệt.");
        return false;
    }
    return true;
}

async function loadTaiKhoan() {
    var url = 'http://localhost:3000/profile';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
    });
    var acc = await response.json();
    document.getElementById("email").value = acc.Email
    document.getElementById("fullname").value = acc.FullName
    document.getElementById("phone").value = acc.Phone
    document.getElementById("address").value = acc.Address
}

async function updateTaiKhoan() {
    var obj = {
        "Email":document.getElementById("email").value,
        "FullName":document.getElementById("fullname").value,
        "Phone":document.getElementById("phone").value,
        "Address": document.getElementById("address").value,
    }
    var url = 'http://localhost:3000/profile';
    const response = await fetch(url, {
        method: 'PUT',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(obj)
    });
    var text = await response.text();
    if(response.status < 300){
        toastr.success(text)
    }
    else{
        toastr.error(text)
    }
}