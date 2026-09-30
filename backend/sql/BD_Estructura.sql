-- =========================================================
-- Base de datos: mantenimiento
-- Motor: MySQL 8.x
--
-- Estructura completa para levantar el proyecto desde cero.
-- Ejecutar este archivo completo (por ejemplo con
-- `mysql -u root -p < BD_Estructura.sql`
-- o importandolo desde MySQL Workbench) crea la base, todas
-- las tablas en el orden correcto segun sus llaves foraneas,
-- y los datos base (roles y estados de mantenimiento) que la
-- aplicacion necesita para funcionar.
--
-- Despues de ejecutarlo, configura backend/.env con las
-- credenciales de conexion (DB_HOST, DB_USER, DB_PASSWORD,
-- DB_NAME=mantenimiento, JWT_SECRET).
--
-- Actualizado: 2026-09-29 (HU11 - asignar tecnico a un reporte)
-- =========================================================

CREATE DATABASE IF NOT EXISTS mantenimiento DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mantenimiento;

-- ---------------------------------------------------------
-- Tabla: roles
-- Catalogo de roles de usuario (Admin, Tecnico, Residente).
-- ---------------------------------------------------------
CREATE TABLE roles (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    nombre  VARCHAR(50) NOT NULL,

    UNIQUE KEY (nombre)
) ENGINE=InnoDB;

INSERT INTO roles (id, nombre) VALUES
    (1, 'ADMIN'),
    (2, 'TECNICO'),
    (3, 'RESIDENTE');

