-- =========================================================
-- Tablas: residenciales y apartamento_casa
-- Motor: MySQL 8.x
-- Asume que la tabla `usuarios` ya existe (id INT PK AUTO_INCREMENT)
-- =========================================================

-- ---------------------------------------------------------
-- Tabla: residenciales
-- Representa cada residencial/condominio registrado en el sistema.
-- ---------------------------------------------------------
CREATE TABLE residenciales (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(150) NOT NULL,
    direccion       VARCHAR(255) NOT NULL,
    ciudad          VARCHAR(100) NOT NULL,
    telefono        VARCHAR(20)  NOT NULL,
    estado          ENUM('Activo', 'En Construcción', 'Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_registro  DATE NOT NULL,

    CONSTRAINT uq_residenciales_nombre_direccion UNIQUE (nombre, direccion)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabla: apartamento_casa
-- Representa el apartamento/casa (nombre, número y piso), el
-- residencial al que pertenece, y opcionalmente el usuario
-- (creado en el formulario de usuarios) que vive ahí como
-- residente.
-- ---------------------------------------------------------
CREATE TABLE apartamento_casa (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    residencial_id      INT NOT NULL,
    usuario_id          INT NULL,
    nombre              VARCHAR(100) NOT NULL,
    numero_apartamento  INT NOT NULL,
    piso_apartamento    INT NOT NULL,
    tipo                VARCHAR(50) DEFAULT NULL,
    estado              TINYINT(1) DEFAULT 1,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_apartamento_residencial FOREIGN KEY (residencial_id) REFERENCES residenciales(id),
    CONSTRAINT fk_apartamento_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;
