---
sidebar_position: 3
title: Steel Shield
description: 自托管部署的安全加固功能
---

# Steel Shield

Steel Shield 是 NetRecon 的安全加固框架。它为自托管部署提供多层保护，确保所有平台组件的完整性和真实性。

## 概览

Steel Shield 包含四个核心安全机制：

| 功能 | 用途 |
|---|---|
| **二进制完整性** | 验证可执行文件未被篡改 |
| **证书固定** | 防止 API 通信的中间人攻击 |
| **篡改响应** | 检测并响应未授权的修改 |
| **运行时保护** | 防止内存操纵和调试 |

## 二进制完整性验证

每个 NetRecon 二进制文件（探针后端、代理、服务）都经过数字签名。启动时，每个组件会验证自身的完整性。

### 工作原理

1. 构建期间，每个二进制文件使用 NetRecon 持有的私钥进行签名
2. 签名嵌入在二进制文件的元数据中
3. 启动时，二进制文件计算自身的 SHA-256 哈希值
4. 将哈希值与嵌入的签名进行验证
5. 如果验证失败，二进制文件拒绝启动并记录告警

### 手动验证

手动验证二进制文件的完整性：

```bash
# 验证探针后端
netrecon-verify /usr/local/bin/netrecon-probe

# 验证代理
netrecon-verify /usr/local/bin/netrecon-agent

# 预期输出：
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker 镜像验证

Docker 镜像使用 Docker Content Trust (DCT) 进行签名：

```bash
# 启用内容信任
export DOCKER_CONTENT_TRUST=1

# 使用签名验证拉取
docker pull netrecon/api-gateway:latest
```

## 证书固定

证书固定确保 NetRecon 组件仅与合法服务器通信，即使证书颁发机构被入侵，也能防止拦截。

### 固定连接

| 连接 | 固定类型 |
|---|---|
| 代理到探针 | 公钥固定 |
| Admin Connect 到探针 | 证书指纹 |
| 探针到更新服务器 | 公钥固定 |
| 探针到许可证服务器 | 证书指纹 |

### 工作原理

1. 预期的证书公钥哈希嵌入在每个客户端二进制文件中
2. 建立 TLS 连接时，客户端提取服务器的公钥
3. 客户端计算公钥的 SHA-256 哈希值
4. 如果哈希值与固定值不匹配，连接被拒绝
5. 固定验证失败会触发安全告警

### 固定轮换

证书轮换时：

1. 新的固定值在证书更改前通过更新服务器分发
2. 过渡期间，新旧固定值均有效
3. 过渡后，旧的固定值在下次更新中被移除

对于自托管部署，在配置中更新固定值：

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # 当前
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # 备用
```

## 篡改响应

Steel Shield 监控关键文件和配置的未授权更改。

### 监控项目

| 项目 | 检查频率 | 响应 |
|---|---|---|
| 二进制文件 | 启动时 + 每 1 小时 | 告警 + 可选关闭 |
| 配置文件 | 每 5 分钟 | 告警 + 恢复到备份 |
| 数据库完整性 | 每 15 分钟 | 告警 + 一致性检查 |
| TLS 证书 | 每 5 分钟 | 如有更改则告警 |
| 系统软件包 | 每日 | 如有意外更改则告警 |

### 响应操作

检测到篡改时，Steel Shield 可以：

1. **记录** — 在安全审计日志中记录事件
2. **告警** — 通过已配置的渠道发送通知
3. **恢复** — 从已知良好的备份恢复被篡改的文件
4. **隔离** — 将网络访问限制为仅管理用途
5. **关闭** — 停止服务以防止进一步被入侵

配置响应级别：

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # 选项：log、alert、alert_and_revert、isolate、shutdown
  notify_email: "security@yourcompany.com"
```

### 文件完整性数据库

Steel Shield 维护所有受保护文件的哈希数据库：

```bash
# 初始化完整性数据库
netrecon-shield init

# 手动检查完整性
netrecon-shield verify

# 预期输出：
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## 运行时保护

### 反调试

在生产模式下，NetRecon 二进制文件包含反调试措施：
- 检测附加的调试器（Linux 上的 ptrace，Windows 上的 IsDebuggerPresent）
- 单步执行的时序检查
- 在生产环境中检测到调试时，进程正常退出

:::info
反调试在开发版本中被禁用，以允许正常的调试工作流程。
:::

### 内存保护

- 敏感数据（令牌、密钥、密码）存储在受保护的内存区域中
- 使用后内存被清零，防止残留数据泄露
- 在 Linux 上，使用 `mlock` 防止敏感页面被交换到磁盘

## 配置

### 启用 Steel Shield

Steel Shield 在生产部署中默认启用。配置位于：

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # 秒
  tamper_check_interval: 300      # 秒
```

### 为开发禁用

对于开发和测试环境：

```yaml
steel_shield:
  enabled: false
```

或禁用特定功能：

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # 开发期间跳过哈希验证
  runtime_protection: false  # 允许调试器附加
```

## 审计跟踪

所有 Steel Shield 事件都记录在安全审计日志中：

```bash
# 查看最近的安全事件
netrecon-shield audit --last 24h

# 导出审计日志
netrecon-shield audit --export csv --output security-audit.csv
```

审计日志条目包括：
- 时间戳
- 事件类型（integrity_check、pin_validation、tamper_detected 等）
- 受影响的组件
- 结果（通过/失败）
- 采取的操作
- 附加详情

## 自托管注意事项

自托管时，请注意：

1. **自定义证书**：如果使用您自己的 CA，在部署后更新证书固定配置
2. **二进制更新**：更新二进制文件后，运行 `netrecon-shield init` 重建完整性数据库
3. **备份完整性数据库**：将 `/etc/netrecon/integrity.db` 包含在您的备份计划中
4. **监控告警**：为篡改告警配置邮件或 Webhook 通知

## 常见问题

**问：Steel Shield 会产生误报吗？**
答：误报很少见，但在系统更新修改共享库后可能会发生。系统更新后运行 `netrecon-shield init` 以刷新完整性数据库。

**问：Steel Shield 会影响性能吗？**
答：性能影响微乎其微。完整性检查在后台线程中运行，通常在 1 秒内完成。

**问：可以将 Steel Shield 告警与我的 SIEM 集成吗？**
答：可以。在安全配置中配置 syslog 输出，将事件转发到您的 SIEM。Steel Shield 支持 syslog (RFC 5424) 和 JSON 输出格式。

**问：生产部署必须使用 Steel Shield 吗？**
答：强烈推荐使用 Steel Shield，但不是严格必需的。您可以禁用它，但这样做会移除重要的安全保护。

如需更多帮助，请联系 [support@netreconapp.com](mailto:support@netreconapp.com)。
