/* ===============================
   Selecionando elementos
   =============================== */
const botaoPesquisar = document.getElementById("searchBtn");
const inputPesquisa = document.getElementById("searchInput");
const userInfo = document.getElementById("userInfo");
const repoContainer = document.getElementById("repoContainer");
const botaoTema = document.getElementById("toggleTheme");
const iconeTema = botaoTema.querySelector("i");

/* ===============================
   Buscar usuário ao carregar página
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  buscarUsuario("willyang10x");
  buscarRepositorios("willyang10x");
});

/* ===============================
   Evento do botão de pesquisa
   =============================== */
botaoPesquisar.addEventListener("click", () => {
  const usuario = inputPesquisa.value.trim();
  if (usuario) {
    buscarUsuario(usuario);
    buscarRepositorios(usuario);
  }
});

/* ===============================
   Trocar tema Dark / Light
   =============================== */
botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("light")) {
    iconeTema.classList.replace("bx-moon", "bx-sun");
  } else {
    iconeTema.classList.replace("bx-sun", "bx-moon");
  }
});

/* ===============================
   Função para buscar usuário
   =============================== */
async function buscarUsuario(usuario) {
  try {
    const resposta = await fetch(`https://api.github.com/users/${usuario}`);
    const dados = await resposta.json();

    if (dados.message === "Not Found") {
      userInfo.innerHTML = "<p><i class='bx bx-error'></i> Usuário não encontrado.</p>";
      return;
    }

    userInfo.innerHTML = `
      <img src="${dados.avatar_url}" alt="${dados.login}">
      <h2>${dados.name || dados.login}</h2>
      <p><i class='bx bx-user'></i> Seguidores: ${dados.followers} | Seguindo: ${dados.following}</p>
      <p><i class='bx bx-map'></i> ${dados.location || "Local não informado"}</p>
      <a href="${dados.html_url}" target="_blank"><i class='bx bx-link-external'></i> Ver perfil no GitHub</a>
    `;
  } catch (erro) {
    console.error("Erro ao buscar usuário:", erro);
    userInfo.innerHTML = "<p><i class='bx bx-error-circle'></i> Ocorreu um erro ao buscar usuário.</p>";
  }
}

/* ===============================
   Função para buscar repositórios
   =============================== */
async function buscarRepositorios(usuario) {
  try {
    const resposta = await fetch(`https://api.github.com/users/${usuario}/repos?sort=updated&per_page=12`);
    const repos = await resposta.json();

    repoContainer.innerHTML = "";

    if (repos.length === 0) {
      repoContainer.innerHTML = "<p><i class='bx bx-folder-open'></i> Nenhum repositório encontrado.</p>";
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement("div");
      card.classList.add("repo-card");

      card.innerHTML = `
        <h3><i class='bx bx-book-alt'></i> ${repo.name}</h3>
        <p>${repo.description || "Sem descrição."}</p>
        <p><i class='bx bx-star'></i> ${repo.stargazers_count} | <i class='bx bx-git-repo-forked'></i> ${repo.forks_count}</p>
        <p><i class='bx bx-code-alt'></i> Linguagem: ${repo.language || "Não especificada"}</p>
        <a href="${repo.html_url}" target="_blank"><i class='bx bx-link'></i> Ver no GitHub</a>
      `;

      repoContainer.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao buscar repositórios:", erro);
    repoContainer.innerHTML = "<p><i class='bx bx-error-circle'></i> Ocorreu um erro ao buscar repositórios.</p>";
  }
}
