const mongoose = require("mongoose");
const { server } = require("../app");

const { api } = require("./helpers");

let token = "";

/**
 * Obtiene el token de administrador antes de ejecutar las pruebas
 */
beforeAll((done) => {
  api
    .post("/usuarios/login")
    .send({
      correo: "estivencano99@gmail.com",
      contraseña: "147258369",
    })
    .end((err, response) => {
      if (err) {
        return done(err);
      }
      token = response.body.token;
      done();
    });
});

describe("Crear usuarios", () => {
  describe("POST /usuarios/signup", () => {
    //Usuario correcto
    const usuario = {
      correo: "celestesukkie@gmail.com",
      nombres: "Maria Celeste",
      contraseña: "147258369",
      apellidos: "Acevedo Marín",
    };

    it("Satisfactoriamente", async () => {
      const res = await api
        .post("/usuarios/signup")
        .send(usuario)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(res.body.success).toEqual(true);
      expect(res.body.status).toEqual("Registro satisfactorio");
    });

    it("Incorrectamente (Usuario ya existe)", async () => {
      const res = await api
        .post("/usuarios/signup")
        .send(usuario)
        .expect(500)
        .expect("Content-Type", /application\/json/);

      expect(res.error.name).toEqual("Error");
    });

    it("Incorrectamente (Falta correo)", async () => {
      // Elimina el correo del usuario
      delete usuario.correo;

      const res = await api
        .post("/usuarios/signup")
        .send(usuario)
        .expect(500)
        .expect("Content-Type", /application\/json/);

      expect(res.error.name).toEqual("Error");
    });
  });
});

describe("Loguear usuario", () => {
  describe("POST /usuarios/login", () => {
    // Credenciales de usuario
    const credenciales = {
      correo: "celestesukkie@gmail.com",
      contraseña: "147258369",
    };

    it("Satisfactoriamente", async () => {
      const res = await api
        .post("/usuarios/login")
        .send(credenciales)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(res.body.success).toEqual(true);
      expect(res.body.status).toEqual("Has iniciado sesión correctamente");
    });

    it("Incorrectamente (credenciales erroneas)", async () => {
      // Cambia la contraseña a una erronea
      credenciales.contraseña = "159456";
      const res = await api
        .post("/usuarios/login")
        .send(credenciales)
        .expect(401);

      expect(res.text).toEqual("Unauthorized");
    });
  });
});

describe("Obtener usuarios", () => {
  describe("GET /usuarios", () => {
    it("Satisfactoriamente", async () => {
      const res = await api
        .get("/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("Incorrectamente (no autorizado)", async () => {
      const res = await api.get("/usuarios").expect(401);

      expect(res.text).toEqual("Unauthorized");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
