-- =========================================================
-- Tabla: edificios
-- Motor: MySQL 8.x
-- Representa cada edificio/torre que pertenece a un residencial.
-- Un residencial tiene uno o más edificios (mínimo 1); cada
-- apartamento/casa pertenece a un residencial a través de su
-- residencial_id ya existente en `apartamento_casa`.
-- =========================================================
CREATE TABLE edificios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    residencial_id  INT NOT NULL,
    nombre          VARCHAR(150) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_edificio_residencial FOREIGN KEY (residencial_id) REFERENCES residenciales(id)
) ENGINE=InnoDB;
