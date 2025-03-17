import Phaser from "phaser";

export class Creature extends Phaser.Physics.Arcade.Sprite {
  health: number;
  isCanTakeDamage: boolean;
  isAnimated: boolean;
  attackHitBox: Phaser.Physics.Arcade.Sprite;
  attackDamage: number;
  isTurnRight: boolean;
  isCanAttack: boolean;
  isWalk: boolean;
  distanceToTheGround: number;
  distanceToTheCeiling: number;
  attackHitBoxOverlapEnemy?: Phaser.Physics.Arcade.Collider;
  enemies: Phaser.Physics.Arcade.Group | undefined;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    enemies?: Phaser.Physics.Arcade.Group | undefined,
  ) {
    super(scene, x, y, key);
    this.enemies = enemies;
    this.scene = scene;
    this.isCanTakeDamage = true;
    this.health = 100;
    this.attackDamage = 10;
    this.isAnimated = false;
    this.isTurnRight = false;
    this.isCanAttack = true;
    this.isWalk = false;
    this.distanceToTheGround = 0;
    this.distanceToTheCeiling = 0;

    // Слушаем начало атаки
    this.on("animationstart", (animation: Phaser.Animations.Animation) => {
      if (animation.key.includes("attack") || animation.key.includes("bash")) {
        this.enemies?.children.iterate((enemy: Creature) => {
          enemy.isCanTakeDamage = true;
        });
        console.log("Начало атаки");
      }
    });
    // Добавляем зону атаки (hitbox) перед игроком
    this.attackHitBox = this.scene.physics.add
      .sprite(x, y, key)
      .setVisible(true) // Отключаем видимость зоны
      .setSize(this.width, this.height); // Настраиваем размеры hitbox
    // Добавляем столкновение зоны атаки с врагами
    if (this.enemies !== undefined) {
      this.attackHitBoxOverlapEnemy = scene.physics.add.overlap(
        this.attackHitBox,
        this.enemies,
        this.hitEnemy,
        undefined,
        this,
      );
      this.attackHitBoxOverlapEnemy.active = false;
    }
    this.attackHitBox.setGravityY(-700);
    this.attackHitBox.setVisible(false);
    // Добавление спрайта в сцену

    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  update() {
    if (this.isAnimated) return; // Если персонаж занят анимацией, выход из функции
    this.attackHitBoxUpdate();
  }
  attackHitBoxUpdate() {
    const offsetX = this.isTurnRight
      ? this.body!.width / 2
      : -this.body!.width / 2;
    this.attackHitBox.setPosition(this.x + offsetX, this.y);
  }
  hitEnemy(hitBox: Body, enemy: Creature) {
    enemy.takeDamage(this.attackDamage); // Метод нанесения урона
  }
  activateAttackHitBox() {
    if (this.attackHitBoxOverlapEnemy)
      this.attackHitBoxOverlapEnemy.active = true;
  }

  deactivateAttackHitBox() {
    if (this.attackHitBoxOverlapEnemy)
      this.attackHitBoxOverlapEnemy.active = false;
  }
  handleAttack() {
    this.activateAttackHitBox();
    setTimeout(() => this.deactivateAttackHitBox(), 200);
  }
  takeDamage(damage: number) {
    if (this.health <= 1) {
      this.isCanTakeDamage = false;
    }
    if (this.isCanTakeDamage) {
      this.health -= damage;

      // Устанавливаем красный цвет при получении урона
      this.scene.time.delayedCall(200, () => {
        this.setTint(0xff0000);
        // Легкий поворот
        this.setAngle(15); // Поворачиваем на 15 градусов
      });

      // Через 200 мс сбрасываем цвет
      this.scene.time.delayedCall(400, () => {
        this.clearTint();
        // Легкий поворот
        this.setAngle(0); // Поворачиваем на -15 градусов обратно
        if (this.health <= 1) {
          this.play("poof", true); // Анимация изсчезновения
          this.isAnimated = true;
          this.setScale(1);
          this.once(`animationcomplete-poof`, () => {
            this.destroy();
            this.attackHitBox.destroy();
          });
        }
      });
    }

    this.isCanTakeDamage = false;
  }
}
export class Bat extends Creature {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    enemies?: Phaser.Physics.Arcade.Group | undefined,
  ) {
    super(scene, x, y, key, enemies);
    this.health = 200;
    this.setScale(0.7);
    this.body!.setSize(50, 50);
    this.attackHitBox.setSize(35, 35);

    this.anims.create({
      key: "bat",
      frames: this.anims.generateFrameNumbers("bat", { start: 0, end: 3 }),
      frameRate: 5 * Math.random() + 5,
      repeat: -1,
    });
    this.anims.create({
      key: "poof",
      frames: this.anims.generateFrameNumbers("poof", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("bat", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 0,
    });
    this.setGravityY(0);
  }

  update() {
    this.activateAttackHitBox();
    this.attackHitBoxUpdate();
    this.checkDistanceToEnemy();
    this.flipX = !this.isTurnRight; // Меняем направление спрайта
    if (this.isAnimated) return; // Если персонаж занят анимацией, выход из функции
    this.play("bat", true);
  }
  // Расчет расстояния до ближайшего противника
  checkDistanceToEnemy() {
    let closestDistance = 100000;
    let closesEnemyCoordinate = { x: 0, y: 0 };

    // Проходим через все платформы
    this.enemies?.children.iterate((enemy: Creature) => {
      const enemyX = enemy.x + enemy.width / 2;
      const enemyY = enemy.y + enemy.height / 2;
      const thisX = this.x + this.width / 2;
      const thisY = this.y + this.height / 2;
      const dx = enemyX - thisX;
      const dy = enemyY - thisY;
      const distance = Math.hypot(dx, dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        if (closestDistance > 50 && closestDistance < 300) {
          this.setVelocity(
            dx > 5 ? 100 : dx < -5 ? -100 : 0,
            dy > 5 ? 100 : dy < -5 ? -100 : 0,
          );
        } else this.setVelocity(0);
        console.log(closestDistance);
      }
      this.isTurnRight = enemyX > thisX;
    });
  }
}
