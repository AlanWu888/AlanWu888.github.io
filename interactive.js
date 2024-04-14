function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

const mobileControls = document.getElementById('mobileControls');

// if (isTouchDevice()) {
//   mobileControls.style.display = 'flex';
// } else {
//   mobileControls.style.display = 'none';
// }

const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// section

const canvas=document.querySelector('canvas');
const c = canvas.getContext('2d');

const mapTileWidth = 70

canvas.width=1024
canvas.height=576

const offset = {
  x: -592,
  y: -460
}

// our map is 70 tiles wide so iterate 70 times
// tell our code where boundaries and zones are
const collisionMap = []
for (let i = 0; i < CollisionBoundaryData.length; i+=mapTileWidth) {
  collisionMap.push(CollisionBoundaryData.slice(i, i+mapTileWidth))
}

const boundaries = []
collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1025)
    boundaries.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})

const battleZonesMap = []
for (let i = 0; i < BattleZonesBoundaryData.length; i+=mapTileWidth) {
  battleZonesMap.push(BattleZonesBoundaryData.slice(i, i+mapTileWidth))
}

const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1025)
    battleZones.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})

// houses
/*
const house1Map = []
for (let i = 0; i < House1Data.length; i+=mapTileWidth) {
  house1Map.push(House1Data.slice(i, i+mapTileWidth))
}

const house1Zones = []
house1Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1025)
    house1Zones.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})

const house2Map = []
for (let i = 0; i < House2Data.length; i+=mapTileWidth) {
  house2Map.push(House2Data.slice(i, i+mapTileWidth))
}

const house2Zones = []
house2Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1025)
    house2Zones.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})

const house3Map = []
for (let i = 0; i < House3Data.length; i+=mapTileWidth) {
  house3Map.push(House3Data.slice(i, i+mapTileWidth))
}

const house3Zones = []
house3Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1025)
    house3Zones.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})

const house4Map = []
for (let i = 0; i < House4Data.length; i+=mapTileWidth) {
  house4Map.push(House4Data.slice(i, i+mapTileWidth))
}

const house4Zones = []
house4Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1025)
    house4Zones.push(new Boundary({
      position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})
*/

const backgroundImage = new Image();
backgroundImage.src='./images/base_map.png'

const foregroundImage = new Image();
foregroundImage.src='./images/foreground_map.png'

const playerUpImage = new Image();
playerUpImage.src='./images/player/playerUp.png'

const playerDownImage = new Image();
playerDownImage.src='./images/player/playerDown.png'

const playerLeftImage = new Image();
playerLeftImage.src='./images/player/playerLeft.png'

const playerRightImage = new Image();
playerRightImage.src='./images/player/playerRight.png'

// y: canvas.height/2 - 68/2,
const player = new Sprite({
  position: {
    x: canvas.width/2 - 192/4/2, 
    y: canvas.height/2 + 40,
  }, 
  image: playerDownImage,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  }, 
  image: backgroundImage,
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  }, 
  image: foregroundImage,
})

const keys = {
  w: {pressed: false}, 
  s: {pressed: false},
  a: {pressed: false},
  d: {pressed: false},
}

// , ...house1Zones, ...house2Zones, ...house3Zones, ...house4Zones
const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rect1, rect2}) {
  return(
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y <= rect2.height + rect2.position.y &&
    rect1.position.y + rect1.height >= rect2.position.y
  )
}

const battle = {
  initiated: false
}

