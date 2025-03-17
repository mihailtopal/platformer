import Phaser from "phaser";
import { characterAnimation } from "../persons/animations.ts";
import { Player } from "../persons/player.ts";
import { Bat } from "../persons/enemy_bat.ts";

export class Lvl_1 extends Phaser.Scene {
  platforms: any;
  player: Player | undefined;
  enemies: Phaser.Physics.Arcade.Group | undefined;
  playerGroup: Phaser.Physics.Arcade.Group | undefined;
  layer_1: Phaser.GameObjects.TileSprite | undefined;
  layer_2: Phaser.GameObjects.TileSprite | undefined;
  layer_3: Phaser.GameObjects.TileSprite | undefined;
  layer_4: Phaser.GameObjects.TileSprite | undefined;
  layer_5: Phaser.GameObjects.TileSprite | undefined;
  constructor() {
    super();
  }

  preload() {
    this.load.atlas(
      "player",
      "src/assets/character.png",
      "src/assets/character.json",
    );
    this.load.image("layer_1", "src/assets/background_layer_1.png");
    this.load.image("layer_2", "src/assets/background_layer_2.png");
    this.load.image("layer_3", "src/assets/background_layer_3.png");
    this.load.image("layer_4", "src/assets/background_layer_4.png");
    this.load.image("layer_5", "src/assets/background_layer_5.png");
    this.load.spritesheet("bat", "src/assets/enemyBat.png", {
      frameWidth: 94,
      frameHeight: 93,
    });
    this.load.spritesheet("poof", "src/assets/poof.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.image("platform", "src/assets/platform.png");
  }

  create() {
    const { width, height } = this.scale;
    this.layer_1 = this.add
      .tileSprite(0, 0, width, height, "layer_1")
      .setOrigin(0, 0)
      .setScrollFactor(0);
    this.layer_2 = this.add
      .tileSprite(0, 0, width, height, "layer_2")
      .setOrigin(0, 0)
      .setScrollFactor(0);
    this.layer_3 = this.add
      .tileSprite(0, 0, width, height, "layer_3")
      .setOrigin(0, 0)
      .setScrollFactor(0);
    this.layer_4 = this.add
      .tileSprite(0, 0, width, height, "layer_4")
      .setOrigin(0, 0)
      .setScrollFactor(0);
    this.layer_5 = this.add
      .tileSprite(0, 0, width, height, "layer_5")
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(1000, 675, "platform")
      .setSize(2000, 50)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(2000, 50);

    this.platforms
      .create(300, 545, "platform")
      .setSize(150, 30)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(150, 30);
    this.platforms
      .create(400, 500, "platform")
      .setSize(150, 30)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(150, 30);
    this.platforms
      .create(500, 450, "platform")
      .setSize(150, 30)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(150, 30);
    this.platforms
      .create(600, 400, "platform")
      .setSize(150, 30)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(150, 30);
    this.platforms
      .create(750, 300, "platform")
      .setSize(150, 30)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(150, 30);
    this.physics.add.existing(this.platforms, true);
    this.enemies = this.physics.add.group();
    this.playerGroup = this.physics.add.group();
    for (let i = 1; i < 3; i++) {
      const enemy = new Bat(this, i * 220, 575, "bat", this.playerGroup);
      this.enemies.add(enemy);
      this.add.existing(enemy); // Добавляем мышь на сцену
      enemy.setGravityY(-700);
    }

    this.player = new Player(this, 100, 150, "player", this.enemies);
    this.add.existing(this.player); // Добавляем персонаж на сцену

    this.player.setCollideWorldBounds(true);
    this.player.body!.setMass(0.5);
    this.playerGroup.add(this.player);
    this.player.setCollideWorldBounds(true);
    characterAnimation.forEach((anim) => {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNames("player", {
          prefix: anim.prefix,
          end: anim.end,
          zeroPad: 3,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    });

    this.cameras.main.startFollow(this.player, true, 1, 0, 0, -200); // Прикрепляем камеру к персонажу, следим только по оси X

    // Устанавливаем "мертвую зону" (центр, в пределах которого камера не будет двигаться)
    const deadzoneWidth = 200; // Ширина мертвой зоны по X
    const deadzoneHeight = this.cameras.main.height; // Полная высота камеры, чтобы зафиксировать Y

    this.cameras.main.setDeadzone(deadzoneWidth, deadzoneHeight);
    this.cameras.main.setBounds(0, 0, 2400, 700);
    this.physics.world.setBounds(0, 0, 2400, 700);
    // Ограничиваем движение камеры только по X
    this.cameras.main.setLerp(1, 0); // Оставляем только горизонтальную плавность следования

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
  }
  update() {
    this.layer_1!.tilePositionX = this.cameras.main.scrollX * 0.2;
    this.layer_2!.tilePositionX = this.cameras.main.scrollX * 0.4;
    this.layer_3!.tilePositionX = this.cameras.main.scrollX * 0.6;
    this.layer_4!.tilePositionX = this.cameras.main.scrollX * 0.8;
    this.layer_5!.tilePositionX = this.cameras.main.scrollX;
    this.player!.update();
    // Обновляем всех врагов в группе
    // @ts-ignore
    this.enemies?.children.iterate((enemy: Enemy) => {
      if (enemy && enemy.update) {
        enemy.update();
        // if (enemy.health <= 0) enemy.destroy();
      }
    });
    if (this.player!.body!.bottom > 698) this.player?.setPosition(100, 150);
    if (!this.player?.body?.touching.down) this.checkDistanceToGround();
    if (this.player!.isSit) this.checkDistanceToCeiling();
  }
  // Расчет расстояния до земли
  checkDistanceToGround() {
    // Получаем ближайший объект под персонажем
    const playerBottomY = this.player!.body!.bottom; // Нижняя граница персонажа
    const playerRightY = this.player!.body!.right; // Правая граница персонажа
    const playerLeftY = this.player!.body!.left; // Левая граница персонажа

    let closestDistance = 1000000;

    // Проходим через все платформы
    this.platforms.children.iterate((platform: any) => {
      const platformTopY = platform.body.top; // Верхняя граница платформы
      const platformRightY = platform.body.right; // Правая граница платформы
      const platformLeftY = platform.body.left; // Левая граница платформы

      if (
        platformTopY > playerBottomY &&
        platformRightY > playerLeftY &&
        platformLeftY < playerRightY
      ) {
        // Только платформы, которые ниже персонажа
        const distance = platformTopY - playerBottomY; // Расстояние до платформы

        if (distance < closestDistance) {
          closestDistance = distance;
        }
      }
    });
    this.player!.distanceToTheGround = closestDistance;
  }
  // Расчет расстояния до потолка
  checkDistanceToCeiling() {
    // Получаем ближайший объект над персонажем
    const playerRightY = this.player!.body!.right; // Правая граница персонажа
    const playerLeftY = this.player!.body!.left; // Левая граница персонажа
    let playerTopY = this.player!.body!.top; // Верхняя граница персонажа

    let closestDistance = 100000;

    // Проходим через все платформы
    this.platforms.children.iterate((platform: any) => {
      const platformRightY = platform.body.right; // Правая граница платформы
      const platformLeftY = platform.body.left; // Левая граница платформы
      const platformBottomY = platform.body.bottom; // Нижняя граница платформы

      if (
        platformBottomY < playerTopY &&
        platformRightY > playerLeftY &&
        platformLeftY < playerRightY
      ) {
        // Только платформы, которые выше персонажа
        const distance = playerTopY - platformBottomY; // Расстояние до платформы

        if (distance < closestDistance) {
          closestDistance = distance;
        }
      }
    });
    this.player!.distanceToTheCeiling = closestDistance;
  }
}
