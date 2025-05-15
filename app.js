let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let puntaje = 0;
let tipoSeleccionado = '';
let timerInterval;

const clickSound = new Audio('click.mp3');
const inicioSound = new Audio('inicio.mp3');
const warningSound = new Audio('warning.mp3');
const finSound = new Audio('fin.mp3');

const tipoSelect = document.getElementById('tipoSelect');
const temaSelect = document.getElementById('temaSelect');
const iniciarBtn = document.getElementById('iniciarBtn');
const contenido = document.getElementById('contenido');
const preguntaContainer = document.getElementById('pregunta-container');
const opcionesContainer = document.getElementById('opciones-container');
const respuestaContainer = document.getElementById('respuesta-container');
const mostrarRespuestaBtn = document.getElementById('mostrarRespuestaBtn');
const siguienteBtn = document.getElementById('siguienteBtn');
const resultadoContainer = document.getElementById('resultado-container');
const timerBar = document.getElementById('timer');
const reiniciarBtn = document.getElementById('reiniciarBtn');

fetch('datos.json')
  .then(res => res.json())
  .then(data => {
    preguntas = data;
  })
  .catch(err => {
    console.error('Error cargando preguntas:', err);
  });

// Actualiza los temas según el tipo seleccionado
tipoSelect.addEventListener('change', () => {
  const tipo = tipoSelect.value;
  temaSelect.innerHTML = '<option value="">-- Selecciona tema --</option>';

  const temasPorTipo = preguntas
    .filter(p => p.tipo === tipo)
    .map(p => p.tema);

  const temasUnicos = [...new Set(temasPorTipo)];

  temasUnicos.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    temaSelect.appendChild(opt);
  });
});

iniciarBtn.addEventListener('click', () => {
  clickSound.play();
  inicioSound.play();

  tipoSeleccionado = tipoSelect.value;
  const tema = temaSelect.value;
  if (!tipoSeleccionado || !tema) return alert('Por favor selecciona tipo y tema');

  preguntasFiltradas = preguntas.filter(p => p.tema === tema && p.tipo === tipoSeleccionado);
  if (preguntasFiltradas.length === 0) {
    alert('No hay preguntas para esta combinación');
    return;
  }

  preguntasFiltradas = preguntasFiltradas.sort(() => Math.random() - 0.5);
  indice = 0;
  puntaje = 0;
  contenido.classList.remove('oculto');
  resultadoContainer.classList.add('oculto');
  reiniciarBtn.classList.add('oculto');
  document.getElementById('seleccion').classList.add('oculto');
  mostrarPregunta();
});

function mostrarPregunta() {
  clearInterval(timerInterval);
  timerBar.style.background = 'green';
  timerBar.style.width = '100%';

  preguntaContainer.classList.remove('fade-in');
  opcionesContainer.classList.remove('fade-in');
  mostrarRespuestaBtn.classList.remove('fade-in');
  siguienteBtn.classList.remove('fade-in');
  reiniciarBtn.classList.remove('fade-in');
  respuestaContainer.classList.remove('fade-in');

  const actual = preguntasFiltradas[indice];
  preguntaContainer.textContent = actual.pregunta;
  opcionesContainer.innerHTML = '';
  respuestaContainer.classList.add('oculto');
  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.add('oculto');
  timerBar.classList.remove('oculto');

  if (tipoSeleccionado === 'quiz' || tipoSeleccionado === 'quiz comentado') {
    // Construimos las opciones con índice para comparar con el campo correcta
    const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3]
      .filter(Boolean)
      .map((text, i) => ({ text, index: i }));
    opciones.sort(() => Math.random() - 0.5);

    opcionesContainer.classList.remove('oculto');
    opciones.forEach(op => {
      const btn = document.createElement('button');
      btn.textContent = op.text;
      btn.onclick = () => {
        clickSound.play();

        if (op.index === actual.correcta) {
          btn.style.background = 'green';
          btn.classList.add('pulse');
          puntaje++;
        } else {
          btn.style.background = 'red';
          btn.classList.add('shake');
          // Mostrar la opción correcta
          Array.from(opcionesContainer.children).forEach(b => {
            if (b.textContent === actual.respuesta) b.style.background = 'green';
          });
        }
        Array.from(opcionesContainer.children).forEach(b => b.disabled = true);

        if (tipoSeleccionado === 'quiz comentado') {
          // Mostrar comentario que es la cita biblica
          respuestaContainer.textContent = actual['cita biblica'] || 'Sin comentario adicional.';
          respuestaContainer.classList.remove('oculto');
          respuestaContainer.classList.add('fade-in');
        }

        siguienteBtn.classList.remove('oculto');
        siguienteBtn.classList.add('fade-in');
        clearInterval(timerInterval);
        timerBar.classList.add('oculto');
      };
      opcionesContainer.appendChild(btn);
    });

    preguntaContainer.classList.add('fade-in');
    opcionesContainer.classList.add('fade-in');

  } else if (tipoSeleccionado === 'reflexion') {
    opcionesContainer.classList.add('oculto');
    respuestaContainer.textContent = actual.respuesta;
    mostrarRespuestaBtn.classList.remove('oculto');
    mostrarRespuestaBtn.classList.add('fade-in');
    preguntaContainer.classList.add('fade-in');
    iniciarTemporizador();
  }
}

