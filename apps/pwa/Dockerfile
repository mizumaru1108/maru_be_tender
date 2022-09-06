# Inspired by:
# * https://medium.com/kocsistem/how-to-run-nginx-for-root-non-root-5ceb13db6d41
# * https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04
# * https://www.rockyourcode.com/run-docker-nginx-as-non-root-user/
FROM nginxinc/nginx-unprivileged

# WORKDIR /app

## add permissions for nginx user
# RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
#   chown -R nginx:nginx /var/cache/nginx && \
#   chown -R nginx:nginx /var/log/nginx && \
#   chown -R nginx:nginx /etc/nginx/conf.d
# RUN touch /var/run/nginx.pid && \
#   chown -R nginx:nginx /var/run/nginx.pid

## nginx configuration
COPY apps/pwa/nginx/conf.d/default.conf /etc/nginx/conf.d/

## add static files
COPY apps/pwa/build/ /usr/share/nginx/html/

## switch to non-root user
USER nginx

## set environment variables

EXPOSE 8080
