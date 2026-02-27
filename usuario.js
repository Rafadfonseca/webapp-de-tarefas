const usuario = localStorage.getItem("usuario");

document.addEventListener("DOMContentLoaded", () => {

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    const nome = document.getElementById("nomeUsuario");
    if (nome) {
        nome.textContent =
            usuario.charAt(0).toUpperCase() + usuario.slice(1);
    }

    document.body.classList.add(usuario);

    iniciarAccordion();
    carregarMoney();
    carregarMeta();
    carregarDesafio();
    carregarCalendarioDados();
});

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

function adicionarTarefa() {

    const select = document.getElementById("tarefa");
    const tarefa = select.value;

    if (!tarefa) {
        alert("Selecione uma tarefa");
        return;
    }

    const dados = {
        usuario,
        tarefa,
        data: new Date().toLocaleDateString("pt-BR"),
        valor: 20
    };

    fetch("https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(() => {
        alert("✅ Tarefa salva!");
        select.selectedIndex = 0;
        carregarMoney();
        carregarMeta();
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao enviar");
    });
}

function carregarMoney() {

    fetch("https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario=" + usuario)
        .then(res => res.json())
        .then(data => {

            const el = document.getElementById("moneyValor");

            if (el) {
                el.textContent =
                    "Você tem R$ " + data.total + ",00";
            }
        })
        .catch(err => console.error("Money erro:", err));
}

async function carregarMeta() {

    const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario="
        + usuario + "&tipo=meta"
    );

    const dados = await res.json();

    const barra = document.getElementById("progressoMeta");
    const texto = document.getElementById("porcentagemMeta");

    if (!barra || !texto) return;

    const total = Number(dados.total) || 0;
    const meta = Number(dados.meta) || 0;

    if (meta === 0) {
        barra.style.width = "0%";
        texto.textContent = "Sem meta";
        return;
    }

    let progresso = (total / meta) * 100;
    if (progresso > 100) progresso = 100;

    animarBarra(barra, progresso);
    animarNumero(texto, total, meta, progresso);
    mudarCor(barra, progresso);

    // confete apenas quando completar
    if (total >= meta && !window.metaCompleta) {
        confete();
        window.metaCompleta = true;
    }
}

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

function confete() {

    const cores = ["#ff5252", "#ffca28", "#66bb6a", "#42a5f5", "#ab47bc"];

    for (let i = 0; i < 120; i++) {

        const conf = document.createElement("div");

        conf.style.position = "fixed";
        conf.style.width = "10px";
        conf.style.height = "10px";
        conf.style.background =
            cores[Math.floor(Math.random() * cores.length)];

        conf.style.left = Math.random() * window.innerWidth + "px";
        conf.style.top = "-20px";
        conf.style.zIndex = "999999";
        conf.style.pointerEvents = "none";

        document.body.appendChild(conf);

        const duracao = 1500 + Math.random() * 1500;

        conf.animate([
            { transform: "translateY(0) rotate(0deg)" },
            { transform: `translateY(${window.innerHeight + 50}px) rotate(${Math.random()*720}deg)` }
        ], {
            duration: duracao,
            easing: "cubic-bezier(.2,.8,.2,1)"
        });

        setTimeout(() => conf.remove(), duracao);
    }
}

async function criarMeta() {

    const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario="
        + usuario + "&tipo=meta"
    );

    const dados = await res.json();

    let valor;

    if (dados.meta > 0) {
        const trocar = confirm("Você já tem uma meta. Deseja criar uma nova?");
        if (!trocar) return;
        valor = prompt("Qual o novo valor da sua meta?");
    } 
    else {
        valor = prompt("Qual o valor da sua meta?");
    }

    if (!valor) return;

    await fetch("https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            tipo: "meta",
            usuario,
            valor: Number(valor)
        })
        });

    window.metaCompleta = false;
    carregarMeta();
}

// ================= DESAFIO =================

async function carregarDesafio() {

  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?tipo=desafio"
  );

  const dados = await res.json();

  atualizarBarra("rafaela", dados.rafaela);
  atualizarBarra("roberta", dados.roberta);
}

