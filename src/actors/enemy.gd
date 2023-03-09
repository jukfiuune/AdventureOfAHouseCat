extends KinematicBody2D

const FLOOR_NORMAL: = Vector2.UP

export var speed: = Vector2(300.0,1000.0)
export var gravity: = 4000.0

var _velocity: = Vector2.ZERO


func _ready() -> void :
	set_physics_process(false)
	_velocity.x = -speed.x


func _on_Stom_detector_body_entered(body: PhysicsBody2D) -> void:
	if body.global_position.y > get_node("StomDetector").global_position.y:
		return
	get_node("CollisionShape2D").disabled = true
	queue_free()


func _physics_process(delta: float) -> void:
	_velocity.y += gravity * delta
	if is_on_wall():
		_velocity.x *= -1.0
	_velocity.y = move_and_slide(_velocity, FLOOR_NORMAL).y
