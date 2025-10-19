
const $ = (sel, ctx=document)=>ctx.querySelector(sel);
const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

const state = {
  triagem: { consulta:'', onde:'', qualHosp:'', tipoOnc:'', areaOutro:'' },
  intake: { idade:'', sexo:'', altura:'', peso:'', imc:'', sintomas:'', info:'', respostas:{} },
  recomendado: ''
};

function go(id){
  $$(".view").forEach(v=>v.classList.remove("active"));
  const el = document.getElementById(id);
  if(el) el.classList.add("active");
  window.location.hash = id;
}

function openTriagem(){ document.getElementById("dlg-triagem").showModal(); }

function initTriagem(){
  const f = document.getElementById("form-triagem");
  f.addEventListener("change", ()=>{
    const consulta = f.consulta.value;
    document.getElementById("sec-ramo-sim").classList.toggle("hidden", consulta!=="Sim");
    if(consulta==="Sim"){
      const onde = f.onde?.value || "";
      document.getElementById("sec-hdl").classList.toggle("hidden", onde!=='HDL');
      document.getElementById("sec-outro").classList.toggle("hidden", onde!=='Outro');
    }
  });
  document.getElementById("triagem-confirmar").addEventListener("click", ()=>{
    state.triagem.consulta = f.consulta.value;
    if(state.triagem.consulta==="Sim"){
      state.triagem.onde = f.onde?.value || "";
      if(state.triagem.onde==="HDL"){
        state.triagem.tipoOnc = document.getElementById("tipo-onc").value.trim();
        state.triagem.qualHosp = "";
        state.triagem.areaOutro = "";
      } else if(state.triagem.onde==="Outro"){
        state.triagem.qualHosp = document.getElementById("qual-hosp").value.trim();
        state.triagem.areaOutro = document.getElementById("area-outro").value.trim();
        state.triagem.tipoOnc = "";
      }
    } else {
      state.triagem.onde = "";
      state.triagem.qualHosp = "";
      state.triagem.tipoOnc = "";
      state.triagem.areaOutro = "";
    }
    document.getElementById("arvore-wrap").classList.toggle("hidden", state.triagem.consulta==='Sim');
    go("intake");
  });
}

function calcIMC(){
  const h = parseFloat(document.getElementById("altura").value||0);
  const p = parseFloat(document.getElementById("peso").value||0);
  if(h>0 && p>0){
    const imc = p / Math.pow(h/100,2);
    document.getElementById("imc").value = imc.toFixed(1);
  } else { document.getElementById("imc").value = ""; }
}

function renderDynamic(){
  const s = document.getElementById("sexo");
  s.innerHTML = CONFIG.sexoOptions.map(v=>`<option>${v}</option>`).join("");
  const wrap = document.getElementById("perguntas-wrap");
  wrap.innerHTML = "";
  CONFIG.perguntasEspecificas.forEach((q,i)=>{
    const id = "q_"+i;
    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = `<label class="form-label" for="${id}">${q}</label><textarea id="${id}" rows="2"></textarea><div class="note">Exemplo gerado por IA — varia consoante o paciente.</div>`;
    wrap.appendChild(box);
  });
  const dl = document.getElementById("lista-onc");
  if(dl) dl.innerHTML = CONFIG.oncologiaTipos.map(o=>`<option>${o}</option>`).join("");
  const arv = document.getElementById("arvore-qs");
  if(arv){
    arv.innerHTML = "";
    CONFIG.arvorePerguntas.forEach((q,i)=>{
      const gid = "arb_"+i;
      const field = document.createElement("fieldset");
      field.innerHTML = `<legend>${q.texto}</legend>
        <label><input type="radio" name="${gid}" value="Sim"> Sim</label>
        <label><input type="radio" name="${gid}" value="Não"> Não</label>`;
      field.dataset.area = q.area;
      arv.appendChild(field);
    });
  }
}

function computeRecommendation(){
  const scores = {};
  CONFIG.arvorePerguntas.forEach((q,i)=>{
    const checked = document.querySelector(`input[name="arb_${i}"]:checked`);
    const v = checked ? checked.value : "";
    if(v === "Sim"){
      scores[q.area] = (scores[q.area]||0) + 1;
    }
  });
  let bestArea = "";
  let bestScore = 0;
  let ties = 0;
  Object.entries(scores).forEach(([area, sc])=>{
    if(sc > bestScore){ bestScore = sc; bestArea = area; ties = 1; }
    else if(sc === bestScore && sc>0){ ties++; }
  });
  if(bestScore === 0 || ties > 1){ return ""; }
  return bestArea;
}

function list(items){ return '<ul>' + items.map(i=>`<li>${i}</li>`).join('') + '</ul>'; }

function doctorCards(area, docs){
  if(!docs.length) return '';
  const cards = docs.map(d=>`
    <div class="doctor-card">
      <div class="doctor-photo">${(d.nome?.[0]||'?')}</div>
      <div>
        <div class="doctor-name">${d.nome}</div>
        <div class="doctor-spec">${area}</div>
        <div class="doctor-meta"><strong>Hospitais:</strong> ${d.hospitais.join(', ')}</div>
        <div class="doctor-meta">📹 Videoconsulta disponível</div>
      </div>
      <div><button class="btn-marcar" type="button" aria-disabled="true">Marcar</button></div>
    </div>`).join('');
  return `<div class="box"><h3>Médicos — ${area} (Lisboa)</h3>${cards}</div>`;
}

function assocForArea(area){
  const map = CONFIG.assocPorArea || {};
  return map[area] || [];
}

