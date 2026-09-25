-- =========================================================
-- Migración: asociar un usuario existente (residente) a un
-- apartamento/casa. Un apartamento puede no tener residente
-- asignado todavía, por eso la columna es NULL-able.
-- Motor: MySQL 8.x
-- =========================================================
ALTER TABLE apartamento_casa
    ADD COLUMN usuario_id INT NULL AFTER residencial_id,
    ADD CONSTRAINT fk_apartamento_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
