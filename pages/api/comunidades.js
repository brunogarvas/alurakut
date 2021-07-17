import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

  if (request.method == 'POST') {

    const TOKEN = 'a8ab1816db73f6b300b1fb71a72f4e';
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "972029",
      ...request.body,
    });

    console.log(registroCriado);

    response.json({
      registroCriado: registroCriado,
    });

    return;
  }

  response.status(404).json({
    message: 'Ainda nao temos resposta do servidor...'
  })
}