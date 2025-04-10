-- Active: 1743886746588@@127.0.0.1@1433@DA_QLBH
CREATE DATABASE DA_QLBH

GO

USE DA_QLBH

GO

-- Thêm dữ liệu vào bảng Categories
INSERT INTO Categories (Name, Description)
VALUES 
('Áo', 'Danh mục các loại áo'),
('Quần', 'Danh mục các loại quần'),
('Giày', 'Danh mục các loại giày'),
('Phụ kiện', 'Danh mục các loại phụ kiện');

GO

-- Thêm dữ liệu vào bảng Products
INSERT INTO Products (Name, Description, Price, Stock, ImageURL, Size, Color, CategoryID)
VALUES 
('Áo sơ mi trắng', 'Áo sơ mi trắng cao cấp', 250000, 50, 'https://sbhtailor.vn/wp-content/uploads/2022/08/mix-ao-so-mi-trang-nam-1.jpg', 'M', 'Trắng', 1),
('Áo thun đen', 'Áo thun đen thoáng mát', 150000, 100, 'https://down-vn.img.susercontent.com/file/b2ec0cc362006e8dddde77df97564aa7', 'L', 'Đen', 1),
('Quần jean xanh', 'Quần jean xanh thời trang', 350000, 30, 'https://pubcdn.ivymoda.com/files/news/2023/10/27/c284d544a99b014031efd25821f60441.jpg', '32', 'Xanh', 2),
('Giày thể thao', 'Giày thể thao năng động', 500000, 20, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/449/472/products/vn-11134207-7r98o-lo2ho07q4ghmea-1699958923523.jpg?v=1699959270613', '42', 'Trắng', 3),
('Mũ lưỡi trai', 'Mũ lưỡi trai thời trang', 100000, 70, 'https://product.hstatic.net/1000312752/product/68e33fe9f15c22602b5ff90da8553b5a3cfe2a31e9c2b5c4da3371b38624078f777ed3_b603631672a742c583524309180ecea1.jpg', 'Free Size', 'Đen', 4),
('Áo sơ mi đen dài tay', 'Áo sơ mi đen dài tay cao cấp', 300000, 50, 'https://sbhtailor.vn/wp-content/uploads/2024/01/1-1-1.png', 'L', 'Đen', 1);


GO

-- Thêm dữ liệu vào bảng roles
INSERT INTO Roles (RoleName, Description)
VALUES 
('Admin', 'Quản trị viên hệ thống'),
('User', 'Người dùng bình thường');

GO

-- Thêm dữ liệu vào bảng Users
INSERT INTO Users (Username, Password, Email, Phone, Address)
VALUES
('admin', 'admin123', 'admin@example.com', '0123456789', '123 Admin St.'),
('user', 'user123', 'user@example.com', '0987654321', '456 User Ave.');

GO

-- Thêm dữ liệu vào bảng UserRoles
INSERT INTO UserRoles (UserID, RoleID)
VALUES
(1, 1), -- Admin
(2, 2); -- User

GO

-- Thêm dữ liệu vào bảng Vouchers
INSERT INTO Vouchers (Code, DiscountPercentage, ExpiryDate, IsActive)
VALUES 
('VOUCHER10', 10, '2023-12-31', 1),
('VOUCHER20', 20, '2023-12-31', 1),
('VOUCHER30', 30, '2023-12-31', 1);

GO