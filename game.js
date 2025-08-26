const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222244', // azul oscuro
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // sin gravedad
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let stars;
let score = 0;
let scoreText;
let pointer; // cursor del mouse

const game = new Phaser.Game(config);

function preload () {
    this.load.image('star', 'https://labs.phaser.io/assets/demoscene/star.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create () {
    // Jugador
    player = this.physics.add.image(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Estrellas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 10,
        setXY: { x: 50, y: 50, stepX: 70, stepY: 40 }
    });

    stars.children.iterate(function (child) {
        child.setBounce(Phaser.Math.FloatBetween(0.2, 0.6));
        child.setCollideWorldBounds(true);
    });

    // Recoleccion
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Texto de puntaje
    scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '32px', fill: '#fff' });

    // Activar puntero
    pointer = this.input.activePointer;
}

function update () {
    // El jugador sigue al puntero
    this.physics.moveTo(player, pointer.x, pointer.y, 240);

    // Si esta cerca del puntero, se detiene
    if (Phaser.Math.Distance.Between(player.x, player.y, pointer.x, pointer.y) < 4) {
        player.body.setVelocity(0);
    }
}

// Recolectar estrella
function collectStar (player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Puntos: ' + score);
}
