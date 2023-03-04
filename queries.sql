-- Multi-Table Sorgu Pratiği

-- Tüm ürünler(product) için veritabanındaki ProductName ve CategoryName'i listeleyin. (77 kayıt göstermeli)
select product.ProductName, category.CategoryName from product
join category on category.id = product.CategoryId;

-- 9 Ağustos 2012 öncesi verilmiş tüm siparişleri(order) için sipariş id'si (Id) ve gönderici şirket adını(CompanyName)'i listeleyin. (429 kayıt göstermeli)
select [order].Id, customer.CompanyName from [order]
join customer on [order].CustomerId = customer.id
where OrderDate < '2012-08-09';

-- Id'si 10251 olan siparişte verilen tüm ürünlerin(product) sayısını ve adını listeleyin. ProdcutName'e göre sıralayın. (3 kayıt göstermeli)
select count(orderDetail.Quantity), product.ProductName from OrderDetail
join product on product.Id = OrderDetail.ProductId
where OrderId = 10251
group by ProductName
order by product.ProductName;

-- Her sipariş için OrderId, Müşteri'nin adını(Company Name) ve çalışanın soyadını(employee's LastName). Her sütun başlığı doğru bir şekilde isimlendirilmeli. (16.789 kayıt göstermeli)
select [order].Id as 'OrderId', customer.CompanyName, employee.LastName from [order]
join customer on [order].CustomerId = customer.Id
join employee on [order].EmployeeId = employee.Id 



-- Esnek görev 1
SELECT CustomerId ,count(CustomerId) as 'SiparisSayisi' FROM [Orders]
group by CustomerId;

-- Esnek görev 2
SELECT EmployeeId, count(EmployeeId) as 'SiparisSayisi' FROM [Orders]
group by EmployeeId
order by count(EmployeeId) desc
limit 5;

-- Esnek görev 3 
select [order].EmployeeId, Sum(OrderDetail.UnitPrice) from OrderDetail 
join [order] on OrderDetail.OrderId = [order].Id

group by [order].EmployeeId
order by  Sum(OrderDetail.UnitPrice) desc
limit 5

-- Esnek görev 4
select Category.CategoryName, Sum(OrderDetail.UnitPrice) as 'En az gelir getiren kategori' from [OrderDetail]
join Product on OrderDetail.ProductId = Product.Id
join Category on Category.Id = Product.CategoryId

group by Category.CategoryName
limit 1;

-- Esnek görev 5 
select Customer.Country, Count(customer.Country) from [order]
join Customer on Customer.Id = [order].CustomerId

group by [customer].ContactName
order by count(customer.Country) desc;