-- MySQL Script generated by MySQL Workbench
-- Thu Mar 30 01:38:57 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema HardwareHouse
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema HardwareHouse
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `HardwareHouse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `HardwareHouse` ;

-- -----------------------------------------------------
-- Table `HardwareHouse`.`categorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HardwareHouse`.`categorias` ;

CREATE TABLE IF NOT EXISTS `HardwareHouse`.`categorias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `estado` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `HardwareHouse`.`productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HardwareHouse`.`productos` ;

CREATE TABLE IF NOT EXISTS `HardwareHouse`.`productos` (
  `codigo` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(60) NOT NULL,
  `descripcion` VARCHAR(200) NOT NULL,
  `precio` DECIMAL(10,0) UNSIGNED NOT NULL,
  `urlImagen` VARCHAR(120) NOT NULL,
  `estado` TINYINT UNSIGNED NOT NULL,
  `disponibilidad` INT UNSIGNED NOT NULL,
  `idCategoria` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`codigo`),
  INDEX `idCategoria_idx` (`idCategoria` ASC) VISIBLE,
  CONSTRAINT `idCategoria`
    FOREIGN KEY (`idCategoria`)
    REFERENCES `HardwareHouse`.`categorias` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `HardwareHouse`.`promociones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HardwareHouse`.`promociones` ;

CREATE TABLE IF NOT EXISTS `HardwareHouse`.`promociones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fechaInicio` DATE NOT NULL,
  `fechaFin` DATE NOT NULL,
  `nombre` VARCHAR(30) NOT NULL,
  `porcentajeDescuento` DECIMAL(10,0) UNSIGNED NOT NULL,
  `idCategoria` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idCategoriaProm_idx` (`idCategoria` ASC) VISIBLE,
  CONSTRAINT `idCategoriaProm`
    FOREIGN KEY (`idCategoria`)
    REFERENCES `HardwareHouse`.`categorias` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `HardwareHouse`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HardwareHouse`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `HardwareHouse`.`usuarios` (
  `esAdmin` TINYINT UNSIGNED NOT NULL,
  `nombre` VARCHAR(60) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
  `apellidos` VARCHAR(60) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(60) NOT NULL,
  `contrasena` VARCHAR(161) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
  `estado` VARCHAR(32) NOT NULL,
  `municipio` VARCHAR(32) NOT NULL,
  `numeroInterior` VARCHAR(6) NOT NULL,
  `colonia` VARCHAR(60) NOT NULL,
  `CP` VARCHAR(5) NOT NULL,
  `calle` VARCHAR(120) NOT NULL,
  `correo` VARCHAR(240) NOT NULL,
  `telefono` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `HardwareHouse`.`ventas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HardwareHouse`.`ventas` ;

CREATE TABLE IF NOT EXISTS `HardwareHouse`.`ventas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idUsuario` INT UNSIGNED NOT NULL,
  `fecha` DATETIME NOT NULL,
  `total` DECIMAL(10,2) UNSIGNED NOT NULL,
  `tipoPago` VARCHAR(16) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idUsuario` USING BTREE (`idUsuario`) VISIBLE,
  CONSTRAINT `idVendedor`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `HardwareHouse`.`usuarios` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `HardwareHouse`.`ventas_detalle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HardwareHouse`.`ventas_detalle` ;

CREATE TABLE IF NOT EXISTS `HardwareHouse`.`ventas_detalle` (
  `idVenta` INT UNSIGNED NOT NULL,
  `idProducto` VARCHAR(20) NOT NULL,
  `cantidad` DECIMAL(10,2) UNSIGNED NOT NULL,
  INDEX `idVentas_idx` (`idVenta` ASC) VISIBLE,
  INDEX `idProducto_idx` (`idProducto` ASC) VISIBLE,
  CONSTRAINT `idProducto`
    FOREIGN KEY (`idProducto`)
    REFERENCES `HardwareHouse`.`productos` (`codigo`),
  CONSTRAINT `idVentas`
    FOREIGN KEY (`idVenta`)
    REFERENCES `HardwareHouse`.`ventas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
