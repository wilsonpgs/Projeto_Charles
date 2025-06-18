/////////////////// VERIFICAR PÁGINA ATUAL /////////////////////////
const paginaLogin = document.querySelector('.pagina-login');
const paginaCadastro = document.querySelector('.pagina-cadastro');

/////////////////// MÁSCARAS ↓↓↓↓↓↓↓↓↓↓↓/////////////////////////////////////
/////////////////// MÁSCARA: DATA DE NASCIMENTO //////////////////////////
const dataInput = document.getElementById("dataNascimento");
dataInput?.addEventListener("input", (e) => {
	let value = e.target.value.replace(/\D/g, "");
	if (value.length > 2) value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
	if (value.length > 4) value = value.replace(/(\d{2})\/(\d{2})(\d+)/, "$1/$2/$3");
	e.target.value = value.slice(0, 10);
});

function validarData(data) {
	const partes = data.split("/");
	if (partes.length !== 3) return false;

	const dia = parseInt(partes[0], 10);
	const mes = parseInt(partes[1], 10) - 1;
	const ano = parseInt(partes[2], 10);

	if (ano < 1900 || ano > new Date().getFullYear()) return false;

	const dataObj = new Date(ano, mes, dia);
	return (
		dataObj.getFullYear() === ano &&
		dataObj.getMonth() === mes &&
		dataObj.getDate() === dia
	);
}

/////////////////// MÁSCARA: CPF ////////////////////////////////////////////
const cpfInput = document.getElementById("cpf");
cpfInput?.addEventListener("input", (e) => {
	let value = e.target.value.replace(/\D/g, "");
	if (value.length > 3) value = value.replace(/(\d{3})(\d)/, "$1.$2");
	if (value.length > 6) value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
	if (value.length > 9) value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
	e.target.value = value.slice(0, 14);
});

function validarCPF(cpf) {
	const digitos = cpf.replace(/\D/g, "");
	return digitos.length === 11;
}

/////////////////// MÁSCARA: TELEFONES (CELULAR/FIXO) ///////////////////////
function maskTelefone(e) {
	let value = e.target.value.replace(/\D/g, "").replace(/^55/, "").slice(0, 13);
	e.target.value = `(+55)${value.slice(0, 2)}${value.length > 2 ? '-' + value.slice(2) : ''}`;
	setCursorPosition(e.target.value.length, e.target);
}

function setCursorPosition(pos, elem) {
	elem.setSelectionRange(pos, pos);
}

function validarTelefone(tel) {
	const digitos = tel.replace(/\D/g, "").replace(/^55/, "");
	return digitos.length === 11;
}

if (paginaCadastro) {
	["telefoneCelular", "telefoneFixo"].forEach((id) => {
		const input = document.getElementById(id);
		if (!input) return;

		input.addEventListener("focus", () => {
			if (input.value.trim() === "") {
				input.value = "(+55)";
				setCursorPosition(input.value.length, input);
			}
		});

		input.addEventListener("input", maskTelefone);
		input.addEventListener("blur", () => {
			if (input.value === "(+55)") input.value = "";
		});
	});
}

/////////////////// MODO ESCURO //////////////////////////////////////////////
document.getElementById("ModoEscuro")?.addEventListener("click", () => {
	document.body.classList.toggle("modo-escuro");
});

