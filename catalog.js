const exerciseLibrary = [
    // Peito
    {
        id: "supino_reto_barra",
        name: "Supino Reto (Barra)",
        group: "Peito",
        description: "Deite no banco e empurre a barra para cima na linha do peito.",
        image: "images/supino_reto.png"
    },
    {
        id: "supino_inclinado_halteres",
        name: "Supino Inclinado (Halteres)",
        group: "Peito",
        description: "Banco a 30-45 graus. Empurre os halteres para cima focando na parte superior do peito.",
        image: "images/desenvolvimento.png" /* Reusing shoulder press visually closer than nothing or keeping empty */
    },
    {
        id: "crucifixo_maquina",
        name: "Crucifixo Máquina (Peck Deck)",
        group: "Peito",
        description: "Sentado, feche os braços trazendo as almofadas ou pegadores à frente do peito.",
        image: ""
    },
    {
        id: "flexao_solo",
        name: "Flexão de Braço",
        group: "Peito",
        description: "Mãos apoiadas no chão na largura dos ombros, desça o peito até quase tocar o solo.",
        image: ""
    },

    // Costas
    {
        id: "puxada_frente",
        name: "Puxada Frontal",
        group: "Costas",
        description: "Puxe a barra em direção ao peito superior, inclinando levemente o tronco para trás.",
        image: "images/puxada_frente.png"
    },
    {
        id: "remada_baixa",
        name: "Remada Baixa (Triângulo)",
        group: "Costas",
        description: "Sentado, puxe o triângulo em direção ao abdômen mantendo a coluna reta.",
        image: ""
    },
    {
        id: "serrote",
        name: "Remada Unilateral (Serrote)",
        group: "Costas",
        description: "Um joelho no banco, puxe o halter lateralmente contraindo a dorsal.",
        image: ""
    },

    // Pernas
    {
        id: "agachamento_livre",
        name: "Agachamento Livre",
        group: "Pernas",
        description: "Pés na largura dos ombros, agache mantendo a coluna neutra.",
        image: "images/agachamento.png"
    },
    {
        id: "leg_press_45",
        name: "Leg Press 45º",
        group: "Pernas",
        description: "Empurre a plataforma com os calcanhares, não estenda totalmente o joelho.",
        image: ""
    },
    {
        id: "extensora",
        name: "Cadeira Extensora",
        group: "Pernas",
        description: "Estenda os joelhos contraindo o quadríceps. Segure 1s no topo.",
        image: ""
    },
    {
        id: "flexora_deitada",
        name: "Mesa Flexora",
        group: "Pernas",
        description: "Deitado, flexione os joelhos trazendo o apoio em direção ao glúteo.",
        image: ""
    },
    {
        id: "panturrilha_em_pe",
        name: "Panturrilha em Pé",
        group: "Pernas",
        description: "Eleve os calcanhares o máximo possível e desça controladamente.",
        image: ""
    },

    // Ombros
    {
        id: "desenvolvimento_halteres",
        name: "Desenvolvimento (Halteres)",
        group: "Ombros",
        description: "Sentado, empurre os halteres verticalmente acima da cabeça.",
        image: "images/desenvolvimento.png"
    },
    {
        id: "elevacao_lateral",
        name: "Elevação Lateral",
        group: "Ombros",
        description: "Eleve os braços lateralmente até a altura dos ombros.",
        image: ""
    },
    {
        id: "elevacao_frontal",
        name: "Elevação Frontal",
        group: "Ombros",
        description: "Eleve o peso à frente do corpo até a altura dos olhos.",
        image: ""
    },

    // Braços
    {
        id: "rosca_direta_barra",
        name: "Rosca Direta (Barra)",
        group: "Braços",
        description: "Em pé, flexione os cotovelos trazendo a barra até o peito.",
        image: ""
    },
    {
        id: "rosca_martelo",
        name: "Rosca Martelo",
        group: "Braços",
        description: "Pegada neutra (dedos para dentro), flexione o cotovelo.",
        image: ""
    },
    {
        id: "triceps_polia",
        name: "Tríceps Pulley",
        group: "Braços",
        description: "Cotovelos fixos ao lado do corpo, empurre a barra para baixo.",
        image: ""
    },
    {
        id: "triceps_testa",
        name: "Tríceps Testa",
        group: "Braços",
        description: "Deitado, flexione os cotovelos levando a barra em direção à testa.",
        image: ""
    },

    // Abdomen/Cardio
    {
        id: "abdominal_infra",
        name: "Abdominal Infra",
        group: "Core",
        description: "Deitado, eleve as pernas unidas até tirar o quadril do chão.",
        image: ""
    },
    {
        id: "prancha",
        name: "Prancha Isométrica",
        group: "Core",
        description: "Sustente o corpo nos antebraços e pontas dos pés. Coluna reta.",
        image: ""
    },
    {
        id: "esteira",
        name: "Esteira (Corrida)",
        group: "Cardio",
        description: "Corrida intervalada ou contínua na esteira.",
        image: ""
    }
];
