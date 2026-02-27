function trocarFundo() {
    const usuario = document.getElementById("usuario").value;

    // remove fundos anteriores
    document.body.classList.remove("rafaela", "roberta", "fabiano");

    // adiciona novo fundo
    if (usuario) {
        document.body.classList.add(usuario);
    }
}

function login() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    const usuarios = {
        rafaela: "1234",
        roberta: "abcd",
        fabiano: "senha123"
    };

    erro.textContent = "";

    // valida campos
    if (!usuario || !senha) {
        erro.textContent = "Preencha todos os campos.";
        return;
    }

    // valida login
    if (usuarios[usuario] === senha) {

        // ⭐ SALVA usuário logado
        localStorage.setItem("usuario", usuario);

        // redirecionamentos
        if (usuario === "rafaela" || usuario === "roberta") {
            window.location.href = "usuario.html";
        } else if (usuario === "fabiano") {
            window.location.href = "pagar.html";
        }

    } else {
        erro.textContent = "Usuário ou senha incorretos.";
    }
}