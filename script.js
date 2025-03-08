const larguraJogo = window.innerWidth;
const alturaJogo = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,
    scale: { 
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cavaleiro;
var golem;
var bat1;
var bat2;
var bat3;
var bat4;
var objInter;
var moveCam = false; 
var bg1;
var bg2;
var bg3;
var bg4;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('bg_1', 'assets/background/background_1a.png');
    this.load.image('bg_2', 'assets/background/background_2a.png');
    this.load.image('bg_3', 'assets/background/background_3a.png');
    this.load.image('bg_4', 'assets/background/background_4a.png');
    
    this.load.image('door', 'assets/background/door.png')

    this.load.spritesheet('knightW', 'assets/WALK.png', { frameWidth: 38, frameHeight: 36 });
    this.load.spritesheet('knightJ', 'assets/JUMP.png', { frameWidth: 35, frameHeight: 44 });
    this.load.spritesheet('knightI', 'assets/IDLE.png', { frameWidth: 34, frameHeight: 37 });
    this.load.spritesheet('knightD', 'assets/DEATH.png', { frameWidth: 39, frameHeight: 36 });
    this.load.spritesheet('knightH', 'assets/HURT.png', { frameWidth: 34, frameHeight: 38 });
    this.load.spritesheet('knightA', 'assets/ATTACK.png', { frameWidth: 53.5, frameHeight: 37 });

    this.load.spritesheet('morcegoF', 'assets/inimigos/batFly.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('morcegoA', 'assets/inimigos/batAttack.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('morcegoD', 'assets/inimigos/batDie.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('morcegoH', 'assets/inimigos/batHurt.png', { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('rockI', 'assets/inimigos/golemIdle.png', { frameWidth: 90, frameHeight: 64 });
    this.load.spritesheet('rockA', 'assets/inimigos/golemAttack.png', { frameWidth: 90, frameHeight: 64 });
    this.load.spritesheet('rockD', 'assets/inimigos/golemDie.png', { frameWidth: 90, frameHeight: 64 });
    this.load.spritesheet('rockH', 'assets/inimigos/golemHurt.png', { frameWidth: 90, frameHeight: 64 });
    this.load.spritesheet('rockW', 'assets/inimigos/golemWalk.png', { frameWidth: 90, frameHeight: 64 });

    this.load.image('tiles', 'assets/background/assets_build.png');
    this.load.tilemapTiledJSON('map', 'assets/background/plataforma.json');
}

function create() {
    bg1 = this.add.tileSprite(2400, alturaJogo/2, 4800, 480, 'bg_1');
    bg2 = this.add.tileSprite(2400, alturaJogo/2, 4800, 480, 'bg_2');
    bg3 = this.add.tileSprite(2400, alturaJogo/2, 4800, 480, 'bg_3');
    bg4 = this.add.tileSprite(2400, alturaJogo/2, 4800, 480, 'bg_4');

    const map = this.make.tilemap({ key : 'map'});
    const tileset = map.addTilesetImage('mainlev_build', 'tiles');

    const back = map.createLayer('Camada de Blocos 2', tileset, 0, alturaJogo/8);
    const ground = map.createLayer('Camada de Blocos 1', tileset, 0, alturaJogo/8); 
    ground.setCollisionByProperty({ colisao: true });

    objInter = this.physics.add.sprite(4615, 440, 'door');
    objInter.setImmovable(true);
    this.physics.add.collider(objInter, ground);

    cavaleiro = this.physics.add.sprite(770, 350, 'knightI');
    this.physics.add.collider(cavaleiro, ground);

    this.anims.create({
        key: 'walkK',
        frames: this.anims.generateFrameNumbers('knightW', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpK',
        frames: this.anims.generateFrameNumbers('knightJ', { start: 0, end: 4 }),
        frameRate: 6.5,
        repeat: 0
    });

    this.anims.create({
        key: 'idleK',
        frames: this.anims.generateFrameNumbers('knightI', { start: 0, end: 6 }),
        frameRate: 6.5,
        repeat: -1
    });

    this.anims.create({
        key: 'hurtK',
        frames: this.anims.generateFrameNumbers('knightH', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'deathK',
        frames: this.anims.generateFrameNumbers('knightD', { start: 0, end: 11 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'attackK',
        frames: this.anims.generateFrameNumbers('knightA', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: 0
    });

    bat1 = this.physics.add.sprite(3600, 400, 'morcegoF');
    this.physics.add.collider(bat1, ground);

    bat2 = this.physics.add.sprite(1800, 100, 'morcegoF');
    this.physics.add.collider(bat2, ground);

    bat3 = this.physics.add.sprite(3000, 200, 'morcegoF');
    this.physics.add.collider(bat3, ground);

    bat4 = this.physics.add.sprite(500, 440, 'morcegoF');
    this.physics.add.collider(bat4, ground);

    this.anims.create({
        key: 'flyB',
        frames: this.anims.generateFrameNumbers('morcegoF', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attackB',
        frames: this.anims.generateFrameNumbers('morcegoA', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'dieB',
        frames: this.anims.generateFrameNumbers('morcegoD', { start: 0, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'hurtB',
        frames: this.anims.generateFrameNumbers('morcegoH', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    bat1.play('flyB');
    bat2.play('flyB');
    bat3.play('flyB');
    bat4.play('flyB');

    golem = this.physics.add.sprite(3700, 200, 'rockI');
    this.physics.add.collider(golem, ground);

    this.anims.create({
        key: 'idleG',
        frames: this.anims.generateFrameNumbers('rockI', { start: 0, end: 7 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'attackG',
        frames: this.anims.generateFrameNumbers('rockA', { start: 0, end: 10 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'dieG',
        frames: this.anims.generateFrameNumbers('rockD', { start: 0, end: 12 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'hurtG',
        frames: this.anims.generateFrameNumbers('rockH', { start: 0, end: 3 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'walkG',
        frames: this.anims.generateFrameNumbers('rockW', { start: 0, end: 9 }),
        frameRate: 7,
        repeat: -1
    });

    golem.play('idleG')

    this.physics.world.setBounds(0, 80, 4800, 480);  

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 4800, 600);  
    this.cameras.main.startFollow(cavaleiro, true);
    this.cameras.main.setDeadzone(0, 150); 
}

let isAttacking = false;

function update() {
    if (isAttacking) return; 

    // Movimento do cavaleiro
    if (this.keyA.isDown) {
        cavaleiro.setVelocityX(-150);
        cavaleiro.setFlipX(true);
        if (cavaleiro.body.blocked.down) {
            cavaleiro.anims.play('walkK', true);
        }
    } else if (this.keyD.isDown) {
        cavaleiro.setVelocityX(150);
        cavaleiro.setFlipX(false);
        if (cavaleiro.body.blocked.down) {
            cavaleiro.anims.play('walkK', true);
        }
    } else {
        cavaleiro.setVelocityX(0);
        if (cavaleiro.body.blocked.down) {
            cavaleiro.anims.play('idleK', true);
        }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keySPACE) && cavaleiro.body.blocked.down) {
        cavaleiro.setVelocityY(-370);
        cavaleiro.anims.play('jumpK', true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
        isAttacking = true;
        cavaleiro.anims.play('attackK', true);
        cavaleiro.setVelocityX(0);
        cavaleiro.once('animationcomplete', () => {
            isAttacking = false;
        });
    }

    perseguirInimigo(bat1, 200, 100);
    perseguirInimigo(bat2, 200, 100);
    perseguirInimigo(bat3, 200, 100);
    perseguirInimigo(bat4, 200, 100);

    perseguirInimigo(golem, 300, 80);
    
    bg1.tilePositionX = cavaleiro.x * 0.05;
    bg2.tilePositionX = cavaleiro.x * 0.1;
    bg3.tilePositionX = cavaleiro.x * 0.15;
    bg4.tilePositionX = cavaleiro.x * 0.2;
}

function perseguirInimigo(inimigo, alcance, velocidade) {
    let distancia = Phaser.Math.Distance.Between(inimigo.x, inimigo.y, cavaleiro.x, cavaleiro.y);

    if (distancia < alcance) {
        if (cavaleiro.x < inimigo.x) {
            inimigo.setVelocityX(-velocidade);
            golem.setFlipX(true);
            bat1.setFlipX(false);
            bat2.setFlipX(false);
            bat3.setFlipX(false);
            bat4.setFlipX(false);
        } else {
            inimigo.setVelocityX(velocidade);
            golem.setFlipX(false);
            bat1.setFlipX(true);
            bat2.setFlipX(true);
            bat3.setFlipX(true);
            bat4.setFlipX(true);
        }

        if (inimigo.texture.key.includes('morcego')) {
            inimigo.anims.play('flyB', true);
        } else {
            inimigo.anims.play('walkG', true);
        }
    } else {
        inimigo.setVelocityX(0);
        if (inimigo.texture.key.includes('morcego')) {
            inimigo.anims.play('flyB', true);
        } else {
            inimigo.anims.play('idleG', true);
        }
    }

    if (distancia < 60) {
        inimigo.setVelocityX(0);
        if (inimigo.texture.key.includes('morcego')) {
            inimigo.anims.play('attackB', true);
        } else {
            golem.anims.play('attackG', true);
        }
    }
}
