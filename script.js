let size = 40;
let rows = Array();
let stars = Array();
let interval;

function Locale(x, y) {
    this.x = x;
    this.y = y;
    this.occupant = null;
    this.heat = null;
}

function Life(locale){
    this.type = "Photos";
    this.absorbtionRate = locale.heat;
    this.energy = 0;
    this.toString = function(){
        return "life";
    }
    this.minHeat = locale.heat - 10;
    if (this.minHeat < 0){
        this.minHeat = 0;
    }
    this.maxHeat = locale.heat + 10;
    this.locale = locale;
    this.birthThreshhold = 20;
    this.energyTax = .5;
    this.sexualMaturity = 3;
    this.age = 0;
}

function Predator(locale){
    this.type = "Predator";
    this.absorbtionRate = 0;
    this.energy = 10;
    this.toString = function(){
        return "predator";
    }
    this.minHeat = locale.heat - 10;
    if (this.minHeat < 0){
        this.minHeat = 0;
    }
    this.maxHeat = locale.heat + 10;
    this.locale = locale;
    this.birthThreshhold = 10;
    this.energyTax = .5;
    this.sexualMaturity = 3;
    this.age = 0;
    this.hunting = false;
    this.following = false;
}

function Apex(locale){
    this.type = "Apex";
    this.absorbtionRate = 0;
    this.energy = 10;
    this.toString = function(){
        return "apex";
    }
    this.minHeat = locale.heat - 10;
    if (this.minHeat < 0){
        this.minHeat = 0;
    }
    this.maxHeat = locale.heat + 10;
    this.locale = locale;
    this.birthThreshhold = 10;
    this.energyTax = .5;
    this.sexualMaturity = 3;
    this.age = 0;
    this.hunting = false;
    this.following = false;
}
  

function generateWorld() {
    for (y = 0; y < size; y++){
        let row = Array();
        for (x = 0; x < size; x++){
            let locale = new Locale(x, y);
            if (chance(100) == 0){
                locale.occupant = "star";
            }
            row.push(locale);
        }
        rows.push(row);
    }
    if (findStars().length == 0){
        rows = Array();
        generateWorld();
    }
    stars = findStars();
    calculateHeat();
}

function calculateDistance(x, y, sx, sy){
    let a = x - sx;
    let b = y - sy;
    let c = a * a + b * b;
    return c
}

function calculateLocaleHeat(x, y){
    let totalHeat = 0;
    for (let s = 0; s < stars.length; s++){
        let distance = calculateDistance(x, y, stars[s].x, stars[s].y);
        heat = 50 / distance;
        heat = Math.round(heat);
        totalHeat += heat;
    }
    return totalHeat;
}

function calculateHeat(){
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            rows[r][c].heat = calculateLocaleHeat(c, r);
        }
    }
}

function displayWorld() {
    document.getElementById("frame").innerHTML = "";
    for (let r = 0; r < rows.length; r++){
        let row = document.createElement("div");
        row.classList.add("row");
        for (let c = 0; c < rows[r].length; c++){
            let locale = document.createElement("span");
            locale.classList.add("locale");
            locale.addEventListener("mouseover", function() {
                hover(event);
            });
            if (rows[r][c].occupant != null){
                locale.classList.add(rows[r][c].occupant.toString());
            }
            locale.row = r;
            locale.column = c;
            row.appendChild(locale);
            locale.innerHTML = rows[r][c].heat;
            if (rows[r][c].occupant != "life" && rows[r][c].occupant != "star" && rows[r][c].occupant != "predator" && rows[r][c].occupant != "apex"){
                locale.style.backgroundColor = heatColoring(rows[r][c].heat);
            }
        }
        document.getElementById("frame").appendChild(row);
    }
}

