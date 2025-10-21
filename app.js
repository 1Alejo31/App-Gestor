require('dotenv').config(); // carga las variables del .env

const express = require('express');
const app = express();

// lee el puerto del .env o usa 3000 por defecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
