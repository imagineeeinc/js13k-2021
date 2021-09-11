ORBS.setFullScreenGameCss()
var renderer = new ORBS.renderer({renderState: update, antiAliasing: false, bgColor: "#0a001a", fps: 24, width: window.innerWidth, height: window.innerHeight})
var scene = new ORBS.scene()
var home = null

// I QUIT!!!
var closeBy = false
var lastXPos = 900
var lastYPos = 600
var levelsExplored = []
var curLevel = 0
var velocity = 40
var curCooldown = 100
let brightness = 110
var fortune = 1
var fortuneTable = false
var shipMax = {
	electronics: 25,
	structure: 50,
	fuel: 50
}
var shipHealth = {
	electronics: 0,
	structure: 0,
	fuel: 0
}
var shipFixed = false
var inventory = {
	superCopper: 0,
	shinyAlloy: 0,
	gooyOil: 0
}
// Images
renderer.addToImgCache(new ORBS.Sprite("./img/player-still.png"), "charecter")
renderer.addToImgCache(new ORBS.Sprite("./img/bg.png"), "bg")
renderer.addToImgCache(new ORBS.Sprite("./img/ship.png"), "ship")
renderer.addToImgCache(new ORBS.Sprite("./img/ship-damaged.png"), "shipDamaged")
renderer.addToImgCache(new ORBS.Sprite("./img/box.png"), "box")
renderer.addToImgCache(new ORBS.Sprite("./img/folliage.png"), "folliage")
renderer.addToImgCache(new ORBS.Sprite("./img/shinyAlloy.png"), "shinyAlloy")
renderer.addToImgCache(new ORBS.Sprite("./img/superCopper.png"), "superCopper")
renderer.addToImgCache(new ORBS.Sprite("./img/gooyOil.png"), "gooyOil")

var bg = new ORBS.obj({type: sprite, name: "bg"})
bg.vars({x: 1440/2, y: 1080/2, width: 1440, height: 1080, sprite: renderer.imgStore.bg})

