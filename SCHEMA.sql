/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `estado` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `urlImagen` varchar(120) NOT NULL,
  `estado` tinyint NOT NULL,
  `disponibilidad` int NOT NULL,
  `idCategoria` int NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idCategoria_idx` (`idCategoria`),
  CONSTRAINT `idCategoria` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `promociones`;
CREATE TABLE `promociones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `porcentajeDescuento` decimal(10,0) NOT NULL,
  `idCategoria` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCategoriaProm_idx` (`idCategoria`),
  CONSTRAINT `idCategoriaProm` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `esAdmin` tinyint(1) NOT NULL,
  `nombre` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellidos` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE `ventas` (
  `id` int NOT NULL,
  `idUsuario` int NOT NULL,
  `fecha` datetime NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `tipoPago` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`) USING BTREE,
  CONSTRAINT `idVendedor` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ventas_detalle`;
CREATE TABLE `ventas_detalle` (
  `idVenta` int NOT NULL,
  `idProducto` varchar(20) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  KEY `idVentas_idx` (`idVenta`),
  KEY `idProducto_idx` (`idProducto`),
  CONSTRAINT `idProducto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`codigo`),
  CONSTRAINT `idVentas` FOREIGN KEY (`idVenta`) REFERENCES `ventas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;