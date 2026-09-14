const { salvarLead } = require('../../lib/sheets');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não suportado' };
  }

  try {
    const dados = JSON.parse(event.body);

    const { nome, email, clinica, cargo, telefone, volume } = dados;

    if (!nome || !email || !clinica || !cargo || !telefone || !volume) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Faltam campos obrigatórios' }),
      };
    }

    await salvarLead({ nome, email, clinica, cargo, telefone, volume });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Erro ao salvar lead:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erro ao salvar' }),
    };
  }
};
