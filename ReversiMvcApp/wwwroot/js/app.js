const Game = (function(url){

    //Configuratie en state waarden
    let configMap = {
        apiUrl: url
    }

    let stateMap = {
        gameState: null,
        previousGameState: null,
        gameID: '',
        gameToken: '',
        playerToken: '',
        playerColorInt: '',
        playerColor: '',
    }

    let gameStateInterval;

    function aanDeBeurt() {
        let token = stateMap.gameState.aandeBeurt === 1 ? stateMap.gameState.speler1Token : stateMap.gameState.speler2Token;
        return token === stateMap.playerToken;
    }

    // Private function init
    const privateInit = function(playerToken, gameToken){
        stateMap.gameToken = gameToken;
        stateMap.playerToken = playerToken;

        _setPlayerColor();

        Game.Template.init();
        Game.Api.init();
        Game.Stats.init();

        _getCurrentGameState();
        gameStateInterval = setInterval(_getCurrentGameState, 2000);

    }

    const _setPlayerColor = async function (){
        let game = await Game.Data.get(`${url}/speler/${stateMap.playerToken}`),
            playercolor = parseInt(Object.keys(game).find(key => game[key] === stateMap.playerToken).match(/\d+/)[0]);

        stateMap.playerColorInt = playercolor;

        if (playercolor === 1){
            playercolor = "wit";
        } else if (playercolor === 2){
            playercolor = "zwart";
        }
        stateMap.playerColor = playercolor;
    }

    const _getCurrentGameState = async function () {

        stateMap.gameState = await Game.Model.getGameState(stateMap.gameToken);

        if (stateMap.gameState != null){
            // 
        }

        if (stateMap.previousGameState === null) { // We haven't been here before
            Game.Reversi.showBoard(stateMap.gameState.bord, stateMap.gameState.aandeBeurt, stateMap.playerColor);
            Game.Reversi.setChart(stateMap.gameState.bord);
        } else if (stateMap.gameState.bord !== stateMap.previousGameState.bord){
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    let oldColor = stateMap.previousGameState.bord[y][x];
                    let color = stateMap.gameState.bord[y][x];

                    if (oldColor !== color) {
                        console.log("oldcolor !== color");
                        Game.Reversi.showFiche(x, y, color);
                        Game.Reversi.setChart(stateMap.gameState.bord);
                    }
                }
            }
        }

        let board = document.getElementById('ReversiBord');
        board.classList.remove('board--turn-1', 'board--turn-2', 'disabled');

        board.classList.add('board--turn-' + stateMap.gameState.aandeBeurt);

        if (stateMap.gameState.aandeBeurt !== stateMap.playerColorInt){
            board.classList.add('disabled');

            let tiles = document.getElementsByClassName('tile');
            for (let i = 0; i < tiles.length; i++) {
                tiles.item(i).classList.remove('invalid');
            }
        }

        let turn = document.getElementById('turn');
        turn.innerHTML = stateMap.gameState.aandeBeurt === 1 ? 'Aan de beurt: Wit' : 'Aan de beurt: Zwart';

        let playerInfo = document.getElementById('player');

        playerInfo.innerHTML = `Jij bent: ${stateMap.playerColor}`;

        if (stateMap.gameState.gewonnen !== null){
            clearInterval(gameStateInterval);

            document.getElementById('leavegame').removeAttribute("onclick");

            board.classList.remove('board--turn-1', 'board--turn-2', 'disabled');
            board.classList.add("finished");
            board.parentElement.innerHTML += '<div id="endscores"></div><div class="fireworks"><div class="firework"></div><div class="firework"></div><div class="firework"></div></div>';

            let endscores = document.getElementById('endscores');

            let white = stateMap.gameState.bord.map(v => v.filter(l => l === 1).length).reduce((i1, i2) => i1 + i2),
                black = stateMap.gameState.bord.map(v => v.filter(l => l === 2).length).reduce((i1, i2) => i1 + i2),
                scores = `Wit: ${white} fiches` + ' <br/> ' + `Zwart: ${black} fiches`;

            endscores.innerHTML = "<h2>Spel afgelopen.</h2>";
            if (white > black) {
                endscores.innerHTML += `<p>Wit heeft gewonnen met ${white} fiches.</p><p>Zwart heeft ${black} fiches</p>`;
            } else if (black > white) {
                endscores.innerHTML += `<p>Zwart heeft gewonnen met ${black} fiches.</p><p>Wit heeft ${white} fiches</p>`;
            } else {
                endscores.innerHTML += `<p>Gelijkspel!</p><p>Wit heeft ${white} fiches</p><p>Zwart heeft ${black} fiches</p>`;
            }

            let winner;
            if (white > black){
                winner = stateMap.gameState.speler1Token;
            } else if (black > white){
                winner = stateMap.gameState.speler2Token;
            } else {
                winner = "tie";
            }

            $.post( `https://localhost:7157/Spel/Done/${stateMap.gameToken}`, function( data ) {
                document.getElementById('leavebutton').removeAttribute("onclick");
            });

        }

        stateMap.previousGameState = stateMap.gameState;
    }

    async function placeFiche(x, y) {
        if (!aanDeBeurt()){
            alert("Niet je beurt.")
            return;
        }

        // let game = await Game.Data.put(`https://localhost:7258/api/spel/${stateMap.gameToken}/zet?spelerToken=${stateMap.playerToken}&row=${y}&col=${x}`);
        // console.log(game);
        // await _getCurrentGameState();

        let form = new FormData();
        form.append("spelerToken", stateMap.playerToken);
        form.append("row", y);
        form.append("col", x);

        let settings = {
            "url": `${url}/${stateMap.gameToken}/zet`,
            "method": "PUT",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        }).fail(function(data){
            if (data.responseText == "Gaan we niet doen."){
                let tile = document.querySelector(`.board__row--y-${y}.board__col--x-${x}`);
                tile.classList.add("invalid");
            }
        });

        // Game.Reversi.setChart(stateMap.gameState.bord);
        // console.log("Placefiche succ");

        await _getCurrentGameState();
    }

    // Waarde/object geretourneerd aan de outer scope
    return {
        init: privateInit,
        placeFiche
    }
})('https://localhost:7258/api/spel');
Game.Data = (function () {

    let stateMap = {
        environment : 'production'
    }

    let configMap = {
        apiKey: "9e1212981dfe5fc0402151d852f36456",
        mock: [
            {
                url: "https://localhost:7258/api/Spel/",
                data: 0
            }
        ],
    };

    const get = function(url) {
        if(stateMap.environment === "production") {
            return $.get(url)
                .then(r => {
                    return r
                })
                .catch(e => {
                    console.log(e.message);
                    return null;
                });
        }else if(stateMap.environment === "development") {
            return getMockData(url);
        }
    }

    function put(url) {
        if (stateMap.environment === "production"){
            return new Promise(resolve => {
                $.ajax({
                    url: url,
                    type: 'PUT',
                    success: function (r) {
                        console.log(r);
                        resolve(r);
                    }
                })
            });
        }
        if (stateMap.environment === "development"){
            return getMockData(url);
        }
    }

    const pokeCard = async function () {
        let number = Math.floor(Math.random() * 967);
        console.log("Pokecard: " + number);
        return $.ajax({
            type: 'GET',
            url: 'https://api.pokemontcg.io/v2/cards/?q=nationalPokedexNumbers:' + number,
            headers: {
                "x-api-key": "596361bf-748d-4298-b415-696d2eb33e31"
            }
        });
    };

    const getMockData = function(url){

        const mockData = configMap.mock.find(item => item.url === url);

        return new Promise((resolve, reject) => {
            resolve(mockData);
        });

    }

    const _init = function (environment) {
        if (environment !== "production" || environment !== "development") {
            throw new Error("Incorrect environment.");
        }

        if (environment === "production"){

        }
    }

    return {
        init: _init,
        get,
        put,
        pokeCard
    }
})()
Game.Model = (function () {

    let _configmap = {}

    const _privateInit = function () {}

    const _getGameState = async function(token){
        let game = await Game.Data.get("https://localhost:7258/api/spel/" + token);

        if (game == null){
            return game;
        }

        game.bord = JSON.parse(game.bord);
        return game;
    };

    function convertBord(bord) {
        let arrayBord = [];
        for (let i = 0; i < 8; i++) {
            arrayBord.push([0,0,0,0,0,0,0,0]);
        }

        for (let position in bord) {
            let color = bord[position],
                positions = position.split(",");

            arrayBord[positions[0]][positions[1]] = color;
        }

        return arrayBord
    }

    const _getGameStatedepr = async function(token){

        let url = "/api/Spel/Beurt" + token;

        Game.Data.get(url)
            .then(data => {
                if (data.value > 2 || data.value < 0) throw new Error("Game.Data invalid value")
                if (data.value === 0) {
                    console.log("No specific value")
                    return "novalue";
                } else if (data.value === 1) {
                    console.log("White's turn")
                    return "white";
                } else if (data.value === 2) {
                    console.log("Black's turn")
                    return "black";
                }
                return null;
            });
    }

    const getWeather = function () {
        let url = "https://api.openweathermap.org/data/2.5/weather";

        Game.Data.get(url).then(data => {
            if (typeof data.main.temp !== 'undefined') {
                console.log("Temp: " + (data.main.temp - 273.15).toFixed(2) + " °C");
            } else {
                throw new Error("No temp.");
            }
        });
    }

    return {
        init: _privateInit,
        getWeather,
        getGameState: _getGameState,
    }
})()
Game.Reversi = (function(){

    let _configmap = {}

    const _privateInit = function () {
        console.log('hallo, vanuit module Reversi')
    }

    const showBoard = function (bord, turn, player){
        const board = document.querySelector(".gameboard");

        board.innerHTML = Game.Template.parseTemplate("reversi.board", {
            board: bord,
            playerTurn: turn,
            currentPlayer: player,
        });

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let place = document.querySelector(`.board__row--y-${y}.board__col--x-${x}`);
                place.addEventListener("click", evt => {
                    if (place.children.length > 0) return;
                    console.log("row: " + y + " | col: " + x);
                    Game.placeFiche(x, y);
                })
            }
        }
    }

    const showFiche = function (x, y, color) {
        let tile = document.querySelector(`.board__row--y-${y}.board__col--x-${x}`);
        tile.classList.remove('invalid');
        tile.innerHTML = '';

        let fiche = document.createElement("div");

        fiche.classList.add("fiche");
        fiche.classList.add("fiche--" + color);

        tile.append(fiche)

        // Game.Stats.setChart(stateMap.gameState.bord);
    };

    const setChart = function (bord) {
        const ctx = document.getElementById('myChart');
        ctx.innerHTML = "";
        const stats = Game.Stats.getStats(bord);
        let chart = Game.Stats.getChart(ctx);

        let aantalWit = stats.aantalWit;
        let aantalZwart = stats.aantalZwart;
        let aantalLeeg = stats.aantalLeeg;
        chart.data.datasets[0].data = [aantalWit, aantalZwart, aantalLeeg];

        chart.update();

        console.log("setchart");
    }

    return {
        init : _privateInit,
        showBoard,
        showFiche,
        setChart,
    }

})()
Game.Template = (function () {

    function getTemplate(templateName) {
        let templates = spa_templates.templates;
        for (let t of templateName.split(".")) {
            templates = templates[t];
        }
        return templates;
    }

    function parseTemplate(templateName, data) {
        return getTemplate(templateName)(data);
    }

    function _init() {
        Handlebars.registerHelper('ifeq', function (a, b, options) {
            if (a === b) { return options.fn(this); }
            return options.inverse(this);
        });

        Handlebars.registerHelper('ifnoteq', function (a, b, options) {
            if (a !== b) { return options.fn(this); }
            return options.inverse(this);
        });
    }

    return {
        init: _init,
        getTemplate,
        parseTemplate,
    }
})();
class FeedbackWidget{
    constructor(elementId) {
        this._elementId = elementId;
    }

