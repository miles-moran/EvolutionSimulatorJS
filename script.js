let size = 40;
let rows = Array();
let stars = Array();

function Locale(x, y) {
    this.x = x;
    this.y = y;
    this.occupant = null;
    this.heat = null;
}

function Life(locale){
    this.type = "Photos";
    this.energy = locale.heat;
    this.toString = function(){
        return "life";
    }
    this.minHeat = heat - 10;
    this.maxHeat = heat + 10;
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
}

function calculateStarDistance(x, y, sx, sy){
    let a = x - sx;
    let b = y - sy;
    let c = a * a + b * b;
    return c
}

function calculateLocaleHeat(x, y){
    let totalHeat = 0;
    for (let s = 0; s < stars.length; s++){
        let distance = calculateStarDistance(x, y, stars[s].x, stars[s].y);
        heat = 50 / distance;
        heat = Math.round(heat);
        totalHeat += heat;
    }
    return totalHeat;
}

function calculateHeats(){
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            rows[r][c].heat = calculateLocaleHeat(c, r);
        }
    }
}

function displayWorld() {
    for (let r = 0; r < rows.length; r++){
        let row = document.createElement("div");
        row.classList.add("row");
        for (let c = 0; c < rows[r].length; c++){
            let locale = document.createElement("span");
            locale.classList.add("locale");
            if (rows[r][c].occupant != null){
                locale.classList.add(rows[r][c].occupant.toString());
            }
            locale.row = r;
            locale.column = c;
            row.appendChild(locale);
            locale.innerHTML = rows[r][c].heat;
            if (rows[r][c].occupant != "life" && rows[r][c].occupant != "star"){
                locale.style.backgroundColor = heatColoring(rows[r][c].heat);
            }
        }
        document.getElementById("frame").appendChild(row);
    }
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
                if (rows[r][c].occupant.type == "Photos"){
                    life.push(rows[r][c]);
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
            if (rows[r][c].occupant == null){
                if (chance(100) == 0){
                    rows[r][c].occupant = new Life(rows[r][c]);
                }
            }
        }
    }
}

function turn(){
    console.log(findLife().length);
}

function reproduceLife(){
    
}

generateWorld();
calculateHeats();
generateLife();
turn();
displayWorld();
//calculateStarDistances(0, 0);