function setup(scene) {
	scene.deleteObj=(e)=>{for (var t = 0; t < scene.vScene.length; t++)if (scene.vScene[t].name == e) scene.vScene.splice(t,1)}
	scene.add(bg)
	var script = new ORBS.scriptComponent(function(self,im,ot) {
		if (self.y > ot.screen.height - 45) {
			if (curLevel != 0) {
				lastXPos = self.x
				lastYPos = 50
				levelChange(down)
				self.y=50
			}
		}
		if (self.y < 49) {
			lastXPos = self.x
			lastYPos = 1080-49
			levelChange(up)
			self.y=50
		}
		if (self.x > ot.screen.width - 31) {
			self.x=ot.screen.width - 30
		}
		if (self.x < 31) {
			self.x=30
		}
		return self
	})
	var charecter = new ORBS.obj({type: sprite, name: "charecter"})
	charecter.vars({x: lastXPos, y: lastYPos, width: 100, height: 100, sprite: renderer.imgStore.charecter})
	charecter.attachScript(script)
	scene.add(charecter)
}
levels = [
	()=>{
		let scene = new ORBS.scene()
		scene.collisionLayerSet("boxes")
		setup(scene)
		var shipScript = new ORBS.scriptComponent((self)=>{
			if (self.repaired != true) {
				if (scene.getObj('charecter').x < self.x+300 && scene.getObj('charecter').x > self.x-300 && scene.getObj('charecter').y < self.y+300 && scene.getObj('charecter').y > self.y-300) {
					closeByFn()
				} else {
					if (closeBy == self.name) {
						info.close()
						closeBy = false
					}
				}
			}
			if (self.toEarth == true) {
				if (self.y < -50) {
					setInterval(()=>brightness-=2, 500)
				} else {
					self.dy *= 1.1
				}
			}
			function closeByFn(){
				if (closeBy == false || closeBy == self.name) {
					if (shipFixed == false) {
						info.show('< SPACE > TO Fix the Ship')
					} else {
						info.show('< SPACE > TO Take of back to earth!')
					}
					closeBy = self.name
					if (renderer.keyMap[' '] == true) {
						if (shipFixed == false) {
							shipHealth.electronics += inventory.superCopper
							shipHealth.fuel += inventory.gooyOil
							shipHealth.structure += inventory.shinyAlloy
							inventory = {
								superCopper: 0,
								shinyAlloy: 0,
								gooyOil: 0
							}
							info.close()
							closeBy = false
							text(`Ship Structure: ${shipHealth.structure}/${shipMax.structure} <br>Ship Electronics: ${shipHealth.electronics}/${shipMax.electronics}<br>Ship Fuel: ${shipHealth.fuel}/${shipMax.fuel}`)
							if (shipHealth.electronics >= shipMax.electronics && shipHealth.structure >= shipMax.structure && shipHealth.fuel >= shipMax.fuel) {
								self.sprite = renderer.imgStore.ship
								scene.deleteObj('folliage');scene.deleteObj('folliage2');scene.deleteObj('folliage3')
								shipFixed = true
							}
						} else {
							scene.deleteObj('charecter')
							self.repaired = true
							info.close()
							setTimeout(()=>{self.toEarth = true;self.dy = -1}, 1000)
						}
					}
				}
			}
			return self
		})
		var shipDamaged = new ORBS.obj({type: sprite, name: "shipDamaged"})
		shipDamaged.vars({x: 550, y: 600, width: 500, height: 500, sprite: renderer.imgStore.shipDamaged})
		shipDamaged.attachScript(shipScript)
		scene.add(shipDamaged)
		var box = new ORBS.obj({type: sprite, name: "box"})
		box.vars({x: 1300, y: 200, width: 100, height: 100, sprite: renderer.imgStore.box})
		scene.add(box)
		let fortuneScript = new ORBS.scriptComponent((self)=>{
			if (scene.getObj('charecter').x < self.x+100 && scene.getObj('charecter').x > self.x-100 && scene.getObj('charecter').y < self.y+100 && scene.getObj('charecter').y > self.y-100) {
				closeByFn()
			} else {
				if (closeBy == self.name) {
					info.close()
					closeBy = false
				}
			}
			function closeByFn(){
				if (closeBy == false || closeBy == self.name) {
					info.show('< SPACE > TO upgrade mining tool')
					closeBy = self.name
					if (renderer.keyMap[' '] == true) {
						if (fortuneTable == false) {
							text('upgrade your tool to extract more materials from mining upgrade your tool here using shiny Alloy')
							fortuneTable = true
						} else {
							if (inventory.shinyAlloy >= fortune*2) {
								inventory.shinyAlloy -= fortune*2
								fortune += 1
								text(`upgraded your tool to mine ${fortune} of materials from each ore.`)
							} else {
								text(`you don't have enough shiny Alloy`)
							}
						}
					}
				}
			}
		})
		var box2 = new ORBS.obj({type: sprite, name: "box2"})
		box2.vars({x: 1200, y: 350, width: 100, height: 100, sprite: renderer.imgStore.box})
		box2.attachScript(fortuneScript)
		scene.add(box2)
		var folliage = new ORBS.obj({type: sprite, name: "folliage"})
		folliage.vars({x: 720, y: 650, width: 75, height: 75, sprite: renderer.imgStore.folliage})
		scene.add(folliage)
		var folliage2 = new ORBS.obj({type: sprite, name: "folliage2"})
		folliage2.vars({x: 570, y: 685, width: 75, height: 75, sprite: renderer.imgStore.folliage})
		scene.add(folliage2)
		var folliage3 = new ORBS.obj({type: sprite, name: "folliage3"})
		folliage3.vars({x: 380, y: 600, width: 75, height: 75, sprite: renderer.imgStore.folliage})
		scene.add(folliage3)
		for (let i=0;i < 3;i++) {
			let foll = new ORBS.obj({type: sprite, name: "folliage"+i+4})
			foll.vars({x: Math.floor(Math.random() * 1340) + 100, y: Math.floor(Math.random() * 980) + 100, width: 75, height: 75, sprite: renderer.imgStore.folliage})
			scene.add(foll)
		}
		if (levelsExplored[0] != true) {
			text('You have crashed landed on <strong style="color: aqua;">QSBXb25kZXJmdWwgUHVycGxlIFBsYW5ldCAg</strong>, look around to find for a way back to earth.')
			levelsExplored[0] = true
		}
		return scene
	},
	()=>{
		let scene = new ORBS.scene()
		scene.collisionLayerSet("boxes")
		setup(scene)
		for (let i=0;i < 3;i++) {
			let foll = new ORBS.obj({type: sprite, name: "folliage"+i})
			foll.vars({x: Math.floor(Math.random() * 1340) + 100, y: Math.floor(Math.random() * 980) + 100, width: 75, height: 75, sprite: renderer.imgStore.folliage})
			scene.add(foll)
		}
		for (let i=0;i < 3;i++) {
			let foll = new ORBS.obj({type: sprite, name: "folliage"+i})
			foll.vars({x: Math.floor(Math.random() * 1340) + 100, y: Math.floor(Math.random() * 980) + 100, width: 75, height: 75, sprite: renderer.imgStore.folliage})
			scene.add(foll)
		}
		if (levelsExplored[1] != true) {
			text('Looks like there are resources on this planet;<br><br><span style="color: springgreen;">SCANING SURROUNDING</span>')
			setTimeout(()=>text('<span style="color: springgreen;">SCANING COMPLETE</span>; Hmm, there seems to be a large amount of resources falling towards the planet from outer space. <br><br><span style="font-weight: 900;">Objective: find resources to fix your ship and look for fuel sources</span>.'), 5000)
			levelsExplored[1]=true
		}
		return scene
	}
]

