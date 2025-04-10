document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem');

    // Verificar CPF usando a API
    const response = await fetch(`https://test-nuvem.onrender.com/verificar-cpf?cpf=${cpf}`);
    const data = await response.json();

    if (!data.valido) {
        mensagem.innerText = "CPF inválido";
        return;
    } else {
        mensagem.innerText = "CPF válido, verificando cadastro...";
    }

    // Consultar se CPF já existe no MongoDB Atlas
    try {
        const checkResponse = await fetch('https://SEU_BACKEND_URL/api/check-cpf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf })
        });

        const checkData = await checkResponse.json();

        if (checkData.exists) {
            mensagem.innerText = "CPF já cadastrado!";
        } else {
            // Inserir no banco
            const insertResponse = await fetch('https://SEU_BACKEND_URL/api/insert-cpf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cpf, senha })
            });

            if (insertResponse.ok) {
                mensagem.innerText = "Cadastro finalizado com sucesso!";
            } else {
                mensagem.innerText = "Erro ao cadastrar. Tente novamente.";
            }
        }
    } catch (error) {
        console.error(error);
        mensagem.innerText = "Erro na comunicação com o servidor.";
    }
});

