const express = require('express');
const contas = require('./controladores/operacoes.js');

const rotas = express();

rotas.post('/contas', contas.criarConta);
rotas.get('/contas', contas.listarContas);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarDadosUsuarioConta);
rotas.delete('/contas/:numeroConta', contas.excluirConta);
rotas.post('/transacoes/depositar', contas.depositarConta);
rotas.post('/transacoes/sacar', contas.sacarConta);
rotas.post('/transacoes/transferir', contas.transferirConta);
rotas.get('/contas/saldo', contas.saldoConta);
rotas.get('/contas/extrato', contas.extratoConta);


module.exports = rotas;