# Ryanair Telegram Mini App

Jednoduchá Telegram Mini App pre Ryanair n8n workflow. Statický formulár (dropdowny + date picker)
zabalený do samostatného nginx kontajnera, pripravený na nasadenie na Raspberry Pi cez `git pull`.

## Štruktúra

- `html/index.html` – formulár s dropdownmi a date pickerom
- `nginx.conf` – nginx config (serve statiky + cache pre assety)
- `Dockerfile` – statický web zabalený do `nginx:1.27-alpine`
- `docker-compose.yml` – build + beh kontajnera, port cez `APP_PORT`
- `.env.example` – vzorová konfigurácia (skopíruj na `.env`)
- `n8n-webapp-parser-snippet.js` – kód do n8n Telegram wizard parsera

## Nasadenie na Raspberry Pi

```bash
# 1) naklonuj repo na RPi (všetky projekty držíš v ~/docker)
cd ~/docker
git clone https://github.com/pidiman/ryanair-telegram-miniapp.git
cd ryanair-telegram-miniapp

# 2) priprav konfiguráciu
cp .env.example .env
# uprav APP_PORT / SITE_URL podľa potreby

# 3) build a štart
docker compose up -d --build
```

Aktualizácia po zmenách:

```bash
cd ~/docker/ryanair-telegram-miniapp
git pull
docker compose up -d --build
```

Lokálne bude stránka dostupná na:

```text
http://IP_TVOJHO_RPI:8099
```

(port sa dá zmeniť cez `APP_PORT` v `.env`)

## NGINX Proxy Manager

Telegram Mini App potrebuje HTTPS URL. Nastav Proxy Host:

```text
Domain Names: letenky.pidiman.sk
Forward Hostname / IP: IP_TVOJHO_RPI
Forward Port: 8099
Scheme: http
SSL: Request a new SSL Certificate
Force SSL: ON
```

## BotFather

Nastav Menu Button:

```text
/setmenubutton
```

URL:

```text
https://letenky.pidiman.sk
```

## Test payloadu

Mini App pošle botovi JSON cez `Telegram.WebApp.sendData()`:

```json
{
  "type": "ryanair_search",
  "origin": "BTS",
  "destination": "ALC",
  "outboundDate": "2026-07-01",
  "returnDate": "2026-07-08",
  "flexDays": 1,
  "alertTotalPriceMax": 150
}
```

n8n musí v Telegram Triggeri čítať:

```text
message.web_app_data.data
```

Parser kód pridaj do n8n podľa `n8n-webapp-parser-snippet.js`.
