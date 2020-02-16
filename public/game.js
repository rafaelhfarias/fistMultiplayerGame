export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []


    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const posX = 'playerX' in command ? command.playerX : Math.floor(Math.random()* state.screen.width)
        const posY = 'playerY' in command ? command.playerY : Math.floor(Math.random()* state.screen.height)
        state.players[playerId] = { x: posX, y: posY }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX : posX,
            playerY : posY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId
        delete state.players[playerId]

        notifyAll({
            type: "remove-player",
            playerId : playerId
        })
    }

    function addFruit(command) {
        const fruitId = command.fruitId
        const posX = command.fruitX
        const posY = command.fruitY
        state.fruits[fruitId] = { x: posX, y: posY }
    }

    function removeFruit(command) {
        const fruitId = command.fruitId
        delete state.fruits[fruitId]
    }

    function checkFruitCollision(playerId){
        const player = state.players[playerId]
        for (const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            if(player.x === fruit.x && player.y === fruit.y){
                removeFruit({fruitId: fruitId})
            }
        }
    }

    function setState(newState){
        Object.assign(state,newState)
    }

    function movePlayer(command) {

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                    return
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                    return
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                    return
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                    return
                }
            }
        }
        const keyPressed = command.keyPressed
        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[keyPressed]
        const playerId = command.playerId
        if (moveFunction && player){ 
            moveFunction(player)
            checkFruitCollision(playerId)
        }
    }
    return {
        setState,
        addFruit,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer,
        state,
        subscribe
    }
}