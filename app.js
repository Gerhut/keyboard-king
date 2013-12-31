+function(undefined) {
  var canvas = document.getElementsByTagName('canvas')[0]
  var context = canvas.getContext('2d')
  var WIDTH = canvas.width, HEIGHT = canvas.height
  var COLUMNS = 15, ROWS = 3
  var BLOCK_SIZE = WIDTH / COLUMNS
  var BLOCK_COLOR = 'blue', LETTER_COLOR = 'white'
  var blocks = new Array(COLUMNS)
  var letters = {}
  var speed = 1, acceleration = .05
  var startTime = Date.now()

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = BLOCK_SIZE + 'px "Comic Sans"'

  for ( var i = 0; i < COLUMNS; i++ ) blocks[i] = 3

  function draw() {
    context.clearRect(0, 0, WIDTH, HEIGHT)

    context.fillStyle = BLOCK_COLOR
    for ( var i = 0; i < COLUMNS; i++ )
      context.fillRect(i * BLOCK_SIZE,
                       HEIGHT - BLOCK_SIZE * blocks[i],
                       BLOCK_SIZE,
                       BLOCK_SIZE * blocks[i])

    context.fillStyle = LETTER_COLOR
    for ( var letter in letters ) {
      var letterObject = letters[letter]
      context.fillText(letter,
                       letterObject.column * BLOCK_SIZE + BLOCK_SIZE / 2,
                       letterObject.y + BLOCK_SIZE / 2)
    }
  }

  function move(generate) {
    var newLetter
    var availableColumns = []

    if (generate)
      for ( var i = 0; i < COLUMNS; i++ )
        availableColumns[i] = i

    for ( var letter in letters ) {
      var letterObject = letters[letter]
      letterObject.y += Math.floor(speed)
      if (HEIGHT - blocks[letterObject.column] * BLOCK_SIZE < letterObject.y + BLOCK_SIZE) {
        if (blocks[letterObject.column] === 0)
          return false
        else
          blocks[letterObject.column] -= 1
        delete letters[letter]
      }
      if (generate && letterObject.y <= BLOCK_SIZE)
        availableColumns.splice(availableColumns.indexOf(letterObject.column), 1)
    }

    speed += acceleration

    if (!generate) return true
    
    for ( var i = 0; i < 3; i++ ) {
      newLetter = String.fromCharCode(Math.random() * 26 + 65)
      if (!(newLetter in letters)) break
    }
    if (i === 3) return true

    letters[newLetter] = {
      'column': availableColumns[Math.floor(Math.random() * availableColumns.length)],
      'y': -BLOCK_SIZE
    }

    return true
  }

  document.addEventListener('keydown', function (event) {
    delete letters[String.fromCharCode(event.keyCode)]
  })


  function tick() {
    draw()
    if (move(Math.random() < .2))
      setTimeout(tick, 50)
    else {
      alert((Date.now() - startTime) / 1000 + ' seconds.');
      location.reload();
    }
  }

  setTimeout(tick, 50)

} ()