---
sidebar_position: 1
title: 安装
description: 在探针硬件上安装 NetRecon OS
---

# NetRecon OS 安装

本指南将引导您在探针硬件上安装 NetRecon OS。从下载到探针完全运行，整个过程大约需要 15 分钟。

## 前提条件

- 一台受支持的硬件设备（参见 [系统要求](./requirements.md)）
- 一张 microSD 卡（最少 16GB，推荐 32GB）或 USB 驱动器
- 镜像写入工具，如 [balenaEtcher](https://etcher.balena.io/) 或 Raspberry Pi Imager
- 一台用于下载和写入镜像的电脑
- 连接到网络的以太网线缆

## 第 1 步：下载镜像

从 NetRecon 客户门户下载适合您硬件的镜像：

| 硬件 | 镜像文件 | 架构 |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 迷你电脑 | `netrecon-os-amd64.iso` | x86_64 |

:::tip
将下载的校验和与门户上显示的值进行比对，以确保文件完整性。
:::

## 第 2 步：写入镜像

### ARM64 设备（Orange Pi、Raspberry Pi）

1. 将 microSD 卡插入电脑
2. 打开 balenaEtcher
3. 选择下载的 `.img.xz` 文件（无需解压）
4. 选择您的 microSD 卡作为目标
5. 点击 **烧录** 并等待完成

### x86_64 设备

1. 将 USB 驱动器插入电脑
2. 打开 balenaEtcher
3. 选择下载的 `.iso` 文件
4. 选择您的 USB 驱动器作为目标
5. 点击 **烧录** 并等待完成
6. 从 USB 驱动器启动迷你电脑并按照屏幕上的安装程序操作

## 第 3 步：首次启动

1. 将 microSD 卡（x86_64 则为内部驱动器）插入探针设备
2. 至少连接一条以太网线缆到您的网络
3. 开启设备电源
4. 等待大约 60 秒让系统初始化

探针将在首次启动时通过 DHCP 获取 IP 地址。

## 第 4 步：运行设置向导

1. 从同一网络上的任何设备，打开 Web 浏览器
2. 导航至 `http://<探针IP>:8080`
3. 设置向导将引导您完成初始配置

向导将帮助您配置：
- 管理员账户凭据
- 网络接口角色
- 网络扫描模式
- Cloudflare Tunnel 连接
- 安全设置

详细的向导文档请参阅 [设置向导概览](../setup-wizard/overview.md)。

## 第 5 步：连接您的应用

向导完成后：

- **NetRecon Scanner**：可以通过 mDNS 在本地网络上发现探针
- **Admin Connect**：扫描向导中显示的二维码，或通过 `https://probe.netreconapp.com` 连接

## 硬件要求

| 要求 | 最低配置 | 推荐配置 |
|---|---|---|
| CPU | ARM64 或 x86_64 | ARM64 四核或 x86_64 |
| 内存 | 4 GB | 8 GB |
| 存储 | 16 GB | 32 GB |
| 以太网 | 1 个端口 | 2+ 个端口 |
| 网络 | 可用 DHCP | 推荐静态 IP |

## 故障排除

### 在网络上找不到探针

- 确保以太网线缆正确连接且链路 LED 亮起
- 检查路由器的 DHCP 租约表，查找名为 `netrecon` 的新设备
- 尝试连接显示器和键盘，在控制台上查看探针的 IP 地址

### 向导无法加载

- 确认您访问的是 8080 端口：`http://<探针IP>:8080`
- 向导服务在启动后大约 60 秒启动
- 检查您的电脑是否与探针在同一网络/VLAN 中

### 镜像写入失败

- 尝试使用不同的 microSD 卡；某些卡可能存在兼容性问题
- 重新下载镜像并验证校验和
- 尝试使用其他镜像写入工具

## 常见问题

**问：可以在虚拟机上安装 NetRecon OS 吗？**
答：可以，x86_64 ISO 可以安装在 VMware、Proxmox 或 Hyper-V 中。至少分配 4 GB 内存，并确保虚拟机使用桥接网络适配器。

**问：安装后如何更新 NetRecon OS？**
答：更新通过 Admin Connect 应用或探针的 Web 仪表板中的 **设置 > 系统更新** 进行。

**问：可以使用 Wi-Fi 代替以太网吗？**
答：探针至少需要一个有线以太网连接才能进行可靠的网络扫描。不支持将 Wi-Fi 作为主要扫描接口。

如需更多帮助，请联系 [support@netreconapp.com](mailto:support@netreconapp.com)。
