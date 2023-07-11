version: '3.9'
services:
  mysql:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: visroot@4
      MYSQL_DATABASE: test
      MYSQL_PASSWORD: visroot@4
    ports:
      - '3307:3306'
    volumes:
      - mysql_data:/var/lib/mysql

  spring-app:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - mysql
    ports:
      - '8081:8080'
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/test?useSSL=false
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: visroot@4
volumes:
  mysql_data:
