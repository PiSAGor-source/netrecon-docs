---
sidebar_position: 1
title: Tổng quan về tự lưu trữ
description: Chạy nền tảng NetRecon trên hạ tầng của riêng bạn
---

# Tự lưu trữ

NetRecon có thể được tự lưu trữ hoàn toàn trên hạ tầng của riêng bạn, giúp bạn kiểm soát toàn bộ dữ liệu, bảo mật và triển khai.

## Tại sao nên tự lưu trữ?

| Lợi ích | Mô tả |
|---|---|
| **Chủ quyền dữ liệu** | Tất cả kết quả quét, cấu hình và nhật ký đều nằm trên máy chủ của bạn |
| **Tuân thủ** | Đáp ứng các yêu cầu quy định về lưu trữ dữ liệu tại chỗ |
| **Cách ly mạng** | Chạy trong môi trường cách ly không phụ thuộc internet |
| **Tích hợp tùy chỉnh** | Truy cập trực tiếp cơ sở dữ liệu cho báo cáo và tích hợp tùy chỉnh |
| **Kiểm soát chi phí** | Không cần giấy phép theo từng probe cho hạ tầng máy chủ |

## Kiến trúc

Một triển khai tự lưu trữ NetRecon bao gồm nhiều dịch vụ vi mô chạy trong các container Docker:

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Tổng quan dịch vụ

| Dịch vụ | Cổng | Mục đích |
|---|---|---|
| API Gateway | 8000 | Định tuyến API trung tâm, xác thực |
| Vault Server | 8001 | Quản lý bí mật, lưu trữ thông tin đăng nhập |
| License Server | 8002 | Xác thực và quản lý giấy phép |
| Email Service | 8003 | Thông báo và cảnh báo qua email |
| Notification Service | 8004 | Thông báo đẩy, webhook |
| Update Server | 8005 | Phân phối cập nhật probe và agent |
| Agent Registry | 8006 | Đăng ký và quản lý agent |
| Warranty Service | 8007 | Theo dõi bảo hành phần cứng |
| CMod Service | 8008 | Quản lý cấu hình thiết bị mạng |
| IPAM Service | 8009 | Quản lý địa chỉ IP |

## Tùy chọn triển khai

### Docker Compose (Khuyến nghị)

Cách đơn giản nhất để triển khai tất cả dịch vụ. Phù hợp cho triển khai nhỏ đến trung bình.

Xem [Hướng dẫn cài đặt](./installation.md) để biết hướng dẫn từng bước.

### Kubernetes

Cho triển khai quy mô lớn yêu cầu tính sẵn sàng cao và mở rộng ngang. Helm chart có sẵn cho mỗi dịch vụ.

### Binary đơn lẻ

Cho triển khai tối thiểu, một binary duy nhất đóng gói tất cả dịch vụ. Phù hợp cho thử nghiệm hoặc môi trường rất nhỏ.

## Yêu cầu hệ thống

| Yêu cầu | Tối thiểu | Khuyến nghị |
|---|---|---|
| Hệ điều hành | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 nhân | 4+ nhân |
| RAM | 4 GB | 8 GB |
| Ổ đĩa | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Phiên bản ổn định mới nhất |
| Docker Compose | v2.20+ | Phiên bản ổn định mới nhất |

## Mạng

| Cổng | Giao thức | Mục đích |
|---|---|---|
| 443 | HTTPS | Bảng điều khiển web và API (qua reverse proxy) |
| 80 | HTTP | Chuyển hướng sang HTTPS |
| 5432 | TCP | PostgreSQL (nội bộ, không phơi ra) |
| 6379 | TCP | Redis (nội bộ, không phơi ra) |

Chỉ cần phơi cổng 80 và 443 ra bên ngoài. Tất cả cổng dịch vụ nội bộ chỉ có thể truy cập trong mạng Docker.

## Lưu trữ dữ liệu

| Dữ liệu | Lưu trữ | Sao lưu |
|---|---|---|
| Cơ sở dữ liệu PostgreSQL | Docker volume | pg_dump hàng ngày |
| Tệp cấu hình | Bind mount | Sao lưu tệp |
| Tệp tải lên | Docker volume | Sao lưu tệp |
| Nhật ký | Docker volume | Xoay vòng nhật ký |
| Chứng chỉ TLS | Bind mount | Sao lưu an toàn |

## Bảo mật

Triển khai tự lưu trữ bao gồm tất cả tính năng bảo mật:

- Mã hóa TLS cho tất cả giao tiếp bên ngoài
- Xác thực dựa trên JWT
- Kiểm soát truy cập theo vai trò
- Ghi nhật ký kiểm toán
- Xác minh tính toàn vẹn Steel Shield (xem [Steel Shield](./steel-shield.md))

## Câu hỏi thường gặp

**H: Tôi có thể chạy tự lưu trữ mà không cần Docker không?**
Đ: Docker Compose là phương pháp triển khai được khuyến nghị và hỗ trợ. Chạy dịch vụ trực tiếp trên máy chủ là có thể nhưng không được hỗ trợ chính thức.

**H: Probe kết nối với máy chủ tự lưu trữ như thế nào?**
Đ: Cấu hình probe để trỏ đến URL máy chủ của bạn thay vì endpoint Cloudflare Tunnel mặc định. Cập nhật `server_url` trong cấu hình probe.

**H: Có bảng điều khiển web đi kèm không?**
Đ: Có. API Gateway phục vụ bảng điều khiển web tại URL gốc. Truy cập qua tên miền đã cấu hình (ví dụ: `https://netrecon.yourcompany.com`).

**H: Tôi có thể chạy trong môi trường cách ly không?**
Đ: Có. Tải trước các Docker image và chuyển chúng sang máy chủ cách ly. Xác thực giấy phép có thể được cấu hình cho chế độ ngoại tuyến.

Để được trợ giúp thêm, liên hệ [support@netreconapp.com](mailto:support@netreconapp.com).
