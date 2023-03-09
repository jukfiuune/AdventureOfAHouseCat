extends KinematicBody2D # The player is a kinematic body, hence extends Kine..

# Adjustable variables of the player
# export is used to allow to edit the values outside the script
export var speed = 500 # The speed of the character
export var gravity = 12 # The gravity of the character
export var jump_height = 300 # The jump force of the character
const DASH_DURATION = 0.5  # Dash duration in seconds
const DASH_SPEED = 1000  # Dash speed in pixels per second
var can_dash = true
var dash_timer = 0
var dash_direction = Vector2.ZERO
const ACCELERATION = 700
const FRICTION = 10
var velocity = Vector2.ZERO
var isOnFloor = false


var motion = Vector2.ZERO 

onready var raycast = $RayCast2D

#func set_floor_normal(normal: Vector2):
#	$CollisionShape2D.set_normal(normal)
#
#func _ready():
#	set_floor_normal(Vector2(0, 1))  # Set the floor normal to point upward

func _on_EnemyDetector_body_entered(body: PhysicsBody2D) -> void:
	queue_free()
func _physics_process(delta): 
	var coll = raycast.get_collider()
	if raycast.is_colliding():
		isOnFloor = true
	else:
		isOnFloor=false
	# Player movement functions:
	#handle_input(delta)
	velocity = velocity.linear_interpolate(Vector2.ZERO, FRICTION * delta)
	velocity = move_and_slide(velocity)

	if Input.is_action_pressed("ui_right"): # If the player enters the right arrow
		motion.x = speed # then the x coordinates of the vector be positive
	elif Input.is_action_pressed("ui_left"): # If the player enters the left arrow
		motion.x = -speed # then the x coordinates of the vector be negative
	else: # If none of these are pressed
		motion.x = lerp(motion.x, 0, 0.25) # set the x to 0 by smoothly transitioning by 0.25
	print(isOnFloor)
	if isOnFloor and Input.is_action_just_pressed("ui_up"): # If the ground checker is colliding with the ground
		motion.y = -jump_height

	motion.y += gravity + delta # Always make the player fall down

	motion = move_and_slide(motion, Vector2.UP)
	# Move and slide is a function which allows the kinematic body to detect
	# collisions and move accordingly

