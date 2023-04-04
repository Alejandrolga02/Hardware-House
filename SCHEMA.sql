DROP DATABASE IF EXISTS `HardwareHouse`;
CREATE DATABASE `HardwareHouse`;
USE `HardwareHouse`;

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `estado` tinyint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `precio` decimal(10,0) unsigned NOT NULL,
  `urlImagen` varchar(120) NOT NULL,
  `estado` tinyint unsigned NOT NULL,
  `disponibilidad` int unsigned NOT NULL,
  `idCategoria` int unsigned NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idCategoria_idx` (`idCategoria`),
  CONSTRAINT `idCategoria` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `promociones`;
CREATE TABLE `promociones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `porcentajeDescuento` decimal(10,0) unsigned NOT NULL,
  `idCategoria` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCategoriaProm_idx` (`idCategoria`),
  CONSTRAINT `idCategoriaProm` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `esAdmin` tinyint unsigned NOT NULL,
  `nombre` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellidos` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `usuario` varchar(60) NOT NULL,
  `contrasena` varchar(161) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estado` varchar(32) NOT NULL,
  `municipio` varchar(32) NOT NULL,
  `numeroInterior` varchar(6) NOT NULL,
  `colonia` varchar(60) NOT NULL,
  `CP` varchar(5) NOT NULL,
  `calle` varchar(120) NOT NULL,
  `correo` varchar(240) NOT NULL,
  `telefono` varchar(12) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE `ventas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `idUsuario` int unsigned NOT NULL,
  `fecha` datetime NOT NULL,
  `total` decimal(10,2) unsigned NOT NULL,
  `tipoPago` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`) USING BTREE,
  CONSTRAINT `idVendedor` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ventas_detalle`;
CREATE TABLE `ventas_detalle` (
  `idVenta` int unsigned NOT NULL,
  `idProducto` varchar(20) NOT NULL,
  `cantidad` int unsigned NOT NULL,
  KEY `idVentas_idx` (`idVenta`),
  KEY `idProducto_idx` (`idProducto`),
  CONSTRAINT `idProducto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`codigo`),
  CONSTRAINT `idVentas` FOREIGN KEY (`idVenta`) REFERENCES `ventas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TRIGGER IF EXISTS `disminuir_disponibilidad`;
CREATE TRIGGER `disminuir_disponibilidad` AFTER INSERT ON `ventas_detalle`
FOR EACH ROW
BEGIN
    UPDATE `productos` SET `disponibilidad` = `disponibilidad` - NEW.`cantidad` WHERE `codigo` = NEW.`idProducto`;
    IF (SELECT `disponibilidad` FROM `productos` WHERE `codigo` = NEW.`idProducto`) = 0 THEN
        UPDATE `productos` SET `estado` = 0 WHERE `codigo` = NEW.`idProducto`;
    END IF;
END;