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

-- Thêm dữ liệu vào bảng Products
INSERT INTO Products (Name, Description, Price, Stock, ImageURL, Size, Color, CategoryID)
VALUES 
('Áo sơ mi trắng', 'Áo sơ mi trắng cao cấp', 250000, 50, 'https://example.com/images/ao-so-mi-trang.jpg', 'M', 'Trắng', 1),
('Áo thun đen', 'Áo thun đen thoáng mát', 150000, 100, 'https://example.com/images/ao-thun-den.jpg', 'L', 'Đen', 1),
('Quần jean xanh', 'Quần jean xanh thời trang', 350000, 30, 'https://example.com/images/quan-jean-xanh.jpg', '32', 'Xanh', 2),
('Giày thể thao', 'Giày thể thao năng động', 500000, 20, 'https://example.com/images/giay-the-thao.jpg', '42', 'Trắng', 3),
('Mũ lưỡi trai', 'Mũ lưỡi trai thời trang', 100000, 70, 'https://example.com/images/mu-luoi-trai.jpg', 'Free Size', 'Đen', 4);