function animate() {
  const animationId = window.requestAnimationFrame(animate)
  background.draw()
  boundaries.forEach(boundary => {
    boundary.draw()
  })
  battleZones.forEach(battleZone => {
    battleZone.draw()
  })

  // houses
  /*
  house1Zones.forEach(house1Zone => {
    house1Zone.draw()
  }) 
  house2Zones.forEach(house2Zone => {
    house2Zone.draw()
  })  
  house3Zones.forEach(house3Zone => {
    house3Zone.draw()
  })  
  house4Zones.forEach(house4Zone => {
    house4Zone.draw()
  })
  */  
  
  player.draw()
  foreground.draw()
  
  let moving=true
  player.moving=false

  if (battle.initiated) return

  if(keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {  
    // battle zones
    for(let i=0; i<battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea = 
        (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) 
      - Math.max(player.position.x, battleZone.position.x))
      * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) 
      - Math.max(player.position.y, battleZone.position.y))

      if (
        rectangularCollision({
          rect1: player,
          rect2: battleZone
        }) && overlappingArea > (player.width * player.height) / 2 
      && Math.random() < 0.01)
      {
        // enter battle
        window.cancelAnimationFrame(animationId)
        battle.initiated = true
        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          onComplete() {
            gsap.to('#overlappingDiv', {
              opacity: 1,
            })

            animateBattle()
            gsap.to('#overlappingDiv', {
              opacity: 0,
            })
          }
        })
        break
      }
    }

    
    // houses
    /*
    for(let i=0; i<house1Zones.length; i++) {
      const house1Zone = house1Zones[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: house1Zone
        }))
      {
        // enter battle
        console.log('enter house 1')
        break
      }
    }

    for(let i=0; i<house2Zones.length; i++) {
      const house2Zone = house2Zones[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: house2Zone
        }))
      {
        // enter battle
        console.log('enter house 2')
        break
      }
    }

    for(let i=0; i<house3Zones.length; i++) {
      const house3Zone = house3Zones[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: house3Zone
        }))
      {
        // enter battle
        console.log('enter house 3')
        break
      }
    }

    for(let i=0; i<house4Zones.length; i++) {
      const house4Zone = house4Zones[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: house4Zone
        }))
      {
        // enter battle
        console.log('enter house 4')
        break
      }
    }
    */
  }

  if (keys.w.pressed && lastKey === 'w') {
    player.moving=true
    player.image = player.sprites.up
    for(let i=0; i<boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
    movables.forEach((movable) => {
      movable.position.y += 3
    })
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving=true
    player.image = player.sprites.down
    for(let i=0; i<boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
      rectangularCollision({
        rect1: player,
        rect2: {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - 3
          }
        }
      })
    ) {
      console.log('collision')
      moving = false
      break
    }
  }
  if (moving)
    movables.forEach((movable) => {
      movable.position.y -= 3
    })
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving=true
    player.image = player.sprites.left
    for(let i=0; i<boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
      rectangularCollision({
        rect1: player,
        rect2: {
          ...boundary,
          position: {
            x: boundary.position.x + 3,
            y: boundary.position.y
          }
        }
      })
    ) {
      console.log('collision')
      moving = false
      break
    }
  }
  if (moving)
    movables.forEach((movable) => {
      movable.position.x += 3
    })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving=true
    player.image = player.sprites.right
    for(let i=0; i<boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
      rectangularCollision({
        rect1: player,
        rect2: {
          ...boundary,
          position: {
            x: boundary.position.x - 3,
            y: boundary.position.y 
          }
        }
      })
    ) {
      console.log('collision')
      moving = false
      break
    }
  }
  if (moving)
    movables.forEach((movable) => {
      movable.position.x -= 3
    })
  }
}

const battleBackgroundImage = new Image();
battleBackgroundImage.src='./images/GrassyField.webp'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  }, 
  image: battleBackgroundImage,
})

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
}

let lastKey = ''

window.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
    break;
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break;
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
    break;
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
    break;

  }
})

window.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'w':
      keys.w.pressed = false
    break;
    case 's':
      keys.s.pressed = false
    break;
    case 'a':
      keys.a.pressed = false
    break;
    case 'd':
      keys.d.pressed = false
    break;

  }
})

// touch buttons
upButton.addEventListener('touchstart', () => {
  keys.w.pressed = true;
  lastKey = 'w';
});

upButton.addEventListener('touchend', () => {
  keys.w.pressed = false;
});

downButton.addEventListener('touchstart', () => {
  keys.s.pressed = true;
  lastKey = 's';
});

downButton.addEventListener('touchend', () => {
  keys.s.pressed = false;
});

leftButton.addEventListener('touchstart', () => {
  keys.a.pressed = true;
  lastKey = 'a';
});

leftButton.addEventListener('touchend', () => {
  keys.a.pressed = false;
});

rightButton.addEventListener('touchstart', () => {
  keys.d.pressed = true;
  lastKey = 'd';
});

rightButton.addEventListener('touchend', () => {
  keys.d.pressed = false;
});

animate();
/*
    case 'arrowUp':

    break;
    case 'arrowDown':

    break;
    case 'arrowLeft':

    break;
    case 'arrowRight':

    break;
*/