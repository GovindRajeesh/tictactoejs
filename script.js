var home = document.getElementById('home_root')
var options = home.querySelectorAll('.option')
var op
var GameElements = {}
var outers = {}
var places = []
var comp = false
var players = []
var WinUpdateUi
var switchCurrent = (current) => { current = current == 0 ? 1 : 0; return current }
var makeTiles

var didWin = (current, WinUpdateUi) => {
  var places = players[current].places

  var condition = (
    (places.includes(0) && places.includes(1) && places.includes(2)) ||
    (places.includes(0) && places.includes(3) && places.includes(6)) ||
    (places.includes(0) && places.includes(4) && places.includes(8)) ||
    (places.includes(3) && places.includes(4) && places.includes(5)) ||
    (places.includes(6) && places.includes(7) && places.includes(8)) ||
    (places.includes(1) && places.includes(4) && places.includes(7)) ||
    (places.includes(2) && places.includes(4) && places.includes(6)) ||
    (places.includes(2) && places.includes(5) && places.includes(8))
  )

  if (condition) {
    var player = players[current]
    player.score += 1
    players[current] = player
    WinUpdateUi(current)
  }
}

function doComp(current, switchCurrent) {
  var unused = places.filter((p) => !p.used)
  if (unused.length != 0 && comp) {
    var compop = op == 'X' ? 'O' : 'X'
    var compmove = unused[Math.floor(Math.random() * unused.length)].index
    compmove = parseInt(compmove)

    GameElements.tiles[compmove].innerText = compop
    GameElements.tiles[compmove].className += ' ' + compop.toLowerCase()

    place = places[compmove]
    place.used = true
    places[compmove] = place

    players[current].places.push(place.index)
    didWin(current, WinUpdateUi)

    return switchCurrent(current)
  }
  return current
}

function Pop(s){
  outers.popout = document.createElement('div')
    outers.popout.className = 'pop-outer'
    GameElements.root.appendChild(outers.popout)

    outers.popin = document.createElement('div')
    outers.popin.className = 'pop-inner'
    outers.popout.appendChild(outers.popin)

    outers.popin.innerText = s
    
    setTimeout(() => {
      outers.popin.style.animationName = 'dewidth'
      outers.popin.style.animationDuration = '1.5s'
      outers.popin.style.fontSize = '0px'
      outers.popin.style.width = '0%'
    }, 1500)
    
    setTimeout(() => outers.popout.remove(), 2500)
    

}

function startGame() {
  players = [
    { name: 'X', score: 0, places: [] },
    { name: 'O', score: 0, places: [] },
  ]

  WinUpdateUi = (current) => {
    var player = players[current]

    Pop(player.name+' scored')

    GameElements[player.name.toLowerCase() + 'score'].innerText = player.name + ':' + player.score

    makeTiles()
  }

  var current = 0

  GameElements.root = document.createElement('div')
  GameElements.root.setAttribute('id', 'game_root')
  document.body.appendChild(GameElements.root)

  setTimeout(() => document.querySelector('#home_root').remove(), 2000)

  var outscoreboard = document.createElement('div')
  outscoreboard.className ='mar-score'
    GameElements.root.appendChild(outscoreboard)

  GameElements.scoreboard = document.createElement('div')
  GameElements.scoreboard.className = 'scores'
  outscoreboard.appendChild(GameElements.scoreboard)

  outers.gameboard = document.createElement('div')
  outers.gameboard.className = 'flex-j-center'
  GameElements.root.appendChild(outers.gameboard)

  GameElements.gameboard = document.createElement('div')
  GameElements.gameboard.setAttribute('id', 'game_board')
  outers.gameboard.appendChild(GameElements.gameboard)

  GameElements.tiles = []
  makeTiles = function() {
    GameElements.tiles.forEach(e => e.remove())
    players.forEach(p => p.places = [])
    places = []
    GameElements.tiles = []

    for (var i = 0; i < 9; i++) {
      var place = { index: i, used: false }
      places.push(place)
      GameElements.tiles[i] = document.createElement('button')
      GameElements.tiles[i].className = 'gamebtn'
      GameElements.tiles[i].dataset.index = i

      GameElements.tiles[i].addEventListener('click', (e) => {
        var place = places.find((p) => p.index == e.target.dataset.index)

        if (place.used) {
          return ''
        }
        e.target.className += ' ' + players[current].name.toLowerCase()
        e.target.innerText = players[current].name
        place.used = true
        places[place.index] = place


        players[current].places.push(place.index)
        didWin(current, WinUpdateUi)
        current = switchCurrent(current)
        current = doComp(current, switchCurrent)

        if (places.map(p => p.used).find(e => !e) == undefined) {
          Pop(`It's a Tie`)
          current=0
          makeTiles()
        }

      })

      GameElements.gameboard.appendChild(GameElements.tiles[i])
    }
  }

  makeTiles()

  GameElements.oscore = document.createElement('div')
  GameElements.oscore.className = "score-o"
  GameElements.oscore.innerText = 'O:0'
  GameElements.scoreboard.appendChild(GameElements.oscore)

  GameElements.xscore = document.createElement('div')
  GameElements.xscore.className = "score-x"
  GameElements.xscore.innerText = 'X:0'
  GameElements.scoreboard.appendChild(GameElements.xscore)
  
  GameElements.status=document.createElement('div')
  GameElements.status.className='status status-inner x'
  GameElements.status.innerText=`X's turn`
  GameElements.root.appendChild(GameElements.status)


  if (comp && players[current].name != op) {
    doComp(current, switchCurrent)
    current = 1
  }
}

options.forEach((option) => {
  option.addEventListener('click', (e) => {
    if (option.className.includes('option-x')) {
      op = 'X'
    } else if (option.className.includes('option-o')) {
      op = 'O'
    }
    comp = true
    startGame()
  })
})

function changeTab(name) {
  document.querySelectorAll('.tab').forEach((tab) => {
    if (!tab.className.includes('hide')) {
      tab.classList.add('hide')
    }
  })
  var tab = document.querySelector(`[data-tab='${name}']`)
  tab.classList.remove('hide')
}