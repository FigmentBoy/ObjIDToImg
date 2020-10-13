const express = require('express')
const app = express()
const port = 3000
const { createCanvas, Image } = require('canvas')

const fs = require('fs');

const objects = JSON.parse(fs.readFileSync('config/objects.json'));
const sprites = JSON.parse(fs.readFileSync('config/sprites.json'));

const spritesheets = [null, new Image(), new Image('./spritesheets/spritesheet2.png'), new Image('./spritesheets/spritesheet3.png')]
spritesheets[1].src = 'spritesheets/spritesheet1.png'
spritesheets[2].src = 'spritesheets/spritesheet2.png'
spritesheets[3].src = 'spritesheets/spritesheet3.png'

app.get('/image/:obj/:rot/out.png', (req, res) => {
    try {
        
        let objID = req.params.obj;
        let spriteInfo = sprites[objects[objID]];

        let rot = parseInt(req.params.rot);
        let canvas = createCanvas(spriteInfo.width, spriteInfo.height);
        let ctx = canvas.getContext('2d');


        ctx.translate(spriteInfo.width/2, spriteInfo.height/2)
        ctx.rotate(rot* Math.PI / 180)
        ctx.rotate(spriteInfo.rotation * Math.PI /180)
        
        
        
        if (spriteInfo.rotation != 0) {
            ctx.drawImage(spritesheets[spriteInfo.spritesheet], spriteInfo.x, spriteInfo.y, spriteInfo.height, spriteInfo.width, -spriteInfo.height/2, -spriteInfo.width/2, spriteInfo.height, spriteInfo.width)    
        } else {
            ctx.drawImage(spritesheets[spriteInfo.spritesheet], spriteInfo.x, spriteInfo.y, spriteInfo.width, spriteInfo.height, -spriteInfo.width/2, -spriteInfo.height/2, spriteInfo.width, spriteInfo.height)
        }
        
        return canvas.createPNGStream().pipe(res);
    } catch (er) {
        console.log('Error: ' + er)
        return res.sendFile(__dirname + '\\e.jpg');
    }
    
})

app.listen(port, () => {
    console.log(`Images loaded at ${port}`)
})