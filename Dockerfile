FROM nginx:1.27-alpine

LABEL maintainer="Gabriel Marques <gabriel@gmdevworks.com.br>"
LABEL description="Portfolio Gabriel Marques - Minimalist Software Engineering"

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application source files
COPY src/ /usr/share/nginx/html/

# Set safe read/execute permissions for Nginx worker
RUN chmod -R 755 /usr/share/nginx/html

# Expose container port
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
