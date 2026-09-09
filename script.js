const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const motivation = document.getElementById("motivation");

const clearCompleted = document.getElementById("clearCompleted");
const dateElement = document.getElementById("date");


/* =========================================
   CARREGAR TAREFAS
========================================= */

let tasks = JSON.parse(
    localStorage.getItem("minhasTarefas")
) || [];


/* =========================================
   MOSTRAR DATA
========================================= */

function mostrarData() {

    const hoje = new Date();

    const dataFormatada = hoje.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    dateElement.textContent =
        dataFormatada.charAt(0).toUpperCase() +
        dataFormatada.slice(1);
}


/* =========================================
   SALVAR TAREFAS
========================================= */

function salvarTarefas() {

    localStorage.setItem(
        "minhasTarefas",
        JSON.stringify(tasks)
    );
}


/* =========================================
   ADICIONAR TAREFA
========================================= */

function adicionarTarefa() {

    const texto = taskInput.value.trim();

    if (!texto) {

        taskInput.focus();

        return;
    }

    const novaTarefa = {

        id: Date.now(),

        texto: texto,

        concluida: false

    };

    tasks.push(novaTarefa);

    salvarTarefas();

    taskInput.value = "";

    renderizarTarefas();

    taskInput.focus();
}


/* =========================================
   CONCLUIR / DESMARCAR
========================================= */

function alternarTarefa(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                concluida: !task.concluida
            };

        }

        return task;

    });

    salvarTarefas();

    renderizarTarefas();
}


/* =========================================
   EDITAR TAREFA
========================================= */

function editarTarefa(id) {

    const tarefa = tasks.find(
        task => task.id === id
    );

    if (!tarefa) {
        return;
    }

    const novoTexto = prompt(
        "Edite sua tarefa:",
        tarefa.texto
    );

    // Cancelou a edição
    if (novoTexto === null) {
        return;
    }

    const texto = novoTexto.trim();

    // Não permite salvar tarefa vazia
    if (!texto) {
        alert("A tarefa não pode ficar vazia.");
        return;
    }

    tarefa.texto = texto;

    salvarTarefas();

    renderizarTarefas();
}


/* =========================================
   REMOVER TAREFA
========================================= */

function removerTarefa(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    salvarTarefas();

    renderizarTarefas();
}


/* =========================================
   LIMPAR CONCLUÍDAS
========================================= */

function limparConcluidas() {

    tasks = tasks.filter(
        task => !task.concluida
    );

    salvarTarefas();

    renderizarTarefas();
}


/* =========================================
   RENDERIZAR TAREFAS
========================================= */

function renderizarTarefas() {

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";


        if (task.concluida) {

            li.classList.add("completed");

        }


        /* ==============================
           BOTÃO CONCLUIR
        ============================== */

        const checkButton =
            document.createElement("button");

        checkButton.className =
            "task-check";

        checkButton.setAttribute(
            "aria-label",
            "Concluir tarefa"
        );

        checkButton.addEventListener(
            "click",
            () => alternarTarefa(task.id)
        );


        /* ==============================
           TEXTO
        ============================== */

        const text =
            document.createElement("span");

        text.className =
            "task-text";

        text.textContent =
            task.texto;


        /* ==============================
           BOTÃO EDITAR
        ============================== */

        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-button";

        editButton.textContent =
            "✏️";

        editButton.setAttribute(
            "aria-label",
            "Editar tarefa"
        );

        editButton.setAttribute(
            "title",
            "Editar tarefa"
        );

        editButton.addEventListener(
            "click",
            () => editarTarefa(task.id)
        );


        /* ==============================
           BOTÃO EXCLUIR
        ============================== */

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-button";

        deleteButton.textContent =
            "×";

        deleteButton.setAttribute(
            "aria-label",
            "Excluir tarefa"
        );

        deleteButton.setAttribute(
            "title",
            "Excluir tarefa"
        );

        deleteButton.addEventListener(
            "click",
            () => removerTarefa(task.id)
        );


        /* ==============================
           MONTAR TAREFA
        ============================== */

        li.appendChild(checkButton);

        li.appendChild(text);

        li.appendChild(editButton);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });

    atualizarEstatisticas();
}


/* =========================================
   ATUALIZAR ESTATÍSTICAS
========================================= */

function atualizarEstatisticas() {

    const total = tasks.length;

    const concluidas =
        tasks.filter(
            task => task.concluida
        ).length;

    const pendentes =
        total - concluidas;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        concluidas;

    pendingTasks.textContent =
        pendentes;


    /* ==============================
       CALCULAR PROGRESSO
    ============================== */

    let progresso = 0;

    if (total > 0) {

        progresso = Math.round(
            (concluidas / total) * 100
        );

    }


    progressText.textContent =
        `${progresso}%`;

    progressFill.style.width =
        `${progresso}%`;


    /* ==============================
       MENSAGEM
    ============================== */

    if (total === 0) {

        motivation.textContent =
            "Comece adicionando uma tarefa!";

    } else if (progresso === 100) {

        motivation.textContent =
            "Parabéns! Você concluiu tudo! 🎉";

    } else if (progresso >= 75) {

        motivation.textContent =
            "Está quase lá! Continue assim!";

    } else if (progresso >= 50) {

        motivation.textContent =
            "Muito bem! Você já passou da metade!";

    } else if (progresso > 0) {

        motivation.textContent =
            "Bom começo! Continue avançando.";

    } else {

        motivation.textContent =
            "Você consegue! Comece pela primeira tarefa.";

    }


    /* ==============================
       ESTADO VAZIO
    ============================== */

    if (total === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }
}


/* =========================================
   EVENTOS
========================================= */

addButton.addEventListener(
    "click",
    adicionarTarefa
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            adicionarTarefa();

        }

    }
);


clearCompleted.addEventListener(
    "click",
    limparConcluidas
);


/* =========================================
   INICIAR APLICAÇÃO
========================================= */

mostrarData();

renderizarTarefas();