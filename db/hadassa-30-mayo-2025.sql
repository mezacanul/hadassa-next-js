-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-05-2025 a las 11:35:22
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hadassa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id` varchar(256) NOT NULL,
  `lashista_id` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id`, `lashista_id`) VALUES
('cama-aithana-1', 'd3e7bb64-feed-11ef-8036-acde48001122'),
('cama-aithana-2', 'd3e7bb64-feed-11ef-8036-acde48001122'),
('cama-eli-1', 'd3e7bc0e-feed-11ef-8036-acde48001122'),
('cama-eli-2', 'd3e7bc0e-feed-11ef-8036-acde48001122'),
('cama-hadassa-1', 'd3e7b9a2-feed-11ef-8036-acde48001122'),
('cama-hadassa-2', 'd3e7b9a2-feed-11ef-8036-acde48001122');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` varchar(256) NOT NULL,
  `servicio_id` varchar(256) NOT NULL,
  `lashista_id` varchar(256) NOT NULL,
  `clienta_id` varchar(256) NOT NULL,
  `cama_id` text NOT NULL,
  `fecha` text NOT NULL,
  `hora` text NOT NULL,
  `pagado` tinyint(1) DEFAULT NULL,
  `fecha_pagado` text DEFAULT NULL,
  `metodo_pago` text DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `fecha_confirmado` text DEFAULT NULL,
  `added` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `servicio_id`, `lashista_id`, `clienta_id`, `cama_id`, `fecha`, `hora`, `pagado`, `fecha_pagado`, `metodo_pago`, `confirmado`, `fecha_confirmado`, `added`) VALUES
('00b5ee22-37c9-11f0-b6b4-acde48001122', '4a8251c6-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '1b208d66-36f3-11f0-b6b4-acde48001122', 'cama-eli-1', '22-05-2025', '09:30', NULL, NULL, NULL, NULL, NULL, '2025-05-23 05:28:08'),
('0c70799c-2993-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba724-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '25-04-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('22030edc-3ad7-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '1b208d66-36f3-11f0-b6b4-acde48001122', 'cama-eli-2', '22-05-2025', '11:30', NULL, NULL, NULL, NULL, NULL, '2025-05-27 02:46:51'),
('2c752014-226b-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-eli-2', '25-04-2025', '12:00', 0, NULL, NULL, NULL, NULL, NULL),
('3672eb3e-1297-11f0-9e81-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '0ccafcae-129c-11f0-9e81-acde48001122', 'cama-hadassa-1', '07-04-2025', '09:00', 0, NULL, NULL, NULL, NULL, NULL),
('3be5486c-3bf7-11f0-b6b4-acde48001122', '4a82522a-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-eli-1', '28-05-2025', '09:30', NULL, NULL, NULL, NULL, NULL, '2025-05-28 13:09:09'),
('3dec6efc-3700-11f0-b6b4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba63e-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '22-05-2025', '11:00', NULL, NULL, NULL, NULL, NULL, '2025-05-22 05:31:02'),
('47aef7f8-2ade-11f0-b6b4-acde48001122', '4a825144-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '24-04-2025', '12:00', NULL, NULL, NULL, NULL, NULL, NULL),
('4e52bbde-2ada-11f0-b6b4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba80a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '06-05-2025', '09:30', NULL, NULL, NULL, NULL, NULL, NULL),
('5034c8bc-3c68-11f0-b6b4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253ba6c0-15a9-11f0-8ca4-acde48001122', 'cama-eli-1', '29-05-2025', '12:30', NULL, NULL, NULL, NULL, NULL, '2025-05-29 02:38:36'),
('51b11c60-2adc-11f0-b6b4-acde48001122', '4a82520c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba850-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '24-04-2025', '10:00', NULL, NULL, NULL, NULL, NULL, NULL),
('6298ddcc-3c59-11f0-b6b4-acde48001122', '4a82518a-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253ba80a-15a9-11f0-8ca4-acde48001122', 'cama-aithana-1', '29-05-2025', '11:30', NULL, NULL, NULL, NULL, NULL, '2025-05-29 00:51:45'),
('6675dd30-36f7-11f0-b6b4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '1b208d66-36f3-11f0-b6b4-acde48001122', 'cama-hadassa-1', '22-05-2025', '09:30', NULL, NULL, NULL, NULL, NULL, '2025-05-22 04:27:45'),
('807a8fa4-299c-11f0-b6b4-acde48001122', '4a82518a-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba724-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '25-04-2025', '15:30', 0, NULL, NULL, NULL, NULL, NULL),
('871d491e-36f8-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '1b208d66-36f3-11f0-b6b4-acde48001122', 'cama-hadassa-2', '22-05-2025', '10:00', NULL, NULL, NULL, NULL, NULL, '2025-05-22 04:35:49'),
('a66fbbcc-3701-11f0-b6b4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-aithana-2', '22-05-2025', '09:30', NULL, NULL, NULL, NULL, NULL, '2025-05-22 05:41:07'),
('a93f4e2a-234d-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '27-04-2025', '09:30', NULL, NULL, NULL, NULL, NULL, NULL),
('b580085a-2294-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-eli-1', '25-04-2025', '09:00', NULL, NULL, NULL, NULL, NULL, NULL),
('b76d7c02-36f7-11f0-b6b4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '1b208d66-36f3-11f0-b6b4-acde48001122', 'cama-hadassa-1', '22-05-2025', '10:00', NULL, NULL, NULL, NULL, NULL, '2025-05-22 04:30:01'),
('bce234b8-36fa-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-aithana-1', '22-05-2025', '09:30', NULL, NULL, NULL, NULL, NULL, '2025-05-22 04:51:38'),
('c0a97038-37c8-11f0-b6b4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-aithana-1', '22-05-2025', '10:30', NULL, NULL, NULL, NULL, NULL, '2025-05-23 05:26:21'),
('c1c9bb60-2294-11f0-8ca4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '25-04-2025', '10:00', NULL, NULL, NULL, NULL, NULL, NULL),
('c479778c-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-aithana-1', '25-04-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47977b4-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '27-04-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47977d2-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '27-04-2025', '12:00', 0, NULL, NULL, NULL, NULL, NULL),
('c4797818-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '28-04-2025', '12:00', 0, NULL, NULL, NULL, NULL, NULL),
('c4797840-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '28-04-2025', '13:00', 0, NULL, NULL, NULL, NULL, NULL),
('c479785e-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '29-04-2025', '09:00', 0, NULL, NULL, NULL, NULL, NULL),
('c479787c-21aa-11f0-8ca4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '29-04-2025', '10:00', 0, NULL, NULL, NULL, NULL, NULL),
('c479789a-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '30-04-2025', '10:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47978b8-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '30-04-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47978d6-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '01-05-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47978f4-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '01-05-2025', '12:00', 0, NULL, NULL, NULL, NULL, NULL),
('c4797912-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '02-05-2025', '12:00', 0, NULL, NULL, NULL, NULL, NULL),
('c479796c-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '02-05-2025', '13:00', 0, NULL, NULL, NULL, NULL, NULL),
('c479798a-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '03-05-2025', '09:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47979a8-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '03-05-2025', '10:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47979c6-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '04-05-2025', '10:00', 0, NULL, NULL, NULL, NULL, NULL),
('c47979e4-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '04-05-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('c4797a2a-21aa-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba788-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '05-05-2025', '11:00', 0, NULL, NULL, NULL, NULL, NULL),
('c4797a48-21aa-11f0-8ca4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba58a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '05-05-2025', '12:00', 0, NULL, NULL, NULL, NULL, NULL),
('cfa2416e-3700-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba706-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '22-05-2025', '11:00', NULL, NULL, NULL, NULL, NULL, '2025-05-22 05:35:07'),
('d104cc34-3c5a-11f0-b6b4-acde48001122', '4a825086-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253ba88c-15a9-11f0-8ca4-acde48001122', 'cama-eli-1', '29-05-2025', '13:00', NULL, NULL, NULL, NULL, NULL, '2025-05-29 01:01:59'),
('d13c7398-2295-11f0-8ca4-acde48001122', '4a82520c-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-aithana-2', '25-04-2025', '15:00', NULL, NULL, NULL, NULL, NULL, NULL),
('d4325f82-2294-11f0-8ca4-acde48001122', '4a8251ee-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253ba724-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '25-04-2025', '12:00', NULL, NULL, NULL, NULL, NULL, NULL),
('d5e8474e-37c8-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253ba724-15a9-11f0-8ca4-acde48001122', 'cama-aithana-2', '22-05-2025', '10:30', NULL, NULL, NULL, NULL, NULL, '2025-05-23 05:26:57'),
('d8a0b758-3ad6-11f0-b6b4-acde48001122', '4a82518a-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253ba86e-15a9-11f0-8ca4-acde48001122', 'cama-eli-1', '22-05-2025', '10:30', NULL, NULL, NULL, NULL, NULL, '2025-05-27 02:44:48'),
('dffffa22-2357-11f0-8ca4-acde48001122', '4a823f4c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-1', '27-04-2025', '10:00', NULL, NULL, NULL, NULL, NULL, NULL),
('e32ab2ae-2295-11f0-8ca4-acde48001122', '4a82516c-fef3-11ef-8036-acde48001122', 'd3e7b9a2-feed-11ef-8036-acde48001122', '253b954a-15a9-11f0-8ca4-acde48001122', 'cama-hadassa-2', '25-04-2025', '14:00', NULL, NULL, NULL, NULL, NULL, NULL),
('edcc4114-3c67-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253ba76a-15a9-11f0-8ca4-acde48001122', 'cama-eli-2', '29-05-2025', '13:00', NULL, NULL, NULL, NULL, NULL, '2025-05-29 02:35:51'),
('ef0c0b8e-37c8-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7bb64-feed-11ef-8036-acde48001122', '253ba832-15a9-11f0-8ca4-acde48001122', 'cama-aithana-1', '22-05-2025', '11:00', NULL, NULL, NULL, NULL, NULL, '2025-05-23 05:27:39'),
('ff14011e-3c67-11f0-b6b4-acde48001122', '4a82511c-fef3-11ef-8036-acde48001122', 'd3e7bc0e-feed-11ef-8036-acde48001122', '253ba7ce-15a9-11f0-8ca4-acde48001122', 'cama-eli-1', '29-05-2025', '13:30', NULL, NULL, NULL, NULL, NULL, '2025-05-29 02:36:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientas`
--