function levelChange(dir) {
	if (dir == up) {
		if (curLevel >= 1) {
			scene = levels[1]()
			renderer.setScene(scene)
			curLevel++
		} else {
			scene = levels[1]()
			renderer.setScene(scene)
			curLevel++
		}
	} else if (dir == down) {
		if (curLevel == 1) {
			scene = home
			renderer.scene = scene
			curLevel--
		} else if (curLevel >= 1) {
			scene = levels[1]()
			renderer.setScene(scene)
			curLevel--
		}
	}
}

renderer.on('keyboardEvent', (e)=>{
  if(e.keyMap.ArrowLeft == true || e.keyMap.a == true) {
		e.scene.getObj('charecter').x-=velocity*e.delta
	}
	if(e.keyMap.ArrowUp == true || e.keyMap.w == true) {
		e.scene.getObj('charecter').y-=velocity*e.delta
	}
	if(e.keyMap.ArrowRight == true || e.keyMap.d == true) {
		e.scene.getObj('charecter').x+=velocity*e.delta
	}
	if(e.keyMap.ArrowDown == true || e.keyMap.s == true) {
		e.scene.getObj('charecter').y+=velocity*e.delta
	}
})
const ran = ()=>Math.round(Math.floor(9999*Math.random())+1e3)

renderer.setSize(1440, 1080)
window.onresize = () => {
	//renderer.setSize(window.innerWidth, window.innerHeight
	if (window.innerHeight <= 1080) {
		document.body.style.zoom = 50 + '%'
	} else if (window.innerHeight > 1080) {
		document.body.style.zoom = '100%'
	}
}
renderer.shaderSet((ctx) => {ctx.filter = `brightness(${brightness}%)`})
renderer.canvasAttactToDom(document.body, "prepend")

