extends KinematicBody2D # The player is a kinematic body, hence extends Kine..

# Adjustable variables of the player
# export is used to allow to edit the values outside the script
export var speed = 500 # The speed of the character
export var gravity = 7 # The gravity of the character
export var jump_height = 300 # The jump force of the character
const DASH_DURATION = 1  # Dash duration in seconds
const DASH_SPEED = 1000  # Dash speed in pixels per second
var can_dash = true
var dash_timer = 0
var dash_direction = Vector2.ZERO
const ACCELERATION = 700
const FRICTION = 10
var velocity = Vector2.ZERO
var isOnFloor = false
var can_jump = true
var jump_interval = 0.5
var motion = Vector2.ZERO 

func _ready():
	get_node("Camera2D").current = true;
	

onready var raycast = $RayCast2D
onready var sprite = $Sprite

#func set_floor_normal(normal: Vector2):     
#	$CollisionShape2D.set_normal(normal)
#
#func _ready():
#	set_floor_normal(Vector2(0, 1))  # Set the floor normal to point upward

func _on_EnemyDetector_body_entered(body: PhysicsBody2D) -> void:
	queue_free()
func _physics_process(delta): 
	var coll = raycast.get_collider()
	if raycast.is_colliding() and not coll.has_method("fall"):
		isOnFloor = true
	else:
		isOnFloor=false
	if raycast.is_colliding() and coll.has_method("fall"):
		coll.fall()
	# Player movement functions:
	#handle_input(delta)
	
	velocity = velocity.linear_interpolate(Vector2.ZERO, FRICTION * delta)
	if raycast.is_colliding() and coll.has_method("fall"):
		velocity.x = 0
		isOnFloor = true
	velocity = move_and_slide(velocity)

	if Input.is_action_pressed("ui_right"): # If the player enters the right arrow
		motion.x = speed # then the x coordinates of the vector be positive
		sprite.scale.x = 0.065
	elif Input.is_action_pressed("ui_left"): # If the player enters the left arrow
		motion.x = -speed # then the x coordinates of the vector be negative
		sprite.scale.x = -0.065
	else: # If none of these are pressed
		motion.x = lerp(motion.x, 0, 0.25) # set the x to 0 by smoothly transitioning by 0.25
	#print(isOnFloor)
	if isOnFloor and Input.is_action_just_pressed("ui_dash_right"):
		gravity = 0
		motion.y = -jump_height
		yield(get_tree().create_timer(DASH_DURATION), "timeout")
		gravity = 7
		motion.x = speed * 13 + delta
		#print(speed)
		yield(get_tree().create_timer(DASH_DURATION), "timeout")
		#motion.y += gravity + delta
		
	if isOnFloor and Input.is_action_just_pressed("ui_dash_left"):
		gravity = 0
		motion.y = -jump_height
		yield(get_tree().create_timer(DASH_DURATION), "timeout")
		gravity = 7
		motion.x = -speed * 13 + delta
		#print(speed)
		yield(get_tree().create_timer(DASH_DURATION), "timeout")
		#motion.y += gravity + delta
	if isOnFloor and Input.is_action_just_pressed("ui_up"):
		motion.y = -jump_height
		can_jump = false
		yield(get_tree().create_timer(jump_interval), "timeout")
		can_jump = true
		#motion.y += gravity + delta
	motion.y += gravity + delta
	motion = move_and_slide(motion, Vector2.UP)
	# Move and slide is a function which allows the kinematic body to detect
	# collisions and move accordingly


