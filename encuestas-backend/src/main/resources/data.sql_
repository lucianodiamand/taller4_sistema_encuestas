CREATE TABLE usuarios (
                          id INTEGER PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL UNIQUE,
                          contrasenia VARCHAR(255) NOT NULL,
                          rol_id INTEGER NOT NULL,
                          fecha_creacion DATE,
                          es_visible BOOLEAN,
                          habilitado BOOLEAN,
                          last_login TIMESTAMP
);

CREATE TABLE encuestadores (
                               id INTEGER PRIMARY KEY,
                               usuario_id INTEGER NOT NULL UNIQUE,
                               nombre VARCHAR(255) NOT NULL,
                               apellido VARCHAR(255) NOT NULL,
                               cuit BIGINT NOT NULL UNIQUE,
                               es_visible BOOLEAN
);

CREATE TABLE clientes (
                          id INTEGER PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL,
                          es_visible BOOLEAN NOT NULL,
                          fecha_creacion DATE NOT NULL
);

CREATE TABLE encuestas (
                           id INTEGER PRIMARY KEY,
                           cliente_id INTEGER NOT NULL,
                           usuario_id INTEGER NOT NULL,
                           disponible BOOLEAN NOT NULL,
                           fecha_creacion DATE NOT NULL,
                           fecha_expiracion DATE NOT NULL,
                           preguntas JSONB,
                           cant_preguntas INTEGER NOT NULL,
                           es_visible BOOLEAN NOT NULL,
                           restricciones VARCHAR(255),
                           descripcion VARCHAR(255),
                           nombre VARCHAR(255) NOT NULL
);

CREATE TABLE respuestas_encuesta (
                                     id INTEGER PRIMARY KEY,
                                     encuesta_id INTEGER NOT NULL,
                                     encuestador_id INTEGER NOT NULL,
                                     fecha_respuesta TIMESTAMP NOT NULL,
                                     fecha_creacion TIMESTAMP NOT NULL,
                                     codigo VARCHAR(255) NOT NULL UNIQUE,
                                     respuestas JSONB,
                                     estado_id INTEGER
);

CREATE TABLE estados (
                         id INTEGER PRIMARY KEY,
                         valor VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE roles (
                       id INTEGER PRIMARY KEY,
                       valor VARCHAR(255) NOT NULL UNIQUE
);

ALTER TABLE usuarios
    ADD CONSTRAINT fk_usuarios_rol_id
        FOREIGN KEY (rol_id)
            REFERENCES roles(id)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE encuestadores
    ADD CONSTRAINT fk_encuestadores_usuario_id
        FOREIGN KEY (usuario_id)
            REFERENCES usuarios(id)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE encuestas
    ADD CONSTRAINT fk_encuestas_cliente_id
        FOREIGN KEY (cliente_id)
            REFERENCES clientes(id)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE encuestas
    ADD CONSTRAINT fk_encuestas_usuario_id
        FOREIGN KEY (usuario_id)
            REFERENCES usuarios(id)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT fk_respuestas_encuesta_encuesta_id
        FOREIGN KEY (encuesta_id)
            REFERENCES encuestas(id)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT fk_respuestas_encuesta_encuestador_id
        FOREIGN KEY (encuestador_id)
            REFERENCES encuestadores(id)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT fk_respuestas_encuesta_estado_id
        FOREIGN KEY (estado_id)
            REFERENCES estados(id)
            ON DELETE CASCADE ON UPDATE CASCADE;