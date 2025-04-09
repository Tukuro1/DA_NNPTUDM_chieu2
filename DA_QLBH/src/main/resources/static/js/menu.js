var token = localStorage.getItem("token");
const exceptionCode = 417;
var tokenFcm = "";
async function loadMenu() {
    var dn = `<span class="nav-item dropdown pointermenu gvs">
                <i class="fa fa-user" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Tài khoản</i>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="account">Tài khoản</a></li>
                    <li onclick="logout()"><a class="dropdown-item" href="#">Đăng xuất</a></li>
                </ul>
            </span>`
    if (token == null) {
        dn = `<a href="login" class="pointermenu gvs"><i class="fa fa-user"> Đăng ký/ Đăng nhập</i></a>`
        if(document.getElementById("btnchatbottom")){
            document.getElementById("btnchatbottom").style.display = 'none'
        }
    }
    var menu =
        `
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand d-none d-lg-block" href="/">
                <img style="width: 140px;" src="image/logo.png">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand navbar-toggler" href="index"><img style="width: 70px;" src="image/logo.png"></a>
            <span>
                <i data-bs-toggle="modal" data-bs-target="#modalsearch" class="fa fa-search navbar-toggler"></i>
                <i class="fa fa-shopping-bag navbar-toggler"> <span id="slcartmenusm" class="slcartmenusm">0</span></i>
            </span>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="mainmenut">
<!--                <li class="nav-item"><a class="nav-link menulink" href="index"><img style="width: 140px;" src="image/logo.png"></a></li>-->
                <li class="nav-item"><a class="nav-link menulink" href="about">Về chúng tôi</a></li>
            </ul>
            <div class="d-flex">
                <a href="#" data-bs-toggle="modal" data-bs-target="#modalsearch" class="pointermenu gvs"><i class="fa fa-search"></i></a>
                ${dn}
                <a href="cart" class="pointermenu"><i class="fa fa-shopping-bag">Giỏ hàng</i></a>
            </div>
        </div>
    </nav>`
    document.getElementById("menu").innerHTML = menu
    // loadCartMenu();
    try { loadFooter(); } catch (error) {}
}


function loadFooter() {
    var foo = `<footer class="text-center text-lg-start text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div class="me-5 d-none d-lg-block"><span>Theo dõi chúng tôi tại:</span></div>
        <div>
        <a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-github"></i></a>
        </div>
    </section>
    <section class="">
        <div class=" text-center text-md-start mt-5">
        <div class="row mt-3">
            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4"><i class="fas fa-gem me-3"></i>Sneaker Easy-Shop</h6>
            <p>
                Chúng tôi tự hào là đơn vị cung cấp các sản phẩm giày thời trang chất lượng cao với mức giá phải chăng, phù hợp cho cả nam, nữ và giới trẻ hiện đại. Với sự đa dạng về mẫu mã, kiểu dáng và màu sắc, bộ sưu tập của chúng tôi luôn được cập nhật để bắt kịp xu hướng thời trang mới nhất. Dù bạn yêu thích phong cách năng động, cá tính hay thanh lịch, tinh tế, chúng tôi đều có những lựa chọn hoàn hảo dành riêng cho bạn. Hãy để chúng tôi đồng hành cùng bạn trong hành trình thể hiện cá tính và phong cách riêng, giúp bạn tự tin tỏa sáng ở bất kỳ nơi đâu!
            </p>
            </div>
            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Sản phẩm</h6>
            <p><a href="#!" class="text-reset">Uy tín</a></p>
            <p><a href="#!" class="text-reset">Chất lượng</a></p>
            <p><a href="#!" class="text-reset">Nguồn gốc rõ ràng</a></p>
            <p><a href="#!" class="text-reset">Giá rẻ</a></p>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Dịch vụ</h6>
            <p><a href="#!" class="text-reset">24/7</a></p>
            <p><a href="#!" class="text-reset">bảo hành 6 tháng</a></p>
            <p><a href="#!" class="text-reset">free ship</a></p>
            <p><a href="#!" class="text-reset">lỗi 1 đổi 1</a></p>
            </div>
            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Liên hệ</h6>
            <p><i class="fas fa-home me-3"></i> Hà nội, Việt Nam</p>
            <p><i class="fas fa-envelope me-3"></i> shop@gmail.com</p>
            <p><i class="fas fa-phone me-3"></i> + 01 234 567 88</p>
            <p><i class="fas fa-print me-3"></i> + 01 234 567 89</p>
            </div>
        </div>
        </div>
    </section>
    </footer>`
    foo +=
        `<div class="modal fade" id="modalsearch" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down modelreplay">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" style="display: block;text-align: center !important;">Tìm kiếm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="searchmenu searchsm">
                    <input id="inputsearchmobile" onkeyup="searchMenuMobile()" class="imputsearchmenu" placeholder="Tìm kiếm sản phẩm...">
                    <button class="btnsearchmenu"><i class="fa fa-search"></i></button>
                </div>

                <div id="listproductsearchmobile" class="row">
                </div>
            </div>
        </div>
        </div>
    </div>`
    document.getElementById("footer").innerHTML = foo;
    try {
        loadMyChat();
    }
    catch (e){

    }
}

async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = '/'
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

async function loadCartMenu() {
    var listcart = localStorage.getItem("product_cart");
    if (listcart == null) {
        return;
    }
    var list = JSON.parse(localStorage.getItem("product_cart"));
    document.getElementById("slcartmenusm").innerHTML = list.length
    document.getElementById("slcartmenu").innerHTML = list.length
}

