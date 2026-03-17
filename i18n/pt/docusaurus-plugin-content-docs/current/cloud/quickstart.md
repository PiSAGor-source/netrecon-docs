---
sidebar_position: 1
title: Início Rápido
description: Comece a usar o NetRecon Cloud em minutos
---

# Início Rápido na Nuvem

O NetRecon Cloud é a maneira mais rápida de começar. Sem configuração de servidor, sem Docker — basta se cadastrar, implantar um probe e começar a descobrir sua rede.

## Passo 1: Crie Sua Conta

1. Acesse [app.netreconapp.com](https://app.netreconapp.com) e clique em **Cadastrar**
2. Insira seu e-mail, nome da empresa e senha
3. Verifique seu endereço de e-mail
4. Faça login no Painel do NetRecon

## Passo 2: Adicione Seu Primeiro Site

1. No Painel, navegue até **Sites** na barra lateral
2. Clique em **Adicionar Site**
3. Insira um nome e endereço para o site (ex.: "Escritório Principal — São Paulo")
4. Salve o site

## Passo 3: Implante um Probe

Cada site precisa de pelo menos um probe para descoberta e monitoramento de rede.

### Opção A: NetRecon OS (Recomendado)

1. Vá para **Sites → [Seu Site] → Probes → Adicionar Probe**
2. Selecione **NetRecon OS** e baixe a imagem para seu hardware
3. Grave a imagem em um cartão SD ou SSD usando o [balenaEtcher](https://etcher.balena.io/)
4. Conecte o probe à sua rede via Ethernet
5. Ligue o dispositivo — o probe se conectará automaticamente à sua conta na nuvem via Cloudflare Tunnel

### Opção B: Docker em Servidor Existente

```bash
# Baixe e execute o contêiner do probe
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

Obtenha o token de registro em **Sites → [Seu Site] → Probes → Adicionar Probe → Docker**.

### Opção C: Máquina Virtual

1. Baixe o arquivo OVA do Painel
2. Importe no VMware, Proxmox ou Hyper-V
3. Configure a VM com **rede em modo bridge** (necessário para varredura de Camada 2)
4. Inicie a VM — ela aparecerá no seu Painel automaticamente

## Passo 4: Inicie a Varredura

Quando o probe estiver online:

1. Vá para **Sites → [Seu Site] → Dispositivos**
2. Clique em **Escanear Agora** ou aguarde a descoberta automática (executada a cada 15 minutos)
3. Os dispositivos descobertos aparecerão no inventário de dispositivos

## Passo 5: Instale o Aplicativo Móvel

Baixe o **NetRecon Scanner** na Google Play Store para varredura de rede em campo:

- Escaneie qualquer rede à qual seu celular esteja conectado
- Os resultados são sincronizados automaticamente com seu painel na nuvem
- Veja [Visão Geral do Scanner](../scanner/overview) para detalhes

## Próximos Passos

- **Implante agentes** nos endpoints para maior visibilidade → [Instalação de Agentes](../agents/overview)
- **Configure alertas** para novos dispositivos, vulnerabilidades ou indisponibilidade
- **Configure integrações** com suas ferramentas existentes (LDAP, SIEM, Jira, ServiceNow)
- **Convide sua equipe** via **Configurações → Gerenciamento de Equipe**

## Nuvem vs Auto-Hospedado

| Recurso | Nuvem | Auto-Hospedado |
|---|---|---|
| Gerenciamento de servidor | Gerenciado pelo NetRecon | Você gerencia |
| Localização dos dados | NetRecon Cloud (UE) | Sua infraestrutura |
| Atualizações | Automáticas | Manuais (docker pull) |
| Cloudflare Tunnel | Incluído | Você configura |
| Preço | Assinatura | Chave de licença |

Prefere auto-hospedado? Veja o [Guia de Instalação](../self-hosting/installation).

Para ajuda, entre em contato com [support@netreconapp.com](mailto:support@netreconapp.com).
