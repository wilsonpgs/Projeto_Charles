/////////////////// POSICIONAMENTO DO CURSOR ////////////////////////////////
function setCursorPosition(pos, elem) {
  elem.focus();
  if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
  else if (elem.createTextRange) {
    let range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}

/////////////////// MÁSCARA PARA DATA DE NASCIMENTO //////////////////////////
const dataInput = document.getElementById("dataNascimento");
if (dataInput) {
  dataInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2 && value.length <= 4) {
      value = value.replace(/(\d{2})(\d+)/, "$1/$2");
    } else if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
    }

    if (value.length > 10) value = value.slice(0, 10);
    e.target.value = value;
  });
}

/////////////////// MÁSCARA PARA CPF //////////////////////////////////////////
const cpfInput = document.getElementById("cpf");
if (cpfInput) {
  cpfInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (value.length > 6 && value.length <= 9) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
    }

    if (value.length > 14) value = value.slice(0, 14);
    e.target.value = value;
  });
}

/////////////////// MÁSCARA PARA TELEFONES /////////////////////////////////
function maskTelefone(e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, "");

  if (value.startsWith("55")) {
    value = value.slice(2);
  }

  if (value.length > 13) value = value.slice(0, 13);

  let result = "(+55)";
  if (value.length > 0) {
    result += value.substring(0, 2);
  }
  if (value.length > 2) {
    result += "-";
    result += value.substring(2);
  }

  input.value = result;
  setCursorPosition(input.value.length, input);
}

const celularInput = document.getElementById("telefoneCelular");
const fixoInput = document.getElementById("telefoneFixo");

[celularInput, fixoInput].forEach((input) => {
  if (input) {
    input.addEventListener("focus", () => {
      if (input.value.trim() === "") {
        input.value = "(+55)";
        setCursorPosition(input.value.length, input);
      }
    });

    input.addEventListener("input", maskTelefone);

    input.addEventListener("blur", () => {
      if (input.value === "(+55)") {
        input.value = "";
      }
    });
  }
});

/////////////////// MODO ESCURO ////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("ModoEscuro");
  if (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("modo-escuro");
    });
  }
});

/////////////////////// LOGIN E CADASTRO //////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const cadastroForm = document.querySelector(".formulario");
  const loginForm = document.getElementById("form-login");

  // === LÓGICA DE CADASTRO ===
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const login = cadastroForm.elements["login"].value.trim();
      const senha = cadastroForm.elements["senha"].value.trim();
      const confirmarSenha = cadastroForm.elements["confirmarSenha"].value.trim();

      const msgErroCampos = document.querySelector(".msgerro");
      const msgErroSenha = document.querySelector(".senhaerrada");

      msgErroCampos.style.display = "none";
      msgErroSenha.style.display = "none";

      if (!login || !senha || !confirmarSenha) {
        msgErroCampos.style.display = "block";
        return;
      }

      if (senha !== confirmarSenha) {
        msgErroSenha.style.display = "block";
        return;
      }

      // Salvar login e senha no localStorage
      localStorage.setItem("login", login);
      localStorage.setItem("senha", senha);

      // Redirecionar para a tela de login
      window.location.href = "tela-de-login.html";
    });
  }

  // === LÓGICA DE LOGIN ===
  if (loginForm) {
    const loginInput = document.getElementById("login");
    const senhaInput = document.getElementById("senha");
    const msgErroLogin = document.querySelector(".msgerrologin");

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      msgErroLogin.style.display = "none";

      if (loginInput.value.trim() === "" || senhaInput.value.trim() === "") {
        msgErroLogin.textContent = "*Por favor, preencha todos os campos obrigatórios.";
        msgErroLogin.style.display = "block";
        return;
      }

      const loginSalvo = localStorage.getItem("login");
      const senhaSalva = localStorage.getItem("senha");

      if (
        loginInput.value === loginSalvo &&
        senhaInput.value === senhaSalva
      ) {
        localStorage.setItem("usuarioLogado", loginInput.value);

        window.location.href = "menus.html";
      } else {
        msgErroLogin.textContent = "*Login ou senha incorretos.";
        msgErroLogin.style.display = "block";
      }
    });

    const botaoNovoUsuario = document.getElementById("botao-novo-usuario");
    if (botaoNovoUsuario) {
      botaoNovoUsuario.addEventListener("click", function () {
        window.location.href = "cadastrar-novo-usuário.html";
      });
    }
  }
});
