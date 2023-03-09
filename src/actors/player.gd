extends KinematicBody2D # The player is a kinematic body, hence extends Kine..

# Adjustable variables of the player
# export is used to allow to edit the values outside the script
export var speed = 500 # The speed of the character
export var gravity = 7 # The gravity of the character
export var jump_height = 100 # The jump force of the character
const DASH_DURATION = 0.5  # Dash duration in seconds
const DASH_SPEED = 1000  # Dash speed in pixels per second
var can_dash = true
var dash_timer = 0
var dash_direction = Vector2.ZERO
const ACCELERATION = 700
const FRICTION = 10
var velocity = Vector2.ZERO


var motion = Vector2.ZERO 

func _ready():
	set_floor_normal(Vector2(0, 1))  # Set the floor normal to point upward

func set_floor_normal(normal: Vector2):
	$CollisionShape2D.set_normal(normal)

func _on_EnemyDetector_body_entered(body: PhysicsBody2D) -> void:
	queue_free()
func _physics_process(delta): 
	# Player movement functions:
	handle_input(delta)
	velocity = velocity.linear_interpolate(Vector2.ZERO, FRICTION * delta)
	velocity = move_and_slide(velocity)

	if Input.is_action_pressed("ui_right"): # If the player enters the right arrow
		motion.x = speed # then the x coordinates of the vector be positive
	elif Input.is_action_pressed("ui_left"): # If the player enters the left arrow
		motion.x = -speed # then the x coordinates of the vector be negative
	else: # If none of these are pressed
		motion.x = lerp(motion.x, 0, 0.25) # set the x to 0 by smoothly transitioning by 0.25
	print(is_on_floor())
	if is_on_floor(): # If the ground checker is colliding with the ground
		if Input.is_action_pressed("ui_up"): # And the player hits the up arrow key
			motion.y = -jump_height # then jump by jumpforce

	motion.y += gravity + delta # Always make the player fall down

	motion = move_and_slide(motion, Vector2.UP)
	# Move and slide is a function which allows the kinematic body to detect
	# collisions and move accordingly

func handle_input(delta):
	# Get the player's input
	var input_vector = Vector2.ZERO
	input_vector.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
	input_vector.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	input_vector = input_vector.normalized()

	# Apply the input to the player's velocity
	var acceleration = input_vector * ACCELERATION
	velocity = velocity.linear_interpolate(velocity + acceleration, FRICTION * delta)
