
/* ===========================================================
   POWERPOLIS - SMART CITY
   Parte 2.1
   Geração Procedural da Cidade
=========================================================== */

let svg = null
let buildingsGroup = null
let treesGroup = null

export function initSmartCity(root) {
    if (!root) {
        return () => {}
    }

    root.innerHTML = ""

    const container = document.createElement("div")
    container.className = "smart-city-container"

    const header = document.createElement("div")
    header.className = "city-header"

    const title = document.createElement("h2")
    title.textContent = "Cidade Inteligente"

    const description = document.createElement("p")
    description.textContent = "Ajuste o consumo de energia para ver a cidade reagir."

    header.append(title, description)

    const controls = document.createElement("div")
    controls.className = "energy-controls"

    const labelWrapper = document.createElement("div")
    labelWrapper.className = "energy-labels"

    const sliderLabel = document.createElement("span")
    sliderLabel.textContent = "Consumo de energia"

    const energyValue = document.createElement("span")
    energyValue.id = "energyValue"
    energyValue.textContent = "50%"

    labelWrapper.append(sliderLabel, energyValue)

    const slider = document.createElement("input")
    slider.type = "range"
    slider.id = "energySlider"
    slider.min = "0"
    slider.max = "100"
    slider.value = "50"
    slider.className = "energy-slider"

    controls.append(labelWrapper, slider)

    const svgElement = createSVG("svg")
    svgElement.setAttribute("viewBox", `0 0 ${CITY_WIDTH} 480`)
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet")
    svgElement.classList.add("smart-city-svg")

    svg = svgElement
    buildingsGroup = createSVG("g")
    buildingsGroup.setAttribute("id", "buildings")
    svg.appendChild(buildingsGroup)

    treesGroup = createSVG("g")
    treesGroup.setAttribute("id", "trees")
    svg.appendChild(treesGroup)

    container.append(header, controls, svg)
    root.appendChild(container)

    generateCity()
    const cleanup = initializeEnergySystem(slider, energyValue)

    return () => {
        cleanup()
        root.innerHTML = ""
    }
}

    //----------------------------------------------------------
    // Configurações da cidade
    //----------------------------------------------------------

    const CITY_WIDTH = 1200;
    const GROUND_Y = 420;

    //----------------------------------------------------------
    // Quantidade aproximada de árvores
    //----------------------------------------------------------

    const TREE_COUNT = 20;

    //----------------------------------------------------------
    // Configurações dos prédios
    //----------------------------------------------------------

    const MIN_WIDTH = 45;
    const MAX_WIDTH = 95;

    const MIN_HEIGHT = 120;
    const MAX_HEIGHT = 320;

    //----------------------------------------------------------
    // Configurações das árvores
    //----------------------------------------------------------

    const TREE_TRUNK_WIDTH = 8;
    const TREE_TRUNK_HEIGHT = 22;

    const TREE_RADIUS = 12;

    //----------------------------------------------------------
    // Listas de elementos da cidade
    //----------------------------------------------------------

    const windows = [];

    const trees = [];

    const treeLeaves = [];

    //----------------------------------------------------------
    // Guarda a posição dos prédios
    //----------------------------------------------------------

    const buildingPositions = [];

    //----------------------------------------------------------
    // Cria um elemento SVG
    //----------------------------------------------------------

    function createSVG(tag){

        return document.createElementNS(
            "http://www.w3.org/2000/svg",
            tag
        );

    }

    //----------------------------------------------------------
    // Cor do prédio
    //----------------------------------------------------------

    function randomBuildingColor(){

        const colors = [

            "#232323",
            "#2C2C2C",
            "#353535",
            "#3A3A3A",
            "#404040"

        ];

        return colors[
            Math.floor(Math.random()*colors.length)
        ];

    }

    //----------------------------------------------------------
    // Cor do telhado
    //----------------------------------------------------------

    function darkerColor(color){

        const rgb = hexToRgb(color);

        const factor = 0.65;

        return `rgb(
            ${Math.round(rgb.r*factor)},
            ${Math.round(rgb.g*factor)},
            ${Math.round(rgb.b*factor)}
        )`;

    }

    //----------------------------------------------------------
    // Cria um prédio
    //----------------------------------------------------------

    function createBuilding(x){

        const width = randomBetween(
            MIN_WIDTH,
            MAX_WIDTH
        );

        const height = randomBetween(
            MIN_HEIGHT,
            MAX_HEIGHT
        );

        const y = GROUND_Y-height;

        //------------------------------------------------------
        // Grupo do prédio
        //------------------------------------------------------

        const group = createSVG("g");

        group.classList.add("building");

        //------------------------------------------------------
        // Cor principal
        //------------------------------------------------------

        const buildingColor = randomBuildingColor();

        //------------------------------------------------------
        // Corpo do prédio
        //------------------------------------------------------

        const building = createSVG("rect");

        building.setAttribute("x",x);

        building.setAttribute("y",y);

        building.setAttribute("width",width);

        building.setAttribute("height",height);

        building.setAttribute(
            "fill",
            buildingColor
        );

        building.setAttribute(
            "stroke",
            "#111"
        );

        building.setAttribute(
            "stroke-width",
            "1"
        );

        group.appendChild(building);

        //------------------------------------------------------
        // Faixa superior
        //------------------------------------------------------

        const topBand = createSVG("rect");

        topBand.setAttribute("x",x);

        topBand.setAttribute("y",y);

        topBand.setAttribute("width",width);

        topBand.setAttribute("height",8);

        topBand.setAttribute(
            "fill",
            darkerColor(buildingColor)
        );

        group.appendChild(topBand);

        //------------------------------------------------------
        // Telhado
        //------------------------------------------------------

        const roof = createSVG("rect");

        roof.setAttribute("x",x-2);

        roof.setAttribute("y",y-5);

        roof.setAttribute("width",width+4);

        roof.setAttribute("height",5);

        roof.setAttribute(
            "fill",
            "#1A1A1A"
        );

        group.appendChild(roof);

        //------------------------------------------------------
        // Porta
        //------------------------------------------------------

        const doorWidth = Math.max(
            10,
            Math.floor(width*0.18)
        );

        const doorHeight = 16;

        const door = createSVG("rect");

        door.setAttribute(
            "x",
            x+(width-doorWidth)/2
        );

        door.setAttribute(
            "y",
            GROUND_Y-doorHeight
        );

        door.setAttribute(
            "width",
            doorWidth
        );

        door.setAttribute(
            "height",
            doorHeight
        );

        door.setAttribute(
            "fill",
            "#1B1B1B"
        );

        group.appendChild(door);

        //------------------------------------------------------
        // Pequena maçaneta
        //------------------------------------------------------

        const knob = createSVG("circle");

        knob.setAttribute(
            "cx",
            x+(width-doorWidth)/2+doorWidth-3
        );

        knob.setAttribute(
            "cy",
            GROUND_Y-8
        );

        knob.setAttribute(
            "r",
            1.2
        );

        knob.setAttribute(
            "fill",
            "#B8860B"
        );

        group.appendChild(knob);

        //------------------------------------------------------
        // Adiciona o prédio ao SVG
        //------------------------------------------------------

        buildingsGroup.appendChild(group);

        //------------------------------------------------------
        // Cria as janelas
        //------------------------------------------------------

       createWindows(

        x,

        y,

        width,

        height

    );

    //------------------------------------------------------
    // Guarda a posição do prédio
    //------------------------------------------------------

    buildingPositions.push({

        x,

        width

    });

    return width;}
    

    //----------------------------------------------------------
    // Cria todas as janelas
    //----------------------------------------------------------

    function createWindows(

        x,

        y,

        width,

        height

    ){

    //------------------------------------------------------
    // Configurações
    //------------------------------------------------------

    const windowWidth = 8;

    const windowHeight = 8;

    const horizontalSpacing = 8;

    const verticalSpacing = 10;

    //------------------------------------------------------
    // Margens internas
    //------------------------------------------------------

    const marginLeft = 8;

    const marginTop = 18;

    const marginBottom = 26;

    //------------------------------------------------------
    // Quantidade de linhas e colunas
    //------------------------------------------------------

    const cols = Math.max(

        1,

        Math.floor(

            (width - marginLeft * 2 + horizontalSpacing)

            /

            (windowWidth + horizontalSpacing)

        )

    );

    const rows = Math.max(

        1,

        Math.floor(

            (height - marginTop - marginBottom)

            /

            (windowHeight + verticalSpacing)

        )

    );

    //------------------------------------------------------
    // Cria as janelas
    //------------------------------------------------------

    for(let row = 0; row < rows; row++){

        for(let col = 0; col < cols; col++){

            const win = createSVG("rect");

            win.classList.add("window");

            const wx =

                x +

                marginLeft +

                col * (windowWidth + horizontalSpacing);

            const wy =

                y +

                marginTop +

                row * (windowHeight + verticalSpacing);

            win.setAttribute("x", wx);

            win.setAttribute("y", wy);

            win.setAttribute("width", windowWidth);

            win.setAttribute("height", windowHeight);

            win.setAttribute("rx", 1.5);

            win.setAttribute("ry", 1.5);

            //--------------------------------------------------

            win.setAttribute(

                "fill",

                "#0B0B0B"

            );

            //--------------------------------------------------

            win.setAttribute(

                "stroke",

                "#111"

            );

            win.setAttribute(

                "stroke-width",

                "0.4"

            );

            //--------------------------------------------------

            buildingsGroup.appendChild(win);

            windows.push(win);

        }

    }

}

    //----------------------------------------------------------
    // Cria uma árvore
    //----------------------------------------------------------

    function createTree(x){

        const group = createSVG("g");

        group.classList.add("tree");

        //------------------------------------------------------
        // Tronco
        //------------------------------------------------------

        const trunk = createSVG("rect");

        trunk.setAttribute(
            "x",
            x - TREE_TRUNK_WIDTH / 2
        );

        const trunkY = GROUND_Y - 10;

        trunk.setAttribute(
            "y",
            trunkY
        );

        trunk.setAttribute(
            "width",
            TREE_TRUNK_WIDTH
        );

        trunk.setAttribute(
            "height",
            TREE_TRUNK_HEIGHT
        );

        trunk.setAttribute(
            "fill",
            "#6B4A2B"
        );

        group.appendChild(trunk);

        //------------------------------------------------------
        // Copa
        //------------------------------------------------------

        const positions = [

            { x: 0,  y: -10 },

            { x: -8, y: -2 },

            { x: 8,  y: -2 }

        ];

        positions.forEach(position=>{

            const leaf = createSVG("circle");

            leaf.setAttribute(
                "cx",
                x + position.x
            );

            leaf.setAttribute(
                "cy",
                trunkY + position.y
            );

            leaf.setAttribute(
                "r",
                TREE_RADIUS
            );

            leaf.setAttribute(
                "fill",
                "#2ECC71"
            );

            leaf.setAttribute(
                "stroke",
                "#1E8449"
            );

            leaf.setAttribute(
                "stroke-width",
                "1"
            );

            group.appendChild(leaf);

            treeLeaves.push(leaf);

        });

        treesGroup.appendChild(group);

        trees.push(group);

    }

    //----------------------------------------------------------
    // Gera as árvores
    //----------------------------------------------------------

    function generateTrees(){

    trees.length = 0;

    treeLeaves.length = 0;

    treesGroup.innerHTML = "";

    const totalTrees = 10;

    const margin = 35;

    const spacing = (CITY_WIDTH - margin * 2) / totalTrees;

    for(let i=0;i<totalTrees;i++){

        const x =

            margin +

            spacing*i +

            randomBetween(-12,12);

        createTree(x);

    }

}

    //----------------------------------------------------------
    // Número aleatório
    //----------------------------------------------------------

    function randomBetween(min,max){

        return Math.floor(

            Math.random()*(max-min+1)

        )+min;

    }

    //----------------------------------------------------------
    // Monta toda a cidade
    //----------------------------------------------------------

    function generateCity(){

        let x = 25;

        //------------------------------------------------------
        // Gera os prédios
        //------------------------------------------------------

        while(x < CITY_WIDTH - 50){

            const width = createBuilding(x);

            x += width + randomBetween(8,22);

        }

        //------------------------------------------------------
        // Gera árvores entre os prédios
        //------------------------------------------------------

        generateTrees();

    }

    //----------------------------------------------------------
    // Inicia
    //----------------------------------------------------------


