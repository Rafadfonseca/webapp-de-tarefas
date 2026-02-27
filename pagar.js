const usuario = localStorage.getItem("usuario") || "fabiano";

document.addEventListener("DOMContentLoaded", () => {

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    document.body.classList.remove("rafaela","roberta","fabiano");
    document.body.classList.add(usuario);

    const nome = document.getElementById("nomeUsuario");
    if (nome) {
        nome.textContent =
            usuario.charAt(0).toUpperCase() + usuario.slice(1);
    }

    iniciarAccordion();
    carregarMoney();
    carregarMeta();
    carregarDesafio();
    carregarCalendarioDados();
});

// ================= ACCORDION =================

function iniciarAccordion() {

    const botoes = document.querySelectorAll(".acc-btn");

    botoes.forEach(btn => {
        btn.addEventListener("click", function () {

            const content = this.nextElementSibling;

            content.classList.toggle("open");

            if (content.classList.contains("open")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// ================= MONEY =================

async function carregarMoney() {
    await carregarMoneyUsuario("rafaela", "moneyRafaela");
    await carregarMoneyUsuario("roberta", "moneyRoberta");
}

async function carregarMoneyUsuario(nomeUsuario, elementoId){

    try{
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario=" + nomeUsuario
        );

        const data = await res.json();

        document.getElementById(elementoId).textContent =
            "Saldo: R$ " + data.total + ",00";

    }catch(e){
        console.error("Erro money:", e);
    }
}

// ================= FUNÇÕES DE ANIMAÇÃO =================

function animarBarra(elemento, valorFinal) {
    elemento.style.width = valorFinal + "%";
}

function animarNumero(texto, total, meta, progresso) {

    let atual = 0;
    const duracao = 800;
    const passos = 30;
    const incremento = total / passos;

    const intervalo = setInterval(() => {

        atual += incremento;

        if (atual >= total) {
            atual = total;
            clearInterval(intervalo);
        }

        texto.textContent =
            `R$ ${Math.floor(atual)} / R$ ${meta} (${Math.floor(progresso)}%)`;

    }, duracao / passos);
}

function mudarCor(barra, progresso) {

    if (progresso < 50) {
        barra.style.background = "#ef5350";
    }
    else if (progresso < 80) {
        barra.style.background = "#ffa726";
    }
    else {
        barra.style.background = "#2e7d32";
    }
}

// ================= META =================

async function carregarMeta(){

    await carregarMetaUsuario("rafaela",
        "progressoMetaRafaela",
        "porcentagemMetaRafaela"
    );

    await carregarMetaUsuario("roberta",
        "progressoMetaRoberta",
        "porcentagemMetaRoberta"
    );
}

async function carregarMetaUsuario(nome, barraId, textoId){

    const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario="+nome+"&tipo=meta"
    );

    const dados = await res.json();

    const barra = document.getElementById(barraId);
    const texto = document.getElementById(textoId);

    if(!barra || !texto) return;

    const total = Number(dados.total) || 0;
    const meta = Number(dados.meta) || 0;

    if(meta === 0){
        texto.textContent = "Sem meta";
        barra.style.width = "0%";
        return;
    }

    let progresso = (total/meta)*100;
    if(progresso>100) progresso=100;

    // 🔥 AGORA COM ANIMAÇÃO
    animarBarra(barra, progresso);
    animarNumero(texto, total, meta, progresso);
    mudarCor(barra, progresso);
}

// ================= DESAFIO =================

async function carregarDesafio(){

    const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?tipo=desafio"
    );

    const dados = await res.json();

    atualizarBarra("rafaela", dados.rafaela);
    atualizarBarra("roberta", dados.roberta);
}

function atualizarBarra(nome, dados){

    if(!dados || !dados.meta) return;

    const barra = document.getElementById("progresso_"+nome);
    const texto = document.getElementById("porcentagem_"+nome);

    if(!barra || !texto) return;

    const total = Number(dados.total) || 0;
    const meta = Number(dados.meta) || 0;

    if(meta === 0){
        texto.textContent = "Sem meta";
        barra.style.width = "0%";
        return;
    }

    let progresso = (total/meta)*100;
    if(progresso>100) progresso=100;

    // 🔥 AGORA COM ANIMAÇÃO
    animarBarra(barra, progresso);
    animarNumero(texto, total, meta, progresso);
    mudarCor(barra, progresso);
}

// ================= CALENDÁRIO =================

let dataAtual = new Date();
let diasComTarefa = {};

async function carregarCalendarioDados(){

    try{
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?tipo=calendarioPai"
        );

        diasComTarefa = await res.json();

        desenharCalendario();

    }catch(e){
        console.error("Erro calendário:", e);
    }
}
function desenharCalendario(){

    const cal = document.getElementById("calendario");
    const titulo = document.getElementById("mesAno");
    console.log("DADOS CALENDARIO:", diasComTarefa);

    cal.innerHTML = "";

    const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

    diasSemana.forEach(d=>{
        const el = document.createElement("div");
        el.textContent = d;
        el.style.fontWeight = "bold";
        el.style.textAlign = "center";
        cal.appendChild(el);
    });

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    titulo.textContent =
        dataAtual.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});

    const primeiroDia = new Date(ano,mes,1).getDay();
    const diasNoMes = new Date(ano,mes+1,0).getDate();

    for(let i=0;i<primeiroDia;i++){
        cal.appendChild(document.createElement("div"));
    }

    for(let dia=1;dia<=diasNoMes;dia++){

        const div = document.createElement("div");
        div.className = "dia";

        // ⭐ número do dia separado (fica acima)
        const numero = document.createElement("span");
        numero.textContent = dia;
        numero.style.position = "relative";
        numero.style.zIndex = "2";

        const dataFormatada =
            `${String(dia).padStart(2,"0")}/${String(mes+1).padStart(2,"0")}/${ano}`;

        const fezRafaela =
            diasComTarefa.rafaela?.includes(dataFormatada);

        const fezRoberta =
            diasComTarefa.roberta?.includes(dataFormatada);

        // ⭐ bolinha Rafaela
        if(fezRafaela){
            const bolinha = document.createElement("div");
            bolinha.className = "bolinha";
            bolinha.style.background = "#fff67b";
            bolinha.style.zIndex = "0";
            div.appendChild(bolinha);
        }

        // ⭐ bolinha Roberta
        if(fezRoberta){
            const bolinha = document.createElement("div");
            bolinha.className = "bolinha";
            bolinha.style.background = "#ffb6c1";
            bolinha.style.zIndex = "0";
            div.appendChild(bolinha);
        }

        // ORDEM CORRETA 👇
        div.appendChild(numero);

        cal.appendChild(div);
    }
}

