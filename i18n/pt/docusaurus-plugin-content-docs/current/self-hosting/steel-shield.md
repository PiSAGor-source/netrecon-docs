---
sidebar_position: 3
title: Steel Shield
description: Recursos de proteção de segurança para implantações auto-hospedadas
---

# Steel Shield

O Steel Shield é o framework de proteção de segurança do NetRecon. Ele fornece múltiplas camadas de proteção para implantações auto-hospedadas, garantindo a integridade e autenticidade de todos os componentes da plataforma.

## Visão Geral

O Steel Shield inclui quatro mecanismos principais de segurança:

| Recurso | Finalidade |
|---|---|
| **Integridade de Binários** | Verificar se os executáveis não foram adulterados |
| **Certificate Pinning** | Prevenir ataques man-in-the-middle na comunicação da API |
| **Resposta a Adulteração** | Detectar e responder a modificações não autorizadas |
| **Proteção em Tempo de Execução** | Proteger contra manipulação de memória e depuração |

## Verificação de Integridade de Binários

Cada binário do NetRecon (backend do probe, agentes, serviços) é assinado digitalmente. Na inicialização, cada componente verifica sua própria integridade.

### Como Funciona

1. Durante a compilação, cada binário é assinado com uma chave privada mantida pelo NetRecon
2. A assinatura é incorporada nos metadados do binário
3. Na inicialização, o binário calcula um hash SHA-256 de si mesmo
4. O hash é verificado contra a assinatura incorporada
5. Se a verificação falhar, o binário se recusa a iniciar e registra um alerta

### Verificação Manual

Verifique a integridade de um binário manualmente:

```bash
# Verificar o backend do probe
netrecon-verify /usr/local/bin/netrecon-probe

# Verificar um agente
netrecon-verify /usr/local/bin/netrecon-agent

# Saída esperada:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Verificação de Imagem Docker

As imagens Docker são assinadas usando Docker Content Trust (DCT):

```bash
# Habilitar content trust
export DOCKER_CONTENT_TRUST=1

# Baixar com verificação de assinatura
docker pull netrecon/api-gateway:latest
```

## Certificate Pinning

O certificate pinning garante que os componentes do NetRecon se comuniquem apenas com servidores legítimos, prevenindo interceptação mesmo que uma autoridade certificadora seja comprometida.

### Conexões Fixadas

| Conexão | Tipo de Fixação |
|---|---|
| Agente para Probe | Pin de chave pública |
| Admin Connect para Probe | Impressão digital do certificado |
| Probe para Update Server | Pin de chave pública |
| Probe para License Server | Impressão digital do certificado |

### Como Funciona

1. O hash esperado da chave pública do certificado é incorporado em cada binário cliente
2. Ao estabelecer uma conexão TLS, o cliente extrai a chave pública do servidor
3. O cliente calcula um hash SHA-256 da chave pública
4. Se o hash não corresponder ao valor fixado, a conexão é rejeitada
5. Falha na validação do pin aciona um alerta de segurança

### Rotação de Pins

Quando os certificados são rotacionados:

1. Novos pins são distribuídos via update server antes da troca de certificado
2. Tanto os pins antigos quanto os novos são válidos durante o período de transição
3. Após a transição, os pins antigos são removidos na próxima atualização

Para implantações auto-hospedadas, atualize os pins na configuração:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Atual
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Resposta a Adulteração

O Steel Shield monitora arquivos críticos e configurações em busca de alterações não autorizadas.

### Itens Monitorados

| Item | Frequência de Verificação | Resposta |
|---|---|---|
| Arquivos binários | Na inicialização + a cada 1 hora | Alerta + desligamento opcional |
| Arquivos de configuração | A cada 5 minutos | Alerta + reverter para backup |
| Integridade do banco de dados | A cada 15 minutos | Alerta + verificação de consistência |
| Certificados TLS | A cada 5 minutos | Alerta se alterado |
| Pacotes do sistema | Diariamente | Alerta se alterações inesperadas |

### Ações de Resposta

Quando uma adulteração é detectada, o Steel Shield pode:

1. **Registrar** — gravar o evento no log de auditoria de segurança
2. **Alertar** — enviar uma notificação pelos canais configurados
3. **Reverter** — restaurar o arquivo adulterado a partir de um backup confiável
4. **Isolar** — restringir o acesso à rede apenas para gerenciamento
5. **Desligar** — parar o serviço para evitar comprometimento adicional

Configure o nível de resposta:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Opções: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "seguranca@suaempresa.com"
```