function iniciarTemporizador() {
  let duracion = 58;
  timerBar.style.background = 'green';
  timerBar.style.width = '100%';
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    duracion--;
    timerBar.style.width = `${(duracion / 58) * 100}%`;

    if (duracion === 20) {
      warningSound.play();
      timerBar.classList.add('pulse-yellow');
      timerBar.style.background = 'yellow';
    }

    if (duracion === 10) {
      finSound.play();
      timerBar.classList.remove('pulse-yellow');
      timerBar.classList.add('pulse-red');
      timerBar.style.background = 'red';
    }

    if (duracion <= 0) {
      clearInterval(timerInterval);
      mostrarRespuestaBtn.classList.remove('oculto');
      mostrarRespuestaBtn.classList.add('fade-in');
      siguienteBtn.classList.remove('oculto');
      siguienteBtn.classList.add('fade-in');
      timerBar.classList.remove('pulse-red');
      timerBar.classList.add('fade-out');
    }
  }, 1000);
}

mostrarRespuestaBtn.addEventListener('click', () => {
  clickSound.play();
  respuestaContainer.classList.remove('oculto');
  respuestaContainer.classList.add('fade-in');
  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.remove('oculto');
  siguienteBtn.classList.add('fade-in');
});

siguienteBtn.addEventListener('click', () => {
  clickSound.play();
  indice++;
  if (indice < preguntasFiltradas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

reiniciarBtn.addEventListener('click', () => {
  clickSound.play();
  document.getElementById('seleccion').classList.remove('oculto');
  contenido.classList.add('oculto');
  resultadoContainer.classList.add('oculto');
  reiniciarBtn.classList.add('oculto');
});

function mostrarResultado() {
  contenido.classList.add('oculto');
  resultadoContainer.classList.remove('oculto');
  resultadoContainer.classList.add('fade-in');
  reiniciarBtn.classList.remove('oculto');
  reiniciarBtn.classList.add('fade-in');

  if (tipoSeleccionado === 'quiz' || tipoSeleccionado === 'quiz comentado') {
    const porcentaje = (puntaje / preguntasFiltradas.length) * 100;
    let mensaje = '';

    if (porcentaje <= 75) {
      mensaje = 'Sigamos creciendo juntos. Compartiendo más en comunidad, seremos mejores.';
    } else if (porcentaje <= 87) {
      mensaje = '¡Estás encaminado! Tu conocimiento es bueno y puede inspirar a otros.';
    } else {
      mensaje = '¡Eres un iluminado de la Palabra! Sigue brillando y guiando con sabiduría.';
    }

    resultadoContainer.innerHTML = `
      <h2>Completado</h2>
      <p>Puntaje: ${puntaje} / ${preguntasFiltradas.length} (${porcentaje.toFixed(1)}%)</p>
      <p><strong>${mensaje}</strong></p>
    `;
  } else {
    const frasesReflexion = [
      'Gracias por dedicar tiempo a reflexionar.',
      'Tu búsqueda te transforma.',
      'El corazón que reflexiona es tierra fértil.',
      '¡Sigue profundizando! Dios habla al alma atenta.'
    ];
    const aleatoria = frasesReflexion[Math.floor(Math.random() * frasesReflexion.length)];
    resultadoContainer.innerHTML = `
      <h2>Gracias por Reflexionar</h2>
      <p>${aleatoria}</p>
    `;
  }
}
