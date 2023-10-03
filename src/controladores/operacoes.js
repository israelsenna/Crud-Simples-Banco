let { contas, depositos, saques, transferencias } = require('../bancodedados');

let numeroConta = 1;

const listarContas = (req, res) => {
    return res.status(200).json(contas);
}

const criarConta = (req, res) => {
    const usuario = req.body;
    const { cpf, email } = req.body;

    const existeCPF = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });

    const existeEmail = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (existeCPF || existeEmail) {
        return res.status(400).json({ 'mensagem': 'Já existe uma conta com o cpf ou e-mail informado!' });
    }

    contas.push({
        numero: numeroConta,
        saldo: 0,
        usuario
    });
    numeroConta++
    res.send('Usuario criada com sucesso.')
}

const atualizarDadosUsuarioConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'A conta não foi encontrada.' });
    }

    contaEncontrada.usuario.nome = nome;
    contaEncontrada.usuario.cpf = cpf;
    contaEncontrada.usuario.data_nascimento = data_nascimento;
    contaEncontrada.usuario.telefone = telefone;
    contaEncontrada.usuario.email = email;
    contaEncontrada.usuario.senha = senha;

    console.log(contaEncontrada);
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const contaFind = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!contaFind) {
        return res.status(404).json({ mensagem: 'A conta não existe.' });
    }

    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    });

    return res.status(204).send();
}

const depositarConta = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (valor > 0) {
        contaEncontrada.saldo = contaEncontrada.saldo + valor;
        const agora = new Date();
        depositos.push({
            data: agora,
            numero_conta: contaEncontrada.numero,
            valor: valor
        });
    }
}

const sacarConta = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (senha === contaEncontrada.usuario.senha) {
        if (contaEncontrada.saldo >= valor) {
            if (valor > 0) {
                contaEncontrada.saldo = contaEncontrada.saldo - valor;
                const agora = new Date();
                saques.push({
                    data: agora,
                    numero_conta: contaEncontrada.numero,
                    valor: valor
                });
            } else {
                return res.status(404).json({ mensagem: 'O valor não pode ser menor que zero!' });
            }
        } else {
            return res.status(404).json({ mensagem: 'Não há saldo suficiente nesta conta!' });
        }
    } else {
        return res.status(404).json({ mensagem: 'Senha incorreta para a conta desejada!' });
    }
}

const transferirConta = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaEncontradaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    const contaEncontradaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (senha === contaEncontradaOrigem.usuario.senha) {
        if (contaEncontradaOrigem.saldo >= valor) {
            if (valor > 0) {
                contaEncontradaOrigem.saldo = contaEncontradaOrigem.saldo - valor;
                contaEncontradaDestino.saldo = contaEncontradaDestino.saldo + valor;

                const agora = new Date();
                transferencias.push({
                    data: agora,
                    numero_conta_origem: contaEncontradaOrigem.numero,
                    numero_conta_destino: contaEncontradaDestino.numero,
                    valor: valor
                });
            } else {
                return res.statsus(404).json({ mensagem: 'O valor não pode ser menor que zero!' });
            }
        } else {
            return res.status(404).json({ mensagem: 'Não há saldo suficiente nesta conta!' });
        }
    } else {
        return res.status(404).json({ mensagem: 'Senha incorreta para a conta desejada!' });
    }
}

const saldoConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (contaEncontrada && senha == contaEncontrada.usuario.senha) {
        return res.status(200).json({ "saldo": contaEncontrada.saldo });
    } else {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }
}

const extratoConta = (req, res) => {
    const { numero_conta, senha } = req.body;

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (contaEncontrada) {
        if (senha == contaEncontrada.usuario.senha) {
            return res.json({
                depositos,
                saques,
                transferencias
            });
        } else {
            return res.status(404).json({ "mensagem": "Senha incorreta!" });
        }
    } else {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }
}

module.exports = {
    listarContas,
    criarConta,
    atualizarDadosUsuarioConta,
    excluirConta,
    depositarConta,
    sacarConta,
    transferirConta,
    saldoConta,
    extratoConta
};