/////////////////// CADASTRO /////////////////////////////////////////////////
if (paginaCadastro) {
	document.addEventListener("DOMContentLoaded", () => {
		const cadastroForm = document.querySelector(".formulario");

		cadastroForm?.addEventListener("submit", (event) => {
			event.preventDefault();

			const inputs = cadastroForm.querySelectorAll('input');
			inputs.forEach(input => {
				input.style.borderColor = '';
			});

			const msgErroCampos = document.querySelector(".msgerro");
			const msgErroSenha = document.querySelector(".senhaerrada");

			msgErroCampos.style.display = "none";
			msgErroSenha.style.display = "none";

			let camposValidos = true;

			const validarCampo = (campo, condicao) => {
				if (!condicao) {
					if (campo.type !== 'radio') {
						campo.style.borderColor = "red";
					}
					camposValidos = false;
				}
			};

			validarCampo(cadastroForm.nome, cadastroForm.nome.value.trim().length >= 15);
			validarCampo(cadastroForm.nomeMae, cadastroForm.nomeMae.value.trim().length >= 15);
			validarCampo(cadastroForm.data, validarData(cadastroForm.data.value));
			validarCampo(cadastroForm.celular, validarTelefone(cadastroForm.celular.value));
			validarCampo(cadastroForm.cpf, validarCPF(cadastroForm.cpf.value));
			validarCampo(cadastroForm.fixo, validarTelefone(cadastroForm.fixo.value));
			validarCampo(cadastroForm.endereco, cadastroForm.endereco.value.trim() !== "");
			validarCampo(cadastroForm.login, cadastroForm.login.value.trim() !== "" && cadastroForm.login.value.trim().length <= 6);
			validarCampo(cadastroForm.senha, cadastroForm.senha.value.trim() !== "" && cadastroForm.senha.value.trim().length <= 8);
			validarCampo(cadastroForm.confirmarSenha, cadastroForm.confirmarSenha.value.trim() !== "");

			if (!document.querySelector('input[name="sexo"]:checked')) {
				camposValidos = false;
			}

			if (!camposValidos) {
				msgErroCampos.style.display = "block";
				return;
			}

			if (cadastroForm.senha.value !== cadastroForm.confirmarSenha.value) {
				cadastroForm.senha.style.borderColor = "red";
				cadastroForm.confirmarSenha.style.borderColor = "red";
				msgErroSenha.style.display = "block";
				return;
			}

			localStorage.setItem("login", cadastroForm.login.value.trim());
			localStorage.setItem("senha", cadastroForm.senha.value.trim());
			window.location.href = "tela-de-login.html";
		});

		document.querySelector(".voltar")?.addEventListener("click", () => {
			location.reload();
		});

		function permitirSomenteLetras(input) {
			input.addEventListener("input", () => {
				input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
			});
		}

		permitirSomenteLetras(document.querySelector('input[name="nome"]'));
		permitirSomenteLetras(document.querySelector('input[name="nomeMae"]'));
	});
}

/////////////////// LOGIN /////////////////////////////////////////////////
if (paginaLogin) {
	document.addEventListener("DOMContentLoaded", () => {
		const loginForm = document.getElementById("form-login");

		loginForm?.addEventListener("submit", (event) => {
			event.preventDefault();
			const loginInput = document.getElementById("login");
			const senhaInput = document.getElementById("senha");
			const msgErroLogin = document.querySelector(".msgerrologin");

			msgErroLogin.style.display = "none";
			loginInput.style.borderColor = "";
			senhaInput.style.borderColor = "";

			const loginVal = loginInput.value.trim();
			const senhaVal = senhaInput.value.trim();

			if (!loginVal || !senhaVal) {
				msgErroLogin.querySelector("p").textContent = "*Por favor, preencha todos os campos obrigatórios.";
				msgErroLogin.style.display = "block";
				if (!loginVal) loginInput.style.borderColor = "red";
				if (!senhaVal) senhaInput.style.borderColor = "red";
				return;
			}

			const loginSalvo = localStorage.getItem("login");
			const senhaSalva = localStorage.getItem("senha");

			if (loginVal === loginSalvo && senhaVal === senhaSalva) {
				localStorage.setItem("usuarioLogado", loginVal);
				window.location.href = "menus.html";
			} else {
				msgErroLogin.querySelector("p").textContent = "*Login ou senha incorretos.";
				msgErroLogin.style.display = "block";
				loginInput.style.borderColor = "red";
				senhaInput.style.borderColor = "red";
			}
		});

		document.getElementById("botao-novo-usuario")?.addEventListener("click", () => {
			window.location.href = "cadastrar-novo-usuário.html";
		});
	});
}