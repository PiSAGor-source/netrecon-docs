---
slug: /
sidebar_position: 1
title: Primeiros Passos com o NetRecon
description: Plataforma de inteligência de rede para MSPs e equipes de TI
---

# Primeiros Passos com o NetRecon

O NetRecon é uma plataforma de inteligência de rede desenvolvida para MSPs e equipes de TI. Ele oferece descoberta automatizada de rede, inventário de dispositivos, varredura de vulnerabilidades, gerenciamento de configuração e monitoramento em tempo real — tudo acessível por meio de um painel centralizado, aplicativos móveis e API REST.

## Escolha Sua Implantação

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Auto-Hospedado

Implante o NetRecon em sua própria infraestrutura usando Docker Compose. Controle total sobre seus dados, sem dependências externas.

- [Requisitos do Sistema](self-hosting/requirements)
- [Guia de Instalação](self-hosting/installation)
- [Referência de Configuração](self-hosting/configuration)

**Ideal para:** Organizações com requisitos rigorosos de soberania de dados, redes isoladas (air-gapped) ou infraestrutura de servidores existente.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Nuvem (SaaS)

Comece instantaneamente com o NetRecon Cloud. Nenhuma configuração de servidor necessária — basta implantar probes e começar a escanear.

- [Guia de Início Rápido](cloud/quickstart)

**Ideal para:** Equipes que desejam começar rapidamente sem gerenciar infraestrutura de servidores.

</div>

</div>

## Componentes da Plataforma

| Componente | Descrição |
|---|---|
| **Dashboard** | Painel de controle baseado na web para todos os recursos do NetRecon |
| **NetRecon Scanner** | Aplicativo Android para varredura de rede em campo ([Saiba mais](scanner/overview)) |
| **Admin Connect** | Aplicativo Android de gerenciamento para administração remota ([Saiba mais](admin-connect/overview)) |
| **Agents** | Agentes leves para endpoints Windows, macOS e Linux ([Instalação](agents/overview)) |
| **Probes** | Sensores de rede baseados em hardware ou VM para monitoramento contínuo |
| **API** | API RESTful para automação e integração ([Referência da API](api/overview)) |

## Precisa de Ajuda?

- Navegue pela documentação usando a barra lateral
- Consulte a [Referência da API](api/overview) para detalhes de integração
- Entre em contato com [support@netreconapp.com](mailto:support@netreconapp.com) para assistência