/* ===========================================================
   POWERPOLIS - SMART CITY
   Parte 2.2
   Controle de Consumo Energético
=========================================================== */

function initializeEnergySystem(slider, label){
    if (!slider || !label) {
        return () => {}
    }

    //------------------------------------------------------
    // Atualiza a cidade imediatamente
    //------------------------------------------------------

    updateEnergy(slider.value);
    label.textContent = slider.value + "%"

    //------------------------------------------------------
    // Sempre que mover o slider
    //------------------------------------------------------

    const onInput = function(){
        label.textContent = this.value + "%";
        updateEnergy(Number(this.value));
    };

    slider.addEventListener("input", onInput);

    return () => {
        slider.removeEventListener("input", onInput);
    };
}

/* ===================================================== */

function updateEnergy(value){

    //----------------------------------------------------------
// Atualiza as árvores
//----------------------------------------------------------

function updateTrees(value){

        const trees =
            document.querySelectorAll("#trees g");

        const leaves =
            document.querySelectorAll("#trees circle");

        
        //------------------------------------------------------
        // Cor das folhas
        //------------------------------------------------------

        const start = hexToRgb("#3CB043");

        const end = hexToRgb("#6B4A2B");

        const factor = value/100;

        const r = Math.round(

            start.r +

            (end.r-start.r)*factor

        );

        const g = Math.round(

            start.g +

            (end.g-start.g)*factor

        );

        const b = Math.round(

            start.b +

            (end.b-start.b)*factor

        );

        const color = `rgb(${r},${g},${b})`;

        leaves.forEach(leaf=>{

            leaf.setAttribute(

                "fill",

                color

            );

        });

    }

    //---------------------------------------------
    // Recupera todas as janelas
    //---------------------------------------------

    const windows = document.querySelectorAll("#buildings rect.window");

    //---------------------------------------------
    // Cor principal
    //---------------------------------------------

    const color = calculateEnergyColor(value);

    //---------------------------------------------
    // Intensidade
    //---------------------------------------------

    const intensity = value/100;

    //---------------------------------------------
    // Quantidade de janelas ligadas
    //---------------------------------------------

    const activeWindows = Math.floor(

        windows.length * intensity

    );

    //---------------------------------------------
    // Embaralha as janelas
    //---------------------------------------------

    const shuffled = [...windows];

    shuffled.sort(()=>Math.random()-0.5);

    //---------------------------------------------
    // Primeiro apaga tudo
    //---------------------------------------------

    windows.forEach(win=>{

        win.setAttribute(
            "fill",
            "#0B0B0B"
        );

        win.style.filter="none";

    });

    //---------------------------------------------
    // Depois acende apenas parte delas
    //---------------------------------------------

    for(let i=0;i<activeWindows;i++){

        shuffled[i].setAttribute(
            "fill",
            color
        );

        shuffled[i].style.filter=

            "drop-shadow(0 0 "

            +(2+intensity*10)

            +"px "

            +color+")";

    }
    updateTrees(value);

}

