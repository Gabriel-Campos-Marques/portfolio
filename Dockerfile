FROM nginx:1.27-alpine

LABEL maintainer="Gabriel Marques <gabriel@gmdevwoks.com.br>"
LABEL description="Portfolio Gabriel Marques - Minimalist Software Engineering"

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy project files and static assets
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Set safe read/execute permissions for Nginx worker
RUN chmod -R 755 /usr/share/nginx/html

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
