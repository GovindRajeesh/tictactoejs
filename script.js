var home = document.getElementById('home_root')
var homeHtml = home.innerHTML
var options = home.querySelectorAll('.option')
var op
var GameElements = {}
var outers = {}
var places = []
var comp = false
var players = []
var WinUpdateUi
var switchCurrent = (current) => {
  current = current == 0 ? 1 : 0;
  updateStatus(current);
  return current
}
var makeTiles

function Timer(el) {
  var timer = {
    minutes: 0,
    seconds: 0
  }
  setInterval(() => {
    el.innerText = `${timer.minutes.toString().length==1?'0'+timer.minutes:timer.minutes}:${timer.seconds.toString().length==1?'0'+timer.seconds:timer.seconds}`
    timer.seconds += 1
    if (timer.seconds >= 60) {
      timer.minutes += 1
      timer.seconds = 0
    }
  }, 1000)
}

function updateStatus(current) {
  if (GameElements.status != null) {
    GameElements.status.remove()
  }
  GameElements.status = document.createElement('div')
  GameElements.status.innerText = players[current].name + `'s turn`
  GameElements.status.className = `status-inner ${players[current].name.toLowerCase()}`
  outers.status.appendChild(GameElements.status)
}

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

function Pop(s) {
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

    Pop(player.name + ' scored')

    GameElements[player.name.toLowerCase() + 'score'].innerText = player.name + ':' + player.score

    makeTiles()
  }

  GameElements.root = document.createElement('div')
  GameElements.root.setAttribute('id', 'game_root')
  document.body.appendChild(GameElements.root)

  setTimeout(() => document.querySelector('#home_root').classList.add('hide'), 2000)

  var outscoreboard = document.createElement('div')
  outscoreboard.className = 'mar-score'
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

  GameElements.oscore = document.createElement('div')
  GameElements.oscore.className = "score-o"
  GameElements.oscore.innerText = 'O:0'
  GameElements.scoreboard.appendChild(GameElements.oscore)

  GameElements.timer = document.createElement('div')
  GameElements.timer.style.flex = '25'
  GameElements.timer.style.fontSize = 'xx-large'
  GameElements.timer.style.display = 'flex'
  GameElements.timer.style.alignItems = 'center'
  GameElements.timer.style.justifyContent = 'center'

  Timer(GameElements.timer)


  GameElements.timer.style.textAlign = 'center'
  GameElements.timer.innerText = '00:00'
  GameElements.scoreboard.appendChild(GameElements.timer)

  GameElements.xscore = document.createElement('div')
  GameElements.xscore.className = "score-x"
  GameElements.xscore.innerText = 'X:0'
  GameElements.scoreboard.appendChild(GameElements.xscore)

  outers.status = document.createElement('div')
  outers.status.className = 'status'
  GameElements.root.appendChild(outers.status)

  var current = 0
  updateStatus(current)

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
          current = 0
          updateStatus(current)
          makeTiles()
        }

      })

      GameElements.gameboard.appendChild(GameElements.tiles[i])
    }
  }

  makeTiles()

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

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').then((e)=>console.log(e))
}