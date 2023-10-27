FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3030

WORKDIR /app

RUN addgroup --system backend && \
          adduser --system -G backend backend

COPY dist/apps/backend backend
RUN chown -R backend:backend .

RUN npm --prefix backend --omit=dev -f install

CMD [ "node", "backend" ]
