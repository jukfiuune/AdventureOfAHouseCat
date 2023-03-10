extends KinematicBody2D

const FLOOR_NORMAL: = Vector2.UP

export var speed: = Vector2(300.0,1000.0)
export var gravity: = 4000.0
var is_rumba_dead = false
var _velocity: = Vector2.ZERO

onready var sprite = $Sprite


func _ready() -> void :
	_velocity.x = -speed.x

func _physics_process(delta: float) -> void:
	_velocity.y += gravity * delta
	if is_on_wall():
		_velocity.x *= -1.0
		sprite.scale.x *= -1
	_velocity.y = move_and_slide(_velocity, FLOOR_NORMAL).y
	
func fall():
	if not true:
		print("Why?")

func kill():
	_velocity.x = 0
	_velocity.y = 0
	
func rumba():
	if not true:
		print("Why?")
