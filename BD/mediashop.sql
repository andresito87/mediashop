-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: database:3306
-- Tiempo de generación: 01-11-2024 a las 21:16:30
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mediashop`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attributes`
--

CREATE TABLE `attributes` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(250) NOT NULL,
  `type_attribute` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es texto, 2 es numerico, 3 es seleccionable y 4 es multiseleccionable',
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es activo y 2 es inactivo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `attributes`
--

INSERT INTO `attributes` (`id`, `name`, `type_attribute`, `state`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 'COLORES CLAROS', 3, 1, '2024-10-20 12:19:34', '2024-10-20 12:19:34', NULL),
(7, 'POTENCIA', 2, 1, '2024-10-20 12:26:45', '2024-10-20 12:26:45', NULL),
(8, 'TALLAS GRANDES', 3, 1, '2024-10-20 12:30:16', '2024-10-20 12:30:16', NULL),
(9, 'TAMAÑO', 1, 1, '2024-10-20 12:30:47', '2024-10-20 13:00:21', NULL),
(10, 'Poder', 2, 1, '2024-10-20 13:37:46', '2024-10-20 11:55:00', '2024-10-20 11:55:00'),
(11, 'Prueba', 2, 1, '2024-10-20 13:38:18', '2024-10-20 11:54:37', '2024-10-20 11:54:37'),
(12, 'MEMORIA', 4, 1, '2024-11-01 17:11:08', '2024-11-01 17:11:08', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `brands`
--

CREATE TABLE `brands` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(250) NOT NULL,
  `image` varchar(250) DEFAULT NULL,
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es activo y 2 es inactivo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`, `state`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'LG', NULL, 1, '2024-10-01 21:00:29', '2024-10-31 21:11:23', NULL),
(2, 'SAMSUNG', NULL, 1, '2024-10-01 21:00:42', NULL, NULL),
(3, 'SONY', NULL, 1, '2024-10-01 21:00:45', NULL, NULL),
(4, 'NIKE', NULL, 1, '2024-10-01 21:00:47', NULL, NULL),
(5, 'XIAOMI', NULL, 1, '2024-10-31 21:40:27', '2024-10-31 22:04:31', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `icon` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es activo y 2 es inactivo',
  `image` varchar(250) DEFAULT NULL,
  `categorie_second_id` bigint UNSIGNED DEFAULT NULL,
  `categorie_third_id` bigint UNSIGNED DEFAULT NULL,
  `position` double UNSIGNED NOT NULL DEFAULT '1',
  `type_categorie` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es departamento, 2 es categoria y 3 es subcategoria',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon`, `state`, `image`, `categorie_second_id`, `categorie_third_id`, `position`, `type_categorie`, `created_at`, `updated_at`, `deleted_at`) VALUES