function hover(e){
    data = document.getElementById("data");
    data.innerHTML = "";
    x = e.target.column;
    y = e.target.row;
    cord = "(" + x + ", " + y + ")";
    heat = rows[y][x].heat;
    occupant = rows[y][x].occupant;
    cordEl = document.createElement("span");
    cordEl.innerHTML = cord;
    occupantEl = document.createElement("span");
    heatToleranceEl = document.createElement("div");
    energyEl = document.createElement("div");
    ageEl = document.createElement("div");
    if (occupant){
        occupantEl.innerHTML = " - " + occupant.type;
        heatToleranceEl.innerHTML = "Tolerance: " + occupant.minHeat + " - " + occupant.maxHeat;
        energyEl.innerHTML = "Energy: " + occupant.energy;
        ageEl.innerHTML = "Age: " + occupant.age;
    }
    dataHeader = document.createElement("div");
    dataHeader.appendChild(cordEl);
    dataHeader.appendChild(occupantEl);
    data.appendChild(dataHeader);
    data.appendChild(energyEl);
    data.appendChild(heatToleranceEl);
    data.appendChild(ageEl);
    
}
function chance(chance) {
    return Math.floor(Math.random() * chance); 
}

function findStars(){
    let stars = Array()
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant == "star"){
                stars.push(rows[r][c]);
            }
        }
    }
    return stars;
}

function findLife(){
    let life = Array()
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant != null){
                if (rows[r][c].occupant.type != "star"){
                    life.push(rows[r][c].occupant);
                }
            }
        }
    }
    return life;
}

function heatColoring(heat){
    let red = 255;
    let green = 700 / (heat+1) + 60;
    let blue = 0;
    let rgb = "rgb(" + red + ", " + green + ", " + blue + ")";
    return rgb;
}

function generateLife(){
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant == null && rows[r][c].heat != 0){
                if (chance(100) == 0){
                    rows[r][c].occupant = new Life(rows[r][c]);
                } else if (chance(500) == 0){
                    rows[r][c].occupant = new Predator(rows[r][c]);
                } else if (chance(1000) == 0){
                    rows[r][c].occupant = new Apex(rows[r][c]);
                }
            }
        }
    }
}

function vacateLocale(x, y){
    rows[y][x].occupant = null;
}

function turn(){
    console.log("Tick");
    absorbHeat();
    energyTax();
    matingSeason();
    moveMovers();
    age();
    displayWorld();
}

function energyTax(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        if (life[i].type == "Predator"){
            console.log("PRED");
        }
        life[i].energy = life[i].energy - life[i].energyTax;
        if (life[i].energy < 0){
            vacateLocale(life[i].locale.x, life[i].locale.y);
        }
    }
}

function absorbHeat(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        life[i].energy = life[i].energy + life[i].absorbtionRate;
    }
}

function birth(life, locale){
    if (life.type == "Photos"){
        locale.occupant = new Life(locale);
    } else if (life.type == "Predator"){
        locale.occupant = new Predator(locale);
    }
    life.energy = life.energy - life.birthThreshhold;
}

function matingSeason(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        if (life[i].energy >= life[i].birthThreshhold){
            let neighbors = getNeighbors(life[i].locale.x, life[i].locale.y, 1);
            for (let n = 0; n < neighbors.length; n++){
                if (neighbors[n]){
                    if (neighbors[n].occupant == null && (neighbors[n].heat >= life[i].minHeat && neighbors[n].heat <= life[i].maxHeat)){
                        //neighbors[n].occupant = new Life(neighbors[n]);
                        //life[i].energy = life[i].energy - life[i].birthThreshhold;
                        birth(life[i], neighbors[n]);
                        break;
                    }
                }
            }
        }
    }
}

function getNeighbors(x, y, d){
    let neighbors = Array();
    let direction = Array();
    for (let i = -d; i <= d; i++){
        direction.push(i);
    }
    for (let i in direction){
        for (let j in direction){
            if (direction[i] != 0 || direction[j] != 0){
                let newY = parseInt(direction[i]) + parseInt(y);
                let newX = parseInt(direction[j]) + parseInt(x);
                try {
                    neighbors.push(rows[newY][newX]);
                } catch {

                }
            }
        }
    }
    return neighbors;
}

function moveMovers(){
    let predators = findSpecies("Predator");
    for (let i = 0; i < predators.length; i++){
        moveWithVision(predators[i], 5);
    }
}

