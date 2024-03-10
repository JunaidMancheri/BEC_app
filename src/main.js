const express = require('express');


async function bootstrap() {

  const app = express();



  app.listen(3000, () => console.log('listening on port 3000'));

}

bootstrap();