(3, 'Gaming', NULL, 1, NULL, 35, 34, 1, 3, '2024-10-18 21:17:20', '2024-10-19 20:01:28', NULL),
(4, 'Hardware', '<svg _ngcontent-ng-c3473377212=\"\" width=\"18\" height=\"16\" viewBox=\"0 0 18 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M15.7462 7.16473V13.167C15.7462 13.6457 15.556 14.1049 15.2175 14.4434C14.8789 14.782 14.4197 14.9722 13.941 14.9722H4.3058C3.82703 14.9722 3.3679 14.782 3.02936 14.4434C2.69083 14.1049 2.50061 13.6457 2.50061 13.167V9.36255\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M3.46186 1.00001C3.18176 0.999863 2.90854 1.08659 2.6798 1.24825C2.45106 1.4099 2.27807 1.63852 2.18471 1.9026L1.11062 5.01655C0.713475 6.15382 1.41752 7.16021 2.71274 7.16021C3.18296 7.14863 3.64325 7.02257 4.05374 6.79294C4.46424 6.56331 4.81255 6.23705 5.0685 5.84243C5.20151 6.24071 5.46067 6.58479 5.80676 6.82258C6.15285 7.06036 6.56702 7.17889 6.98651 7.16021C7.18566 6.7642 7.4909 6.43132 7.86823 6.19871C8.24556 5.96611 8.68013 5.84294 9.1234 5.84294C9.56666 5.84294 10.0012 5.96611 10.3785 6.19871C10.7558 6.43132 11.0611 6.7642 11.2603 7.16021V7.16021C11.679 7.17789 12.0922 7.0589 12.4373 6.82119C12.7825 6.58348 13.041 6.23994 13.1738 5.84243C13.431 6.23686 13.7802 6.56288 14.1914 6.79243C14.6026 7.02199 15.0633 7.1482 15.5341 7.16021C16.8293 7.16021 17.5288 6.15382 17.1362 5.01655L16.0621 1.9026C15.9685 1.6378 15.7948 1.40866 15.5652 1.24694C15.3355 1.08522 15.0613 0.998927 14.7804 1.00001H3.46186Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M11.0707 14.9722H7.19861V11.4701C7.19861 10.983 7.3921 10.5158 7.73656 10.1713C8.08102 9.82685 8.54822 9.63333 9.03536 9.63333H9.22041C9.70755 9.63333 10.1747 9.82685 10.5192 10.1713C10.8637 10.5158 11.0572 10.983 11.0572 11.4701L11.0707 14.9722Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/b15wRF8zJcNkDIItCB1Rsr8L9CJVS9CI4JV2r5da.jpg', NULL, NULL, 1, 1, '2024-10-18 21:26:50', '2024-10-18 21:26:50', NULL),
(32, 'Moviles', '<svg _ngcontent-ng-c3473377212=\"\" width=\"15\" height=\"18\" viewBox=\"0 0 15 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M12.375 1H2.625C1.72754 1 1 1.72754 1 2.625V15.625C1 16.5225 1.72754 17.25 2.625 17.25H12.375C13.2725 17.25 14 16.5225 14 15.625V2.625C14 1.72754 13.2725 1 12.375 1Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M7.5 14H7.50875\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/YyoBRxQFEpEp3Y5GX6agqgyH8hsdTVUsd7bxMffn.jpg', NULL, NULL, 1, 1, '2024-10-19 16:12:29', '2024-10-19 16:12:29', NULL),
(33, 'Piezas', '<svg _ngcontent-ng-c3473377212=\"\" width=\"18\" height=\"16\" viewBox=\"0 0 18 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M15.7462 7.16473V13.167C15.7462 13.6457 15.556 14.1049 15.2175 14.4434C14.8789 14.782 14.4197 14.9722 13.941 14.9722H4.3058C3.82703 14.9722 3.3679 14.782 3.02936 14.4434C2.69083 14.1049 2.50061 13.6457 2.50061 13.167V9.36255\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M3.46186 1.00001C3.18176 0.999863 2.90854 1.08659 2.6798 1.24825C2.45106 1.4099 2.27807 1.63852 2.18471 1.9026L1.11062 5.01655C0.713475 6.15382 1.41752 7.16021 2.71274 7.16021C3.18296 7.14863 3.64325 7.02257 4.05374 6.79294C4.46424 6.56331 4.81255 6.23705 5.0685 5.84243C5.20151 6.24071 5.46067 6.58479 5.80676 6.82258C6.15285 7.06036 6.56702 7.17889 6.98651 7.16021C7.18566 6.7642 7.4909 6.43132 7.86823 6.19871C8.24556 5.96611 8.68013 5.84294 9.1234 5.84294C9.56666 5.84294 10.0012 5.96611 10.3785 6.19871C10.7558 6.43132 11.0611 6.7642 11.2603 7.16021V7.16021C11.679 7.17789 12.0922 7.0589 12.4373 6.82119C12.7825 6.58348 13.041 6.23994 13.1738 5.84243C13.431 6.23686 13.7802 6.56288 14.1914 6.79243C14.6026 7.02199 15.0633 7.1482 15.5341 7.16021C16.8293 7.16021 17.5288 6.15382 17.1362 5.01655L16.0621 1.9026C15.9685 1.6378 15.7948 1.40866 15.5652 1.24694C15.3355 1.08522 15.0613 0.998927 14.7804 1.00001H3.46186Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M11.0707 14.9722H7.19861V11.4701C7.19861 10.983 7.3921 10.5158 7.73656 10.1713C8.08102 9.82685 8.54822 9.63333 9.03536 9.63333H9.22041C9.70755 9.63333 10.1747 9.82685 10.5192 10.1713C10.8637 10.5158 11.0572 10.983 11.0572 11.4701L11.0707 14.9722Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/b15wRF8zJcNkDIItCB1Rsr8L9CJVS9CI4JV2r5da.jpg', 4, NULL, 1, 2, '2024-10-19 16:13:12', '2024-10-20 04:35:24', NULL),
(34, 'Ordenadores', '<svg _ngcontent-ng-c3473377212=\"\" width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M14.5 1H2.5C1.67157 1 1 1.67157 1 2.5V10C1 10.8284 1.67157 11.5 2.5 11.5H14.5C15.3284 11.5 16 10.8284 16 10V2.5C16 1.67157 15.3284 1 14.5 1Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M5.5 14.5H11.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M8.5 11.5V14.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/49r7BoCdJWe9d5fUNF7Wxnp3rZlKJ15FjL5f7YXD.jpg', NULL, NULL, 1, 1, '2024-10-19 16:25:28', '2024-10-19 19:45:39', NULL),
(35, 'Desktop', '<svg _ngcontent-ng-c3473377212=\"\" width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M14.5 1H2.5C1.67157 1 1 1.67157 1 2.5V10C1 10.8284 1.67157 11.5 2.5 11.5H14.5C15.3284 11.5 16 10.8284 16 10V2.5C16 1.67157 15.3284 1 14.5 1Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M5.5 14.5H11.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M8.5 11.5V14.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/jGTHUwP560FAtlRnPZtK8AnfeZT3jPFXKPa229ZT.jpg', 34, NULL, 1, 2, '2024-10-19 16:26:42', '2024-10-19 16:26:42', NULL),
(36, 'Componentes', '<svg _ngcontent-ng-c3473377212=\"\" width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M14.5 1H2.5C1.67157 1 1 1.67157 1 2.5V10C1 10.8284 1.67157 11.5 2.5 11.5H14.5C15.3284 11.5 16 10.8284 16 10V2.5C16 1.67157 15.3284 1 14.5 1Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M5.5 14.5H11.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M8.5 11.5V14.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/ZDy96qlBxskVpzbVcO5P0fgVxgqdMKUdZu3HxYKj.jpg', 4, NULL, 1, 2, '2024-10-20 07:24:23', '2024-10-20 07:24:23', NULL),
(37, 'Memorias Ram', '<svg _ngcontent-ng-c3473377212=\"\" width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path _ngcontent-ng-c3473377212=\"\" d=\"M14.5 1H2.5C1.67157 1 1 1.67157 1 2.5V10C1 10.8284 1.67157 11.5 2.5 11.5H14.5C15.3284 11.5 16 10.8284 16 10V2.5C16 1.67157 15.3284 1 14.5 1Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M5.5 14.5H11.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path _ngcontent-ng-c3473377212=\"\" d=\"M8.5 11.5V14.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>', 1, 'categories/g6GBKSqur122gcbD6XFQGYqChSVNOyJVUdtMerBI.jpg', 36, 4, 1, 3, '2024-10-20 07:38:22', '2024-10-20 07:38:22', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_10_05_205419_create_personal_access_tokens_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(250) NOT NULL,
  `slug` text NOT NULL,
  `sku` varchar(50) NOT NULL,
  `price_eur` double NOT NULL,
  `price_usd` double NOT NULL,
  `description` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `resume` longtext NOT NULL,
  `image` varchar(250) NOT NULL,
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es pendiente y 2 es publico',
  `tags` json DEFAULT NULL,
  `brand_id` bigint UNSIGNED NOT NULL,
  `categorie_first_id` bigint UNSIGNED NOT NULL,
  `categorie_second_id` bigint UNSIGNED DEFAULT NULL,
  `categorie_third_id` bigint UNSIGNED DEFAULT NULL,
  `stock` double NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `title`, `slug`, `sku`, `price_eur`, `price_usd`, `description`, `resume`, `image`, `state`, `tags`, `brand_id`, `categorie_first_id`, `categorie_second_id`, `categorie_third_id`, `stock`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'LAPTOP GAMING 2024', 'laptop-gaming-2024', 'LAPTOP-2024', 1000, 1200, '<p>Hello World!43534eerwre</p>', 'Mejor laptop 2024', 'products/bogfEypUNmilZnHHj8A1cRaBsQaXUBGHm0Pe9k12.jpg', 1, '[{\"item_id\": 1730302956413, \"item_text\": \"LAPTOP\"}, {\"item_id\": 1730302961326, \"item_text\": \"GAMING\"}]', 1, 34, 35, 3, 0, '2024-10-30 16:43:18', '2024-10-30 20:44:20', NULL),
