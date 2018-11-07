var mongoose = require('mongoose');
var uniquieValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var rolesValidos = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    role: { type: String, required: true, default: "ADMIN", enum: rolesValidos },
    img: { type: String, required: false }
});

usuarioSchema.plugin(uniquieValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);