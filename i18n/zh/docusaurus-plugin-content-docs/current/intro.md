---
slug: /
sidebar_position: 1
title: NetRecon 入门指南
description: 面向 MSP 和 IT 团队的网络智能平台
---

# NetRecon 入门指南

NetRecon 是专为 MSP 和 IT 团队打造的网络智能平台。它提供自动化网络发现、设备清单管理、漏洞扫描、配置管理和实时监控等功能——所有这些均可通过集中式仪表板、移动应用和 REST API 进行访问。

## 选择您的部署方式

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### 自托管

使用 Docker Compose 将 NetRecon 部署在您自己的基础设施上。完全掌控您的数据，无需外部依赖。

- [系统要求](self-hosting/requirements)
- [安装指南](self-hosting/installation)
- [配置参考](self-hosting/configuration)

**最适合：** 对数据主权有严格要求、使用隔离网络或已有服务器基础设施的组织。

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### 云端 (SaaS)

使用 NetRecon Cloud 即刻开始。无需设置服务器——只需部署探针并开始扫描。

- [快速入门指南](cloud/quickstart)

**最适合：** 希望快速启动运行而无需管理服务器基础设施的团队。

</div>

</div>

## 平台组件

| 组件 | 描述 |
|---|---|
| **仪表板** | 用于所有 NetRecon 功能的 Web 控制面板 |
| **NetRecon Scanner** | 用于移动网络扫描的 Android 应用 ([了解更多](scanner/overview)) |
| **Admin Connect** | 用于远程管理的 Android 管理应用 ([了解更多](admin-connect/overview)) |
| **代理** | 适用于 Windows、macOS 和 Linux 端点的轻量级代理 ([安装指南](agents/overview)) |
| **探针** | 基于硬件或虚拟机的网络传感器，用于持续监控 |
| **API** | 用于自动化和集成的 RESTful API ([API 参考](api/overview)) |

## 需要帮助？

- 使用侧边栏浏览文档
- 查看 [API 参考](api/overview) 获取集成详情
- 联系 [support@netreconapp.com](mailto:support@netreconapp.com) 获取帮助
