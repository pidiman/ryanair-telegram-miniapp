FROM nginx:1.27-alpine

# Statická Telegram Mini App – HTML a nginx konfiguráciu pečieme priamo do image,
# aby bol kontajner samostatný (žiadne bind-mounty, stačí git pull + docker compose up -d --build).
COPY html/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1 >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