window.onload=()=>{
	text(`<h1>Where In Space?</h1><h5>by Imagineee</h5><h4>When you are stuck in space on a bizarre planet</h4><a href='javascript:startGame()'>Start Game</a>`)
}
function startGame(){
	document.body.onclick = ()=>{document.getElementById('textbox').className = 'hide'}
	//setInterval(()=>{try{if (renderer.keyMap[' '] == true) {document.getElementById('textbox').className = 'hide'}}catch(e){}}, 50)
	setInterval (()=>{
		document.getElementById('inventory').innerHTML = "<b>inventory</b>: <br>"+JSON.stringify(inventory).replaceAll('"', '').replaceAll(',', '<br>').replace('{', '').replace('}', '')+"<br><br><b>Parts of the <br>Ship Fixed</b>: <br>"+JSON.stringify(shipHealth).replaceAll('"', '').replaceAll(',', '<br>').replace('{', '').replace('}', '')
		if (brightness < -100) {
		try{
			document.getElementById(renderer.canvasId).style.opacity = 0
			renderer.renderState = still
			scene.vScene = []
			text('You got back to Earth safely! Congratulations on surviving on <strong style="color: aqua;">QSBXb25kZXJmdWwgUHVycGxlIFBsYW5ldCAg</strong>!<br><br>Thanks for playing the game by <a href="https://imagineeeinc.github.io/">Imagineee</a> for the JS13k Game Jam, made with JS and my personal game engine <a href="https://imagineeeinc.github.io/orbs-js/">Orbs JS</a>, art and music (if I added any) by me, Made with ♥ and rush. (I had to make it in 1.5 weeks because I didn\'t do any thing in the first 3 weeks)')
		}catch(e){}
	}}, 500)

	renderer.startRenderCycle()
	scene = levels[0]()
	renderer.setScene(scene)
	curLevel = 0
	home = scene
}

renderer.on('beforeRender', ()=>{
	let i = ran()
	if (scene.vScene.length < 15 && curLevel != 0) {
		if (Math.round(Math.floor(1000*Math.random())+0) < 20) {
			let r = Math.round(Math.floor(5*Math.random())+0)
			if (r >= 4) {
				r = 'shinyAlloy'
			} else if (r == 3) {
				r = 'superCopper'
			} else if (r <= 2) {
				r = 'gooyOil'
			}
			let ore = new ORBS.obj({type: sprite, name: r+i})
			ore.vars({x: Math.floor(Math.random() * 1340) + 100, y: Math.floor(Math.random() * 980) + 100, width: 75, height: 75, sprite: renderer.imgStore[r]})
			let oreScript = new ORBS.scriptComponent((self)=>{
				if (scene.getObj('charecter').x < self.x+100 && scene.getObj('charecter').x > self.x-100 && scene.getObj('charecter').y < self.y+100 && scene.getObj('charecter').y > self.y-100) {
					closeByFn()
				} else {
					if (closeBy == self.name) {
						info.close()
						closeBy = false
					}
				}
				function closeByFn(){
					if (closeBy == false || closeBy == self.name) {
						info.show('< SPACE > TO mine '+r)
						closeBy = self.name
						if (renderer.keyMap[' '] == true) {
							inventory[r]+=1*fortune
							scene.deleteObj(closeBy)
							info.close()
							closeBy = false
							info.show(`Collected 1 ${r}.`)
						}
					}
				}
				return self
			})
			ore.attachScript(oreScript)
			scene.add(ore)
		}
	}
})

function text(txt) {
	document.getElementById('textbox').innerHTML = txt
	document.getElementById('textbox').className = ''
}
const info = {
	show: (txt)=>{
		document.getElementById('info').innerHTML = txt
		document.getElementById('info').className = ''
	},
	close: ()=>document.getElementById('info').className = 'hide'
}

//renderer.shaderSet((ctx) => console.log(ctx.imageSmoothingEnabled))
/*
var image = new ORBS.obj({type: sprite, name: "img"})
image.vars({x: window.innerWidth/2, y: 100, width: 189, height: 189, sprite: renderer.imgStore.pickquick, dx: 0.01})
scene.add(image)

var txt = new ORBS.obj({type: text, drawType: plainText, name: "theTxt",
vars: {x: 30, y: 35, txt: "Orbs JS Test Suite", font: "35px Verdana", color: "orange", scale: 1}
})
scene.add(txt)
*/
/*
Space Gravity:
With mouse center and charecter orbiting it
let v = [renderer.events.mouse.x-e.scene.getObj('charecter').x, renderer.events.mouse.y-e.scene.getObj('charecter').y]
e.scene.getObj('charecter').dx += v[0]/128
e.scene.getObj('charecter').dy += v[1]/128
*/