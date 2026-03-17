---
sidebar_position: 1
title: 快速入门
description: 几分钟内开始使用 NetRecon Cloud
---

# 云端快速入门

NetRecon Cloud 是最快的入门方式。无需设置服务器、无需 Docker——只需注册、部署探针，即可开始发现您的网络。

## 第 1 步：创建您的账户

1. 前往 [app.netreconapp.com](https://app.netreconapp.com) 并点击 **注册**
2. 输入您的邮箱、公司名称和密码
3. 验证您的邮箱地址
4. 登录 NetRecon 仪表板

## 第 2 步：添加您的第一个站点

1. 在仪表板中，导航至侧边栏的 **站点**
2. 点击 **添加站点**
3. 输入站点的名称和地址（例如 "总部办公室 — 上海"）
4. 保存站点

## 第 3 步：部署探针

每个站点至少需要一个探针用于网络发现和监控。

### 方案 A：NetRecon OS（推荐）

1. 前往 **站点 → [您的站点] → 探针 → 添加探针**
2. 选择 **NetRecon OS** 并下载适合您硬件的镜像
3. 使用 [balenaEtcher](https://etcher.balena.io/) 将镜像烧录到 SD 卡或 SSD
4. 通过以太网将探针连接到您的网络
5. 开机——探针将通过 Cloudflare Tunnel 自动连接到您的云端账户

### 方案 B：在现有服务器上运行 Docker

```bash
# 拉取并运行探针容器
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

从 **站点 → [您的站点] → 探针 → 添加探针 → Docker** 获取注册令牌。

### 方案 C：虚拟机

1. 从仪表板下载 OVA 文件
2. 导入到 VMware、Proxmox 或 Hyper-V
3. 将虚拟机配置为 **桥接网络**（二层扫描必需）
4. 启动虚拟机——它将自动出现在您的仪表板中

## 第 4 步：开始扫描

探针上线后：

1. 前往 **站点 → [您的站点] → 设备**
2. 点击 **立即扫描** 或等待自动发现（每 15 分钟运行一次）
3. 发现的设备将出现在设备清单中

## 第 5 步：安装移动应用

从 Google Play 商店下载 **NetRecon Scanner**，实现移动网络扫描：

- 扫描您手机所连接的任何网络
- 结果自动同步到您的云端仪表板
- 详情请参见 [Scanner 概览](../scanner/overview)

## 下一步

- **部署代理** 到端点以获得更深入的可见性 → [代理安装](../agents/overview)
- **设置告警** 以监控新设备、漏洞或停机
- **配置集成** 与您现有的工具（LDAP、SIEM、Jira、ServiceNow）
- **邀请团队成员** 通过 **设置 → 团队管理**

## 云端 vs 自托管

| 功能 | 云端 | 自托管 |
|---|---|---|
| 服务器管理 | 由 NetRecon 管理 | 您自行管理 |
| 数据位置 | NetRecon Cloud（欧盟） | 您的基础设施 |
| 更新 | 自动 | 手动 (docker pull) |
| Cloudflare Tunnel | 已包含 | 您自行配置 |
| 定价 | 订阅制 | 许可证密钥 |

需要自托管？请参阅 [安装指南](../self-hosting/installation)。

如需帮助，请联系 [support@netreconapp.com](mailto:support@netreconapp.com)。