function move(life){
    let neighbors = getNeighbors(life.locale.x, life.locale.y, 1);
    if (neighbors.length > 0){
        let destination = neighbors[chance(neighbors.length)];
        if (destination != null){
            if (destination.occupant != "star"){
                let oldX = life.locale.x;
                let oldY = life.locale.y;
                if (destination.occupant){
                    consume(life, destination.occupant);
                }
                life.locale = destination;
                destination.occupant = life;
                vacateLocale(oldX, oldY);
            } else {
                move(life);
            }
        }
    }
}


function consume(hunter, prey){
    hunter.energy += prey.energy;
}

function age(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        life[i].age++;
    }
}

function ring(locale, distance){
    let ring = Array();
    let neighbors = getNeighbors(locale.x, locale.y, distance);
    for (let i = 0; i < neighbors.length; i++){
        if (neighbors[i] != null){
            if (Math.abs(locale.x-neighbors[i].x) == distance || Math.abs(locale.y-neighbors[i].y) == distance){
                ring.push(neighbors[i]);
            }
        }
    }
    return ring;
}

function moveWithVision(life, depth){
   for (let i = 0; i <= depth; i++){
        let r = ring(life.locale, i);
        for (let j = 0; j < r.length; j++){
            if (r[j].occupant == "life"){
                r[j].occupant.hunting = true;
                let neighbors = getNeighbors(life.locale.x, life.locale.y, 1);
                let nDistances = Array();
                for (let k = 0; k < neighbors.length; k++){
                    if (neighbors[k] != null){
                        if (neighbors[k].occupant == null || neighbors[k].occupant == "life"){
                            nDistances.push(calculateDistance(neighbors[k].x, neighbors[k].y, r[j].x, r[j].y));
                        } else {
                            nDistances.push(1000);
                        }
                    }
                }
                let destination = neighbors[findMinIndex(nDistances)];
                if (destination != null){
                    let oldX = life.locale.x;
                    let oldY = life.locale.y;
                    if (destination.occupant && destination.occupant != "Predator"){
                        consume(life, destination.occupant);
                    }
                    life.locale = destination;
                    destination.occupant = life;
                    vacateLocale(oldX, oldY);
                    return;
                }
            }
        }
   }
   if(followWithVision(life, depth)){
       return;
   }
   life.hunting = false;
   move(life);   
}
function followWithVision(life, depth){
    for (let i = 0; i <= 10; i++){
         let r = ring(life.locale, i);
         for (let j = 0; j < r.length; j++){
             if (r[j].occupant == "Predator" && r[j].occupant.hunting == true){
                 let neighbors = getNeighbors(life.locale.x, life.locale.y, 1);
                 let nDistances = Array();
                 for (let k = 0; k < neighbors.length; k++){
                     if (neighbors[k] != null){
                         if (neighbors[k].occupant == null){
                             nDistances.push(calculateDistance(neighbors[k].x, neighbors[k].y, r[j].x, r[j].y));
                         } else {
                             nDistances.push(1000);
                         }
                     }
                 }
                 let destination = neighbors[findMinIndex(nDistances)];
                 if (destination != null){
                     let oldX = life.locale.x;
                     let oldY = life.locale.y;
                     life.locale = destination;
                     destination.occupant = life;
                     vacateLocale(oldX, oldY);
                     return true;
                 }
             }
         }
    }
    return false;
 }

function findMinIndex(nums){
    let min = 0;
    for (let i = 0; i < nums.length; i++){
        if (nums[i] < nums[min]){
            min = i;
        }
    }
    return min;
}

function findSpecies(species){
    let life = Array()
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant != null){
                if (rows[r][c].occupant.type == species){
                    life.push(rows[r][c].occupant);
                }
            }
        }
    }
    return life;
}

function play(){
    interval = setInterval(turn, 500); // Time in milliseconds
}

function pause(){
    clearInterval(interval);
}

function bigBang(){
    generateWorld();
    generateLife();
    displayWorld();
}

bigBang();
