# Hardware House

Proyecto para la materia Tecnologías y Aplicaciones en Internet de un E-Commerce creado con Nodejs con Express, Plantillas con ejs, MySQL, Bootstrap y Imagenes subidas a cloudinary.

Este proyecto está conformado por dos partes, la primer parte es para el usuario donde este puede consultar los productos disponibles y comprarlos a través de un carrito.  
Y la segunda es un panel de administrador donde puede agregar productos, categorias, promociones y consultar las ventas.

## Enlace de proyecto en la nube

-   [Cliente](http://alejandrolizarraga.tech/)
-   [Administrador](http://alejandrolizarraga.tech/login)

## Tecnologias usadas

-   [Nodejs](https://nodejs.org/en)
-   [Git](https://git-scm.com/)
-   [MySQL](https://www.mysql.com/)
-   [Bootstrap](https://getbootstrap.com/)
-   [Visual Studio Code](https://code.visualstudio.com/)
-   [Cloudinary](https://cloudinary.com/)
-   [AWS](https://aws.amazon.com/es/)

## Instalación local

1. Clonar el repositorio

```
git clone https://gitlab.com/gadaca/hardware-house.git
```

2. Instalar los paquetes necesarios

```
npm install
```

3. Crear archivo .env usado para guardar las variables de entorno

```
cp .env.example .env
```

4. Crear la base de datos en mysql a partir del schema.sql

5. Guardar las credenciales de la base de datos en el .env

```
DB_HOST = "your_db_host"
DB_USER = "your_user"
DB_PASS = "db_password"
DB_PORT = "db_port"
DB_NAME = "HardwareHouse"
```

6. Iniciar el proyecto

```
npm run dev
```

7. Accedemos a la pagina

```
http://localhost/
```

## Desarrollado por

1. [Alejandro Iván Lizárraga Rojas](https://gitlab.com/Alejandrolga02)
2. [Jesus Daniel Lopez Robles](https://gitlab.com/JesusLopez117)
3. [Cesar Oswaldo Bernal Sanchez](https://gitlab.com/CesarUPSIN)
4. [Guillermo Manuel Sanchez Lizarraga](https://gitlab.com/GuillermoSan02)