/* ===================================================== */

function calculateEnergyColor(value){

    //---------------------------------------------
    // Verde
    //---------------------------------------------

    if(value<=33){

        return interpolateColor(

            "#00FF66",

            "#9CFF2E",

            value/33

        );

    }

    //---------------------------------------------
    // Amarelo
    //---------------------------------------------

    if(value<=66){

        return interpolateColor(

            "#9CFF2E",

            "#FFD000",

            (value-33)/33

        );

    }

    //---------------------------------------------
    // Laranja -> Vermelho
    //---------------------------------------------

    return interpolateColor(

        "#FFD000",

        "#FF3300",

        (value-66)/34

    );

}

/* ===================================================== */

function interpolateColor(start,end,factor){

    const s=hexToRgb(start);

    const e=hexToRgb(end);

    const r=Math.round(

        s.r+(e.r-s.r)*factor

    );

    const g=Math.round(

        s.g+(e.g-s.g)*factor

    );

    const b=Math.round(

        s.b+(e.b-s.b)*factor

    );

    return `rgb(${r},${g},${b})`;

}

/* ===================================================== */

function hexToRgb(hex){

    hex=hex.replace("#","");

    return{

        r:parseInt(hex.substring(0,2),16),

        g:parseInt(hex.substring(2,4),16),

        b:parseInt(hex.substring(4,6),16)

    };

=======
/* ===========================================================
   POWERPOLIS - SMART CITY
   Parte 2.1
   Geração Procedural da Cidade
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    //----------------------------------------------------------
    // Elementos do HTML
    //----------------------------------------------------------

    const svg = document.getElementById("smart-city");
    const buildingsGroup = document.getElementById("buildings");

    //----------------------------------------------------------
    // Grupo das árvores
    //----------------------------------------------------------

    const treesGroup = createSVG("g");

    treesGroup.setAttribute("id", "trees");

    // As árvores ficam na frente dos prédios
    svg.appendChild(treesGroup);

    //----------------------------------------------------------
    // Configurações da cidade
    //----------------------------------------------------------

    const CITY_WIDTH = 1200;
    const GROUND_Y = 420;

    //----------------------------------------------------------
    // Quantidade aproximada de árvores
    //----------------------------------------------------------

    const TREE_COUNT = 20;

    //----------------------------------------------------------
    // Configurações dos prédios
    //----------------------------------------------------------

    const MIN_WIDTH = 45;
    const MAX_WIDTH = 95;

    const MIN_HEIGHT = 120;
    const MAX_HEIGHT = 320;

    //----------------------------------------------------------
    // Configurações das árvores
    //----------------------------------------------------------

    const TREE_TRUNK_WIDTH = 8;
    const TREE_TRUNK_HEIGHT = 22;

    const TREE_RADIUS = 12;

    //----------------------------------------------------------
    // Listas de elementos da cidade
    //----------------------------------------------------------

    const windows = [];

    const trees = [];

    const treeLeaves = [];

    //----------------------------------------------------------
    // Guarda a posição dos prédios
    //----------------------------------------------------------

    const buildingPositions = [];

    //----------------------------------------------------------
    // Cria um elemento SVG
    //----------------------------------------------------------

    function createSVG(tag){

        return document.createElementNS(
            "http://www.w3.org/2000/svg",
            tag
        );

    }

    //----------------------------------------------------------
    // Cor do prédio
    //----------------------------------------------------------

    function randomBuildingColor(){

        const colors = [

            "#232323",
            "#2C2C2C",
            "#353535",
            "#3A3A3A",
            "#404040"

        ];

        return colors[
            Math.floor(Math.random()*colors.length)
        ];

    }

    //----------------------------------------------------------
    // Cor do telhado
    //----------------------------------------------------------

    function darkerColor(color){

        const rgb = hexToRgb(color);

        const factor = 0.65;

        return `rgb(
            ${Math.round(rgb.r*factor)},
            ${Math.round(rgb.g*factor)},
            ${Math.round(rgb.b*factor)}
        )`;

    }

    //----------------------------------------------------------
    // Cria um prédio
    //----------------------------------------------------------

    function createBuilding(x){

        const width = randomBetween(
            MIN_WIDTH,
            MAX_WIDTH
        );

        const height = randomBetween(
            MIN_HEIGHT,
            MAX_HEIGHT
        );

        const y = GROUND_Y-height;

        //------------------------------------------------------
        // Grupo do prédio
        //------------------------------------------------------

        const group = createSVG("g");

        group.classList.add("building");

        //------------------------------------------------------
        // Cor principal
        //------------------------------------------------------

        const buildingColor = randomBuildingColor();

        //------------------------------------------------------
        // Corpo do prédio
        //------------------------------------------------------

        const building = createSVG("rect");

        building.setAttribute("x",x);

        building.setAttribute("y",y);

        building.setAttribute("width",width);

        building.setAttribute("height",height);

        building.setAttribute(
            "fill",
            buildingColor
        );

        building.setAttribute(
            "stroke",
            "#111"
        );

        building.setAttribute(
            "stroke-width",
            "1"
        );

        group.appendChild(building);

        //------------------------------------------------------
        // Faixa superior
        //------------------------------------------------------

        const topBand = createSVG("rect");

        topBand.setAttribute("x",x);

        topBand.setAttribute("y",y);

        topBand.setAttribute("width",width);

        topBand.setAttribute("height",8);

        topBand.setAttribute(
            "fill",
            darkerColor(buildingColor)
        );

        group.appendChild(topBand);

        //------------------------------------------------------
        // Telhado
        //------------------------------------------------------

        const roof = createSVG("rect");

        roof.setAttribute("x",x-2);

        roof.setAttribute("y",y-5);

        roof.setAttribute("width",width+4);

        roof.setAttribute("height",5);

        roof.setAttribute(
            "fill",
            "#1A1A1A"
        );

        group.appendChild(roof);

        //------------------------------------------------------
        // Porta
        //------------------------------------------------------

        const doorWidth = Math.max(
            10,
            Math.floor(width*0.18)
        );

        const doorHeight = 16;

        const door = createSVG("rect");

        door.setAttribute(
            "x",
            x+(width-doorWidth)/2
        );

        door.setAttribute(
            "y",
            GROUND_Y-doorHeight
        );

        door.setAttribute(
            "width",
            doorWidth
        );

        door.setAttribute(
            "height",
            doorHeight
        );

        door.setAttribute(
            "fill",
            "#1B1B1B"
        );

        group.appendChild(door);

        //------------------------------------------------------
        // Pequena maçaneta
        //------------------------------------------------------

        const knob = createSVG("circle");

        knob.setAttribute(
            "cx",
            x+(width-doorWidth)/2+doorWidth-3
        );

        knob.setAttribute(
            "cy",
            GROUND_Y-8
        );

        knob.setAttribute(
            "r",
            1.2
        );

        knob.setAttribute(
            "fill",
            "#B8860B"
        );

        group.appendChild(knob);

        //------------------------------------------------------
        // Adiciona o prédio ao SVG
        //------------------------------------------------------

        buildingsGroup.appendChild(group);

        //------------------------------------------------------
        // Cria as janelas
        //------------------------------------------------------

       createWindows(

        x,

        y,

        width,

        height

    );

    //------------------------------------------------------
    // Guarda a posição do prédio
    //------------------------------------------------------

    buildingPositions.push({

        x,

        width

    });

    return width;}
    

    //----------------------------------------------------------
    // Cria todas as janelas
    //----------------------------------------------------------

    function createWindows(

        x,

        y,

        width,

        height

    ){

    //------------------------------------------------------
    // Configurações
    //------------------------------------------------------

    const windowWidth = 8;

    const windowHeight = 8;

    const horizontalSpacing = 8;

    const verticalSpacing = 10;

    //------------------------------------------------------
    // Margens internas
    //------------------------------------------------------

    const marginLeft = 8;

    const marginTop = 18;

    const marginBottom = 26;

    //------------------------------------------------------
    // Quantidade de linhas e colunas
    //------------------------------------------------------

    const cols = Math.max(

        1,

        Math.floor(

            (width - marginLeft * 2 + horizontalSpacing)

            /

            (windowWidth + horizontalSpacing)

        )

    );

    const rows = Math.max(

        1,

        Math.floor(

            (height - marginTop - marginBottom)

            /

            (windowHeight + verticalSpacing)

        )

    );

    //------------------------------------------------------
    // Cria as janelas
    //------------------------------------------------------

    for(let row = 0; row < rows; row++){

        for(let col = 0; col < cols; col++){

            const win = createSVG("rect");

            win.classList.add("window");

            const wx =

                x +

                marginLeft +

                col * (windowWidth + horizontalSpacing);

            const wy =

                y +

                marginTop +

                row * (windowHeight + verticalSpacing);

            win.setAttribute("x", wx);

            win.setAttribute("y", wy);

            win.setAttribute("width", windowWidth);

            win.setAttribute("height", windowHeight);

            win.setAttribute("rx", 1.5);

            win.setAttribute("ry", 1.5);

            //--------------------------------------------------

            win.setAttribute(

                "fill",

                "#0B0B0B"

            );

            //--------------------------------------------------

            win.setAttribute(

                "stroke",

                "#111"

            );

            win.setAttribute(

                "stroke-width",

                "0.4"

            );

            //--------------------------------------------------

            buildingsGroup.appendChild(win);

            windows.push(win);

        }

    }

}

    //----------------------------------------------------------
    // Cria uma árvore
    //----------------------------------------------------------

    function createTree(x){

        const group = createSVG("g");

        group.classList.add("tree");

        //------------------------------------------------------
        // Tronco
        //------------------------------------------------------

        const trunk = createSVG("rect");

        trunk.setAttribute(
            "x",
            x - TREE_TRUNK_WIDTH / 2
        );

        const trunkY = GROUND_Y - 10;

        trunk.setAttribute(
            "y",
            trunkY
        );

        trunk.setAttribute(
            "width",
            TREE_TRUNK_WIDTH
        );

        trunk.setAttribute(
            "height",
            TREE_TRUNK_HEIGHT
        );

        trunk.setAttribute(
            "fill",
            "#6B4A2B"
        );

        group.appendChild(trunk);

        //------------------------------------------------------
        // Copa
        //------------------------------------------------------

        const positions = [

            { x: 0,  y: -10 },

            { x: -8, y: -2 },

            { x: 8,  y: -2 }

        ];

        positions.forEach(position=>{

            const leaf = createSVG("circle");

            leaf.setAttribute(
                "cx",
                x + position.x
            );

            leaf.setAttribute(
                "cy",
                trunkY + position.y
            );

            leaf.setAttribute(
                "r",
                TREE_RADIUS
            );

            leaf.setAttribute(
                "fill",
                "#2ECC71"
            );

            leaf.setAttribute(
                "stroke",
                "#1E8449"
            );

            leaf.setAttribute(
                "stroke-width",
                "1"
            );

            group.appendChild(leaf);

            treeLeaves.push(leaf);

        });

        treesGroup.appendChild(group);

        trees.push(group);

    }

    //----------------------------------------------------------
    // Gera as árvores
    //----------------------------------------------------------

    function generateTrees(){

    trees.length = 0;

    treeLeaves.length = 0;

    treesGroup.innerHTML = "";

    const totalTrees = 10;

    const margin = 35;

    const spacing = (CITY_WIDTH - margin * 2) / totalTrees;

    for(let i=0;i<totalTrees;i++){

        const x =

            margin +

            spacing*i +

            randomBetween(-12,12);

        createTree(x);

    }

}

    //----------------------------------------------------------
    // Número aleatório
    //----------------------------------------------------------

    function randomBetween(min,max){

        return Math.floor(

            Math.random()*(max-min+1)

        )+min;

    }

    //----------------------------------------------------------
    // Monta toda a cidade
    //----------------------------------------------------------

    function generateCity(){

        let x = 25;

        //------------------------------------------------------
        // Gera os prédios
        //------------------------------------------------------

        while(x < CITY_WIDTH - 50){

            const width = createBuilding(x);

            x += width + randomBetween(8,22);

        }

        //------------------------------------------------------
        // Gera árvores entre os prédios
        //------------------------------------------------------

        generateTrees();

    }

    //----------------------------------------------------------
    // Inicia
    //----------------------------------------------------------

    generateCity();

    initializeEnergySystem();

});

/* ===========================================================
   POWERPOLIS - SMART CITY
   Parte 2.2
   Controle de Consumo Energético
=========================================================== */

function initializeEnergySystem(){

    const slider = document.getElementById("energySlider");
    const label = document.getElementById("energyValue");

    //------------------------------------------------------
    // Atualiza a cidade imediatamente
    //------------------------------------------------------

    updateEnergy(slider.value);

    //------------------------------------------------------
    // Sempre que mover o slider
    //------------------------------------------------------

    slider.addEventListener("input", function(){

        label.textContent = this.value + "%";

        updateEnergy(Number(this.value));

    });

}

/* ===================================================== */

function updateEnergy(value){

    //----------------------------------------------------------
// Atualiza as árvores
//----------------------------------------------------------

function updateTrees(value){

        const trees =
            document.querySelectorAll("#trees g");

        const leaves =
            document.querySelectorAll("#trees circle");

        
        //------------------------------------------------------
        // Cor das folhas
        //------------------------------------------------------

        const start = hexToRgb("#3CB043");

        const end = hexToRgb("#6B4A2B");

        const factor = value/100;

        const r = Math.round(

            start.r +

            (end.r-start.r)*factor

        );

        const g = Math.round(

            start.g +

            (end.g-start.g)*factor

        );

        const b = Math.round(

            start.b +

            (end.b-start.b)*factor

        );

        const color = `rgb(${r},${g},${b})`;

        leaves.forEach(leaf=>{

            leaf.setAttribute(

                "fill",

                color

            );

        });

    }

    //---------------------------------------------
    // Recupera todas as janelas
    //---------------------------------------------

    const windows = document.querySelectorAll("#buildings rect.window");

    //---------------------------------------------
    // Cor principal
    //---------------------------------------------

    const color = calculateEnergyColor(value);

    //---------------------------------------------
    // Intensidade
    //---------------------------------------------

    const intensity = value/100;

    //---------------------------------------------
    // Quantidade de janelas ligadas
    //---------------------------------------------

    const activeWindows = Math.floor(

        windows.length * intensity

    );

    //---------------------------------------------
    // Embaralha as janelas
    //---------------------------------------------

    const shuffled = [...windows];

    shuffled.sort(()=>Math.random()-0.5);

    //---------------------------------------------
    // Primeiro apaga tudo
    //---------------------------------------------

    windows.forEach(win=>{

        win.setAttribute(
            "fill",
            "#0B0B0B"
        );

        win.style.filter="none";

    });

    //---------------------------------------------
    // Depois acende apenas parte delas
    //---------------------------------------------

    for(let i=0;i<activeWindows;i++){

        shuffled[i].setAttribute(
            "fill",
            color
        );

        shuffled[i].style.filter=

            "drop-shadow(0 0 "

            +(2+intensity*10)

            +"px "

            +color+")";

    }
    updateTrees(value);

}

/* ===================================================== */

function calculateEnergyColor(value){

    //---------------------------------------------
    // Verde
    //---------------------------------------------

    if(value<=33){

        return interpolateColor(

            "#00FF66",

            "#9CFF2E",

            value/33

        );

    }

    //---------------------------------------------
    // Amarelo
    //---------------------------------------------

    if(value<=66){

        return interpolateColor(

            "#9CFF2E",

            "#FFD000",

            (value-33)/33

        );

    }

    //---------------------------------------------
    // Laranja -> Vermelho
    //---------------------------------------------

    return interpolateColor(

        "#FFD000",

        "#FF3300",

        (value-66)/34

    );

}

/* ===================================================== */

function interpolateColor(start,end,factor){

    const s=hexToRgb(start);

    const e=hexToRgb(end);

    const r=Math.round(

        s.r+(e.r-s.r)*factor

    );

    const g=Math.round(

        s.g+(e.g-s.g)*factor

    );

    const b=Math.round(

        s.b+(e.b-s.b)*factor

    );

    return `rgb(${r},${g},${b})`;

}

/* ===================================================== */

function hexToRgb(hex){

    hex=hex.replace("#","");

    return{

        r:parseInt(hex.substring(0,2),16),

        g:parseInt(hex.substring(2,4),16),

        b:parseInt(hex.substring(4,6),16)

    };