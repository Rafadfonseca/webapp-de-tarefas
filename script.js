// =============================
// URL DO GOOGLE SCRIPT
// =============================
const url = "https://script.google.com/macros/s/AKfycbyuykXUhQAF9Q3GIgqS4gLxPlXG_d6YGq8nhdVqjJ9OoMmMwP1PX-wAGVcHhq2aFJz3mw/exec";


// =============================
// PREVIEW DAS IMAGENS
// =============================
const inputs = document.querySelectorAll(".file-input input");

inputs.forEach(input => {
  input.addEventListener("change", function () {

    const file = this.files[0];
    if (!file) return;

    const dropZone = this.parentElement.querySelector(".drop-zone");
    const imageURL = URL.createObjectURL(file);

    dropZone.innerHTML =
      `<img src="${imageURL}" class="preview-img">`;
  });
});


// =============================
// CARREGAR DINHEIRO (VIEW MONEY)
// =============================
async function loadMoney() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("moneyList").innerHTML = `
      <strong>Rafaela:</strong> R$ ${data.Rafaela ?? 0}<br>
      <strong>Roberta:</strong> R$ ${data.Roberta ?? 0}
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("moneyList").innerHTML =
      "Erro ao carregar valores";
  }
}

// carrega ao abrir página
window.addEventListener("load", loadMoney);


// =============================
// BOTÃO ENVIAR TAREFA
// =============================
document.getElementById("btnEnviar")
.addEventListener("click", async function(e){

  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const tarefa = document.getElementById("tarefa").value;

  const foto1 = document.getElementById("foto1").files[0];
  const foto2 = document.getElementById("foto2").files[0];

  if(!nome || !tarefa || !foto1 || !foto2){
    alert("Preencha tudo e adicione as duas imagens!");
    return;
  }

  const toBase64 = file => new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=> resolve(reader.result);
    reader.onerror = reject;
  });

  const img1 = await toBase64(foto1);
  const img2 = await toBase64(foto2);

  fetch(url,{
    method:"POST",
    body: JSON.stringify({
      nome,
      tarefa,
      img1,
      img2
    })
  })
  .then(()=>{

    alert("Salvo com sucesso!");

    // limpa campos
    document.getElementById("nome").value = "";
    document.getElementById("tarefa").value = "";
    document.getElementById("foto1").value = "";
    document.getElementById("foto2").value = "";

    document.querySelectorAll(".drop-zone").forEach(zone=>{
      zone.innerHTML = "Selecione uma imagem";
    });

    loadMoney();
  })
  .catch(err=>{
    console.error(err);
    alert("Erro ao salvar");
  });

});


// =============================
// BOTÃO PAGAR
// =============================
function abrirPagamento() {

  const senha = prompt("Digite a senha:");
  if (senha !== "rafabeta") {
    alert("Senha incorreta ❌");
    return;
  }

  const pessoa = prompt("Quem você quer pagar? (rafaela ou roberta)");
  if (!pessoa) return;

  fetch(url,{
    method:"POST",
    body: JSON.stringify({
      action:"pagar",
      pessoa: pessoa.toLowerCase()
    })
  })
  .then(()=>{
    alert("Pagamento realizado ✅");
    loadMoney();
  })
  .catch(err=>{
    console.error(err);
    alert("Erro ao pagar");
  });
}