function atualizarBarra(usuarioNome, dados) {

  if (!dados || !dados.meta) return;

  const barra = document.getElementById("progresso_" + usuarioNome);
  const texto = document.getElementById("porcentagem_" + usuarioNome);

  if (!barra || !texto) return;

  let progresso = (dados.total / dados.meta) * 100;

  if (progresso > 100) progresso = 100;

  barra.style.width = progresso + "%";
  texto.textContent =
    `R$ ${dados.total} / R$ ${dados.meta} (${Math.floor(progresso)}%)`;
}

async function criarDesafio() {

  // busca desafio atual
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?tipo=desafio"
  );

  const dados = await res.json();

  let valorAtual = 0;

  if (dados.rafaela && dados.rafaela.meta) {
    valorAtual = Number(dados.rafaela.meta);
  }

  let valor;

  // ✅ se já existir desafio
  if (valorAtual > 0) {

    const trocar = confirm("Você já tem um desafio ativo. Deseja criar outro?");
    if (!trocar) return;

    valor = prompt("Qual o novo valor do desafio?");
  } 
  else {
    valor = prompt("Qual o valor do desafio?");
  }

  if (!valor) return;

  await fetch(
    "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec",
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        tipo: "desafio",
        valor: Number(valor)
      })
    }
  );

  carregarDesafio(); // atualiza barras
}


function atualizarBarra(usuarioNome, dados) {

  if (!dados || !dados.meta) return;

  const barra = document.getElementById("progresso_" + usuarioNome);
  const texto = document.getElementById("porcentagem_" + usuarioNome);

  if (!barra || !texto) return;

  const total = Number(dados.total) || 0;
  const meta = Number(dados.meta) || 0;

  if (meta === 0) {
    barra.style.width = "0%";
    texto.textContent = "Sem meta";
    return;
  }

  let progresso = (total / meta) * 100;
  if (progresso > 100) progresso = 100;

  // ⭐ MESMAS FUNÇÕES DO META
  animarBarra(barra, progresso);
  animarNumero(texto, total, meta, progresso);
  mudarCor(barra, progresso);
}

// ================= CALENDÁRIO =================

let dataAtual = new Date();
let diasComTarefa = [];

async function carregarCalendarioDados() {

  try {

    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbzyUWn-_SfnPRoMeFCdkmNO_kFhzX0QKc9eQQkovPFipeg82JPLTQ0ueRiutFCdg-yD/exec?usuario="
      + usuario + "&tipo=calendario"
    );

    const dados = await res.json();

    diasComTarefa = dados.dias || [];

    console.log("dias carregados:", diasComTarefa);

    // 👇 força redesenho REAL
    setTimeout(() => {
      desenharCalendario();
    }, 50);

  } catch (erro) {
    console.error("Erro calendário:", erro);
  }
}

function desenharCalendario() {

  const cal = document.getElementById("calendario");
  const titulo = document.getElementById("mesAno");

  cal.innerHTML = "";
  console.log("diasComTarefa:", diasComTarefa);

  const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  diasSemana.forEach(d => {
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

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++){
    cal.innerHTML += "<div></div>";
  }

  for (let dia = 1; dia <= diasNoMes; dia++){

    const div = document.createElement("div");
    div.className = "dia";
    div.textContent = dia;

    const dataFormatada =
      `${dia.toString().padStart(2,"0")}/${(mes+1)
      .toString().padStart(2,"0")}/${ano}`;

    const fezNoDia = diasComTarefa
    .map(d => d.trim())
    .includes(dataFormatada.trim());

    if (fezNoDia) { 

      const bolinha = document.createElement("div");
      bolinha.className = "bolinha";

      bolinha.style.background =
        usuario === "rafaela" ? "#fff67b" : "#ffb6c1";

      div.appendChild(bolinha);
    }

    cal.appendChild(div);
  }
}
function mudarMes(valor){
  dataAtual.setMonth(dataAtual.getMonth() + valor);
  desenharCalendario();

  // 🔥 ATUALIZA ALTURA DO ACCORDION
  const content = document.getElementById("calendario").parentElement;
  content.style.maxHeight = content.scrollHeight + "px";
}