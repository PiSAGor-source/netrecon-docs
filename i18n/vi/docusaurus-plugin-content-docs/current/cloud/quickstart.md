---
sidebar_position: 1
title: Khởi động nhanh
description: Bắt đầu với NetRecon Cloud trong vài phút
---

# Khởi động nhanh trên Đám mây

NetRecon Cloud là cách nhanh nhất để bắt đầu. Không cần thiết lập máy chủ, không cần Docker — chỉ cần đăng ký, triển khai probe và bắt đầu khám phá mạng của bạn.

## Bước 1: Tạo tài khoản

1. Truy cập [app.netreconapp.com](https://app.netreconapp.com) và nhấp **Đăng ký**
2. Nhập email, tên công ty và mật khẩu
3. Xác minh địa chỉ email của bạn
4. Đăng nhập vào Bảng điều khiển NetRecon

## Bước 2: Thêm địa điểm đầu tiên

1. Trong Bảng điều khiển, điều hướng đến **Địa điểm** trên thanh bên
2. Nhấp **Thêm địa điểm**
3. Nhập tên và địa chỉ cho địa điểm (ví dụ: "Văn phòng chính — Hà Nội")
4. Lưu địa điểm

## Bước 3: Triển khai Probe

Mỗi địa điểm cần ít nhất một probe để khám phá và giám sát mạng.

### Phương án A: NetRecon OS (Khuyến nghị)

1. Vào **Địa điểm → [Địa điểm của bạn] → Probe → Thêm Probe**
2. Chọn **NetRecon OS** và tải xuống hình ảnh cho phần cứng của bạn
3. Ghi hình ảnh vào thẻ SD hoặc SSD bằng [balenaEtcher](https://etcher.balena.io/)
4. Kết nối probe với mạng qua Ethernet
5. Bật nguồn — probe sẽ tự động kết nối với tài khoản đám mây qua Cloudflare Tunnel

### Phương án B: Docker trên máy chủ hiện có

```bash
# Kéo và chạy container probe
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="token-của-bạn-từ-bảng-điều-khiển" \
  netrecon/probe:latest
```

Lấy token đăng ký từ **Địa điểm → [Địa điểm của bạn] → Probe → Thêm Probe → Docker**.

### Phương án C: Máy ảo

1. Tải xuống tệp OVA từ Bảng điều khiển
2. Nhập vào VMware, Proxmox hoặc Hyper-V
3. Cấu hình VM với **mạng cầu nối** (bắt buộc cho quét Layer 2)
4. Khởi động VM — nó sẽ tự động xuất hiện trong Bảng điều khiển của bạn

## Bước 4: Bắt đầu quét

Khi probe đã trực tuyến:

1. Vào **Địa điểm → [Địa điểm của bạn] → Thiết bị**
2. Nhấp **Quét ngay** hoặc chờ khám phá tự động (chạy mỗi 15 phút)
3. Các thiết bị được phát hiện sẽ xuất hiện trong danh sách thiết bị

## Bước 5: Cài đặt ứng dụng di động

Tải xuống **NetRecon Scanner** từ Google Play Store để quét mạng khi di chuyển:

- Quét bất kỳ mạng nào mà điện thoại của bạn đang kết nối
- Kết quả tự động đồng bộ với bảng điều khiển đám mây
- Xem [Tổng quan Scanner](../scanner/overview) để biết chi tiết

## Tiếp theo là gì?

- **Triển khai agent** trên các thiết bị đầu cuối để có khả năng hiển thị sâu hơn → [Cài đặt Agent](../agents/overview)
- **Thiết lập cảnh báo** cho thiết bị mới, lỗ hổng hoặc thời gian ngừng hoạt động
- **Cấu hình tích hợp** với các công cụ hiện có (LDAP, SIEM, Jira, ServiceNow)
- **Mời đội ngũ** qua **Cài đặt → Quản lý đội ngũ**

## Đám mây so với Tự lưu trữ

| Tính năng | Đám mây | Tự lưu trữ |
|---|---|---|
| Quản lý máy chủ | Được quản lý bởi NetRecon | Bạn tự quản lý |
| Vị trí dữ liệu | NetRecon Cloud (EU) | Hạ tầng của bạn |
| Cập nhật | Tự động | Thủ công (docker pull) |
| Cloudflare Tunnel | Đã bao gồm | Bạn tự cấu hình |
| Giá cả | Thuê bao | Khóa giấy phép |

Cần tự lưu trữ? Xem [Hướng dẫn cài đặt](../self-hosting/installation).

Để được trợ giúp, liên hệ [support@netreconapp.com](mailto:support@netreconapp.com).