-- ---------------------------------------------------------
-- Tabla: residenciales
-- Cada residencial/condominio registrado en el sistema.
-- ---------------------------------------------------------
CREATE TABLE residenciales (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(200) NOT NULL,
    direccion       VARCHAR(255) DEFAULT NULL,
    ciudad          VARCHAR(150) DEFAULT NULL,
    telefono        VARCHAR(30)  DEFAULT NULL,
    estado          VARCHAR(30)  NOT NULL DEFAULT 'Activo',
    fecha_registro  DATE DEFAULT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: usuarios
-- Cuentas de acceso al sistema. `residencial_id` solo aplica
-- a usuarios con rol Residente; `role_id` define sus permisos.
-- ---------------------------------------------------------
CREATE TABLE usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    residencial_id  INT DEFAULT NULL,
    role_id         INT NOT NULL,
    nombre          VARCHAR(200) NOT NULL,
    email           VARCHAR(200) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    estado          TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY (email),
    CONSTRAINT fk_usuario_residencial FOREIGN KEY (residencial_id) REFERENCES residenciales(id),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: edificios
-- Cada edificio/torre que pertenece a un residencial
-- (un residencial tiene uno o mas edificios).
-- ---------------------------------------------------------
CREATE TABLE edificios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    residencial_id  INT NOT NULL,
    nombre          VARCHAR(150) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_edificio_residencial FOREIGN KEY (residencial_id) REFERENCES residenciales(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: apartamento_casa
-- Cada unidad (apartamento/casa), su residencial y,
-- opcionalmente, el usuario que vive ahi como residente.
-- ---------------------------------------------------------
CREATE TABLE apartamento_casa (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    residencial_id      INT NOT NULL,
    usuario_id          INT DEFAULT NULL,
    nombre              VARCHAR(100) NOT NULL,
    tipo                VARCHAR(50) DEFAULT NULL,
    estado              TINYINT(1) DEFAULT 1,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    numero_apartamento  INT NOT NULL,
    piso_apartamento    INT NOT NULL,

    CONSTRAINT fk_apartamento_residencial FOREIGN KEY (residencial_id) REFERENCES residenciales(id),
    CONSTRAINT fk_apartamento_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: residentes
-- Datos de contacto adicionales de un residente, ligados 1 a 1
-- a un apartamento/casa.
-- ---------------------------------------------------------
CREATE TABLE residentes (
    id_residente        INT PRIMARY KEY,
    nombre_residente    VARCHAR(50) NOT NULL,
    apellido_residente  VARCHAR(80) NOT NULL,
    telefono_residente  VARCHAR(15) NOT NULL,
    correo_residente    VARCHAR(100) NOT NULL,
    tipo_residente      ENUM('PROPIETARIO', 'INQUILINO') NOT NULL,
    id                  INT NOT NULL,

    CONSTRAINT fk_residente_apartamento FOREIGN KEY (id) REFERENCES apartamento_casa(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: areas_comunes
-- Areas compartidas de un residencial (pasillo, elevador,
-- estacionamiento, piscina, etc.), usadas al reportar una
-- averia que no ocurre dentro de un apartamento especifico.
-- ---------------------------------------------------------
CREATE TABLE areas_comunes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    residencial_id  INT NOT NULL,
    nombre          VARCHAR(100) NOT NULL,

    CONSTRAINT fk_area_residencial FOREIGN KEY (residencial_id) REFERENCES residenciales(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: estados_mantenimiento
-- Catalogo de estados para solicitudes de mantenimiento.
-- PENDIENTE quedo como id 5 porque se agrego despues de los
-- otros cuatro; por eso el DEFAULT de `reportes.estado_id`
-- apunta a 5, no a 1. Mantenemos este orden a proposito para
-- que coincida con las bases de datos que el equipo ya tiene
-- funcionando (no reordenar sin avisar a todos).
-- ---------------------------------------------------------
CREATE TABLE estados_mantenimiento (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    nombre  VARCHAR(50) NOT NULL,

    UNIQUE KEY (nombre)
) ENGINE=InnoDB;

INSERT INTO estados_mantenimiento (id, nombre) VALUES
    (1, 'PROGRAMADO'),
    (2, 'EN_PROCESO'),
    (3, 'COMPLETADO'),
    (4, 'CANCELADO'),
    (5, 'PENDIENTE'),
    (6, 'ASIGNADO');

-- ---------------------------------------------------------
-- Tabla: reportes
-- Reportes de mantenimiento creados por un residente. La
-- ubicacion es un apartamento propio O un area comun, nunca
-- ambos (por eso los dos campos son opcionales). El estado
-- inicial siempre es Pendiente (id 5, ver nota en la tabla
-- estados_mantenimiento). `tecnico_id` se llena cuando un
-- admin asigna un tecnico (rol TECNICO) al reporte, momento en
-- el que el estado pasa a Asignado (id 6).
-- ---------------------------------------------------------
CREATE TABLE reportes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT NOT NULL,
    apartamento_id  INT DEFAULT NULL,
    area_comun_id   INT DEFAULT NULL,
    categoria       ENUM('PLOMERIA', 'ELECTRICIDAD', 'ELEVADOR', 'ESTRUCTURAL', 'OTRO') NOT NULL,
    descripcion     TEXT NOT NULL,
    estado_id       INT NOT NULL DEFAULT 5,
    tecnico_id      INT DEFAULT NULL,
    fecha_reporte   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_programada DATE DEFAULT NULL,

    CONSTRAINT fk_reporte_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_reporte_apartamento FOREIGN KEY (apartamento_id) REFERENCES apartamento_casa(id),
    CONSTRAINT fk_reporte_area FOREIGN KEY (area_comun_id) REFERENCES areas_comunes(id),
    CONSTRAINT fk_reporte_estado FOREIGN KEY (estado_id) REFERENCES estados_mantenimiento(id),
    CONSTRAINT fk_reporte_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: tecnicos
-- Datos adicionales que solo aplican a usuarios con rol
-- Tecnico (role_id = 2), ligados 1 a 1 a `usuarios`. La
-- especialidad usa el mismo catalogo de categorias que
-- `reportes.categoria`, para poder filtrar tecnicos por la
-- categoria del reporte al asignar (HU11).
-- ---------------------------------------------------------
-- Datos adicionales de los usuarios con rol Tecnico (role_id = 2)
CREATE TABLE IF NOT EXISTS tecnicos (
    id             INT PRIMARY KEY,
    especialidad   ENUM('PLOMERIA', 'ELECTRICIDAD', 'ELEVADOR', 'ESTRUCTURAL', 'GENERAL') NOT NULL,
    telefono       VARCHAR(15) DEFAULT NULL,

    CONSTRAINT fk_tecnico_usuario FOREIGN KEY (id) REFERENCES usuarios(id)
) ENGINE=InnoDB;