function mudarMes(valor){
    dataAtual.setMonth(dataAtual.getMonth()+valor);
    desenharCalendario();

    const content=document.getElementById("calendario").parentElement;
    content.style.maxHeight=content.scrollHeight+"px";
}
async function pagar(){

    const pessoa = prompt(
        "Quem deseja pagar?\nDigite:\nrafaela ou roberta"
    );

    if(!pessoa) return;

    const usuario = pessoa.toLowerCase();

    if(usuario !== "rafaela" && usuario !== "roberta"){
        alert("Usuário inválido");
        return;
    }

    // 🔎 verifica meta
    const resMeta = await fetch("https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario=" + usuario + "&tipo=meta");

    const dadosMeta = await resMeta.json();

    let aviso = "";

    if(dadosMeta.meta > 0){
        aviso += "⚠ Existe uma META ativa.\n";
    }

    // 🔎 verifica desafio
    const resDesafio = await fetch("https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?tipo=desafio"
    );

    const dadosDesafio = await resDesafio.json();

    if(dadosDesafio[usuario]?.meta > 0){
        aviso += "🏆 Existe um DESAFIO ativo.\n";
    }

    // confirmação final
    const confirmar = confirm(
        `${aviso}\nDeseja realmente pagar ${usuario}?`
    );

    if(!confirmar) return;

    // 💰 envia pagamento
    await fetch("https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec",{
        method:"POST",
        body:JSON.stringify({
            tipo:"pagar",
            usuario:usuario
        })
    });

    alert("Pagamento realizado ✅");

    location.reload();
}