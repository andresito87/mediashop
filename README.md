# MediaShop: Proyecto de Tienda Virtual de tecnología

Este proyecto es una tienda virtual de tecnología, en la cual se pueden comprar productos como ordenadores, móviles, tablets, etc.

## Integrantes

- Andrés Samuel Podadera González

## Tecnologías

- HTML
- CSS
- JavaScript
- TypeScript
- PHP
- MySQL

## Herramientas

- Visual Studio Code
- Postman
- GitHub
- MySQL Workbench
- Docker
- Docker Compose

## Frameworks

- Laravel 11
- Angular 18

## Funcionalidades

- Registro de usuarios
- Inicio de sesión
- Cesta de la compra
- Compra de productos
- Visualización de productos
- Visualización de productos por categoría
- Visualización de productos por marca
- Visualización de productos por precio
- Visualización de productos por nombre

## Diagrama de clases

[![Diagrama de clases](./BD/MediaShop%20ER.png)](./BD/MediaShop%20ER.png)

## Instalación

1. Clonar el repositorio

```bash
git clone
```

2. Crear la base de datos

```sql
CREATE DATABASE mediashop;
```

```bash
cd BD
mysql -u root -p mediashop < mediashop.sql
```

3. Ejecutar Backend con Laravel (php artisan serve)

```bash
cd mediashop-backend
composer install
php artisan serve
```

4. Ejecutar Frontend con Angular (ng serve)

```bash
cd mediashop-frontend
npm install
ng serve
```

## URLs de la aplicación

- [Frontend](http://localhost:4200)
- [Backend](http://localhost:8000/api)
- [Admin](http://localhost:5000/auth/login)

## Finalidad

Este proyecto es un proyecto de clase, por lo que no tiene fines comerciales. Se ha realizado con el fin de aprender a utilizar las tecnologías y Frameworks mencionados anteriormente y ser presentado en clase como proyecto final de grado superior de Desarrollo de Aplicaciones Web.

## API Postman Collection

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/19407551-9c595361-10ab-4222-bba9-aa56cbf58ccc?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D19407551-9c595361-10ab-4222-bba9-aa56cbf58ccc%26entityType%3Dcollection%26workspaceId%3De11487c7-189e-419d-8ceb-47ab3e2aea5f)

## Licencia

Open Source
