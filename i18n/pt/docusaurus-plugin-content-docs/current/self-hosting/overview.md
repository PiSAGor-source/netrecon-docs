---
sidebar_position: 1
title: Visão Geral do Auto-Hospedagem
description: Execute a plataforma NetRecon em sua própria infraestrutura
---

# Auto-Hospedagem

O NetRecon pode ser totalmente auto-hospedado em sua própria infraestrutura, oferecendo controle completo sobre seus dados, segurança e implantação.

## Por Que Auto-Hospedar?

| Benefício | Descrição |
|---|---|
| **Soberania de Dados** | Todos os resultados de varredura, configurações e logs permanecem em seus servidores |
| **Conformidade** | Atenda requisitos regulatórios que exigem armazenamento de dados local |
| **Isolamento de Rede** | Execute em ambientes air-gapped sem dependência de internet |
| **Integração Personalizada** | Acesso direto ao banco de dados para relatórios e integração customizados |
| **Controle de Custos** | Sem licenciamento por probe para a infraestrutura do servidor |

## Arquitetura

Uma implantação auto-hospedada do NetRecon consiste em múltiplos microsserviços executados em contêineres Docker:

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

## Visão Geral dos Serviços

| Serviço | Porta | Finalidade |
|---|---|---|
| API Gateway | 8000 | Roteamento central de API, autenticação |
| Vault Server | 8001 | Gerenciamento de segredos, armazenamento de credenciais |
| License Server | 8002 | Validação e gerenciamento de licenças |
| Email Service | 8003 | Notificações e alertas por e-mail |
| Notification Service | 8004 | Notificações push, webhooks |
| Update Server | 8005 | Distribuição de atualizações de probes e agentes |
| Agent Registry | 8006 | Registro e gerenciamento de agentes |
| Warranty Service | 8007 | Rastreamento de garantia de hardware |
| CMod Service | 8008 | Gerenciamento de configuração de dispositivos de rede |
| IPAM Service | 8009 | Gerenciamento de endereços IP |

## Opções de Implantação

### Docker Compose (Recomendado)

A maneira mais simples de implantar todos os serviços. Adequado para implantações pequenas e médias.

Veja o [Guia de Instalação](./installation.md) para instruções passo a passo.

### Kubernetes

Para implantações em larga escala que exigem alta disponibilidade e escalonamento horizontal. Helm charts estão disponíveis para cada serviço.

### Binário Único

Para implantações mínimas, um binário único empacota todos os serviços. Adequado para testes ou ambientes muito pequenos.

## Requisitos do Sistema

| Requisito | Mínimo | Recomendado |
|---|---|---|
| SO | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 núcleos | 4+ núcleos |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Última versão estável |
| Docker Compose | v2.20+ | Última versão estável |

## Rede

| Porta | Protocolo | Finalidade |
|---|---|---|
| 443 | HTTPS | Painel web e API (via proxy reverso) |
| 80 | HTTP | Redirecionamento para HTTPS |
| 5432 | TCP | PostgreSQL (interno, não exposto) |
| 6379 | TCP | Redis (interno, não exposto) |

Apenas as portas 80 e 443 precisam ser expostas externamente. Todas as portas internas dos serviços são acessíveis apenas dentro da rede Docker.

## Armazenamento de Dados

| Dados | Armazenamento | Backup |
|---|---|---|
| Banco de dados PostgreSQL | Volume Docker | pg_dump diário |
| Arquivos de configuração | Bind mount | Backup de arquivos |
| Arquivos enviados | Volume Docker | Backup de arquivos |
| Logs | Volume Docker | Rotação de logs |
| Certificados TLS | Bind mount | Backup seguro |

## Segurança

Implantações auto-hospedadas incluem todos os recursos de segurança:

- Criptografia TLS para toda comunicação externa
- Autenticação baseada em JWT
- Controle de acesso baseado em funções
- Registro de auditoria
- Verificação de integridade Steel Shield (veja [Steel Shield](./steel-shield.md))

## Perguntas Frequentes

**P: Posso executar auto-hospedado sem Docker?**
R: Docker Compose é o método de implantação recomendado e suportado. Executar serviços diretamente no host é possível, mas não oficialmente suportado.

**P: Como os probes se conectam a um servidor auto-hospedado?**
R: Configure os probes para apontar para a URL do seu servidor em vez do endpoint padrão do Cloudflare Tunnel. Atualize o `server_url` na configuração do probe.

**P: Existe um painel web incluído?**
R: Sim. O API Gateway serve o painel web na URL raiz. Acesse-o pelo domínio configurado (ex.: `https://netrecon.suaempresa.com`).

**P: Posso executar isso em um ambiente air-gapped?**
R: Sim. Baixe previamente as imagens Docker e transfira-as para seu servidor air-gapped. A validação de licença pode ser configurada para modo offline.

Para ajuda adicional, entre em contato com [support@netreconapp.com](mailto:support@netreconapp.com).
