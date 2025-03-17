import Phaser from "phaser";
import { Creature } from "./enemy_bat.ts";

const PLAYER_HEIGHT = 64;
const PLAYER_CROUCH_HEIGHT = 40;
const PLAYER_WIDTH = 20;
const MAX_DISTANCE_TO_FALL = 300;
const DISTANCE_TO_LANDING = 50;
const ATTACK_COMBO_LIMIT = 4;
const COMBO_RESET_TIME = 30;

export class Player extends Creature {
  stand_height: number;
  crouch_height: number;
  stand_width: number;
  cursors: any;
  isSit: boolean;
  isCrouching: boolean;
  isJump: boolean;
  isCanJump: boolean;
  isCanDashing: boolean;
  isCanStand: boolean;
  isFall: boolean;
  isShieldUp: boolean;
  weaponState: 1 | 2;
  attackCombo: 1 | 2 | 3 | 4;
  comboInterval: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    enemies?: Phaser.Physics.Arcade.Group | undefined,
  ) {
    super(scene, x, y, key, enemies);
    this.isSit = false;
    this.isJump = false;
    this.attackDamage = 50;
    this.health = 100;
    this.isCanDashing = true;
    this.isCanJump = true;
    this.isShieldUp = false;
    this.isCanStand = true;
    this.isFall = false;
    this.isCrouching = false;
    this.isTurnRight = true;
    this.attackCombo = 1;
    this.comboInterval = 0;
    this.weaponState = 1;
    this.stand_height = PLAYER_HEIGHT;
    this.crouch_height = PLAYER_CROUCH_HEIGHT;
    this.stand_width = PLAYER_WIDTH;

    this.attackHitBox.setGravityY(-700);
    this.attackHitBox.setVisible(false);
    this.setScale(1.5);
    this.body!.setSize(this.stand_width, this.stand_height);

    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.cursors = {
      left: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.D,
      ),
      down: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      jump: this.scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      ),
      attack: this.scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.K,
      ),
      change_weapon_state: this.scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.E,
      ),
      dashing: this.scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.F,
      ),
      shieldUp: this.scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT,
      ),
    };
  }

  update() {
    this.attackHitBoxUpdate();
    if (this.isAnimated) return; // Если персонаж занят анимацией, выход из функции

    this.flipX = !this.isTurnRight; // Меняем направление спрайта
    this.handleWeaponChange(); // Обрабатываем смену оружия
    this.handleMovement(); // Обрабатываем движение персонажа
    this.handleJumpingAndFalling(); // Обрабатываем прыжки и падения
    this.handleAttack(); // Обрабатываем атаку
    this.handleAnimations(); // Обрабатываем анимации в зависимости от состояния
    this.handleDashing(); // Обрабатываем рывок
    this.handleShieldUp(); // Обрабатываем поднятие щита
    this.comboInterval++;
  }

  attackHitBoxUpdate() {
    const offsetX = this.isTurnRight ? PLAYER_WIDTH : -PLAYER_WIDTH;
    if (this.isShieldUp) this.attackHitBox.setSize(40, 50);
    else this.attackHitBox.setSize(70, 50);
    if (this.attackCombo === 4) {
      this.attackHitBox.setSize(140, 50);
      this.attackHitBox.setPosition(this.x, this.y);
      this.attackCombo = 1;
    } else this.attackHitBox.setPosition(this.x + offsetX * 2, this.y);
  }

  handleWeaponChange() {
    // Проверка нажатия на клавишу смены оружия и переключение между состояниями оружия
    if (Phaser.Input.Keyboard.JustDown(this.cursors.change_weapon_state)) {
      this.isCanTakeDamage = true;
      this.weaponState = this.weaponState === 1 ? 2 : 1;
    }
  }

  handleMovement() {
    // Проверяем нажатие клавиш для перемещения влево или вправо
    if (this.cursors.left.isDown) {
      this.isTurnRight = false; // Персонаж поворачивается налево
      if (!this.isShieldUp) this.isWalk = true; // Персонаж идет
    } else if (this.cursors.right.isDown) {
      this.isTurnRight = true; // Персонаж поворачивается направо
      if (!this.isShieldUp) this.isWalk = true; // Персонаж идет
    } else {
      this.isWalk = false; // Персонаж не двигается
    }

    // Если персонаж идет
    if (this.isWalk) {
      const velocity = this.isTurnRight ? 160 : -160; // Скорость в зависимости от направления
      this.setVelocityX(this.isSit ? velocity / 3 : velocity); // Замедляем, если сидит
    } else {
      this.setVelocityX(0); // Если не идет, останавливаем персонажа
    }
  }

  handleJumpingAndFalling() {
    // Проверка: если персонаж на земле, сбрасываем флаги прыжка и падения
    if (this.body!.touching.down) {
      this.isJump = false;
      this.isFall = false;
      if (this.cursors.jump.isUp) this.isCanJump = true;
    }

    // Если нажата клавиша прыжка и персонаж не сидит, выполняем прыжок
    if (this.cursors.jump.isDown && this.isCanJump && !this.isSit) {
      this.isJump = true;
      this.isCanJump = false;
      this.setVelocityY(-500); // Прыжок вверх
    } else if (
      this.cursors.jump.isUp &&
      !this.body!.touching.down &&
      this.body!.velocity.y < -300
    ) {
      this.setVelocityY(this.body!.velocity.y + 200); // Смягчаем скорость прыжка, если клавиша отпущена
    }

    // Если персонаж падает на достаточном расстоянии от платформы
    if (
      this.distanceToTheGround > MAX_DISTANCE_TO_FALL &&
      this.body!.velocity.y > 100
    ) {
      this.isFall = true; // Устанавливаем флаг падения
    }
  }
  handleDashing() {
    if (this.cursors.dashing.isDown && this.isCanDashing) {
      this.playDashingAnimation();
    } else if (this.cursors.dashing.isUp) {
      this.isCanDashing = true;
    }
  }

  handleShieldUp() {
    if (
      this.cursors.shieldUp.isDown &&
      !this.isShieldUp &&
      this.distanceToTheGround < 10 &&
      !this.isSit
    ) {
      this.isShieldUp = true;
      this.playShieldUpAnimation();
    } else if (this.cursors.shieldUp.isUp && this.isShieldUp) {
      this.isShieldUp = false;
    }
  }
  handleAttack() {
    // Если нажата клавиша атаки и персонаж может атаковать
    if (this.cursors.attack.isDown && this.isCanAttack && !this.isFall) {
      if (this.isJump && this.isWalk) {
        const velocity = this.isTurnRight ? 80 : -80; // Скорость в зависимости от направления
        this.setVelocityX(velocity);
      } else if (this.isWalk) {
        this.setVelocityX(0);
      }
      // Активируем область атаки перед игроком
      this.activateAttackHitBox();
      this.isJump = false;
      this.weaponState = 2;
      this.isCanAttack = false; // Блокируем повторную атаку
      this.isAnimated = true; // Включаем анимацию атаки
      if (
        this.attackCombo <= ATTACK_COMBO_LIMIT &&
        this.comboInterval < COMBO_RESET_TIME
      ) {
        this.attackCombo++;
      }
      if (
        this.attackCombo > ATTACK_COMBO_LIMIT ||
        this.comboInterval > COMBO_RESET_TIME
      )
        this.attackCombo = 1;
      this.comboInterval = 0;
      if (this.isShieldUp) {
        this.anims.play(`shield_bash_1`, true); // Проигрываем анимацию атаки щитом
        this.once(`animationcomplete-shield_bash_1`, () => {
          this.deactivateAttackHitBox();
          this.isAnimated = false; // После завершения анимации, разблокируем
        });
      } else {
        this.anims.play(`attack_${this.attackCombo}`, true); // Проигрываем анимацию атаки
        this.once(`animationcomplete-attack_${this.attackCombo}`, () => {
          this.deactivateAttackHitBox();
          this.isAnimated = false; // После завершения анимации, разблокируем
        });
      }
      this.isWalk = false; // Останавливаем движение при атаке
    } else if (this.cursors.attack.isUp) {
      this.isCanAttack = true; // Позволяем атаковать снова
    }
  }

  handleAnimations() {
    // Проверка нажатия клавиши вниз для перехода в состояние сидя
    if (this.cursors.down.isDown) {
      if (!this.isAnimated && !this.isSit && !this.isJump) {
        this.playCrouchingAnimation(); // Проигрываем анимацию сидения
      }
    } else if (this.distanceToTheCeiling > 35) {
      this.isSit = false; // Если клавиша не нажата, перестаем сидеть
    }

    // Если персонаж идет
    if (this.isWalk) {
      if (this.isSit) {
        this.playCrouchingWalkAnimation(); // Если персонаж идет и сидит
      } else if (!this.isJump && !this.isFall) {
        this.anims.play(`walking_${this.weaponState}`, true); // Если персонаж идет, но не прыгает
      } else if (this.isJump && !this.isFall) {
        this.anims.play(`jump_${this.weaponState}`, true); // Если персонаж прыгает
      } else if (
        this.isFall &&
        this.body!.velocity.y > 0 &&
        this.distanceToTheGround > DISTANCE_TO_LANDING
      ) {
        this.anims.play(`fall_${this.weaponState}`, true); // Если персонаж падает
      } else if (
        this.isFall &&
        this.distanceToTheGround < DISTANCE_TO_LANDING
      ) {
        this.playLandingAnimation(); // Если персонаж готовится приземлиться
      }
    } else {
      this.playIdleAnimation(); // Если персонаж стоит на месте
    }

    // Регулируем размеры коллайдера в зависимости от состояния сидя
    if (this.isSit) {
      this.adjustColliderForCrouch();
    } else {
      this.resetColliderSize();
    }
  }

  playCrouchingAnimation() {
    this.setVelocityX(0);
    this.isWalk = false;
    this.isAnimated = true;
    this.isSit = true; // Включаем режим сидя
    this.anims.play(`crouching_${this.weaponState}`, true); // Проигрываем анимацию сидения
    this.once(`animationcomplete-crouching_${this.weaponState}`, () => {
      this.isAnimated = false; // После завершения анимации сбрасываем флаг
    });
  }
  playDashingAnimation() {
    const velocity = this.isTurnRight ? 450 : -450; // Скорость в зависимости от направления
    this.setVelocityX(velocity);
    this.isCanDashing = false;
    this.isWalk = false;
    this.isAnimated = true;
    this.anims.play(`dashing_1`, true); // Проигрываем анимацию сидения
    this.once(`animationcomplete-dashing_1`, () => {
      this.isAnimated = false;
      this.setVelocityX(0);
      this.deactivateAttackHitBox();
    });
  }
  playShieldUpAnimation() {
    this.setVelocityX(0);
    this.isWalk = false;
    this.isAnimated = true;
    this.anims.play(`shield_up_1`, true); // Проигрываем анимацию сидения
    this.once(`animationcomplete-shield_up_1`, () => {
      this.isAnimated = false;
    });
  }

  playCrouchingWalkAnimation() {
    this.anims.play(`crouching_walk_${this.weaponState}`, true); // Анимация ходьбы в приседе
  }

  playLandingAnimation() {
    this.setVelocityX(0);
    this.isAnimated = true;
    this.anims.play(`landing_${this.weaponState}`, true); // Проигрываем анимацию приземления
    this.once(`animationcomplete-landing_${this.weaponState}`, () => {
      this.isAnimated = false; // После завершения анимации сбрасываем флаг
    });
  }

  playIdleAnimation() {
    if (this.isAnimated) return;
    // Если персонаж в прыжке, но не падает
    if (this.isJump && !this.isFall) {
      this.anims.play(`jump_${this.weaponState}`, true);
    } else if (this.isFall && this.distanceToTheGround > DISTANCE_TO_LANDING) {
      this.anims.play(`fall_${this.weaponState}`, true); // Если персонаж падает
    } else if (this.isFall && this.distanceToTheGround < DISTANCE_TO_LANDING) {
      this.playLandingAnimation(); // Если персонаж готовится приземлиться
    } else if (this.isSit && !this.isAnimated) {
      this.anims.play(`crouching_idle_${this.weaponState}`, true); // Анимация сидячего состояния
    } else if (this.isShieldUp) {
      this.anims.play(`shield_idle_1`, true); // Анимация ожидания с поднятым щитом
    } else if (!this.isAnimated) {
      this.anims.play(`idle_${this.weaponState}`, true); // Анимация бездействия
    }
  }
  takeDamage(damage: number) {
    if (this.health <= 1) {
      this.isCanTakeDamage = false;
    }
    if (this.isCanTakeDamage) {
      this.health -= damage;
      this.setVelocityX(0);
      console.log(this.health);

      this.play(`hurt_${this.weaponState}`);
      this.isAnimated = true;
      this.once(`animationcomplete-hurt_${this.weaponState}`, () => {
        this.isAnimated = false;
        console.log("END TAKE DAMAGE");
      });

      if (this.health <= 1) {
        this.play(`dying_${this.weaponState}`, true); // Анимация изсчезновения
        this.isAnimated = true;
        this.once(`animationcomplete-dying_${this.weaponState}`, () => {
          this.health = 100;
          this.isAnimated = false;
          // this.destroy();
          // this.attackHitBox.destroy();
        });
      }
    }
    this.isCanTakeDamage = false;
  }
  adjustColliderForCrouch() {
    // Уменьшаем коллайдер персонажа в состоянии сидя
    this.body!.setSize(this.stand_width, this.crouch_height, false);
    this.setOffset(
      (this.width - this.stand_width) / 2,
      this.stand_height - this.crouch_height,
    );
  }

  resetColliderSize() {
    // Восстанавливаем коллайдер в нормальное состояние
    this.body!.setSize(this.stand_width, this.stand_height, false);
    this.setOffset((this.width - this.stand_width) / 2, 0);
  }
}
