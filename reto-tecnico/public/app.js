const grid = document.querySelector('#grid');
const form = document.querySelector('#controls');
const inputCantidad = document.querySelector('#cantidad');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const n = Number(inputCantidad.value || 10);
  const cantidad = Math.min(Math.max(n, 1), 10);
  await generar(cantidad);
});

async function generar(n) {
  grid.textContent = 'Cargando…';
  try {
    const r = await fetch(`/api/people?results=${n}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const { people } = await r.json();
    render(people);
  } catch (e) {
    grid.textContent = `Error: ${e.message || e}`;
  }
}

function render(items) {
  const tpl = document.querySelector('#card-tpl');
  grid.innerHTML = '';
  items.forEach(d => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.foto').src = d.fotografia;
    node.querySelector('.foto').alt = `Foto de ${d.nombre}`;
    node.querySelector('.nombre').textContent = d.nombre;
    node.querySelector('.genero').textContent = d.genero;
    node.querySelector('.ubicacion').textContent = d.ubicacion;
    const a = node.querySelector('.correo');
    a.href = `mailto:${d.correo}`;
    a.textContent = d.correo;
    node.querySelector('.nacimiento').textContent = d.fecha_nacimiento;
    grid.appendChild(node);
  });

  if (!items.length) {
    grid.textContent = 'Sin resultados.';
  }
}
