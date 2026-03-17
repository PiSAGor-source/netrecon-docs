---
slug: /
sidebar_position: 1
title: Bắt đầu với NetRecon
description: Nền tảng thông minh mạng dành cho MSP và đội ngũ CNTT
---

# Bắt đầu với NetRecon

NetRecon là nền tảng thông minh mạng được xây dựng dành cho MSP và đội ngũ CNTT. Nó cung cấp khả năng khám phá mạng tự động, quản lý thiết bị, quét lỗ hổng bảo mật, quản lý cấu hình và giám sát thời gian thực — tất cả đều truy cập được thông qua bảng điều khiển tập trung, ứng dụng di động và REST API.

## Chọn phương thức triển khai

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Tự lưu trữ

Triển khai NetRecon trên hạ tầng của riêng bạn bằng Docker Compose. Toàn quyền kiểm soát dữ liệu, không phụ thuộc bên ngoài.

- [Yêu cầu hệ thống](self-hosting/requirements)
- [Hướng dẫn cài đặt](self-hosting/installation)
- [Tham chiếu cấu hình](self-hosting/configuration)

**Phù hợp nhất cho:** Các tổ chức có yêu cầu nghiêm ngặt về chủ quyền dữ liệu, mạng cách ly, hoặc đã có sẵn hạ tầng máy chủ.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Đám mây (SaaS)

Bắt đầu ngay lập tức với NetRecon Cloud. Không cần thiết lập máy chủ — chỉ cần triển khai probe và bắt đầu quét.

- [Hướng dẫn khởi động nhanh](cloud/quickstart)

**Phù hợp nhất cho:** Các đội muốn bắt đầu nhanh chóng mà không cần quản lý hạ tầng máy chủ.

</div>

</div>

## Các thành phần nền tảng

| Thành phần | Mô tả |
|---|---|
| **Bảng điều khiển** | Bảng điều khiển dựa trên web cho tất cả tính năng của NetRecon |
| **NetRecon Scanner** | Ứng dụng Android để quét mạng khi di chuyển ([Tìm hiểu thêm](scanner/overview)) |
| **Admin Connect** | Ứng dụng quản lý Android cho quản trị từ xa ([Tìm hiểu thêm](admin-connect/overview)) |
| **Agent** | Agent nhẹ cho các thiết bị đầu cuối Windows, macOS và Linux ([Cài đặt](agents/overview)) |
| **Probe** | Cảm biến mạng dựa trên phần cứng hoặc VM để giám sát liên tục |
| **API** | RESTful API cho tự động hóa và tích hợp ([Tham chiếu API](api/overview)) |

## Cần trợ giúp?

- Duyệt tài liệu bằng thanh bên
- Xem [Tham chiếu API](api/overview) để biết chi tiết tích hợp
- Liên hệ [support@netreconapp.com](mailto:support@netreconapp.com) để được hỗ trợ
