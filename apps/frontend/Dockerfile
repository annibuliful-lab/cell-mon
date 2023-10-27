
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=4200

WORKDIR /app

RUN addgroup --system frontend && \
          adduser --system -G frontend frontend

COPY dist/apps/frontend frontend
RUN chown -R frontend:frontend .

RUN npm --prefix frontend --omit=dev -f install

CMD [ "node", "frontend" ]
