ORBS.setFullScreenGameCss()
var renderer = new ORBS.renderer({renderState: update, antiAliasing: false, bgColor: "#0a001a", fps: 24, width: window.innerWidth, height: window.innerHeight})
var scene = new ORBS.scene()

// I QUIT!!!
var levelsExplored = []
var curLevel = 0
var velocity = 40
// Images
renderer.addToImgCache(new ORBS.Sprite("./img/player-still.png"), "charecter")
renderer.addToImgCache(new ORBS.Sprite("./img/bg.png"), "bg")
renderer.addToImgCache(new ORBS.Sprite("./img/first-gun.png"), "firstGun")
renderer.addToImgCache(new ORBS.Sprite("./img/first-gun-left.png"), "firstGunLeft")
renderer.addToImgCache(new ORBS.Sprite("./img/ship.png"), "ship")
renderer.addToImgCache(new ORBS.Sprite("./img/ship-damaged.png"), "shipDamaged")
renderer.addToImgCache(new ORBS.Sprite("./img/box.png"), "box")
renderer.addToImgCache(new ORBS.Sprite("./img/folliage.png"), "folliage")

var bg = new ORBS.obj({type: sprite, name: "bg"})
bg.vars({x: 1440/2, y: 1080/2, width: 1440, height: 1080, sprite: renderer.imgStore.bg})

function setup(scene) {
	scene.add(bg)
	var script = new ORBS.scriptComponent(function(self,im,ot) {
		if (self.y > ot.screen.height - 45) {
			self.y=ot.screen.height - 44
		}
		if (self.y < 49) {
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
	charecter.vars({x: 900, y: 600, width: 100, height: 100, sprite: renderer.imgStore.charecter, collisionLayer: "boxes", hitbox: {shape: rect, width: 100, height: 80, center: [0,0]}, collideReact: true})
	charecter.attachScript(script)
	scene.add(charecter)

	var gunScript = new ORBS.scriptComponent(function(self,im,ot) {
		self.y = charecter.y+30
		if (renderer.events.mouse.x <= charecter.x) {
			self.sprite = renderer.imgStore.firstGunLeft
			self.x = charecter.x-20
		} else {
			self.sprite = renderer.imgStore.firstGun
			self.x = charecter.x+20
		}
		return self
	})
	var gun = new ORBS.obj({type: sprite, name: "gun"})
	gun.vars({x: 50, y: 50, width: 40, height: 40, sprite: renderer.imgStore.firstGun})
	gun.attachScript(gunScript)
	scene.add(gun)
}
levels = [
	()=>{
		let scene = new ORBS.scene()
		scene.collisionLayerSet("boxes")
		setup(scene)
		var shipDamaged = new ORBS.obj({type: sprite, name: "shipDamaged"})
		shipDamaged.vars({x: 550, y: 600, width: 500, height: 500, sprite: renderer.imgStore.shipDamaged})
		scene.add(shipDamaged)
		var box = new ORBS.obj({type: sprite, name: "box"})
		box.vars({x: 1300, y: 200, width: 100, height: 100, sprite: renderer.imgStore.box, collisionLayer: "boxes", hitbox: {shape: rect, width: 100, height: 100, center: [0,0]}})
		scene.add(box)
		var box2 = new ORBS.obj({type: sprite, name: "box2"})
		box2.vars({x: 1200, y: 350, width: 100, height: 100, sprite: renderer.imgStore.box, collisionLayer: "boxes", hitbox: {shape: rect, width: 100, height: 100, center: [0,0]}})
		scene.add(box2)
		var folliage = new ORBS.obj({type: sprite, name: "folliage"})
		folliage.vars({x: 720, y: 650, width: 75, height: 75, sprite: renderer.imgStore.folliage, collisionLayer: "boxes", hitbox: {shape: rect, width: 100, height: 100, center: [0,0]}})
		scene.add(folliage)
		var folliage2 = new ORBS.obj({type: sprite, name: "folliage2"})
		folliage2.vars({x: 570, y: 685, width: 75, height: 75, sprite: renderer.imgStore.folliage, collisionLayer: "boxes", hitbox: {shape: rect, width: 100, height: 100, center: [0,0]}})
		scene.add(folliage2)
		var folliage3 = new ORBS.obj({type: sprite, name: "folliage3"})
		folliage3.vars({x: 380, y: 600, width: 75, height: 75, sprite: renderer.imgStore.folliage, collisionLayer: "boxes", hitbox: {shape: rect, width: 100, height: 100, center: [0,0]}})
		scene.add(folliage3)
		for (let i=0;i < 3;i++) {
			let foll = new ORBS.obj({type: sprite, name: "folliage"+i+4})
			foll.vars({x: Math.floor(Math.random() * 1340) + 100, y: Math.floor(Math.random() * 980) + 100, width: 75, height: 75, sprite: renderer.imgStore.folliage})
			scene.add(foll)
		}
		if (levelsExplored[0] != true) {
			text('You have crashed landed on <strong>QSBXb25kZXJmdWwgUHVycGxlIFBsYW5ldCAg</strong>, look around to find resources to fix the ship and look for fuel like resource to get back to earth.')
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
		if (levelsExplored[1] != true) {
			text('Looks like there are aliens on this planet;\n\n<span style="color: springgreen;">SCANING SURROUNDING</span>')
			setTimeout(()=>text('<span style="color: springgreen;">SCANING COMPLETE</span>; Hmm, looks like there are some aliens in the area moving my way, and they look quite agrasive acording to the Sonar scans.'), 5000)
			setTimeout(()=>text('Looks like we need to get ready to fight. Use the \'LEFT MOUSE BUTTON\' to shoot in the direction of your mouse; this is a basic self defence gun, acuire materials to upgrade the gun.'), 15000)
		}
		return scene
	}
]

function levelChange(dir) {
	if(dir == up) {
		renderer.setScene(levels[curLevel+1]())
		curScene++
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

console.log(renderer)
console.log(scene)
renderer.setSize(1440, 1080)
window.onresize = () => {
	//renderer.setSize(window.innerWidth, window.innerHeight
	if (window.innerHeight <= 1080) {
		document.body.style.zoom = (window.innerHeight/10)*0.9 + '%'
	} else if (window.innerHeight > 1080) {
		document.body.style.zoom = '100%'
	}
}
renderer.shaderSet((ctx) => {ctx.filter = "brightness(110%)"})
renderer.canvasAttactToDom(document.body, "prepend")

window.onload=()=>{
	renderer.startRenderCycle()
	renderer.setScene(levels[0]())
	curLevel = 0
}

function text(txt) {
	document.getElementById('textbox').innerHTML = txt
	document.getElementById('textbox').className = ''
}

document.body.onclick = ()=>{document.getElementById('textbox').className = 'hide'}

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
//TODO: import charecter, add movement, gun sprite and gun system
/*
Space Gravity:
With mouse center and charecter orbiting it
let v = [renderer.events.mouse.x-e.scene.getObj('charecter').x, renderer.events.mouse.y-e.scene.getObj('charecter').y]
e.scene.getObj('charecter').dx += v[0]/128
e.scene.getObj('charecter').dy += v[1]/128
*/