(3, 'SMARTWATCH PLUS ARCHOR', 'smartwatch-plus-archor', 'SMARTWATCH-2024', 123, 150, '<p>Hello World! cambiando</p>', 'Reloj inteligente 2024', 'products/CTfQhMsrmVsJHnEB36eTY0XwN6Dw9lsRhIDnp5xb.jpg', 1, '[{\"item_id\": 1730303909339, \"item_text\": \"SMARTWATCH\"}, {\"item_id\": 1730303962085, \"item_text\": \"2024\"}]', 2, 4, NULL, NULL, 0, '2024-10-30 17:00:03', '2024-10-31 14:52:56', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `image` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 'products/jI54OMOGNltS89xukAt1lunm50aeFwoS1u3V98fk.jpg', '2024-10-31 14:48:13', '2024-10-31 14:33:50', '2024-10-31 14:33:50'),
(2, 2, 'products/StDlrVvwDfcJ1deivrDgWqOzmNCpipYn4RQkhWoE.jpg', '2024-10-31 14:52:43', '2024-10-31 14:30:01', '2024-10-31 14:30:01'),
(3, 2, 'products/XLQpApflVZuYHK3I11guSdjhxG43FkAvX4hO5tYO.jpg', '2024-10-31 14:53:42', '2024-10-31 14:29:55', '2024-10-31 14:29:55'),
(4, 2, 'products/cnFK4WefifA1iqJbD1QM25x3Mxk6hE6E4pel1COP.jpg', '2024-10-31 14:55:26', '2024-10-31 14:55:26', NULL),
(5, 2, 'products/JYE4QiKdJhC2CzIx3iZqZNoe3CXd63BnE0R2Tng7.jpg', '2024-10-31 15:09:16', '2024-10-31 14:30:50', '2024-10-31 14:30:50'),
(6, 2, 'products/a4kiFecLbjXEcUT8oy2vzdiTAcYOIms4Vwopzr3v.jpg', '2024-10-31 15:35:05', '2024-10-31 14:35:14', '2024-10-31 14:35:14'),
(7, 2, 'products/xxSzRAp7Mj73sUmTEMHCq4NWAEKKWzhLN7LA72M2.jpg', '2024-10-31 15:38:46', '2024-10-31 14:38:52', '2024-10-31 14:38:52'),
(8, 2, 'products/fut3VL6V26C3wZMxEE4jmJPaWsew3H8oPwl7NiQf.jpg', '2024-10-31 15:39:25', '2024-10-31 14:39:37', '2024-10-31 14:39:37'),
(9, 2, 'products/tsu0gLoutZ0xR0HRaQ6CN5NXwhsAle6JFMFE4mwj.jpg', '2024-10-31 15:39:33', '2024-10-31 15:39:33', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_specifications`
--

CREATE TABLE `product_specifications` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `attribute_id` bigint UNSIGNED NOT NULL,
  `property_id` bigint UNSIGNED DEFAULT NULL,
  `value_add` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es activo y 2 es inactivo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `product_specifications`
--

INSERT INTO `product_specifications` (`id`, `product_id`, `attribute_id`, `property_id`, `value_add`, `state`, `created_at`, `updated_at`, `deleted_at`) VALUES
(4, 2, 6, 1, NULL, 1, '2024-11-01 20:36:19', '2024-11-01 20:36:18', NULL),
(9, 2, 9, NULL, '56', 1, '2024-11-01 21:00:40', '2024-11-01 21:00:40', NULL),
(12, 2, 8, 4, NULL, 1, '2024-11-01 21:43:32', '2024-11-01 21:43:32', NULL),
(14, 2, 7, NULL, '200', 1, '2024-11-01 21:51:03', '2024-11-01 21:51:03', NULL),
(15, 2, 12, NULL, '[{\"id\":6,\"name\":\"16GB\"},{\"id\":7,\"name\":\"32GB\"}]', 1, '2024-11-01 22:04:08', '2024-11-01 22:04:08', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_variations`
--

CREATE TABLE `product_variations` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `attribute_id` bigint UNSIGNED NOT NULL,
  `property_id` bigint UNSIGNED DEFAULT NULL,
  `value_add` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `add_price` double NOT NULL DEFAULT '0',
  `stock` double NOT NULL DEFAULT '0',
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es activo y 2 es inactivo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `properties`
--

CREATE TABLE `properties` (
  `id` bigint UNSIGNED NOT NULL,
  `attribute_id` bigint UNSIGNED NOT NULL,
  `name` varchar(250) NOT NULL,
  `code` varchar(250) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `properties`
--

INSERT INTO `properties` (`id`, `attribute_id`, `name`, `code`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 6, 'Rosado', '#f9b4b4', '2024-10-20 16:00:30', '2024-10-20 16:00:30', NULL),
(2, 6, 'Verde', '#96f89d', '2024-10-20 16:00:57', '2024-10-20 16:00:57', NULL),
(3, 6, 'Blanco', '#fdfcfc', '2024-10-20 16:10:11', '2024-10-20 14:22:39', '2024-10-20 14:22:39'),
(4, 8, 'XL', NULL, '2024-10-20 16:23:29', '2024-10-20 16:23:29', NULL),
(5, 8, 'L', NULL, '2024-10-20 16:23:35', '2024-10-20 16:23:35', NULL),
(6, 12, '16GB', NULL, '2024-11-01 17:12:00', '2024-11-01 17:12:00', NULL),
(7, 12, '32GB', NULL, '2024-11-01 17:12:32', '2024-11-01 17:12:32', NULL),
(8, 12, '64GB', NULL, '2024-11-01 17:12:36', '2024-11-01 17:12:36', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('URpunptKL6bnoHix71UnTZgKvZfA13vWwFJZRvgs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUldIRVBOVmdvOE9VWXlFUEsyMzFQQnpxVzhENkN4eTIzT2VQMlRuUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1728479588);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sliders`
--

CREATE TABLE `sliders` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(250) NOT NULL,
  `label` varchar(250) DEFAULT NULL,
  `subtitle` varchar(250) DEFAULT NULL,
  `image` varchar(250) NOT NULL,
  `link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `color` varchar(50) DEFAULT NULL,
  `state` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es activo y 2 es inactivo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sliders`
--

INSERT INTO `sliders` (`id`, `title`, `label`, `subtitle`, `image`, `link`, `color`, `state`, `created_at`, `updated_at`, `deleted_at`) VALUES
(8, 'Las mejores tablets de 2025', NULL, 'Ofertas del 20% sólo esta semana', 'slider/1NoK4aEqTr9bdE5COQr0xC2svD0QkS27pYb0viO6.jpg', 'https://preview.keenthemes.com/', '#a6e92b', 1, '2024-10-20 20:48:26', '2024-10-20 21:35:57', NULL),
(9, 'asdasda2', 'asdasd', 'asdasd', 'slider/GrBxhbaWw9cHmVQcJLMsC7uvkmxlF1JrkNwghPjg.jpg', 'asdad', '#880202', 1, '2024-10-20 21:48:45', '2024-10-20 19:49:27', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unique_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_user` tinyint UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 es administrador y 2 es cliente',
  `code_verified` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `phone`, `unique_id`, `avatar`, `email`, `type_user`, `code_verified`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(52, 'asadad', 'asdasd', '233234234', '6702a93eb70a6', NULL, 'andrespodadera87@gmail.com', 1, NULL, '2024-10-06 15:30:10', '$2y$12$DEF01W6Ab5q/ZAX0RxOQ2.G4eLKjrsdUzzmALWkDbzAHxrgpBnReq', NULL, '2024-10-06 15:14:06', '2024-10-09 14:53:22', NULL),
(53, 'andres', 'podadera', '2234234', '67227b97b72c9', NULL, 'andrespoda@gmail.com', 2, NULL, '2024-10-30 18:33:17', '$2y$12$Cz8swfIyuveMBQOrlNhcUuljVOaVnMkZNbAoMOigA7NboKUz1dA/2', NULL, '2024-10-30 18:31:51', '2024-10-30 18:33:17', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `product_variations`
--
ALTER TABLE `product_variations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `attributes`
--
ALTER TABLE `attributes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `product_specifications`
--
ALTER TABLE `product_specifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `product_variations`
--
ALTER TABLE `product_variations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
