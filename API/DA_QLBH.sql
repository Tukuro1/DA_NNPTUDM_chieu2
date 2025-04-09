-- Active: 1743886746588@@127.0.0.1@1433@DA_QLBH
CREATE DATABASE DA_QLBH

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
('Áo sơ mi trắng', 'Áo sơ mi trắng cao cấp', 250000, 50, 'https://example.com/images/ao-so-mi-trang.jpg', 'M', 'Trắng', 1),
('Áo thun đen', 'Áo thun đen thoáng mát', 150000, 100, 'https://example.com/images/ao-thun-den.jpg', 'L', 'Đen', 1),
('Quần jean xanh', 'Quần jean xanh thời trang', 350000, 30, 'https://example.com/images/quan-jean-xanh.jpg', '32', 'Xanh', 2),
('Giày thể thao', 'Giày thể thao năng động', 500000, 20, 'https://example.com/images/giay-the-thao.jpg', '42', 'Trắng', 3),
('Mũ lưỡi trai', 'Mũ lưỡi trai thời trang', 100000, 70, 'https://example.com/images/mu-luoi-trai.jpg', 'Free Size', 'Đen', 4);

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