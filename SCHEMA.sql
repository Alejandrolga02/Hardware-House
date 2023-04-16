-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 35.91.225.111
-- Tiempo de generación: 17-04-2023 a las 00:59:34
-- Versión del servidor: 8.0.32-0ubuntu0.22.04.2
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `HardwareHouse`
--
CREATE DATABASE IF NOT EXISTS `HardwareHouse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `HardwareHouse`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `estado` tinyint UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `precio` decimal(10,2) UNSIGNED NOT NULL,
  `urlImagen` varchar(120) NOT NULL,
  `estado` tinyint UNSIGNED NOT NULL,
  `disponibilidad` int UNSIGNED NOT NULL,
  `idCategoria` int UNSIGNED NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idCategoria_idx` (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

DROP TABLE IF EXISTS `promociones`;
CREATE TABLE IF NOT EXISTS `promociones` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `porcentajeDescuento` decimal(4,2) UNSIGNED NOT NULL,
  `idCategoria` int UNSIGNED NOT NULL,
  `estado` tinyint UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCategoriaProm_idx` (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `esAdmin` tinyint UNSIGNED NOT NULL,
  `nombre` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellidos` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario` varchar(60) NOT NULL,
  `contrasena` varchar(161) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estado` varchar(32) NOT NULL,
  `municipio` varchar(32) NOT NULL,
  `numeroExterior` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `colonia` varchar(60) NOT NULL,
  `CP` varchar(5) NOT NULL,
  `calle` varchar(120) NOT NULL,
  `correo` varchar(240) NOT NULL,
  `telefono` varchar(12) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `idUsuario` int UNSIGNED NOT NULL,
  `fecha` datetime NOT NULL,
  `total` decimal(10,2) UNSIGNED NOT NULL,
  `tipoPago` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_detalle`
--

DROP TABLE IF EXISTS `ventas_detalle`;
CREATE TABLE IF NOT EXISTS `ventas_detalle` (
  `idVenta` int UNSIGNED NOT NULL,
  `idProducto` varchar(20) NOT NULL,
  `cantidad` int UNSIGNED NOT NULL,
  KEY `idVentas_idx` (`idVenta`),
  KEY `idProducto_idx` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Disparadores `ventas_detalle`
--
DROP TRIGGER IF EXISTS `disminuir_disponibilidad`;
DELIMITER $$
CREATE TRIGGER `disminuir_disponibilidad` AFTER INSERT ON `ventas_detalle` FOR EACH ROW BEGIN
    UPDATE `productos` SET `disponibilidad` = `disponibilidad` - NEW.`cantidad` WHERE `codigo` = NEW.`idProducto`;
    IF (SELECT `disponibilidad` FROM `productos` WHERE `codigo` = NEW.`idProducto`) = 0 THEN
        UPDATE `productos` SET `estado` = 0 WHERE `codigo` = NEW.`idProducto`;
    END IF;
END
$$
DELIMITER ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `idCategoria` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD CONSTRAINT `idCategoriaProm` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `idVendedor` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `ventas_detalle`
--
ALTER TABLE `ventas_detalle`
  ADD CONSTRAINT `idProducto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`codigo`),
  ADD CONSTRAINT `idVentas` FOREIGN KEY (`idVenta`) REFERENCES `ventas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
