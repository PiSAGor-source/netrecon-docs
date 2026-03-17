---
sidebar_position: 3
title: 系统要求
description: NetRecon 的硬件、软件和网络要求
---

# 系统要求

本页面详细列出了所有 NetRecon 组件的最低和推荐要求。

## 探针硬件

### 支持的平台

| 设备 | 支持级别 | 备注 |
|---|---|---|
| Orange Pi R2S (8 GB) | 主要支持 | 双以太网，紧凑外形 |
| Raspberry Pi 4 (4/8 GB) | 主要支持 | 广泛可用，性能良好 |
| Raspberry Pi 5 (4/8 GB) | 主要支持 | 最佳 ARM 性能 |
| x86_64 迷你电脑 (Intel N100+) | 主要支持 | 最佳整体性能，多网口 |
| 其他 ARM64 单板电脑 | 高级 | 可能需要手动配置 |
| 虚拟机 (VMware/Proxmox/Hyper-V) | 支持 | 需要桥接网络 |

### 硬件规格

| 要求 | 最低配置 | 推荐配置 |
|---|---|---|
| 架构 | ARM64 或 x86_64 | ARM64 四核或 x86_64 |
| CPU 核心 | 2 | 4+ |
| 内存 | 4 GB | 8 GB |
| 存储 | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| 以太网端口 | 1 | 2+（用于桥接/TAP 模式） |
| USB | 非必需 | USB-A 用于串口控制台适配器 |
| 电源 | 5V/3A (单板电脑) | PoE 或桶形插头 |

### 存储注意事项

- **16 GB** 足够基本的扫描和监控
- **32 GB+** 推荐用于启用 PCAP 捕获、IDS 日志或漏洞扫描
- PCAP 文件在繁忙网络上可能快速增长；考虑使用外部存储进行长期捕获
- SQLite 数据库使用 WAL 模式以获得最佳写入性能

## NetRecon Scanner 应用 (Android)

| 要求 | 详情 |
|---|---|
| Android 版本 | 8.0 (API 26) 或更高 |
| 内存 | 最少 2 GB |
| 存储 | 应用 + 数据 100 MB |
| 网络 | 通过 Wi-Fi 连接到目标网络 |
| Root 权限 | 可选（启用高级扫描模式） |
| Shizuku | 可选（无需 root 即可启用某些功能） |

## Admin Connect 应用

| 要求 | 详情 |
|---|---|
| Android 版本 | 8.0 (API 26) 或更高 |
| 内存 | 最少 2 GB |
| 存储 | 应用 + 数据 80 MB |
| 网络 | 互联网连接（通过 Cloudflare Tunnel 连接） |

## 自托管服务器

| 要求 | 最低配置 | 推荐配置 |
|---|---|---|
| 操作系统 | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 核 | 4+ 核 |
| 内存 | 4 GB | 8 GB |
| 存储 | 40 GB | 100 GB SSD |
| Docker | v24.0+ | 最新稳定版 |
| Docker Compose | v2.20+ | 最新稳定版 |

Windows Server 也支持使用 Docker Desktop 或 WSL2。

## 网络要求

### 探针网络访问

| 方向 | 端口 | 协议 | 用途 |
|---|---|---|---|
| 探针 -> 局域网 | ARP | 二层 | 主机发现 |
| 探针 -> 局域网 | TCP (各种) | 四层 | 端口扫描 |
| 探针 -> 局域网 | UDP 5353 | mDNS | 服务发现 |
| 探针 -> 互联网 | TCP 443 | HTTPS | Cloudflare Tunnel、更新 |
| 局域网 -> 探针 | TCP 3000 | HTTPS | Web 仪表板 |
| 局域网 -> 探针 | TCP 8080 | HTTP | 设置向导（仅首次启动） |

### 防火墙注意事项

- 使用 Cloudflare Tunnel 时，探针**不需要任何来自互联网的入站端口**
- 探针需要**出站 HTTPS (443)** 用于隧道连接和系统更新
- 对于本地网络扫描，探针必须与目标设备在同一二层网段（或使用 SPAN/镜像端口）

### Cloudflare Tunnel

通过 Cloudflare Tunnel 提供对探针的远程访问。需要：
- 探针上有活跃的互联网连接
- 出站 TCP 443 访问（不需要入站端口）
- 一个 Cloudflare 账户（免费套餐即可）

## 浏览器要求（Web 仪表板）

| 浏览器 | 最低版本 |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

必须启用 JavaScript。

## 常见问题

**问：可以在 Raspberry Pi 3 上运行探针吗？**
答：Raspberry Pi 3 只有 1 GB 内存，低于最低要求。基本扫描可能可以运行，但不受支持。

**问：探针需要互联网访问吗？**
答：仅 Cloudflare Tunnel（远程访问）和系统更新需要互联网访问。所有扫描功能在无互联网的情况下也可正常工作。

**问：可以使用 USB Wi-Fi 适配器进行扫描吗？**
答：不支持 Wi-Fi 扫描。探针需要有线以太网才能进行可靠和完整的网络发现。

如需更多帮助，请联系 [support@netreconapp.com](mailto:support@netreconapp.com)。
