const { mongoose } = require('../../conection/mongo');

const preguntaPsicologiaSchema = new mongoose.Schema(
    {
        tipo: { type: String, required: true },                   
        pregunta: { type: String, required: true },               
        estado: { type: String, default: "activo" },             
        id_usuario_creacion: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    },
    {
        timestamps: true,                                         
        collection: 'cl_preguntas_psicologia'
    }
);

const PreguntaPsicologia = mongoose.model('PreguntaPsicologia', preguntaPsicologiaSchema);

module.exports = PreguntaPsicologia;