CREATE TABLE `clientas` (
  `id` varchar(256) NOT NULL,
  `nombre_completo` text DEFAULT NULL,
  `nombres` text NOT NULL,
  `apellidos` text NOT NULL,
  `lada` text NOT NULL,
  `telefono` text NOT NULL,
  `fecha_de_nacimiento` text DEFAULT NULL,
  `foto_clienta` text DEFAULT NULL,
  `detalles_cejas` text DEFAULT NULL,
  `fotos_cejas` text DEFAULT NULL,
  `fecha_agregado` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientas`
--

INSERT INTO `clientas` (`id`, `nombre_completo`, `nombres`, `apellidos`, `lada`, `telefono`, `fecha_de_nacimiento`, `foto_clienta`, `detalles_cejas`, `fotos_cejas`, `fecha_agregado`) VALUES
('1b208d66-36f3-11f0-b6b4-acde48001122', NULL, 'José Eduardo', 'Meza Canul', '52', '9993524438', NULL, NULL, NULL, NULL, '2025-05-22 03:57:00'),
('253b954a-15a9-11f0-8ca4-acde48001122', 'Mariana Perez', 'Mariana', 'Perez', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba58a-15a9-11f0-8ca4-acde48001122', 'Camila Calderon', 'Camila', 'Calderon', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba63e-15a9-11f0-8ca4-acde48001122', 'Yarisa Fernandez', 'Yarisa', 'Fernandez', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba670-15a9-11f0-8ca4-acde48001122', 'Paula Godinez', 'Paula', 'Godinez', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba698-15a9-11f0-8ca4-acde48001122', 'Yamileth Carcamo', 'Yamileth', 'Carcamo', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba6c0-15a9-11f0-8ca4-acde48001122', 'Nora Manzanilla', 'Nora', 'Manzanilla', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba6de-15a9-11f0-8ca4-acde48001122', 'Sofia Rodriguez', 'Sofia', 'Rodriguez', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba706-15a9-11f0-8ca4-acde48001122', 'Karen Magaña', 'Karen', 'Magaña', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba724-15a9-11f0-8ca4-acde48001122', 'Karen Palma', 'Karen', 'Palma', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba74c-15a9-11f0-8ca4-acde48001122', 'Patricia Palma', 'Patricia', 'Palma', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba76a-15a9-11f0-8ca4-acde48001122', 'Mariana Rubio', 'Mariana', 'Rubio', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba788-15a9-11f0-8ca4-acde48001122', 'Katia Vazquez', 'Katia', 'Vazquez', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba7b0-15a9-11f0-8ca4-acde48001122', 'Fabiola Balam', 'Fabiola', 'Balam', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba7ce-15a9-11f0-8ca4-acde48001122', 'Montserrat Rosado', 'Montserrat', 'Rosado', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba7ec-15a9-11f0-8ca4-acde48001122', 'Fernanda Molina', 'Fernanda', 'Molina', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba80a-15a9-11f0-8ca4-acde48001122', 'Mitzi Molina', 'Mitzi', 'Molina', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba832-15a9-11f0-8ca4-acde48001122', 'Ale Heredia', 'Ale', 'Heredia', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba850-15a9-11f0-8ca4-acde48001122', 'Pao Mezo', 'Pao', 'Mezo', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba86e-15a9-11f0-8ca4-acde48001122', 'Tita Hagar', 'Tita', 'Hagar', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09'),
('253ba88c-15a9-11f0-8ca4-acde48001122', 'Andrea Palma', 'Andrea', 'Palma', '52', '9999123456', NULL, NULL, NULL, NULL, '2025-04-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lashistas`
--

CREATE TABLE `lashistas` (
  `id` varchar(256) NOT NULL,
  `nombre` text NOT NULL,
  `rol` text NOT NULL,
  `horarioLV` text NOT NULL,
  `horarioSBD` text NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lashistas`
--

INSERT INTO `lashistas` (`id`, `nombre`, `rol`, `horarioLV`, `horarioSBD`, `image`) VALUES
('d3e7b9a2-feed-11ef-8036-acde48001122', 'Hadassa', 'admin', '[\"09:30 - 13:00\", \"15:00 - 18:00\"]', '09:00 - 14:00', 'hadassa.jpg'),
('d3e7bb64-feed-11ef-8036-acde48001122', 'Aithana', 'personal', '[\"09:30 - 14:00\"]', '09:00 - 14:00', 'aithana.jpg'),
('d3e7bc0e-feed-11ef-8036-acde48001122', 'Eli', 'personal', '[\"13:30 - 18:00\"]', '09:00 - 14:00', 'eli.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` varchar(256) NOT NULL,
  `tipo` text NOT NULL,
  `servicio` text NOT NULL,
  `descripcion` text NOT NULL,
  `minutos` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `reglas_agenda` text NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `tipo`, `servicio`, `descripcion`, `minutos`, `precio`, `reglas_agenda`, `image`) VALUES
('4a823f4c-fef3-11ef-8036-acde48001122', 'default', 'Diseño de cejas', 'Depilación de cejas con pinza.', 30, 250, '[-1]', 'srv1.png'),
('4a825086-fef3-11ef-8036-acde48001122', 'default', 'Brow Henna', 'Depilación de cejas con pinza y tinte henna para cejas.', 30, 300, '[-1]', 'srv2.png'),
('4a82511c-fef3-11ef-8036-acde48001122', 'default', 'Lami Brow', 'Laminación / planchado de cejas con diseño, depilación y tinte henna.', 60, 350, '[0,-1]', 'srv3.png'),
('4a825144-fef3-11ef-8036-acde48001122', 'default', 'Lash Lift', 'Levantamiento/rizado de pestañas, incluye pigmento negro.', 60, 450, '[-1]', 'srv4.png'),
('4a82516c-fef3-11ef-8036-acde48001122', 'default', 'Lash Lift Doble', 'Levantamiento/rizado de pestañas superiores e inferiores, incluye pigmento negro.', 90, 600, '[1]', 'srv5.png'),
('4a82518a-fef3-11ef-8036-acde48001122', 'combo', 'Lash Lift + Lami Brow', 'Levantamiento de pestañas laminado de Ceja depilacion y pigmento.', 90, 700, '[-1]', 'srv6.png'),
('4a8251a8-fef3-11ef-8036-acde48001122', 'combo', 'Lash Lift + Brow Henna', 'Levantamiento de pestañas depilación y pigmento henna', 60, 650, '[-1]', 'srv7.png'),
('4a8251c6-fef3-11ef-8036-acde48001122', 'combo', 'Lash Lift + Diseño de Cejas', 'Levantamiento de pestañas depilación y pigmento henna', 60, 600, '[-1]', 'srv8.png'),
('4a8251ee-fef3-11ef-8036-acde48001122', 'combo-hadassa', 'Lash Lift Doble + Lami Brow', '', 120, 850, '[1]', 'combo-hadassa.png'),
('4a82520c-fef3-11ef-8036-acde48001122', 'combo-hadassa', 'Lash Lift Doble + Brow Henna', '', 90, 800, '[1]', 'combo-hadassa.png'),
('4a82522a-fef3-11ef-8036-acde48001122', 'combo-hadassa', 'Lash Lift Doble + Diseño de Cejas', '', 90, 750, '[1]', 'combo-hadassa.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientas`
--
ALTER TABLE `clientas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `lashistas`
--
ALTER TABLE `lashistas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
