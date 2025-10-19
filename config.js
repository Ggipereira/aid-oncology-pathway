
// Configuração editável + árvore de decisão
const CONFIG = {
  sexoOptions: ["Feminino", "Masculino", "Outro / Prefiro não dizer"],
  perguntasEspecificas: [
    "Há quanto tempo começaram os sintomas?",
    "Os sintomas estão a piorar/progredir?",
    "Existe história familiar de cancro?",
    "Fez exames recentes (TAC, mamografia, análises)?"
  ],
  habitos: [
    "Não fumar; evitar exposição ao fumo.",
    "Limitar álcool (0–1 dose/dia).",
    "Alimentação rica em fruta/legumes/fibras; reduzir ultraprocessados.",
    "Atividade física 150–300 min/semana (adaptada).",
    "Sono regular e gestão de stress.",
    "Cumprir rastreios de acordo com idade e risco."
  ],
  razoes: [
    "Reduz inflamação sistémica e stress oxidativo.",
    "Diminui risco de cancros ligados a tabaco/álcool.",
    "Melhora controlo ponderal e metabolismo.",
    "Exercício associa-se a melhor prognóstico e qualidade de vida.",
    "Sono/gestão de stress apoiam imunidade e recuperação.",
    "Rastreios detetam lesões precoces e tratáveis."
  ],
  perguntasBase: [
    "Que exames considera prioritários no meu caso?",
    "Há sinais de alarme que justificam ida imediata às urgências?",
    "Devo ajustar medicação/suplementos antes de exames?",
    "Qual o tempo expectável até diagnóstico ou exclusão?"
  ],
  oncologiaTipos: [
    "Oncologia Médica",
    "Cirurgia Oncológica",
    "Senologia",
    "Ginecologia Oncológica",
    "Urologia Oncológica",
    "Oncologia Digestiva (Gastrenterologia)",
    "Pneumologia Oncológica",
    "Hematologia",
    "Dermato-oncologia",
    "Endocrinologia / Tiróide",
    "Radioterapia",
    "Outras"
  ],
  arvorePerguntas: [
    { texto: "Tem nódulo mamário, alteração recente da mama ou corrimento mamilar?", area: "Senologia" },
    { texto: "Sangue nas fezes, alteração do trânsito intestinal ou dor abdominal persistente?", area: "Oncologia Digestiva (Gastrenterologia)" },
    { texto: "Tosse persistente, dor torácica, falta de ar ou expetoração com sangue?", area: "Pneumologia Oncológica" },
    { texto: "Alterações urinárias (jato fraco, sangue na urina) ou PSA elevado?", area: "Urologia Oncológica" },
    { texto: "Nódulo no pescoço/tiroide, rouquidão persistente ou disfagia?", area: "Endocrinologia / Tiróide" },
    { texto: "Lesão cutânea que cresce, sangra ou muda de cor/formato?", area: "Dermato-oncologia" },
    { texto: "Adenopatias persistentes, febre prolongada, perda de peso ou sudorese noturna?", area: "Hematologia" },
    { texto: "Hemorragia uterina anómala, dor pélvica persistente ou corrimento anormal?", area: "Ginecologia Oncológica" }
  ],
  assocPorArea: {
    "Senologia": ["Europa Donna (mama)", "Liga Portuguesa Contra o Cancro (LPCC)"],
    "Oncologia Digestiva (Gastrenterologia)": ["Europacolon Portugal", "LPCC"],
    "Urologia Oncológica": ["Movember", "LPCC"],
    "Pneumologia Oncológica": ["LPCC"],
    "Hematologia": ["LPCC"],
    "Dermato-oncologia": ["LPCC"],
    "Ginecologia Oncológica": ["LPCC"],
    "Endocrinologia / Tiróide": ["LPCC"],
    "Oncologia Médica": ["LPCC"],
    "Radioterapia": ["LPCC"]
  },
  medicosPorArea: {
    "Oncologia Médica": [
      { nome: "Catarina Pulido", hospitais: ["Lisboa"] },
      { nome: "Fábio Cassiano Lopes", hospitais: ["Lisboa"] },
      { nome: "Gonçalo Ventura Fernandes", hospitais: ["Setúbal","Lisboa"] },
      { nome: "Joana Albuquerque", hospitais: ["Setúbal","Lisboa"] }
    ]
  }
};