### Banco de Dados de Integridade de Arquivos

O Steel Shield mantém um banco de dados de hash de todos os arquivos protegidos:

```bash
# Inicializar o banco de dados de integridade
netrecon-shield init

# Verificar a integridade manualmente
netrecon-shield verify

# Saída esperada:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Proteção em Tempo de Execução

### Anti-Depuração

Em modo de produção, os binários do NetRecon incluem medidas anti-depuração:
- Detecção de depuradores conectados (ptrace no Linux, IsDebuggerPresent no Windows)
- Verificações de temporização para execução passo a passo
- Quando a depuração é detectada em produção, o processo encerra graciosamente

:::info
A anti-depuração é desabilitada em compilações de desenvolvimento para permitir fluxos de trabalho normais de depuração.
:::

### Proteção de Memória

- Dados sensíveis (tokens, chaves, senhas) são armazenados em regiões de memória protegidas
- A memória é zerada após o uso para evitar exposição de dados remanescentes
- No Linux, `mlock` é usado para evitar que páginas sensíveis sejam enviadas ao disco (swap)

## Configuração

### Habilitar o Steel Shield

O Steel Shield é habilitado por padrão em implantações de produção. Configure-o em:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # segundos
  tamper_check_interval: 300      # segundos
```

### Desabilitar para Desenvolvimento

Para ambientes de desenvolvimento e teste:

```yaml
steel_shield:
  enabled: false
```

Ou desabilite recursos específicos:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Pular verificação de hash durante dev
  runtime_protection: false  # Permitir conexão de depurador
```

## Trilha de Auditoria

Todos os eventos do Steel Shield são registrados no log de auditoria de segurança:

```bash
# Ver eventos de segurança recentes
netrecon-shield audit --last 24h

# Exportar log de auditoria
netrecon-shield audit --export csv --output security-audit.csv
```

As entradas do log de auditoria incluem:
- Timestamp
- Tipo de evento (integrity_check, pin_validation, tamper_detected, etc.)
- Componente afetado
- Resultado (aprovado/reprovado)
- Ação tomada
- Detalhes adicionais

## Considerações para Auto-Hospedagem

Ao auto-hospedar, tenha em mente:

1. **Certificados personalizados**: Se usar sua própria CA, atualize a configuração de certificate pin após a implantação
2. **Atualizações de binários**: Após atualizar binários, execute `netrecon-shield init` para reconstruir o banco de dados de integridade
3. **Backup do banco de dados de integridade**: Inclua `/etc/netrecon/integrity.db` em sua rotina de backup
4. **Monitore alertas**: Configure notificações por e-mail ou webhook para alertas de adulteração

## Perguntas Frequentes

**P: O Steel Shield pode causar falsos positivos?**
R: Falsos positivos são raros, mas podem ocorrer após atualizações do sistema que modificam bibliotecas compartilhadas. Execute `netrecon-shield init` após atualizações do sistema para atualizar o banco de dados de integridade.

**P: O Steel Shield afeta o desempenho?**
R: O impacto no desempenho é mínimo. As verificações de integridade são executadas em uma thread de segundo plano e normalmente são concluídas em menos de 1 segundo.

**P: Posso integrar os alertas do Steel Shield com meu SIEM?**
R: Sim. Configure a saída syslog na configuração de segurança para encaminhar eventos ao seu SIEM. O Steel Shield suporta formatos de saída syslog (RFC 5424) e JSON.

**P: O Steel Shield é obrigatório para implantações de produção?**
R: O Steel Shield é fortemente recomendado, mas não estritamente obrigatório. Você pode desabilitá-lo, mas isso remove proteções de segurança importantes.

Para ajuda adicional, entre em contato com [support@netreconapp.com](mailto:support@netreconapp.com).