function renderOutput(){
  document.getElementById("out-title").textContent = "As suas respostas";
  const area = document.getElementById("resultado"); area.innerHTML = "";

  const resumo = document.createElement("div");
  resumo.className = "box";
  const con = state.triagem.consulta==='Sim' ? 'Sim' : 'Não';
  const onde = state.triagem.onde==='HDL' ? 'Hospital da Luz' : (state.triagem.onde==='Outro' ? 'Outro' : '-');
  let areaTxt = '-';
  if(state.triagem.consulta==='Sim'){
    areaTxt = state.triagem.onde==='HDL' ? (state.triagem.tipoOnc||'-') : (state.triagem.areaOutro||'-');
  } else if(state.recomendado){
    areaTxt = state.recomendado + " (aconselhada)";
  }
  resumo.innerHTML = `<h3>Resumo</h3>
    <p><span class="badge">Consulta prévia</span> ${con} ${ onde!=='-' ? '• '+onde : '' } ${ state.triagem.qualHosp ? ' ('+state.triagem.qualHosp+')' : '' }</p>
    <p><span class="badge">Área/Especialidade</span> ${areaTxt}</p>
    <p><span class="badge">Idade</span> ${state.intake.idade||'-'} &nbsp; <span class="badge">Sexo</span> ${state.intake.sexo||'-'} &nbsp; <span class="badge">IMC</span> ${state.intake.imc||'-'}</p>`;
  area.appendChild(resumo);

  area.insertAdjacentHTML('beforeend', `<div class="box"><h3>Hábitos sugeridos</h3>${list(CONFIG.habitos)}<div class="note">Conteúdo pré-definido (não personalizado).</div></div>`);
  area.insertAdjacentHTML('beforeend', `<div class="box"><h3>Razões para os hábitos sugeridos</h3>${list(CONFIG.razoes)}<div class="note">Conteúdo pré-definido (não personalizado).</div></div>`);

  const perguntas = [...CONFIG.perguntasBase];
  Object.values(state.intake.respostas).forEach(v=>{ if(v) perguntas.unshift(v) });
  area.insertAdjacentHTML('beforeend', `<div class="box"><h3>Perguntas para o médico</h3>${list(perguntas)}<div class="note">Exemplos gerados por IA — variam de paciente para paciente.</div></div>`);

  if(state.triagem.consulta!=='Sim'){
    const msg = state.recomendado ? ('Com base nas respostas, sugerimos <strong>' + state.recomendado + '</strong>.') :
      'Não há indicação inequívoca. Recomendamos consulta <strong>pré-oncológica</strong> ou de <strong>Medicina Geral e Familiar</strong>.';
    area.insertAdjacentHTML('beforeend', `<div class="box"><h3>Especialidade aconselhada</h3><p>${msg}</p></div>`);
    // Append general oncology doctors for ALL specialties
    const docsOnc = CONFIG.medicosPorArea["Oncologia Médica"] || [];
    area.insertAdjacentHTML('beforeend', doctorCards("Oncologia Médica", docsOnc));
    area.insertAdjacentHTML('beforeend', `<div class="box"><h3>Recomendação</h3><p>Agende uma <strong>consulta de avaliação pré-oncológica</strong> no Hospital da Luz.</p></div>`);
    return;
  }

  const selectedArea = state.triagem.onde==='HDL' ? state.triagem.tipoOnc : state.triagem.areaOutro;
  const assoc = assocForArea(selectedArea);
  if(assoc.length){
    area.insertAdjacentHTML('beforeend', `<div class="box"><h3>Associações oncológicas</h3>${list(assoc)}</div>`);
  }
  // Doctors of selected area (if HDL) + ALWAYS general oncology doctors
  if(state.triagem.onde==='HDL' && selectedArea){
    const docsSel = CONFIG.medicosPorArea[selectedArea] || [];
    if(docsSel.length) area.insertAdjacentHTML('beforeend', doctorCards(selectedArea, docsSel));
  }
  const docsOnc = CONFIG.medicosPorArea["Oncologia Médica"] || [];
  area.insertAdjacentHTML('beforeend', doctorCards("Oncologia Médica", docsOnc));
}

function initOutput(){
  document.getElementById("voltar-intake").addEventListener("click", ()=> go("intake"));
  document.getElementById("exportar").addEventListener("click", ()=> window.print());
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("abrir-triagem").addEventListener("click", openTriagem);
  initTriagem();
  document.getElementById("altura").addEventListener("input", calcIMC);
  document.getElementById("peso").addEventListener("input", calcIMC);
  document.getElementById("voltar-triagem").addEventListener("click", ()=> openTriagem());
  document.getElementById("form-intake").addEventListener("submit",(e)=>{
    e.preventDefault();
    state.intake.idade = document.getElementById("idade").value;
    state.intake.sexo = document.getElementById("sexo").value;
    state.intake.altura = document.getElementById("altura").value;
    state.intake.peso = document.getElementById("peso").value;
    state.intake.imc = document.getElementById("imc").value;
    state.intake.sintomas = document.getElementById("sintomas").value.trim();
    state.intake.info = document.getElementById("info").value.trim();
    state.intake.respostas = {};
    CONFIG.perguntasEspecificas.forEach((q,i)=> state.intake.respostas[q] = (document.getElementById("q_"+i).value||"").trim());
    state.recomendado = (state.triagem.consulta==='Sim') ? "" : computeRecommendation();
    renderOutput();
    go("output");
  });
  initOutput();
  renderDynamic();
  document.getElementById("arvore-wrap").classList.add("hidden");
  go("start");
});
