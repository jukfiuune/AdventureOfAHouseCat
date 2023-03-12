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
var hasJumped = false
#var triggerIdle = true
var is_rumba_dead = false
var is_player_dead = false
onready var floorCh = $RayCast2D
onready var scratchCh = $RayCast2D2
onready var sprite = $Sprite
var choice_scene = preload("res://src/Levels/Choice.tscn")

#func set_floor_normal(normal: Vector2):
#	$CollisionShape2D.set_normal(normal)
#
#func _ready():
#	set_floor_normal(Vector2(0, 1))  # Set the floor normal to point upward

func _ready():
	get_node("Camera2D").current = true;
func _on_EnemyDetector_body_entered(body: PhysicsBody2D) -> void:
	kill()
func _physics_process(delta): 
	if not is_player_dead:
		var coll = floorCh.get_collider()
		var scratch = scratchCh.get_collider()
		if floorCh.is_colliding() and not coll.has_method("fall"):
			isOnFloor = true
			if can_jump and not Input.is_action_pressed("ui_right") and not Input.is_action_pressed("ui_left"):
				sprite.texture = load("res://src/Textures/CatIdleAni.tres")
				#triggerIdle=true
			if can_jump:
				hasJumped = false
		else:
			isOnFloor=false
		if floorCh.is_colliding() and coll.has_method("fall"):
			coll.fall()
		if floorCh.is_colliding() and coll.has_method("interactive"):
			get_parent().get_node("Lvl3DesignAll").visible = false
			get_parent().get_node("Choice").visible = true
			get_parent().get_node("AudioStreamPlayer2D").volume_db = -80
		# Player movement functions:
		#handle_input(delta)
		
		velocity = velocity.linear_interpolate(Vector2.ZERO, FRICTION * delta)
		if floorCh.is_colliding() and coll.has_method("fall"):
			velocity.x = 0
			isOnFloor = true
			if can_jump and not Input.is_action_pressed("ui_right") and not Input.is_action_pressed("ui_left"):
				sprite.texture = load("res://src/Textures/CatIdleAni.tres")
				#triggerIdle = true
			if can_jump:
				hasJumped = false
		velocity = move_and_slide(velocity)

		if Input.is_action_pressed("ui_right"): # If the player enters the right arrow
			motion.x = speed # then the x coordinates of the vector be positive
			sprite.flip_h = false
			if not hasJumped:
				#triggerIdle = false
				sprite.texture = load("res://src/Textures/CatWalkAni.tres")
		elif Input.is_action_pressed("ui_left"): # If the player enters the left arrow
			motion.x = -speed # then the x coordinates of the vector be negative
			sprite.flip_h = true
			if not hasJumped:
				#triggerIdle = false
				sprite.texture = load("res://src/Textures/CatWalkAni.tres")
		else: # If none of these are pressed
			motion.x = lerp(motion.x, 0, 0.25) # set the x to 0 by smoothly transitioning by 0.25
		#print(isOnFloor)
		if isOnFloor and Input.is_action_just_pressed("ui_dash_right"):
			gravity = 0
			motion.y = -jump_height
			sprite.texture = load("res://src/Textures/CatJumpAni.tres")
			can_jump = false
			yield(get_tree().create_timer(DASH_DURATION), "timeout")
			gravity = 7
			motion.x = speed * 13 + delta
			can_jump = true
			#print(speed)
			yield(get_tree().create_timer(DASH_DURATION), "timeout")
			#motion.y += gravity + delta
			
		if isOnFloor and Input.is_action_just_pressed("ui_dash_left"):
			gravity = 0
			motion.y = -jump_height
			sprite.texture = load("res://src/Textures/CatJumpAni.tres")
			can_jump = false
			yield(get_tree().create_timer(DASH_DURATION), "timeout")
			gravity = 7
			motion.x = -speed * 13 + delta
			can_jump = true
			#print(speed)
			yield(get_tree().create_timer(DASH_DURATION), "timeout")
		if isOnFloor and Input.is_action_just_pressed("ui_dash_up"):
			gravity = 0
			motion.y = -jump_height
			sprite.texture = load("res://src/Textures/CatJumpAni.tres")
			can_jump = false
			yield(get_tree().create_timer(DASH_DURATION), "timeout")
			gravity = 7
			can_jump = true
			#print(speed)
			yield(get_tree().create_timer(DASH_DURATION), "timeout")
			#motion.y += gravity + delta
		if isOnFloor and Input.is_action_just_pressed("ui_up"):
			motion.y = -jump_height
			hasJumped = true
			#triggerIdle = false
			sprite.texture = load("res://src/Textures/CatJumpAni.tres")
			sprite.texture = load("res://src/Textures/CatJumpAni.tres")
			can_jump = false
			yield(get_tree().create_timer(jump_interval), "timeout")
			can_jump = true
			#motion.y += gravity + delta
			
		# Move and slide is a function which allows the kinematic body to detect
		# collisions and move accordingly
		if Input.is_action_just_pressed("ui_left_mouse"):
			can_jump = false
			sprite.texture = load("res://src/Textures/CatScratchAni.tres")
			yield(get_tree().create_timer(jump_interval), "timeout")
			can_jump=true
			if scratchCh.is_colliding() and scratch.has_method("kill"):
				scratch.kill()
				if scratch.has_method("rumba"):
					is_rumba_dead = true
			
		if scratchCh.is_colliding() and scratch.has_method("firepl"):
			if !is_rumba_dead:
				position = Vector2(-355,537)
			else:
				get_node("/root/Node2D/l1 background/fireplace").texture = load("res://src/Textures/FireplaceEvilAni.tres")
		if scratchCh.is_colliding() and scratch.has_method("deadly_tile"):
			kill()
		if scratchCh.is_colliding() and scratch.has_method("trust") and get_parent().get_node("Choice").visible == true:
			kill()
	motion.y += gravity + delta
	motion = move_and_slide(motion, Vector2.UP)
func kill():
	sprite.texture = load("res://src/Textures/CatDeathAni.tres")
	is_player_dead = true
	#print(is_rumba_dead)