    get elementId() { //getter, set keyword voor setter methode
        return this._elementId;
    }

    show(message, type){
        let feedbackWidget = $("#"+this._elementId);
        feedbackWidget.addClass('widget--show');
        feedbackWidget.find('.content p').text(message);
        feedbackWidget.removeClass(['alert-success', 'alert-danger']);

        if (type === "success"){
            feedbackWidget.addClass('alert-success');
        } else {
            feedbackWidget.addClass('alert-danger');
        }
    }

    hide(){
        let feedbackWidget = $('#'+this._elementId);
        feedbackWidget.removeClass('widget--show');

        // feedbackWidget.css('display', 'none');
    }

    log(message){
        let storage = [];

        if (localStorage.getItem('feedback_widget') !== null){
            let lS = JSON.parse(localStorage.getItem('feedback_widget'));

            storage.push(message);

            for (let i = 0; i < lS.length; i++) {
                if (i < 9){
                    storage.push(lS[i]);
                }
            }

        } else {
            storage.push(message);
        }

        localStorage.setItem('feedback_widget', JSON.stringify(storage));
    }

    removeLog(){
        localStorage.removeItem('feedback_widget');
    }

    history(){
        let logs = JSON.parse(localStorage.getItem('feedback_widget')),
            string = "";

        for (let i = 0; i < logs.length; i++){
            let curr = logs[i];

            string += "<type " + curr.type + "> - <" + curr.message + "> \n\r";
        }

        this.show(string, "success");
    }
}
Game.Api = (function () {
    async function privateInit() {
        let cardwrap = document.getElementById('pokecards'),
            pokecard = await pokeCard(),
            card = pokecard.data[0].images.small;
        //
        // cardwrap.append(Game.Template.parseTemplate("partials.poke.card", {card:card}));

        const cards = document.querySelector(".pokecards");
        cards.innerHTML = Game.Template.parseTemplate("partials.poke.card", {
            card: card,
        });
    }

    async function pokeCard() {
        return await Game.Data.pokeCard();
    }

    return {
        init: privateInit,
    }
})();
Game.Stats = (function () {

    const configMap = {
        stats: {
            aantalWit: 0,
            aantalZwart: 0,
            aantalLeeg: 0,
        }
    }

    const getStats = function (bord) {
        configMap.stats.aantalWit = countFichesByColor("Wit", bord);
        configMap.stats.aantalZwart = countFichesByColor("Zwart", bord);
        configMap.stats.aantalLeeg = (bord.length * bord.length) - configMap.stats.aantalWit - configMap.stats.aantalZwart;
        return configMap.stats;
    }

    const getChart = function (ctx) {

        Chart.helpers.each(Chart.instances, function(instance){
            instance.chart.destroy();
        });

        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Wit', 'Zwart', 'Leeg'],
                datasets: [{
                    label: 'Aantal fiches',
                    data: [2, 2, 0],
                    backgroundColor: [
                        '#FFFFFF',
                        '#000000',
                        '#208AAE'
                    ],
                    borderColor: [
                        '#FFFFFF',
                        '#000000',
                        '#208AAE'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function init() {
        // const statsElem = document.querySelector(".stats");
        // statsElem.innerHTML = Game.Template.parseTemplate("partials.stats.graph");

        console.log("game.stats");
    }

    const countFichesByColor = (color, bord) => {
        // console.log("hallo");
        let wit = 0;
        let zwart = 0;
        for (let i = 0; i < bord.length; i++) {
            for (let j = 0; j < bord.length; j++) {
                if (bord[i][j] === 1) {
                    wit++;
                } else if (bord[i][j] === 2) {
                    zwart++;
                }
            }
        }
        return color === "Wit" ? wit : zwart;
    }

    return {
        init,
        getStats: getStats,
        getChart: getChart,
        countFichesByColor: countFichesByColor,
    }
})();